import { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import Swal from "sweetalert2";
export default function SignupModal({ onClose, onSwitch }) {
  const { setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const [successShown, setSuccessShown] = useState(false);
async function handleSignup() {
  try {
    setLoading(true);
    setError("");

    if (!email.includes("@")) {
      setError("Please enter a valid email with @");
      setLoading(false);
      return;
    }

    if (!/^[A-Za-z0-9]{6,}$/.test(password)) {
      setError("Password must be at least 6 alphanumeric characters");
      setLoading(false);
      return;
    }

    const res = await axios.post(
      "https://server.consciouskarma.co/api/auth/register",
      { name, email, password },
      { timeout: 10000 } // ✅ CRITICAL
    );

    if (!res.data?.ok) {
      throw new Error(res.data?.message || "Signup failed");
    }
console.log("Signup successful:", res);
Swal.fire({
  icon: "success",
  title: "Signup Successful",
  text: "Your account has been created successfully!",
  confirmButtonText: "Continue",
  background: "#000",
  color: "#fff",
  confirmButtonColor: "#ff914d",
  allowOutsideClick: false,
  allowEscapeKey: false,

  didOpen: () => {
    const popup = Swal.getPopup();
    popup.style.border = "1.5px solid #ff914d";
    popup.style.borderRadius = "14px";
    popup.style.boxShadow = "0 0 25px rgba(255,145,77,0.35)";
  }
});


  

    onClose();

  } catch (err) {
    if (err.code === "ECONNABORTED") {
      setError("Server is not responding. Please try again.");
    } else {
      setError(err?.response?.data?.message || "Signup failed");
    }
  } finally {
    setLoading(false);
  }
}


  return (
  <div
  className="ck-modal-backdrop"
  onClick={() => {
    if (!loading && !successShown) onClose();
  }}
>

      <div className="ck-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ck-modal-header" style={{
  display: "flex",
  alignItems: "center",   /* vertical */
  justifyContent: "center", /* horizontal */
}}>
          <span style={{fontSize:"28px",fontWeight:"400"}}>Create an Account</span>
          
        </div>

        {error && <div className="ck-error">{error}</div>}

        <div className="ck-form-fields" style={{ marginBottom: "14px" }}>
          <div>
            <label className="ck-label">Full Name</label>
            <input 
              className="ck-input" 
              placeholder="Enter your full name"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

          <div>
            <label className="ck-label">Email</label>
            <input 
              className="ck-input" 
              placeholder="Enter your email"
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div>
            <label className="ck-label">Password</label>
            <div className="ck-input-wrapper">
              <input 
                className="ck-input ck-input-toggle" 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <button
                type="button"
                className="ck-toggle"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9-4-9-8 0-1.5.54-3 1.58-4.32M6.1 6.1A10.94 10.94 0 0 1 12 4c5 0 9 4 9 8 0 1.16-.22 2.28-.64 3.32" />
                    <path d="M3 3l18 18" />
                    <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <button 
          className="ck-btn" 
          disabled={loading} 
          onClick={handleSignup}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <div className="ck-switch-divider">
          <span>Already have an account?</span>
          <button className="ck-switch" onClick={onSwitch}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}


