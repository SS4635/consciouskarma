import { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { encryptEmail } from "./utils/emailCrypto";
import Swal from "sweetalert2";
import "./loginModal.css";
/* ================= API BASE ================= */
const API_BASE_URL = "https://server.consciouskarma.co";
/* ============================================ */

export default function LoginModal({ onClose, onSwitch }) {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  /* ---------- LOGIN STATES ---------- */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* ---------- COMMON ---------- */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------- FORGOT PASSWORD STATES ---------- */
  const [forgotMode, setForgotMode] = useState(false);
  const [step, setStep] = useState(1);

  const [fpEmail, setFpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [otpLoading, setOtpLoading] = useState(false);

  /* ---------- LOGIN ---------- */
  async function handleLogin() {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email, password }
      );

      if (!res.data.ok) {
        throw new Error(res.data.message || "Login failed");
      }

      const user = res.data.user || { email };
      setUser(user);

      const encrypted = encodeURIComponent(encryptEmail(user.email));
      navigate(`/dashboard?u=${encrypted}`);

      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  /* ---------- SEND OTP ---------- */
  async function sendResetCode() {
    try {
      setOtpLoading(true);
      setError("");

      await axios.post(
        `${API_BASE_URL}/api/auth/send-reset-code`,
        { email: fpEmail }
      );

      setStep(2);
    } catch {
      setError("Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  }

  /* ---------- VERIFY OTP ---------- */
  async function verifyCode() {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `${API_BASE_URL}/api/auth/verify-reset-code`,
        { email: fpEmail, code: otp }
      );

      if (!res.data.verified) {
        setError("Invalid or expired OTP");
        return;
      }

      setStep(3);
    } catch {
      setError("OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  /* ---------- RESET PASSWORD ---------- */
  async function resetPassword() {
    if (newPass !== confirmPass) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post(
        `${API_BASE_URL}/api/auth/reset-password`,
        {
          email: fpEmail,
          code: otp,
          newPassword: newPass,
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Password Reset Successful",
        timer: 1500,
        showConfirmButton: false,
      });

      setForgotMode(false);
      setStep(1);
      onClose();
    } catch {
      setError("Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ck-modal-backdrop">
      <div className="ck-modal">
        <div className="ck-modal-header">
          <span>{forgotMode ? "Reset Password" : "Login"}</span>
          <button className="ck-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="ck-error">{error}</div>}

        {/* ---------------- LOGIN ---------------- */}
        {!forgotMode && (
          <>
            <label className="ck-label">Email</label>
            <input
              className="ck-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="ck-password-row">
              <label className="ck-label">Password</label>
              <button
                type="button"
                className="ck-forgot"
                onClick={() => {
                  setForgotMode(true);
                  setFpEmail(email);
                }}
              >
                Forgot password?
              </button>
            </div>

            <div className="ck-input-wrapper">
              <input
                className="ck-input"
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
                👁
              </button>
            </div>

            <button className="ck-btn" onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in…" : "Login"}
            </button>

            <div className="ck-switch-divider">
              <span>Don't have an account?</span>
              <button className="ck-switch" onClick={onSwitch}>
                Sign Up
              </button>
            </div>
          </>
        )}

        {/* ---------------- FORGOT PASSWORD ---------------- */}
        {forgotMode && step === 1 && (
          <>
            <label className="ck-label">Registered Email</label>
            <input
              className="ck-input"
              value={fpEmail}
              onChange={(e) => setFpEmail(e.target.value)}
            />

            <button
              className="ck-btn"
              onClick={sendResetCode}
              disabled={otpLoading}
            >
              {otpLoading ? "Sending OTP…" : "Send OTP"}
            </button>
          </>
        )}

        {forgotMode && step === 2 && (
          <>
            <label className="ck-label">Enter OTP</label>
            <input
              className="ck-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              className="ck-btn"
              onClick={verifyCode}
              disabled={loading}
            >
              {loading ? "Verifying…" : "Verify OTP"}
            </button>
          </>
        )}

        {forgotMode && step === 3 && (
          <>
            <label className="ck-label">New Password</label>
            <input
              className="ck-input"
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />

            <label className="ck-label">Confirm Password</label>
            <input
              className="ck-input"
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />

            <button
              className="ck-btn"
              onClick={resetPassword}
              disabled={loading}
            >
              {loading ? "Updating…" : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
