import React, { useEffect, useState, useMemo } from "react";
import "./DashboardLayout.css";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { decryptEmail } from "./utils/emailCrypto";

export default function DashboardLayout() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState("activity");
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // password states – OLD PASSWORD FLOW
  const [pwdMode, setPwdMode] = useState("old"); // "old" | "email"
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNew, setConfirmNew] = useState("");
  const [pwdStepVerified, setPwdStepVerified] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  // password states – EMAIL CODE FLOW
  const [verifyCode, setVerifyCode] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);

  // common feedback
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  // decode email from query
  const emailFromQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const enc = params.get("u");
    if (!enc) return "";
    return decryptEmail(decodeURIComponent(enc));
  }, [location.search]);

  const finalEmail = emailFromQuery || user?.email || "";

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  // Load activity
  useEffect(() => {
    const load = async () => {
      if (!finalEmail) return;
      setLoadingActivities(true);
      try {
        const { data } = await axios.get(
          "https://server.consciouskarma.co/api/user-activity",
          { params: { email: finalEmail } }
        );
        setActivities(data.ok ? data.data : []);
      } catch {
        setActivities([]);
      } finally {
        setLoadingActivities(false);
      }
    };
    load();
  }, [finalEmail]);

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  if (!user) return null;

  const firstInitial = (user.name || user.email || "?")[0].toUpperCase();

  /* ---------------------------
     PASSWORD HANDLERS
  ---------------------------- */

  async function handleVerifyOldPassword() {
    try {
      if (!oldPassword) {
        setPwdError("Please enter your current password.");
        return
      }
      setPwdLoading(true);
      setPwdError("");
      setPwdSuccess("");

      const { data } = await axios.post(
        "https://server.consciouskarma.co/api/auth/check-password",
        { email: finalEmail, oldPassword }
      );

      if (!data.ok || !data.valid) {
        throw new Error(data.message || "Invalid password");
      }

      setPwdStepVerified(true);
      setPwdSuccess("Current password verified. Enter a new password.");
    } catch (err) {
      setPwdError("Incorrect current password.");
    } finally {
      setPwdLoading(false);
    }
  }

  async function handleChangePassword() {
    try {
      setPwdLoading(true);
      setPwdError("");
      setPwdSuccess("");

      if (!newPassword || newPassword.length < 6) {
        setPwdError("New password must be at least 6 characters.");
        return;
      }
      if (newPassword !== confirmNew) {
        setPwdError("New password and confirm password do not match.");
        return;
      }

      const { data } = await axios.post(
        "https://server.consciouskarma.co/api/auth/change-password",
        { email: finalEmail, oldPassword, newPassword }
      );

      if (!data.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setPwdSuccess("Password updated. You will be logged out.");
      setTimeout(() => handleLogout(), 1000);
    } catch (err) {
      setPwdError("Failed to change password. Please try again.");
    } finally {
      setPwdLoading(false);
    }
  }

  // NOTE: these three require backend endpoints:
  //  POST /api/auth/send-reset-code
  //  POST /api/auth/verify-reset-code
  //  POST /api/auth/reset-password
  async function sendResetCode() {
    try {
      setPwdLoading(true);
      setPwdError("");
      setPwdSuccess("");

      const { data } = await axios.post(
        "https://server.consciouskarma.co/api/auth/send-reset-code",
        { email: finalEmail }
      );

      if (!data.ok) throw new Error(data.message || "Failed to send code");

      setPwdSuccess("Verification code sent to your email.");
    } catch (err) {
      setPwdError("Could not send code. Please try again.");
    } finally {
      setPwdLoading(false);
    }
  }

  async function verifyResetCode() {
    try {
      if (!verifyCode) {
        setPwdError("Please enter the verification code.");
        return;
      }
      setPwdLoading(true);
      setPwdError("");
      setPwdSuccess("");

      const { data } = await axios.post(
        "https://server.consciouskarma.co/api/auth/verify-reset-code",
        { email: finalEmail, code: verifyCode }
      );

      if (!data.ok || !data.verified) {
        throw new Error(data.message || "Invalid code");
      }

      setCodeVerified(true);
      setPwdSuccess("Code verified. Enter a new password.");
    } catch (err) {
      setPwdError("Invalid or expired code.");
    } finally {
      setPwdLoading(false);
    }
  }

  async function applyResetPassword() {
    try {
      setPwdLoading(true);
      setPwdError("");
      setPwdSuccess("");

      if (!newPassword || newPassword.length < 6) {
        setPwdError("New password must be at least 6 characters.");
        return;
      }

      const { data } = await axios.post(
        "https://server.consciouskarma.co/api/auth/reset-password",
        { email: finalEmail, code: verifyCode, newPassword }
      );

      if (!data.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setPwdSuccess("Password changed successfully. You will be logged out.");
      setTimeout(() => handleLogout(), 1000);
    } catch (err) {
      setPwdError("Failed to reset password. Please try again.");
    } finally {
      setPwdLoading(false);
    }
  }

  function resetPasswordUIState(nextMode) {
    setPwdMode(nextMode);
    setPwdError("");
    setPwdSuccess("");
    setPwdStepVerified(false);
    setCodeVerified(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmNew("");
    setVerifyCode("");
  }

  return (
    <div className="ck-dashboard">
      {/* Sidebar */}
      <aside className={`ck-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <a className="ck-header-logo-link" href="/">
          <img src="/Logomy-cropped.svg" alt="CK" className="ck-header-logo" />
        </a>

        <nav className="ck-nav">
          <button
            className={`ck-nav-item ${
              activeSection === "activity" ? "ck-nav-item--active" : ""
            }`}
            onClick={() => setActiveSection("activity")}
          >
            Activity
          </button>
          <button
            className={`ck-nav-item ${
              activeSection === "settings" ? "ck-nav-item--active" : ""
            }`}
            onClick={() => setActiveSection("settings")}
          >
            Account Settings
          </button>
        </nav>
      </aside>

      {/* Main area */}
      <div className="ck-main">
        {/* Header */}
        <header className="ck-navbar">
          <button
            className="ck-sidebar-toggle"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            ☰
          </button>

          <div className="ck-navbar-right">
            <div className="ck-user">
              <div className="ck-avatar">{firstInitial}</div>
              <div className="ck-user-meta">
                <span className="ck-user-email">{finalEmail}</span>
                <button onClick={handleLogout} className="ck-link-button">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="ck-content">
          {/* ACTIVITY SECTION */}
          {activeSection === "activity" && (
            <section className="ck-panel ck-panel-main">
              <h2 className="ck-panel-title">Your Activity</h2>

              {loadingActivities ? (
                <div className="ck-empty-state">Loading…</div>
              ) : activities.length === 0 ? (
                <div className="ck-empty-state">
                  No activity yet. Once you book or buy, it will appear here.
                </div>
              ) : (
                <div className="ck-table-wrapper">
                  <table className="ck-table">
                    <thead>
                      <tr>
                        <th>Report Type</th>
                        <th>Date</th>
                        <th>Mobile</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((item) => {
                        const statusLabel =
                          item.kind === "consultation"
                            ? "Booked"
                            : item.status === "emailed" ||
                              item.status === "submitted"
                            ? "Report emailed"
                            : item.status || "Processing";

                        return (
                          <tr key={item._id}>
                            <td>
                              {item.kind === "consultation"
                                ? "Consultation Booked"
                                : item.kind === "instant-report"
                               
                                ? "Instant Report"
                                : "Personalized Report"}
                            </td>
                            <td>
                              {new Date(item.createdAt).toLocaleString()}
                            </td>
                            <td>{item.phone || "-"}</td>
                            <td>₹{(item.amount || item.price) / 100}</td>
                            <td>
                              <span
                                className={`ck-status-badge ${
                                  statusLabel.toLowerCase().includes("email") ||
                                  statusLabel.toLowerCase() === "paid"
                                    ? "paid"
                                    : statusLabel
                                        .toLowerCase()
                                        .includes("pending")
                                    ? "pending"
                                    : "booked"
                                }`}
                              >
                                {statusLabel}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* ACCOUNT SETTINGS SECTION */}
          {activeSection === "settings" && (
            <section className="ck-panel ck-panel-main">
              <h2 className="ck-panel-title">Account Settings</h2>

              {(pwdError || pwdSuccess) && (
                <div className="ck-pwd-messages">
                  {pwdError && <div className="ck-error">{pwdError}</div>}
                  {pwdSuccess && (
                    <div className="ck-success">{pwdSuccess}</div>
                  )}
                </div>
              )}

              {/* Tabs */}
              <div className="ck-password-tabs">
                <button
                  className={pwdMode === "old" ? "active" : ""}
                  onClick={() => resetPasswordUIState("old")}
                >
                  Change with Existing Password
                </button>

                <button
                  className={pwdMode === "email" ? "active" : ""}
                  onClick={() => resetPasswordUIState("email")}
                >
                  Change with Email Code
                </button>
              </div>

              {/* 1️⃣ Old Password Method */}
            {pwdMode === "old" && (
  <div className="ck-pass-box">
    {!pwdStepVerified ? (
     <div className="ck-row">
  <input
    type="password"
    placeholder="Current Password"
    className="ck-input"
    value={oldPassword}
    onChange={(e) => setOldPassword(e.target.value)}
  />

  <button
    className="ck-btn-sm"
    disabled={pwdLoading}
    onClick={handleVerifyOldPassword}
  >
    {pwdLoading ? "Verifying..." : "Verify"}
  </button>
</div>

    ) : (
      <>
       <div className="ck-row">
  <input
    type="text"
    placeholder="Code"
    className="ck-input"
    value={verifyCode}
    onChange={(e) => setVerifyCode(e.target.value)}
  />

  <button
    className="ck-btn-sm"
    disabled={pwdLoading}
    onClick={verifyResetCode}
  >
    {pwdLoading ? "Verifying..." : "Verify"}
  </button>
</div>

        <input
          type="password"
          placeholder="Confirm New Password"
          className="ck-input"
          value={confirmNew}
          onChange={(e) => setConfirmNew(e.target.value)}
        />
      </>
    )}
  </div>
)}


              {/* 2️⃣ Email Code Method */}
        {/* Email OTP Method */}
{pwdMode === "email" && (
  <div className="ck-pass-box">

    <div className="ck-row">
      <button
        className="ck-btn-sm"
        disabled={pwdLoading}
        onClick={sendResetCode}
      >
        {pwdLoading ? "Sending..." : "Send Code"}
      </button>

      <input
        type="text"
        placeholder="Code"
        className="ck-input"
        value={verifyCode}
        onChange={(e) => setVerifyCode(e.target.value)}
      />

      <button
        className="ck-btn-sm"
        disabled={pwdLoading}
        onClick={verifyResetCode}
      >
        {pwdLoading ? "Verifying..." : "Verify"}
      </button>
    </div>

  </div>
)}



            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="ck-footer">
          <div className="container-footer">
            <a href="/termsandconditions">Terms & Conditions</a>
            <span>|</span>
            <a href="/privacy-policy">Privacy Policy</a>
            <span>|</span>
            <a href="/refund-policy">Refund Policy</a>
            <span>|</span>
            <a href="/shipping-policy">Shipping & Delivery</a>
            <span>|</span>
            <a href="/contact-us">Contact Us</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
