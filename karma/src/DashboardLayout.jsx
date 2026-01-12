import React, { useEffect, useState, useMemo } from "react";
import "./DashboardLayout.css";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { decryptEmail } from "./utils/emailCrypto";
import CKNavbar from "./components/CKNavbar";

export default function DashboardLayout() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState("activity");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  // FILTER LOGIC
  const visibleActivities = useMemo(() => {
    return activities.filter((item) => {
      if (item.kind === "consultation") return true;
      const s = (item.status || "").toLowerCase();
      if (s === "paid" || s === "emailed" ) return true;
      return false;
    });
  }, [activities]);

  // PAGINATION LOGIC
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = visibleActivities.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(visibleActivities.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
        return;
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
      {/* CKNavbar handles the Hamburger button internally.
         It typically renders the button with class "ck-menu-btn" 
      */}
      <CKNavbar 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen} 
        setShowSignup={setShowSignup} 
      />

      {/* Main Header/Navbar (Desktop Visuals) */}
      <header className="ck-navbar">
        <div className="ck-navbar-brand">
          <span className="brand-text-top">conscious</span>
          <span className="brand-text-bottom">KARMA</span>
        </div>
      </header>

      {/* Main Body Wrapper: Holds Sidebar + Content */}
      <div className="dashboard-body">
        
        {/* Sidebar */}
        <aside className={`ck-sidebar ${menuOpen ? 'open' : ''}`}>
          <div>
            <nav className="ck-nav">
              <button
                className={`ck-nav-item ${
                  activeSection === "activity" ? "ck-nav-item--active" : ""
                }`}
                onClick={() => {
                   setActiveSection("activity");
                   setMenuOpen(false); // Close menu on mobile click
                }}
              >
                Activity
              </button>
              <button
                className={`ck-nav-item ${
                  activeSection === "settings" ? "ck-nav-item--active" : ""
                }`}
                onClick={() => {
                   setActiveSection("settings");
                   setMenuOpen(false);
                }}
              >
                Account Settings
              </button>

              {/* Mobile Only: Main Site Navigation */}
              <div className="ck-nav-mobile-menu">
                <div className="ck-nav-divider"></div>
                <a href="/" className="ck-nav-item">Home</a>
                <a href="/personalised-report" className="ck-nav-item">Personalized Report</a>
                <a href="/consult" className="ck-nav-item">Consult</a>
              </div>
            </nav>
          </div>
          <div className="ck-sidebar-user">
            <div className="ck-avatar">{firstInitial}</div>
            <div className="ck-user-meta">
              <span className="ck-user-email">{finalEmail}</span>
              <button onClick={handleLogout} className="ck-link-button">
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="ck-main">
          <main className="ck-content mt-16 md:mt-0">
            {/* ACTIVITY SECTION */}
            {activeSection === "activity" && (
              <section className="ck-panel ck-panel-main">
                <h2 className="ck-panel-title">Your Activity</h2>

                {loadingActivities ? (
                  <div className="ck-empty-state">Loading…</div>
                ) : visibleActivities.length === 0 ? (
                  <div className="ck-empty-state">
                    No paid activity yet. Once you book or buy, it will appear
                    here.
                  </div>
                ) : (
                  <>
                    <div className="ck-table-wrapper">
                      <table className="ck-table">
                        <thead>
                          <tr>
                            <th>Report Type</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Mobile</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((item) => {
                            const createdDate = new Date(item.createdAt);
                            const dateStr = createdDate.toLocaleDateString();
                            const timeStr = createdDate.toLocaleTimeString();

                            let paymentStatus = "Processing";
                            if (item.status) {
                              const s = item.status.toLowerCase();
                              if (s === "paid") paymentStatus = "Paid";
                              else if (s === "pending") paymentStatus = "Pending";
                              else if (s === "processing") paymentStatus = "Processing";
                              else if (s === "submitted" || s === "emailed") paymentStatus = "Sent";
                              else paymentStatus = item.status;
                            }

                            return (
                              <tr key={item._id}>
                                <td>
                                  {item.kind === "consultation"
                                    ? "Consultation Booked"
                                    : item.kind === "instant-report"
                                    ? "Instant Report"
                                    : "Personalized Report"}
                                </td>
                                <td>{dateStr}</td>
                                <td>{timeStr}</td>
                                <td>{item.phone || "-"}</td>
                                <td style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  <span
                                    className={`ck-status-badge ${
                                      paymentStatus.toLowerCase() === "paid"
                                        ? "paid"
                                        : paymentStatus.toLowerCase() === "pending"
                                        ? "pending"
                                        : paymentStatus.toLowerCase() === "submitted"
                                        ? "booked"
                                        : paymentStatus.toLowerCase() === "processing"
                                        ? "processing"
                                        : paymentStatus.toLowerCase() === "sent"
                                        ? "sent"
                                        : "other"
                                    }`}
                                  >
                                    {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="ck-pagination">
                        <button
                          className="ck-page-btn"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          Prev
                        </button>
                        <span className="ck-page-info">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          className="ck-page-btn"
                          disabled={currentPage === totalPages}
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
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
                        <button
                          className="ck-btn-sm"
                          style={{ marginTop: 10 }}
                          disabled={pwdLoading}
                          onClick={handleChangePassword}
                        >
                          {pwdLoading ? "Updating..." : "Update Password"}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* 2️⃣ Email Code Method */}
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

                    {codeVerified && (
                      <>
                        <input
                          type="password"
                          placeholder="New Password"
                          className="ck-input"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                          className="ck-btn-sm"
                          style={{ marginTop: 10 }}
                          disabled={pwdLoading}
                          onClick={applyResetPassword}
                        >
                          {pwdLoading ? "Resetting..." : "Reset Password"}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </section>
            )}
          </main>
        </div>
      </div>

      {/* Footer Moved Outside Main Content for Full Width Border */}
      <footer className="ck-footer">
        <div className="container-footer">
          <a href="/termsandconditions">Terms & Conditions</a>
          <span className="footer-pipe"> | </span>
          <a href="/privacy-policy">Privacy Policy</a>
          <span className="footer-pipe"> | </span>
          <a href="/refund-policy">Refund Policy</a>
          <span className="footer-pipe"> | </span>
          <a href="/shipping-policy">Shipping & Delivery</a>
          <span className="footer-pipe"> | </span>
          <a href="/contact-us">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}