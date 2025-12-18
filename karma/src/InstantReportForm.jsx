// src/InstantReportForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";
const PRICE =
  Number(process.env.REACT_APP_INSTANT_REPORT_PRICE || 0) * 100;


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
  const [accountChoice, setAccountChoice] = useState("guest"); // 'guest' | 'create'
  const [password, setPassword] = useState("");
const [showSignup, setShowSignup] = useState(false);
const [showLogin, setShowLogin] = useState(false);

  const [applying, setApplying] = useState(false);
  const [paying, setPaying] = useState(false);
  const [errors, setErrors] = useState({});
  const [couponInfo, setCouponInfo] = useState(null);

  // Update phone when initialMobile changes
  useEffect(() => {
    setPhone(initialMobile);
  }, [initialMobile]);

  // Update ISD when initialIsd changes
  useEffect(() => {
    setIsd(initialIsd);
  }, [initialIsd]);

  const navigate =useNavigate();
  const finalAmount = useMemo(
    () => (!couponInfo ? PRICE : Math.max(0, couponInfo.finalAmount)),
    [couponInfo]
  );

  // useEffect(() => {
  //   // load Razorpay checkout script once
  //   const src = "https://checkout.razorpay.com/v1/checkout.js";
  //   if (!document.querySelector(`script[src="${src}"]`)) {
  //     const s = document.createElement("script");
  //     s.src = src;
  //     s.async = true;
  //     document.body.appendChild(s);
  //   }
  // }, []);



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


  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Required";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      e.email = "Enter a valid email";
    if (!/^\d{10}$/.test(phone)) e.phone = "Enter 10-digit mobile";
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
        {
          code: coupon,
          price: PRICE,
        }
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

    // Prepare request body in the format server expects
    const requestBody = {
      general: {
        name,
        email,
      },
      primary: {
        isd,
        number: phone,
      },
      parallels: [],
      previousNumbers: [],
      coupon,
      accountChoice,
      password,
      price: PRICE / 100, // Convert paise to rupees for server
    };


    console.log("Submitting order with body:", requestBody);
    // Free flow (after coupon)
    if (finalAmount === 0) {
      setPaying(true);
      try {
        const { data } = await axios.post(
          `${API}/api/pay/create-order`,
          requestBody
        );
        if (!data.ok)
          throw new Error(data.message || "Failed to create free order");

        // Call Score API and send email for free orders
        try {
          const { data: scoreResponse } = await axios.post(
            `${SCORE_API}/score`,
            {
              mobile_number: phone,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "X-API-Key": process.env.REACT_APP_SCORE_API_KEY,
              },
            }
          );

          console.log("✅ SCORE API Response:", scoreResponse);

          // Extract the score object from the response
          const scoreData = scoreResponse.score || scoreResponse;

          await axios.post(`${API}/api/mail/score`, {
            email,
            mobileNumber: phone,
            scoreData,
          });
          console.log("📩 Mail sent for free order");
        } catch (apiErr) {
          console.error("❌ Error:", apiErr?.response?.data || apiErr.message);
        }

        alert("Report is being generated and will be emailed shortly.");
      } catch (err) {
        alert(
          err?.response?.data?.message || err.message || "Something went wrong"
        );
      } finally {
        setPaying(false);
      }
      return;
    }

    // Paid flow
    setPaying(true);
    try {
      const { data } = await axios.post(
        `${API}/api/pay/create-order`,
        requestBody
      );
      const { ok, message, order, keyId, orderId } = data;

      console.log("Create order response:", data);
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
            const { data: vj } = await axios.post(
              `${API}/api/pay/verify`,
              {
                ...response,
                orderId,
              }
            );
            if (!vj.ok) {
              alert("Payment verification failed");
              return;
            }

            
            try {
              const { data: scoreResponse } = await axios.post(
                `${SCORE_API}/score`,
                {
                  mobile_number: phone,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": process.env.REACT_APP_SCORE_API_KEY,
                  },
                }
              );

              console.log("✅ SCORE API Response:", scoreResponse);

              // Extract the score object from the response
              const scoreData = scoreResponse.score || scoreResponse;

              try {
                const mailResp = await axios.post(
                  `${API}/api/mail/score`,
                  {
                    email,
                    scoreData,
                    mobileNumber: phone, 
                    
                  }
                );
                console.log("📩 Mail sent:", mailResp.data);
                alert("Report is being generated and will be emailed shortly.");
              } catch (mailErr) {
                console.error(
                  "❌ Mail error:",
                  mailErr?.response?.data || mailErr.message
                );
                alert(
                  "Payment successful, but there was an issue sending the report. Please contact support."
                );
              }
            } catch (apiErr) {
              console.error(
                "❌ SCORE API Error:",
                apiErr?.response?.data || apiErr.message
              );
              alert(
                "Payment successful, but there was an issue generating the report. Please contact support."
              );
            }
          } catch (err) {
            alert(
              err?.response?.data?.message ||
                err.message ||
                "Verification error"
            );
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

  return (
    <div style={{ width: "100%" }}>
      {/* ⭐ FORM CONTENT (with padding, footer excluded) */}
      <div style={{ paddingRight: "16px", paddingLeft: "16px", paddingBottom: "16px" }}>
        {showSignup && (
  <SignupModal
    onClose={() => setShowSignup(false)}
    onSwitch={() => {
      setShowSignup(false);
      setShowLogin(true);
    }}
  />
)}

{showLogin && (
  <LoginModal
    onClose={() => setShowLogin(false)}
    onSwitch={() => {
      setShowLogin(false);
      setShowSignup(true);
    }}
  />
)}

        <form onSubmit={handleSubmit}>
          {/* <br /> */}
          {/* MOBILE */}
          <div style={{ marginBottom: "18px" }}>
            <div
              style={{ fontSize: "17px", color: "#fff", marginBottom: "6px" }}
            >
              Mobile Number
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <select
                value={isd}
                onChange={(e) => setIsd(e.target.value)}
                style={{
                  background: "#111",
                  border: "1px solid #444",
                  borderRadius: "6px",
                  color: "#fff",
                  height: "37px",
                  padding: "0 12px",
                  fontSize: "16px",
                }}
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
              </select>

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="9999999999"
                maxLength={10}
                style={{
                  flex: 1,
                  height: "37px",
                  padding: "0 12px",
                  borderRadius: "6px",
                  background: "#111",
                  border: "1px solid #444",
                  color: "#fff",
                  fontSize: "16px",
                }}
              />
            </div>

            {errors.phone && (
              <span style={{ color: "#ff5656", fontSize: "13px" }}>
                {errors.phone}
              </span>
            )}
          </div>

          {/* NAME */}
          <div style={{ marginBottom: "18px" }}>
            <div
              style={{ color: "#fff", marginBottom: "6px", fontSize: "17px" }}
            >
              Name
            </div>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              style={{
                width: "100%",
                height: "37px",
                padding: "0 12px",
                borderRadius: "6px",
                background: "#111",
                border: "1px solid #444",
                color: "#fff",
                fontSize: "16px",
              }}
            />

            {errors.name && (
              <span style={{ color: "#ff5656", fontSize: "13px" }}>
                {errors.name}
              </span>
            )}
          </div>

          {/* EMAIL */}
          <div style={{ marginBottom: "18px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#fff",
                marginBottom: "6px",
                fontSize: "17px",
              }}
            >
              <span>Email</span>
             <button
  type="button"
  style={{ color: "#ff7a33" }}
  onClick={() => setShowSignup(true)}
>
  Create account
</button>

            </div>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={{
                width: "100%",
                height: "37px",
                padding: "0 12px",
                borderRadius: "6px",
                background: "#111",
                border: "1px solid #444",
                color: "#fff",
                fontSize: "16px",
              }}
            />

            {errors.email && (
              <span style={{ color: "#ff5656", fontSize: "13px" }}>
                {errors.email}
              </span>
            )}
          </div>

          {/* COUPON */}
          <div style={{ marginBottom: "18px" }}>
            <div
              style={{ color: "#fff", marginBottom: "6px", fontSize: "17px" }}
            >
              Coupon
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="e.g. CKFREE100"
                style={{
                  flex: 1,
                  height: "37px",
                  padding: "0 12px",
                  borderRadius: "6px",
                  background: "#111",
                  border: "1px solid #444",
                  color: "#fff",
                  fontSize: "16px",
                }}
              />

              <button
                type="button"
                onClick={applyCoupon}
                disabled={!coupon || applying}
                style={{
                  height: "37px",
                  padding: "0 16px",
                  borderRadius: "6px",
                  background: "#222",
                  border: "1px solid #444",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                {applying ? "…" : "Apply"}
              </button>
            </div>

            {couponInfo && (
              <div
                style={{ color: "#2ecc71", marginTop: "6px", fontSize: "13px" }}
              >
                ✓ New total: ₹{(finalAmount / 100).toFixed(2)}
              </div>
            )}
          </div>

          {/* Password Field (Conditional) */}
          {accountChoice === "create" && (
            <div style={{ marginBottom: "18px" }}>
              <div
                style={{ color: "#fff", marginBottom: "6px", fontSize: "17px" }}
              >
                Password
              </div>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                style={{
                  width: "100%",
                  height: "37px",
                  padding: "0 12px",
                  borderRadius: "6px",
                  background: "#111",
                  border: "1px solid #444",
                  color: "#fff",
                  fontSize: "16px",
                }}
              />

              {errors.password && (
                <span style={{ color: "#ff5656", fontSize: "13px" }}>
                  {errors.password}
                </span>
              )}
            </div>
          )}
        </form>
      </div>

      {/* ⭐ FOOTER (NO PADDING, FULL WIDTH) */}
      <div style={footerFix}>
        <div
          style={{
            width: "50%",
            padding: "12px",
            paddingLeft: "70.5px",
            background: "#161616",
            borderRight: "2px solid #ff7a33",
            color: "#fff",
            borderBottomLeftRadius: "12px",
            fontSize: "21px",
          }}
        >
          ₹{(finalAmount / 100).toFixed(2)}
        </div>
<button
  type="submit"
  disabled={paying || !rzReady}
  onClick={handleSubmit}
  style={{
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "21px",
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






























// // src/InstantReportForm.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { useAuth } from "./AuthContext";

// const PRICE = 100; // paise (₹1.00) – adjust as needed

// export default function InstantReportForm({
//   initialIsd = "+91",
//   initialMobile = "",
//   ctaLabel = "Pay & Get Report",
//   onOpenLogin, // optional
//   onOpenSignup, // optional
// }) {
//   const { user } = useAuth();

//   // form state
//   const [name, setName] = useState(user?.name || "");
//   const [email, setEmail] = useState(user?.email || "");
//   const [isd, setIsd] = useState(initialIsd);
//   const [phone, setPhone] = useState(initialMobile);
//   const [coupon, setCoupon] = useState("");
//   const [accountChoice, setAccountChoice] = useState("guest"); // 'guest' | 'create'
//   const [password, setPassword] = useState("");

//   const [applying, setApplying] = useState(false);
//   const [paying, setPaying] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [couponInfo, setCouponInfo] = useState(null);

//   const [rzReady, setRzReady] = useState(false);

//   // Sync with props / logged-in user
//   useEffect(() => {
//     setPhone(initialMobile);
//   }, [initialMobile]);

//   useEffect(() => {
//     setIsd(initialIsd);
//   }, [initialIsd]);

//   useEffect(() => {
//     if (user) {
//       setName(user.name || "");
//       setEmail(user.email || "");
//     }
//   }, [user]);

//   // Load Razorpay script once
//   useEffect(() => {
//     const src = "https://checkout.razorpay.com/v1/checkout.js";
//     const existing = document.querySelector(`script[src="${src}"]`);

//     if (existing) {
//       if (existing.onload) {
//         existing.onload();
//       } else {
//         setRzReady(true);
//       }
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = src;
//     script.onload = () => setRzReady(true);
//     script.onerror = () => {
//       console.error("Failed to load Razorpay script");
//       setRzReady(false);
//     };
//     document.body.appendChild(script);
//   }, []);

//   const finalAmount = useMemo(
//     () => (!couponInfo ? PRICE : Math.max(0, couponInfo.finalAmount)),
//     [couponInfo]
//   );

//   const validate = () => {
//     const e = {};
//     if (!name.trim()) e.name = "Required";
//     if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
//       e.email = "Enter a valid email";
//     if (!/^\d{10}$/.test(phone)) e.phone = "Enter 10-digit mobile";
//     if (accountChoice === "create" && password.length < 6)
//       e.password = "Min 6 characters";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const applyCoupon = async (ev) => {
//     ev.preventDefault();
//     if (!coupon) return;
//     setApplying(true);
//     try {
//       const { data } = await axios.post(
//         "http://localhost:4000/api/coupon/validate",
//         {
//           code: coupon,
//           price: PRICE,
//         }
//       );
//       if (!data.valid) throw new Error(data.message || "Invalid coupon");
//       setCouponInfo(data);
//     } catch (err) {
//       setCouponInfo(null);
//       alert(err?.response?.data?.message || err.message || "Coupon error");
//     } finally {
//       setApplying(false);
//     }
//   };

//   const handleSubmit = async (ev) => {
//     if (ev) ev.preventDefault();
//     if (!validate()) return;

//     // Build body for backend
//     const requestBody = {
//       userId: user?.id || user?._id || null, // backend can start using this
//       general: { name, email },
//       primary: { isd, number: phone },
//       parallels: [],
//       previousNumbers: [],
//       coupon,
//       accountChoice,
//       // server expects price in INR (you were doing PRICE / 100 already)
//       price: PRICE / 100,
//     };

//     console.log("Submitting order with body:", requestBody);

//     // FREE FLOW (amount = 0 after coupon)
//     if (finalAmount === 0) {
//       setPaying(true);
//       try {
//         const { data } = await axios.post(
//           "http://localhost:4000/api/pay/create-order",
//           requestBody
//         );

//         if (!data.ok && !data.free) {
//           throw new Error(data.message || "Failed to create free order");
//         }

//         // Call SCORE API directly for free orders
//         try {
//           const { data: scoreResponse } = await axios.post(
//             "http://13.61.5.172:8000/score",
//             {
//               mobile_number: phone,
//             },
//             {
//               headers: {
//                 "Content-Type": "application/json",
//                 "X-API-Key": "CK_Score_55bJ9rPp!2025",
//               },
//             }
//           );

//           console.log("✅ SCORE API Response:", scoreResponse);

//           const scoreData = scoreResponse.score || scoreResponse;

//           await axios.post("http://localhost:4000/api/mail/score", {
//             email,
//             mobileNumber: phone,
//             scoreData,
//           });

//           console.log("📩 Mail sent for free order");
//         } catch (apiErr) {
//           console.error("❌ Error:", apiErr?.response?.data || apiErr.message);
//         }

//         alert("Report is being generated and will be emailed shortly.");
//       } catch (err) {
//         alert(
//           err?.response?.data?.message || err.message || "Something went wrong"
//         );
//       } finally {
//         setPaying(false);
//       }
//       return;
//     }

//     // PAID FLOW
//     setPaying(true);
//     try {
//       const { data } = await axios.post(
//         "http://localhost:4000/api/pay/create-order",
//         requestBody
//       );
//       const { ok, message, order, keyId, orderId } = data;

//       console.log("Create order response:", data);
//       if (!ok) throw new Error(message || "Order creation failed");

//       const options = {
//         key: keyId,
//         amount: order.amount,
//         currency: order.currency,
//         name: "Conscious Karma",
//         description: "Instant Report",
//         order_id: order.id,
//         prefill: { name, email, contact: phone },
//         theme: { color: "#ff8a3d" },
//         handler: async (response) => {
//           try {
//             const { data: vj } = await axios.post(
//               "http://localhost:4000/api/pay/verify",
//               {
//                 ...response,
//                 orderId,
//               }
//             );
//             if (!vj.ok) {
//               alert("Payment verification failed");
//               return;
//             }

//             // SCORE + MAIL after successful payment
//             try {
//               const { data: scoreResponse } = await axios.post(
//                 "http://13.61.5.172:8000/score",
//                 {
//                   mobile_number: phone,
//                 },
//                 {
//                   headers: {
//                     "Content-Type": "application/json",
//                     "X-API-Key": "CK_Score_55bJ9rPp!2025",
//                   },
//                 }
//               );

//               console.log("✅ SCORE API Response:", scoreResponse);

//               const scoreData = scoreResponse.score || scoreResponse;

//               try {
//                 const mailResp = await axios.post(
//                   "http://localhost:4000/api/mail/score",
//                   {
//                     email,
//                     scoreData,
//                     mobileNumber: phone,
//                   }
//                 );
//                 console.log("📩 Mail sent:", mailResp.data);
//                 alert("Report is being generated and will be emailed shortly.");
//               } catch (mailErr) {
//                 console.error(
//                   "❌ Mail error:",
//                   mailErr?.response?.data || mailErr.message
//                 );
//                 alert(
//                   "Payment successful, but there was an issue sending the report. Please contact support."
//                 );
//               }
//             } catch (apiErr) {
//               console.error(
//                 "❌ SCORE API Error:",
//                 apiErr?.response?.data || apiErr.message
//               );
//               alert(
//                 "Payment successful, but there was an issue generating the report. Please contact support."
//               );
//             }
//           } catch (err) {
//             alert(
//               err?.response?.data?.message ||
//                 err.message ||
//                 "Verification error"
//             );
//           } finally {
//             setPaying(false);
//           }
//         },
//         modal: {
//           ondismiss: () => setPaying(false),
//         },
//       };

//       const rz = new window.Razorpay(options);
//       rz.open();
//     } catch (err) {
//       alert(err?.response?.data?.message || err.message || "Checkout failed");
//       setPaying(false);
//     }
//   };

//   const footerFix = {
//     width: "100%",
//     display: "flex",
//     borderTop: "2px solid #ff7a33",
//   };

//   return (
//     <div style={{ width: "100%" }}>
//       {/* FORM BODY */}
//       <div style={{ padding: "16px" }}>
//         <form onSubmit={handleSubmit}>
//           {/* MOBILE */}
//           <div style={{ marginBottom: "18px" }}>
//             <div
//               style={{ fontSize: "17px", color: "#fff", marginBottom: "6px" }}
//             >
//               Mobile Number
//             </div>

//             <div style={{ display: "flex", gap: "10px" }}>
//               <select
//                 value={isd}
//                 onChange={(e) => setIsd(e.target.value)}
//                 style={{
//                   background: "#111",
//                   border: "1px solid #444",
//                   borderRadius: "6px",
//                   color: "#fff",
//                   height: "37px",
//                   padding: "0 12px",
//                   fontSize: "16px",
//                 }}
//               >
//                 <option value="+91">🇮🇳 +91</option>
//                 <option value="+1">🇺🇸 +1</option>
//               </select>

//               <input
//                 value={phone}
//                 onChange={(e) =>
//                   setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
//                 }
//                 placeholder="9999999999"
//                 maxLength={10}
//                 style={{
//                   flex: 1,
//                   height: "37px",
//                   padding: "0 12px",
//                   borderRadius: "6px",
//                   background: "#111",
//                   border: "1px solid #444",
//                   color: "#fff",
//                   fontSize: "16px",
//                 }}
//               />
//             </div>

//             {errors.phone && (
//               <span style={{ color: "#ff5656", fontSize: "13px" }}>
//                 {errors.phone}
//               </span>
//             )}
//           </div>

//           {/* NAME */}
//           <div style={{ marginBottom: "18px" }}>
//             <div
//               style={{ color: "#fff", marginBottom: "6px", fontSize: "17px" }}
//             >
//               Name
//             </div>

//             <input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Your name"
//               style={{
//                 width: "100%",
//                 height: "37px",
//                 padding: "0 12px",
//                 borderRadius: "6px",
//                 background: "#111",
//                 border: "1px solid #444",
//                 color: "#fff",
//                 fontSize: "16px",
//               }}
//             />

//             {errors.name && (
//               <span style={{ color: "#ff5656", fontSize: "13px" }}>
//                 {errors.name}
//               </span>
//             )}
//           </div>

//           {/* EMAIL + AUTH LINKS */}
//           <div style={{ marginBottom: "18px" }}>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 color: "#fff",
//                 marginBottom: "6px",
//                 fontSize: "17px",
//                 alignItems: "center",
//               }}
//             >
//               <span>Email</span>
//               <span style={{ fontSize: "13px" }}>
//                 {user ? (
//                   <span>Logged in as {user.email}</span>
//                 ) : (
//                   <>
//                     <button
//                       type="button"
//                       onClick={onOpenSignup}
//                       style={{
//                         background: "transparent",
//                         border: "none",
//                         color: "#ff8a3d",
//                         cursor: "pointer",
//                         padding: 0,
//                         marginRight: 8,
//                       }}
//                     >
//                       Create account
//                     </button>
//                     /
//                     <button
//                       type="button"
//                       onClick={onOpenLogin}
//                       style={{
//                         background: "transparent",
//                         border: "none",
//                         color: "#ff8a3d",
//                         cursor: "pointer",
//                         padding: 0,
//                         marginLeft: 8,
//                       }}
//                     >
//                       Login
//                     </button>
//                   </>
//                 )}
//               </span>
//             </div>

//             <input
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@email.com"
//               style={{
//                 width: "100%",
//                 height: "37px",
//                 padding: "0 12px",
//                 borderRadius: "6px",
//                 background: "#111",
//                 border: "1px solid #444",
//                 color: "#fff",
//                 fontSize: "16px",
//               }}
//             />

//             {errors.email && (
//               <span style={{ color: "#ff5656", fontSize: "13px" }}>
//                 {errors.email}
//               </span>
//             )}
//           </div>

//           {/* ACCOUNT CHOICE (Guest vs Create) */}
//           {!user && (
//             <div style={{ marginBottom: "18px", color: "#ccc", fontSize: 14 }}>
//               <span
//                 style={{
//                   marginRight: 16,
//                   cursor: "pointer",
//                   color: accountChoice === "guest" ? "#ff8a3d" : "#ccc",
//                 }}
//                 onClick={() => setAccountChoice("guest")}
//               >
//                 ● Continue as guest
//               </span>
//               <span
//                 style={{
//                   cursor: "pointer",
//                   color: accountChoice === "create" ? "#ff8a3d" : "#ccc",
//                 }}
//                 onClick={() => setAccountChoice("create")}
//               >
//                 ● Create account with this email
//               </span>
//             </div>
//           )}

//           {/* Password Field (Conditional) */}
//           {!user && accountChoice === "create" && (
//             <div style={{ marginBottom: "18px" }}>
//               <div
//                 style={{ color: "#fff", marginBottom: "6px", fontSize: "17px" }}
//               >
//                 Password
//               </div>

//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Create a password"
//                 style={{
//                   width: "100%",
//                   height: "37px",
//                   padding: "0 12px",
//                   borderRadius: "6px",
//                   background: "#111",
//                   border: "1px solid #444",
//                   color: "#fff",
//                   fontSize: "16px",
//                 }}
//               />

//               {errors.password && (
//                 <span style={{ color: "#ff5656", fontSize: "13px" }}>
//                   {errors.password}
//                 </span>
//               )}
//             </div>
//           )}

//           {/* COUPON */}
//           <div style={{ marginBottom: "18px" }}>
//             <div
//               style={{ color: "#fff", marginBottom: "6px", fontSize: "17px" }}
//             >
//               Coupon
//             </div>

//             <div style={{ display: "flex", gap: "10px" }}>
//               <input
//                 value={coupon}
//                 onChange={(e) => setCoupon(e.target.value)}
//                 placeholder="e.g. CKFREE100"
//                 style={{
//                   flex: 1,
//                   height: "37px",
//                   padding: "0 12px",
//                   borderRadius: "6px",
//                   background: "#111",
//                   border: "1px solid #444",
//                   color: "#fff",
//                   fontSize: "16px",
//                 }}
//               />

//               <button
//                 type="button"
//                 onClick={applyCoupon}
//                 disabled={!coupon || applying}
//                 style={{
//                   height: "37px",
//                   padding: "0 16px",
//                   borderRadius: "6px",
//                   background: "#222",
//                   border: "1px solid #444",
//                   color: "#fff",
//                   cursor: !coupon || applying ? "not-allowed" : "pointer",
//                   fontSize: "16px",
//                 }}
//               >
//                 {applying ? "…" : "Apply"}
//               </button>
//             </div>

//             {couponInfo && (
//               <div
//                 style={{ color: "#2ecc71", marginTop: "6px", fontSize: "13px" }}
//               >
//                 ✓ New total: ₹{(finalAmount / 100).toFixed(2)}
//               </div>
//             )}
//           </div>
//         </form>
//       </div>

//       {/* FOOTER */}
//       <div style={footerFix}>
//         <div
//           style={{
//             width: "50%",
//             padding: "12px",
//             paddingLeft: "70.5px",
//             background: "#161616",
//             borderRight: "2px solid #ff7a33",
//             color: "#fff",
//             borderBottomLeftRadius: "12px",
//             fontSize: "21px",
//           }}
//         >
//           ₹{(finalAmount / 100).toFixed(2)}
//         </div>

//         <button
//           type="button"
//           disabled={paying || !rzReady}
//           onClick={handleSubmit}
//           style={{
//             width: "50%",
//             padding: "12px",
//             background: paying || !rzReady ? "#444" : "#ff7a33",
//             color: "#fff",
//             border: "none",
//             borderBottomRightRadius: "12px",
//             fontSize: "18px",
//             fontWeight: 600,
//             cursor: paying || !rzReady ? "not-allowed" : "pointer",
//           }}
//         >
//           {!rzReady
//             ? "Loading…"
//             : paying
//             ? "Processing…"
//             : finalAmount === 0
//             ? "Get Free Report"
//             : ctaLabel}
//         </button>
//       </div>
//     </div>
//   );
// }
