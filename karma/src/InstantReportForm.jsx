// src/InstantReportForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";
// Path check kar lena
import { COUNTRY_CODES } from "./components/constants/countryCodes"; 

const PRICE = Number(process.env.REACT_APP_INSTANT_REPORT_PRICE || 0) * 100;

const API = process.env.REACT_APP_API_URL;
const SCORE_API = process.env.REACT_APP_SCORE_API;

export default function InstantReportForm({
  initialIsd = "+91",
  initialMobile = "",
  ctaLabel = "Pay & Get Report",
  onSubmit: onSubmitProp,
}) {
  // form state
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
  const [errors, setErrors] = useState({});
  const [couponInfo, setCouponInfo] = useState(null);

  // --- TOAST STATE ---
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

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

  const navigate = useNavigate();
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

  // --- REAL-TIME VALIDITY CHECK ---
  const isFormValid = useMemo(() => {
    // 1. Check Name
    if (!name.trim()) return false;

    // 2. Check Email
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return false;

    // 3. Check Phone Length
    const currentCountry = COUNTRY_CODES.find((c) => c.dial_code === isd);
    const exactLength = currentCountry ? currentCountry.max_length : 10;
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== exactLength) return false;

    // 4. Check Password (if creating account)
    if (accountChoice === "create" && password.length < 6) return false;

    return true;
  }, [name, email, phone, isd, accountChoice, password]);

  // --- VALIDATION ON SUBMIT/BLUR ---
  const validateMobileOnBlur = () => {
    const currentCountry = getSelectedCountry();
    if (!currentCountry) return;

    const exactLength = currentCountry.max_length;
    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length > 0 && cleanPhone.length !== exactLength) {
      showToast(
        `Phone number must be exactly ${exactLength} digits for ${currentCountry.name}`
      );
      setErrors((prev) => ({
        ...prev,
        phone: `Must be ${exactLength} digits`,
      }));
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
    
    if (!new RegExp(`^\\d{${exactLength}}$`).test(phone)) {
       e.phone = `Enter ${exactLength}-digit mobile`;
    }

    if (accountChoice === "create" && password.length < 6)
      e.password = "Min 6 chars";
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const applyCoupon = async (ev) => {
    ev.preventDefault();
    if (!coupon) return;
    setApplying(true);
    try {
      const { data } = await axios.post(
        `${API}/api/coupon/validate`,
        { code: coupon, price: PRICE }
      );
      if (!data.valid) throw new Error(data.message || "Invalid coupon");
      setCouponInfo(data);
    } catch (err) {
      setCouponInfo(null);
      alert(err?.response?.data?.message || err.message || "Coupon error");
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

    console.log("Submitting order with body:", requestBody);

    // Free flow
    if (finalAmount === 0) {
      setPaying(true);
      try {
        const { data } = await axios.post(`${API}/api/pay/create-order`, requestBody);
        if (!data.ok) throw new Error(data.message || "Failed to create free order");

        try {
          const { data: scoreResponse } = await axios.post(
            `${SCORE_API}/score`,
            { mobile_number: phone },
            { headers: { "Content-Type": "application/json", "X-API-Key": process.env.REACT_APP_SCORE_API_KEY } }
          );

          const scoreData = scoreResponse.score || scoreResponse;
          await axios.post(`${API}/api/mail/score`, { email, mobileNumber: phone, scoreData });
        } catch (apiErr) {
          console.error("Error:", apiErr);
        }

        alert("Report is being generated and will be emailed shortly.");
      } catch (err) {
        alert(err?.response?.data?.message || err.message || "Something went wrong");
      } finally {
        setPaying(false);
      }
      return;
    }

    // Paid flow
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
                alert("Report is being generated and will be emailed shortly.");
              } catch (mailErr) {
                alert("Payment successful, but issue sending report.");
              }
            } catch (apiErr) {
              alert("Payment successful, but issue generating report.");
            }
          } catch (err) {
            alert("Verification error");
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      };

      const rz = new window.Razorpay(options);
      rz.open();
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Checkout failed");
      setPaying(false);
    }
  };

  const footerFix = {
    width: "100%",
    display: "flex",
    borderTop: "2px solid #ff7a33",
  };

  const currentCountry = getSelectedCountry();
  const maxAllowedLength = currentCountry?.max_length || 15;

  const toastComponent = toast.show ? (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        animation: 'slideDown 0.3s ease-out',
        zIndex: 9999999,
      }}
    >
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
      <div
        style={{
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: toast.type === 'error' ? '#dc2626' : '#16a34a',
          color: '#fff',
          fontFamily: 'inherit',
        }}
      >
        <span>{toast.message}</span>
        <button
          onClick={() => setToast({ show: false, message: "", type: "error" })}
          style={{
            marginLeft: 'auto',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '18px',
            lineHeight: '1',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          ×
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div style={{ width: "100%" }}>
      {typeof document !== 'undefined' 
        ? ReactDOM.createPortal(toastComponent, document.body) 
        : toastComponent
      }

      <div style={{ paddingRight: "16px", paddingLeft: "16px", paddingBottom: "16px" }}>
        {showSignup && (
          <SignupModal
            onClose={() => setShowSignup(false)}
            onSwitch={() => { setShowSignup(false); setShowLogin(true); }}
          />
        )}
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onSwitch={() => { setShowLogin(false); setShowSignup(true); }}
          />
        )}

        <form onSubmit={handleSubmit}>
          {/* MOBILE */}
          <div style={{ marginBottom: "18px" }}>
            <div style={{ fontSize: "17px", color: "#fff", marginBottom: "6px" }}>Mobile Number</div>
            <div style={{ display: "flex", gap: "10px" }}>
              <select
                value={isd}
                onChange={(e) => {
                    setIsd(e.target.value);
                    setPhone("");
                    setErrors(prev => ({...prev, phone: null}));
                }}
                style={{
                  background: "#111", border: "1px solid #444", borderRadius: "6px",
                  color: "#fff", height: "37px", padding: "0 12px", fontSize: "16px",
                  maxWidth: "100px", textAlign: "center"
                }}
              >
                 {COUNTRY_CODES.map((c) => (
                    <option key={c.code + c.dial_code} value={c.dial_code} style={{ background: "#000", color: "#fff" }}>
                      {c.dial_code}
                    </option>
                 ))}
              </select>

              <input
                value={phone}
                onChange={(e) => {
                    const val = e.target.value;
                    if (/[^0-9]/.test(val)) return;
                    setPhone(val);
                    if(errors.phone) setErrors(prev => ({...prev, phone: null}));
                }}
                onBlur={validateMobileOnBlur}
                maxLength={maxAllowedLength}
                placeholder="Mobile Number"
                inputMode="numeric"
                style={{
                  flex: 1, height: "37px", padding: "0 12px", borderRadius: "6px",
                  background: "#111", border: "1px solid #444", color: "#fff", fontSize: "16px",
                }}
              />
            </div>
            {errors.phone && <span style={{ color: "#ff5656", fontSize: "13px" }}>{errors.phone}</span>}
          </div>

          {/* NAME */}
          <div style={{ marginBottom: "18px" }}>
            <div style={{ color: "#fff", marginBottom: "6px", fontSize: "17px" }}>Name</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              style={{
                width: "100%", height: "37px", padding: "0 12px", borderRadius: "6px",
                background: "#111", border: "1px solid #444", color: "#fff", fontSize: "16px",
              }}
            />
            {errors.name && <span style={{ color: "#ff5656", fontSize: "13px" }}>{errors.name}</span>}
          </div>

          {/* EMAIL */}
          <div style={{ marginBottom: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#fff", marginBottom: "6px", fontSize: "17px" }}>
              <span>Email</span>
              <button type="button" style={{ color: "#ff7a33", background:'transparent', border:'none', cursor:'pointer' }} onClick={() => setShowSignup(true)}>
                Create account
              </button>
            </div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={{
                width: "100%", height: "37px", padding: "0 12px", borderRadius: "6px",
                background: "#111", border: "1px solid #444", color: "#fff", fontSize: "16px",
              }}
            />
            {errors.email && <span style={{ color: "#ff5656", fontSize: "13px" }}>{errors.email}</span>}
          </div>

          {/* COUPON */}
          <div style={{ marginBottom: "18px" }}>
            <div style={{ color: "#fff", marginBottom: "6px", fontSize: "17px" }}>Coupon</div>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="e.g. CKFREE100"
                style={{
                  flex: 1, height: "37px", padding: "0 12px", borderRadius: "6px",
                  background: "#111", border: "1px solid #444", color: "#fff", fontSize: "16px",
                }}
              />
              <button
                type="button"
                onClick={applyCoupon}
                disabled={!coupon || applying}
                style={{
                  height: "37px", padding: "0 16px", borderRadius: "6px",
                  background: "#222", border: "1px solid #444", color: "#fff", cursor: "pointer", fontSize: "16px",
                }}
              >
                {applying ? "…" : "Apply"}
              </button>
            </div>
            {couponInfo && <div style={{ color: "#2ecc71", marginTop: "6px", fontSize: "13px" }}>✓ New total: ₹{(finalAmount / 100).toFixed(2)}</div>}
          </div>

          {/* PASSWORD */}
          {accountChoice === "create" && (
            <div style={{ marginBottom: "18px" }}>
              <div style={{ color: "#fff", marginBottom: "6px", fontSize: "17px" }}>Password</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                style={{
                  width: "100%", height: "37px", padding: "0 12px", borderRadius: "6px",
                  background: "#111", border: "1px solid #444", color: "#fff", fontSize: "16px",
                }}
              />
              {errors.password && <span style={{ color: "#ff5656", fontSize: "13px" }}>{errors.password}</span>}
            </div>
          )}
        </form>
      </div>

      {/* ⭐ FOOTER */}
      <div style={footerFix}>
        <div
          style={{
            width: "50%", padding: "12px", paddingLeft: "70.5px", background: "#161616",
            borderRight: "2px solid #ff7a33", color: "#fff", borderBottomLeftRadius: "12px", fontSize: "21px",
          }}
        >
          ₹{(finalAmount / 100).toFixed(2)}
        </div>
        <button
          type="submit"
          disabled={paying || !rzReady || !isFormValid} // ✅ Button Disabled if Invalid
          onClick={handleSubmit}
          style={{
            flex: 1, display: "flex", justifyContent: "center", alignItems: "center", fontSize: "21px",
            // ✅ Button Color Logic: Grey if invalid/processing, Orange if valid & ready
            background: (paying || !rzReady || !isFormValid) ? "#444" : "#ff7a33", 
            border: "none",
            color: (paying || !rzReady || !isFormValid) ? "#888" : "black", // Text dim if disabled
            cursor: (paying || !rzReady || !isFormValid) ? "not-allowed" : "pointer"
          }}
        >
          {!rzReady ? "Loading…" :
           paying ? "Processing…" :
           finalAmount === 0 ? "Get Free Report" : ctaLabel}
        </button>
      </div>
    </div>
  );
}