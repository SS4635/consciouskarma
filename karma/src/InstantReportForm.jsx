// src/InstantReportForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";
import { COUNTRY_CODES } from "./components/constants/countryCodes"; 

const PRICE = Number(process.env.REACT_APP_INSTANT_REPORT_PRICE || 0) * 100;

const API = process.env.REACT_APP_API_URL;
const SCORE_API = process.env.REACT_APP_SCORE_API;

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

  const [applying, setApplying] = useState(false);
  const [paying, setPaying] = useState(false);
  
  
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
    [couponInfo]
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

  const applyCoupon = async (ev) => {
    ev.preventDefault();
    if (!coupon) return;
    setApplying(true);
    try {
      const { data } = await axios.post(`${API}/api/coupon/validate`, { code: coupon, price: PRICE,mobile:phone });
      if (!data.valid) throw new Error(data.message || "Invalid coupon");
      setCouponInfo(data);
    } catch (err) {
      setCouponInfo(null);
      alert(err?.response?.data?.message || err.message || "Coupon error");
    } finally {
      setApplying(false);
    }
  };

  // --- HANDLE SUBMISSION ---
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
        const { data } = await axios.post(`${API}/api/pay/create-order`, requestBody);
        if (!data.ok){   handleSuccess(); }

        // We don't set generatingReport to true here anymore, as we don't want to show the "Generating Your Report..." loader.
        // setGeneratingReport(true); 

        try {
          const { data: scoreResponse } = await axios.post(
            `${SCORE_API}/score`,
            { mobile_number: phone },
            { headers: { "Content-Type": "application/json", "X-API-Key": process.env.REACT_APP_SCORE_API_KEY } }
          );
          const scoreData = scoreResponse.score || scoreResponse;
          await axios.post(`${API}/api/mail/score`, { email, mobileNumber: phone, scoreData });
          
          handleSuccess(); 

        } catch (apiErr) {
          console.error("Error:", apiErr);
          // setGeneratingReport(false); // This is no longer needed
            handleSuccess(); 
        
        }
      } catch (err) {
        // setGeneratingReport(false); // This is no longer needed
        setPaying(false);
     handleSuccess(); 
      }
      return;
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
           
            const { data: vj } = await axios.post(`${API}/api/pay/verify`, { ...response, orderId });
            if (!vj.ok) {
              alert("Payment verification failed");
              setPaying(false);
              return;
            }

          
            try {
              const { data: scoreResponse } = await axios.post(
                `${SCORE_API}/score`,
                { mobile_number: phone },
                { headers: { "Content-Type": "application/json", "X-API-Key": process.env.REACT_APP_SCORE_API_KEY } }
              );
              const scoreData = scoreResponse.score || scoreResponse;
              try {
                await axios.post(`${API}/api/mail/score`, { email, scoreData, mobileNumber: phone });
                
                handleSuccess(); // ✅ Calls the success animation + redirect

              } catch (mailErr) {
             handleSuccess(); 
              }
            } catch (apiErr) {
              handleSuccess(); 
            }
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
    <div style={{ width: "100%", maxWidth: "400px" }}>
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
          `}</style>

          <div style={{ padding: "0 1.5rem 1.5rem 1.2rem" }}>
            <form onSubmit={handleSubmit}>
              {/* MOBILE */}
              <div style={{ marginBottom: "18px" }}>
                <div style={{ fontSize: "17px", color: "#fff", marginBottom: "6px" }}>Mobile Number*</div>
                <div style={{ display: "flex", gap: "10px" }}>
                  {/* --- DROPDOWN WITH ARROW FIXED --- */}
                  <div style={{ position: "relative", width: "100px" }}>
                    <select
                      value={isd}
                      onChange={(e) => {
                        setIsd(e.target.value);
                        setPhone("");
                        setErrors(prev => ({ ...prev, phone: null }));
                      }}
                      style={{
                        background: "#111",
                        border: "1px solid #444",
                        borderRadius: "6px",
                        height: "37px",
                        padding: "0 12px",
                        fontSize: "16px",
                        width: "100%",
                        color: "transparent",
                        cursor: "pointer",
                        appearance: "none",
                        WebkitAppearance: "none",
                        MozAppearance: "none"
                      }}
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
                      fontSize: "16px",
                      gap: "6px"
                    }}>
                      <span>{isd}</span>
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  <input value={phone} onChange={(e) => { if (/[^0-9]/.test(e.target.value)) return; setPhone(e.target.value); if (errors.phone) setErrors(prev => ({ ...prev, phone: null })); }}
                    onBlur={validateMobileOnBlur} maxLength={maxAllowedLength} placeholder="Mobile Number" inputMode="numeric"
                    style={{ flex: 1, height: "37px", padding: "0 12px", borderRadius: "6px", background: "#111", border: "1px solid #444", color: "#fff", fontSize: "16px" }}
                  />
                </div>
                {errors.phone && <span style={{ color: "#ff5656", fontSize: "13px" }}>{errors.phone}</span>}
              </div>

              {/* NAME */}
              <div style={{ marginBottom: "18px" }}>
                <div style={{ color: "#fff", marginBottom: "6px", fontSize: "17px" }}>Name*</div>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={{ width: "100%", height: "37px", padding: "0 12px", borderRadius: "6px", background: "#111", border: "1px solid #444", color: "#fff", fontSize: "16px" }} />
                {errors.name && <span style={{ color: "#ff5656", fontSize: "13px" }}>{errors.name}</span>}
              </div>

              {/* EMAIL */}
              <div style={{ marginBottom: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#fff", marginBottom: "6px", fontSize: "17px" }}>
                  <span>Email*</span>
                  <button type="button" style={{ color: "#ff914d", background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => setShowSignup(true)}>Create account</button>
                </div>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" style={{ width: "100%", height: "37px", padding: "0 12px", borderRadius: "6px", background: "#111", border: "1px solid #444", color: "#fff", fontSize: "16px" }} />
                {errors.email && <span style={{ color: "#ff5656", fontSize: "13px" }}>{errors.email}</span>}
              </div>

              {/* COUPON */}
              <div style={{ marginBottom: "18px" }}>
                <div style={{ color: "#fff", marginBottom: "6px", fontSize: "17px" }}>Coupon</div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="e.g. CKFREE100" style={{ flex: 1, height: "37px", padding: "0 12px", borderRadius: "6px", background: "#111", border: "1px solid #444", color: "#fff", fontSize: "16px" }} />
                  <button type="button" onClick={applyCoupon} disabled={!coupon || applying} style={{ height: "37px", padding: "0 16px", borderRadius: "6px", background: "#222", border: "1px solid #444", color: "#fff", cursor: "pointer", fontSize: "16px" }}>{applying ? "…" : "Apply"}</button>
                </div>
                {couponInfo && <div style={{ color: "#2ecc71", marginTop: "6px", fontSize: "13px" }}>Applied Successfully</div>}
              </div>

              {/* PASSWORD */}
              {accountChoice === "create" && (
                <div style={{ marginBottom: "18px" }}>
                  <div style={{ color: "#fff", marginBottom: "6px", fontSize: "17px" }}>Password</div>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" style={{ width: "100%", height: "37px", padding: "0 12px", borderRadius: "6px", background: "#111", border: "1px solid #444", color: "#fff", fontSize: "16px" }} />
                  {errors.password && <span style={{ color: "#ff5656", fontSize: "13px" }}>{errors.password}</span>}
                </div>
              )}
            </form>
          </div>

          <div style={footerFix}>
            <div style={{ width: "50%", padding: "7px 61px", background: "#161616", borderRight: "2px solid #ff914d", color: "#fff", borderBottomLeftRadius: "12px", fontSize: "21px" }}>₹{(finalAmount / 100).toFixed(2)}</div>
            <button type="submit" disabled={paying || !rzReady || !isFormValid || generatingReport} onClick={handleSubmit}
              style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", fontSize: "21px", background: (paying || !rzReady || !isFormValid || generatingReport) ? "#444" : "#ff914d", border: "none", color: (paying || !rzReady || !isFormValid || generatingReport) ? "#888" : "black", cursor: (paying || !rzReady || !isFormValid || generatingReport) ? "not-allowed" : "pointer" }}>
              {!rzReady ? "Loading…" : paying || generatingReport ? "Processing…" : finalAmount === 0 ? "Get Report" : ctaLabel}
            </button>
          </div>
        </>
      )}
    </div>
  );
}