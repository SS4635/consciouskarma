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

  async function handleSignup() {
  try {
    setLoading(true);
    setError("");

    if (!email.includes("@")) {
      setError("Please enter a valid email with @");
      return;
    }

    if (!/^[A-Za-z0-9]{6,}$/.test(password)) {
      setError("Password must be at least 6 alphanumeric characters");
      return;
    }

    const res = await axios.post(
      "https://server.consciouskarma.co/api/auth/register",
      {
        name,
        email,
        password,
      }
    );

    if (!res.data.ok) throw new Error(res.data.message);

    setUser({ name, email });

    // Success Alert with Animation
    await Swal.fire({
      icon: "success",
      title: "Signup Successful",
      text: "Your account has been created successfully!",
      confirmButtonColor: "#ff914d",
      timer: 1800,
      showConfirmButton: false,
    });

    // Reset fields
    setName("");
    setEmail("");
    setPassword("");

    onClose();
  } catch (err) {
    setError(err?.response?.data?.message || "Signup failed");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="ck-modal-backdrop">
      <div className="ck-modal">
        <div className="ck-modal-header">
          <span style={{fontSize:"28px",fontWeight:"400"}}>Create an Account</span>
          <button className="ck-close" onClick={onClose}>✕</button>
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
