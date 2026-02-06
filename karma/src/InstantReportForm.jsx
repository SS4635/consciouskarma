// src/InstantReportForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";
import { COUNTRY_CODES } from "./components/constants/countryCodes"; 

// const PRICE = Number(process.env.REACT_APP_INSTANT_REPORT_PRICE || 0) * 100;




const API = process.env.REACT_APP_API_URL;


export default function InstantReportForm({
  initialIsd = "+91",
  initialMobile = "",
  ctaLabel = "Pay & Get Report",
  onSubmit: onSubmitProp,
  onClose, 
}) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isd, setIsd] = useState(initialIsd);
  const [phone, setPhone] = useState(initialMobile);
  const [coupon, setCoupon] = useState("");
  const [accountChoice, setAccountChoice] = useState("guest");
  const [password, setPassword] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  // const [applying, setApplying] = useState(false);
  const [PRICE, setPRICE] = useState(0);
  const [applying, setApplying] = useState(false);
  const [paying, setPaying] = useState(false);
  
  const [showCouponSuccess, setShowCouponSuccess] = useState(false);

  const [generatingReport, setGeneratingReport] = useState(false);
 
  const [showSuccess, setShowSuccess] = useState(false); 
  
  const [errors, setErrors] = useState({});
  const [couponInfo, setCouponInfo] = useState(null);

  
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const navigate = useNavigate();

  useEffect(() => {
    setPhone(initialMobile);
  }, [initialMobile]);
useEffect(() => {
  async function fetchPrice() {
    try {
      const res = await axios.get(`${API}/api/config/price`);

     const price = Number(res.data.price) * 100;

      console.log("Fetched price:", price);
      setPRICE(price);
    } catch (err) {
      console.error("Price fetch failed", err);
      setPRICE(0);
    }
  }

  fetchPrice();
}, []);

  useEffect(() => {
    setIsd(initialIsd);
  }, [initialIsd]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: "", type: "error" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const finalAmount = useMemo(
    () => (!couponInfo ? PRICE : Math.max(0, couponInfo.finalAmount)),
    [couponInfo,PRICE]
  );
 

  const [rzReady, setRzReady] = useState(false);

  useEffect(() => {
    const src = "https://checkout.razorpay.com/v1/checkout.js";
    const existing = document.querySelector(`script[src="${src}"]`);

    if (existing) {
      if (existing.onload) existing.onload();
      else setRzReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.onload = () => setRzReady(true);
    document.body.appendChild(script);
  }, []);

  function showToast(message, type = "error") {
    setToast({ show: true, message, type });
  }

  const getSelectedCountry = () => {
    return COUNTRY_CODES.find((c) => c.dial_code === isd);
  };
const canApplyCoupon =
  coupon &&
  name.trim().length > 0 &&
  /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  const isFormValid = useMemo(() => {
    if (!name.trim()) return false;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return false;

    const currentCountry = COUNTRY_CODES.find((c) => c.dial_code === isd);
    const exactLength = currentCountry ? currentCountry.max_length : 10;
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== exactLength) return false;

    if (accountChoice === "create" && password.length < 6) return false;

    return true;
  }, [name, email, phone, isd, accountChoice, password]);

  const validateMobileOnBlur = () => {
    const currentCountry = getSelectedCountry();
    if (!currentCountry) return;
    const exactLength = currentCountry.max_length;
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length > 0 && cleanPhone.length !== exactLength) {
      showToast(`Phone number must be exactly ${exactLength} digits for ${currentCountry.name}`);
      setErrors((prev) => ({ ...prev, phone: `Must be ${exactLength} digits` }));
    } else {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs.phone;
        return newErrs;
      });
    }
  };

  const validate = () => {
    const e = {};
    const currentCountry = getSelectedCountry();
    const exactLength = currentCountry ? currentCountry.max_length : 10;
    if (!name.trim()) e.name = "Required";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = "Enter a valid email";
    if (!new RegExp(`^\\d{${exactLength}}$`).test(phone)) e.phone = `Enter ${exactLength}-digit mobile`;
    if (accountChoice === "create" && password.length < 6) e.password = "Min 6 chars";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

//  const applyCoupon = async (ev) => {
//   ev.preventDefault();
//   if (!coupon) return;

//   setApplying(true);
//   try {
//     const { data } = await axios.post(`${API}/api/coupon/validate`, {
//       code: coupon,
//       price: PRICE,
//       mobile: phone,
//       email,
//       name
//     });
   
  
//     if (!data.valid) throw new Error(data.message || "Invalid coupon");

   
//     setShowCouponSuccess(true);

//   } catch (err) {

    
//     alert(err?.response?.data?.message || err.message || "Coupon error");
//   } finally {
//     setApplying(false);
//   }
// };


  // --- HANDLE SUBMISSION ---
 const applyCoupon = async (ev) => {
  ev.preventDefault();
  if (!coupon) return;

  setApplying(true);
  try {
    const { data } = await axios.post(`${API}/api/coupon/validate`, {
      code: coupon,
      price: PRICE,
      mobile: phone,
      email,
      name
    });

    if (data.valid) {
      // Price ko zero karo aur info save karo
      setCouponInfo(data);
      setPRICE(0); 

      // Coupon Success Popup dikhao
      setShowCouponSuccess(true);

      // 2 second ka wait taaki backend process karle, phir redirect
      setTimeout(() => {
        setGeneratingReport(true);
        setShowSuccess(true);
      }, 2000);
    } else {
      alert(data.message || "Invalid coupon");
    }
  } catch (err) {
    alert("Coupon error: " + (err.response?.data?.message || err.message));
  } finally {
    setApplying(false);
  }
};
 
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    const requestBody = {
      general: { name, email },
      primary: { isd, number: phone },
      parallels: [],
      previousNumbers: [],
      coupon,
      accountChoice,
      password,
      price: PRICE / 100,
    };


    

 const handleSuccess = () => {
  setGeneratingReport(true);
  setShowSuccess(true);

  // Auto close after 2 seconds
  setTimeout(() => {
    setGeneratingReport(false);
    setShowSuccess(false);

    // Optional redirect
    window.location.href = "/";
    if (onClose) onClose();
  }, 2000);
};




    // ---------------- FREE FLOW ----------------
    if (finalAmount === 0) {
  setPaying(true);

  try {
    const { data } = await axios.post(
      `${API}/api/pay/create-order`,
      requestBody
    );

    if (data.ok) {
      handleSuccess();
    }
  } catch (err) {
    handleSuccess(); // free flow me block mat karo
  }

  return; // 🔒 Razorpay skipped
}


    // ---------------- PAID FLOW ----------------
    setPaying(true);
    try {
      const { data } = await axios.post(`${API}/api/pay/create-order`, requestBody);
      const { ok, message, order, keyId, orderId } = data;

      if (!ok) throw new Error(message || "Order creation failed");

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Conscious Karma",
        description: "Instant Report",
        order_id: order.id,
        prefill: { name, email, contact: phone },
        theme: { color: "#ff8a3d" },
        handler: async (response) => {
          try {
            setPaying(false);
    setGeneratingReport(true);
            const { data: vj } = await axios.post(`${API}/api/pay/verify`, { ...response, orderId });
            
            if (!vj.ok) {
                setGeneratingReport(false);
              alert("Payment verification failed");
              setPaying(false);
              return;
            }

    // ✅ PAYMENT SUCCESS
    setPaying(false);
    setShowSuccess(true);

 setTimeout(() => {
      setGeneratingReport(false);
      setShowSuccess(true);
    }, 1200); // ⏳ loader visible rahe thoda

          
            // try {
            //   const { data: scoreResponse } = await axios.post(
            //     `${SCORE_API}/score`,
            //     { mobile_number: phone },
            //     { headers: { "Content-Type": "application/json", "X-API-Key": process.env.REACT_APP_SCORE_API_KEY } }
            //   );
            //   const scoreData = scoreResponse.score || scoreResponse;
            //   try {
            //     await axios.post(`${API}/api/mail/score`, { email, scoreData, mobileNumber: phone });
                
            //     handleSuccess(); // ✅ Calls the success animation + redirect

            //   } catch (mailErr) {
            //  handleSuccess(); 
            //   }
            // } catch (apiErr) {
            //   handleSuccess(); 
            // }
          } catch (err) {
            
            setPaying(false);
            alert("Verification error");
          }
        },
        modal: { 
          ondismiss: () => {
             setPaying(false);
           
          }
        },
      };

      const rz = new window.Razorpay(options);
      rz.open();
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Checkout failed");
      setPaying(false);
       setGeneratingReport(false);
      // setGeneratingReport(false); // This is no longer needed
    }
  };





  const footerFix = {
    width: "100%", display: "flex", borderTop: "2px solid #ff914d",
  };
  const currentCountry = getSelectedCountry();
  const maxAllowedLength = currentCountry?.max_length || 15;

  // --- COMPONENT PORTALS ---
  const toastComponent = toast.show ? (
    <div style={{
        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
        animation: 'slideDown 0.3s ease-out', zIndex: 9999999,
        padding: '12px 16px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        display: 'flex', alignItems: 'center', gap: '8px',
        background: toast.type === 'error' ? '#dc2626' : '#16a34a', color: '#fff'
    }}>
      <span>{toast.message}</span>
      <button onClick={() => setToast({ show: false, message: "", type: "error" })} 
        style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}>×</button>
      <style>{`@keyframes slideDown { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }`}</style>
    </div>
  ) : null;

  // ✅ LOADING / SUCCESS COMPONENT
  // This component is now only shown when showSuccess is true.
  // It displays the success message and tick.
  const loadingComponent = (generatingReport && showSuccess) ? (
     <div style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", 
        zIndex: 99999, display: "flex", flexDirection: "column", 
        alignItems: "center", justifyContent: "center", color: "#fff"
     }}>
        {/* ✅ SUCCESS STATE: Large Checkmark (Visible for 2 seconds) */}
       

        <h2 style={{ fontSize: "24px", fontWeight: "bold", fontFamily: "Arsenal, sans-serif" }}>
           Success
        </h2>
        
        {/* Removed "Please wait, do not close this window." and "Stuck? Click to close" button as requested. */}

        <style>{`
            @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        `}</style>
     </div>
  ) : null;
const successOverlay = (generatingReport && showSuccess) ? (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.9)",
      zIndex: 999999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arsenal, sans-serif",
    }}
  >
    <div
      style={{
        background: "#000",
        border: "2px solid #ff914d",
        borderRadius: "16px",
        padding: "32px 28px",
        width: "90%",
        maxWidth: "420px",
        textAlign: "center",
        animation: "scaleIn 0.35s ease-out",
      }}
    >
      {/* ORANGE TICK */}
      <div style={{ marginBottom: "18px" }}>
        <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="10.5"
            stroke="#ff914d"
            strokeWidth="2"
          />
          <path
            d="M7 12L10.2 15.2L17 8"
            stroke="#ff914d"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* TEXT */}
      <h2
        style={{
          fontSize: "22px",
          color: "#ff914d",
          marginBottom: "10px",
          fontWeight: "600",
        }}
      >
        Success!
      </h2>

      <p style={{ color: "#fff", fontSize: "16px", lineHeight: "1.5" }}>
        Your Instant report is booked.
        <br />
        It will be delivered to your email-id shortly.
      </p>
    </div>

    <style>{`
      @keyframes scaleIn {
        0% { transform: scale(0.85); opacity: 0 }
        100% { transform: scale(1); opacity: 1 }
      }
    `}</style>
  </div>
) : null;






  return (

    
    <div style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {generatingReport &&
  ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        zIndex: 999999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arsenal, sans-serif",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          border: "4px solid #333",
          borderTop: "4px solid #ff914d",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: 16,
        }}
      />
      <div style={{ color: "#fff", fontSize: 16 }}>
       
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>,
    document.body
  )
}

      {applying &&
  typeof document !== "undefined" &&
  ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        zIndex: 9999999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arsenal, sans-serif",
      }}
    >
      {/* SPINNER */}
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "4px solid #333",
          borderTop: "4px solid #ff914d",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "16px",
        }}
      />

      {/* TEXT */}
      <div style={{ color: "#fff", fontSize: "16px", letterSpacing: "0.5px" }}>
        Applying coupon…
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>,
    document.body
  )
}

      {typeof document !== 'undefined' ? ReactDOM.createPortal(toastComponent, document.body) : toastComponent}
      {typeof document !== "undefined" && showSuccess && ReactDOM.createPortal(successOverlay, document.body)}

      {/* Hide the Instant Report form when Login modal is visible */}
      {showLogin ? (
        <LoginModal onClose={() => setShowLogin(false)} onSwitch={() => { setShowLogin(false); setShowSignup(true); }} />
      ) : (
        <>
          {showSignup && <SignupModal onClose={() => setShowSignup(false)} onSwitch={() => { setShowSignup(false); setShowLogin(true); }} />}

          <style>{`
            /* SweetAlert2 Custom Styles */
            .swal2-popup {
              background: #111 !important;
              color: #fff !important;
              border: 2px solid #ff914d !important;
              border-radius: 16px !important;
            }
            .swal2-title,
            .swal2-html-container {
              color: #fff !important;
            }
            .swal2-success-circular-line-left,
            .swal2-success-circular-line-right,
            .swal2-success-fix {
              background: none !important;
            }
            .swal2-success {
              border-color: #ff914d !important;
            }
            .swal2-success .swal2-success-ring {
              border: 4px solid #ff914d !important;
            }
            .swal2-success .swal2-success-line-tip,
            .swal2-success .swal2-success-line-long {
              background-color: #ff914d !important;
            }
            .swal2-styled.swal2-confirm {
              background-color: #ff914d !important;
              color: #fff !important;
              border: 2px solid #ff914d !important;
              border-radius: 8px !important;
            }
            .swal2-styled.swal2-confirm:focus {
              box-shadow: 0 0 0 2px #ff914d55 !important;
            }
            .swal2-container { z-index: 9999 !important; }

            /* New Input Styles */
            .instant-input {
              width: 100%;
              height: 44px;
              padding: 0 12px;
              border-radius: 12px;
              background: transparent;
              border: 1.5px solid #666;
              color: #fff;
              font-size: 16px;
              transition: all 0.25s ease;
              outline: none;
            }
            .instant-input:focus {
              border-color: #ff914d;
              box-shadow: 0 0 0 0.2rem rgba(255, 145, 77, 0.25);
            }
            .instant-input.error {
              border-color: #dc2626;
            }

            .instant-select {
              background: transparent;
              border: 1.5px solid #666;
              border-radius: 12px;
              height: 44px;
              padding: 0 12px;
              font-size: 0.95rem;
              width: 100%;
              color: transparent;
              cursor: pointer;
              appearance: none;
              -webkit-appearance: none;
              -moz-appearance: none;
              outline: none;
              transition: all 0.25s ease;
            }
            .instant-select:focus {
              border-color: #ff914d;
              box-shadow: 0 0 0 0.2rem rgba(255, 145, 77, 0.25);
            }
          `}</style>

{showCouponSuccess &&
  ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arsenal, sans-serif",
      }}
    onClick={() => {
    setShowCouponSuccess(false);
    window.location.href = "/";
  }}
    >
      <div
        style={{
          background: "#000",
          border: "2px solid #ff914d",
          borderRadius: "16px",
          padding: "30px",
          width: "90%",
          maxWidth: "400px",
          textAlign: "center",
          animation: "scaleIn 0.3s ease-out",
        }}
      >
        {/* TICK */}
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10.5" stroke="#ff914d" strokeWidth="2" />
          <path
            d="M7 12L10.2 15.2L17 8"
            stroke="#ff914d"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <h2 style={{ color: "#ff914d", marginTop: "16px" }}>
          Coupon Applied!
        </h2>

        <p style={{ color: "#fff", marginTop: "8px" }}>
         Your Instant report is booked.
        <br />
        It will be delivered to your email-id shortly.
        </p>

        {/* CLOSE BUTTON */}
       
      </div>

      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.9); opacity: 0 }
          100% { transform: scale(1); opacity: 1 }
        }
      `}</style>
    </div>,
    document.body
  )
}
{showSuccess &&
  ReactDOM.createPortal(
    <div
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setShowSuccess(false);
          window.location.href = "/";
        }
      }}
      onClick={() => {
        setShowSuccess(false);
        window.location.href = "/";
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arsenal, sans-serif",
        outline: "none",
      }}
    >
      <div
        style={{
          background: "#000",
          border: "2px solid #ff914d",
          borderRadius: "16px",
          padding: "32px",
          width: "90%",
          maxWidth: "420px",
          textAlign: "center",
          animation: "scaleIn 0.3s ease-out",
        }}
      >
        {/* TICK */}
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10.5" stroke="#ff914d" strokeWidth="2" />
          <path
            d="M7 12L10.2 15.2L17 8"
            stroke="#ff914d"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <h2 style={{ color: "#ff914d", marginTop: 16 }}>
          Payment Successful
        </h2>

        <p style={{ color: "#fff", marginTop: 8 }}>
          Your Instant report is booked.
          <br />
          It will be delivered to your email shortly.
        </p>
      </div>

      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.9); opacity: 0 }
          100% { transform: scale(1); opacity: 1 }
        }
      `}</style>
    </div>,
    document.body
  )
}

          <div style={{ padding: "0 1.5rem 1.5rem 1.2rem", overflowY: "auto", flex: "1" }}>
            <form onSubmit={handleSubmit}>
              {/* MOBILE */}
              <div style={{ marginBottom: "18px" }}>
                <div style={{ fontSize: "17px", color: "#fff", marginBottom: "6px" }}>Mobile Number*</div>
                <div style={{ display: "grid", gridTemplateColumns: "105px 1fr", gap: "12px" }}>
                  {/* --- DROPDOWN WITH ARROW FIXED --- */}
                  <div style={{ position: "relative", width: "100%", height: "44px" }}>
                    <select
                      value={isd}
                      onChange={(e) => {
                        setIsd(e.target.value);
                        setPhone("");
                        setErrors(prev => ({ ...prev, phone: null }));
                      }}
                      className="instant-select"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code + c.dial_code} value={c.dial_code} style={{ background: "#000", color: "#fff" }}>
                          {c.name} ({c.dial_code})
                        </option>
                      ))}
                    </select>
                    {/* ✨ Overlay with Code + SVG Arrow */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "none",
                      color: "#fff",
                      fontSize: "0.95rem",
                      gap: "5px"
                    }}>
                      <span>{isd}</span>
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  <input value={phone} onChange={(e) => { if (/[^0-9]/.test(e.target.value)) return; setPhone(e.target.value); if (errors.phone) setErrors(prev => ({ ...prev, phone: null })); }}
                    onBlur={validateMobileOnBlur} maxLength={maxAllowedLength} placeholder="Mobile Number" inputMode="numeric"
                    className={`instant-input ${errors.phone ? 'error' : ''}`}
                  />
                </div>
                {errors.phone && <span style={{ color: "#ff5656", fontSize: "13px" }}>{errors.phone}</span>}
              </div>

              {/* NAME */}
              <div style={{ marginBottom: "18px" }}>
                <div style={{ color: "#fff", marginBottom: "6px", fontSize: "17px" }}>Name*</div>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={`instant-input ${errors.name ? 'error' : ''}`} />
                {errors.name && <span style={{ color: "#ff5656", fontSize: "13px" }}>{errors.name}</span>}
              </div>

              {/* EMAIL */}
              <div style={{ marginBottom: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#fff", marginBottom: "6px", fontSize: "17px" }}>
                  <span>Email*</span>
                  <button type="button" style={{ color: "#ff914d", background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => setShowSignup(true)}>Create account</button>
                </div>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className={`instant-input ${errors.email ? 'error' : ''}`} />
                {errors.email && <span style={{ color: "#ff5656", fontSize: "13px" }}>{errors.email}</span>}
              </div>

              {/* COUPON */}
              <div style={{ marginBottom: "18px" }}>
                <div style={{ color: "#fff", marginBottom: "6px", fontSize: "17px" }}>Coupon</div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="e.g. CKFREE100" className="instant-input" style={{ flex: 1 }} />
             <button
  type="button"
  onClick={applyCoupon}
  disabled={!canApplyCoupon || applying}
  style={{
    height: "44px",
    padding: "0 16px",
    borderRadius: "12px",
    background: (!canApplyCoupon || applying) ? "#333" : "#222",
    border: "1.5px solid #666",
    color: (!canApplyCoupon || applying) ? "#777" : "#fff",
    cursor: (!canApplyCoupon || applying) ? "not-allowed" : "pointer",
    fontSize: "16px",
  }}
>
  {applying ? "…" : "Apply"}
</button>

                </div>
                {couponInfo && <div style={{ color: "#2ecc71", marginTop: "6px", fontSize: "13px" }}>Applied Successfully</div>}
              </div>

              {/* PASSWORD */}
              {accountChoice === "create" && (
                <div style={{ marginBottom: "18px" }}>
                  <div style={{ color: "#fff", marginBottom: "6px", fontSize: "17px" }}>Password</div>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" className={`instant-input ${errors.password ? 'error' : ''}`} />
                  {errors.password && <span style={{ color: "#ff5656", fontSize: "13px" }}>{errors.password}</span>}
                </div>
              )}
            </form>
          </div>

          <div style={{
            width: "100%", 
            display: "flex",
            flexShrink: 0,
            // borderTop: "2px solid #ff914d" // Removed container border to fix overlap
          }}>
            <div style={{ 
              width: "50%", 
              padding: "7px 61px", 
              background: "#161616", 
              borderRight: "2px solid #ff914d", 
              borderTop: "2px solid #ff914d", // Moved border to children
              color: "#fff", 
              borderBottomLeftRadius: "12px", 
              fontSize: "21px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              ₹{(finalAmount / 100)}
            </div>
            <button type="submit" disabled={paying || !rzReady || !isFormValid || generatingReport} onClick={handleSubmit}
              style={{ 
                flex: 1, 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                fontSize: "21px", 
                background: (paying || !rzReady || !isFormValid || generatingReport) ? "#1a1a1a" : "#ff914d", 
                border: "none", 
                borderTop: "2px solid #ff914d", // Explicit border top for button
                color: (paying || !rzReady || !isFormValid || generatingReport) ? "#666" : "black", 
                cursor: (paying || !rzReady || !isFormValid || generatingReport) ? "not-allowed" : "pointer",
                borderBottomRightRadius: "12px"
              }}>
              {!rzReady ? "Loading…" : paying || generatingReport ? "Processing…" : finalAmount === 0 ? "Get Report" : ctaLabel}
            </button>
          </div>
        </>
      )}
    </div>
  );
}