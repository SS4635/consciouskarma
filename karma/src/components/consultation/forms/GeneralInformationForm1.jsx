import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import SignupModal from "../../../SignupModal";
import LoginModal from "../../../LoginModal";

export default function GeneralInformationForm({
  data = {},
  onChange,
  showTitle = true,
  showDateTimePickers = false,
  className = "",
}) {
  const KEY_NAME = "Name";
  const KEY_GENDER = "Gender";
  const KEY_EMAIL = "Email-id";
  const KEY_PLACE = "Place of Birth";
  const KEY_DOB_DATE = "Date of Birth";
  const KEY_DOB_TIME = "Time of Birth";

  // Access data safely
  const nameVal = data[KEY_NAME] ?? "";
  const genderVal = data[KEY_GENDER] ?? "";
  const emailVal = data[KEY_EMAIL] ?? "";
  const placeVal = data[KEY_PLACE] ?? "";

  const [selectedGender, setSelectedGender] = useState(genderVal);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState(emailVal);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailCooldown, setEmailCooldown] = useState(0);

  useEffect(() => setSelectedGender(genderVal || ""), [genderVal]);

  const sendEmailOtp = async () => {
    if (!email) return alert("Enter email first");

    await fetch("/api/email/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setEmailOtpSent(true);
    setEmailCooldown(30);

    const t = setInterval(() => {
      setEmailCooldown((c) => {
        if (c <= 1) {
          clearInterval(t);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const verifyEmailOtp = async () => {
    const res = await fetch("/api/email/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: emailOtp }),
    });

    const data = await res.json();

    if (data.ok && data.verified) {
      setEmailVerified(true);
      handleFieldChange(KEY_EMAIL, email);
    } else {
      alert("Invalid OTP");
    }
  };

  const handleFieldChange = (field, value) => {
    if (!onChange) return;
    onChange(field, value);
  };

  // ✅ MODAL WITH SOLID BLACK BACKGROUND
  const modal = (
    // Yahan 'bg-black/80' ko 'bg-black' kar diya gaya hai
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black backdrop-blur-sm">
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
    </div>
  );

  return (
    <div className={`${className} font-arsenal`}>
      {/* RENDER MODAL VIA PORTAL OR INLINE */}
      {(showSignup || showLogin) &&
        (typeof document !== "undefined"
          ? ReactDOM.createPortal(modal, document.body)
          : modal)}

      <style>{`
        .gen-info-field-label {
          font-size: 17.6px;
          font-weight: 300;
          margin-bottom: 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #fff;
        }

        .gen-info-input {
          width: 100%;
          background: transparent !important;
          border: 1.5px solid #666;
          border-radius: 12px;
          padding: 10px 12px;
          color: white;
          height: 44px;
        }

        .gen-info-input:focus {
          outline: none;
          border-color: #ff6b35;
          box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.25);
        }

        .gen-info-input[type="date"],
        .gen-info-input[type="time"] {
          color-scheme: dark;
        }

        .gen-info-btn-option {
          border: 1.5px solid #666;
          background: transparent;
          color: white;
          border-radius: 12px;
          height: 44px;
          flex: 1;
          transition: all 0.25s ease;
        }

        .gen-info-btn-option:hover {
           border-color: #ff6b35;
        }

        .gen-info-btn-option.active {
          background: #ff6b35;
          color: #0b0b0b;
          font-weight: 700;
          border-color: #ff6b35;
        }

        .gen-info-link-btn {
          background: none;
          border: none;
          color: #ff6b35;
          cursor: pointer;
          padding: 0;
          font-size: 0.9rem;
        }
        
        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        
        @media (max-width: 420px) {
           .two-col { gap: 10px; }
        }
      `}</style>

      {showTitle && (
        <h2 style={{ color: "white", marginBottom: "24px", fontWeight: 300 }}>
          General Information
        </h2>
      )}

      {/* Name */}
      <div className="mb-3">
        <div className="gen-info-field-label">
          <span>Name*</span>
        </div>
        <input
          className="gen-info-input"
          placeholder="Enter full name"
          value={nameVal}
          onChange={(e) => handleFieldChange(KEY_NAME, e.target.value)}
        />
      </div>

      {/* Gender */}
      <div className="mb-3">
        <div className="gen-info-field-label">
          <span>Gender*</span>
        </div>
        <div className="d-flex gap-2">
          {["Female", "Male", "Other"].map((g) => (
            <button
              key={g}
              className={`gen-info-btn-option ${
                selectedGender === g ? "active" : ""
              }`}
              onClick={() => {
                setSelectedGender(g);
                handleFieldChange(KEY_GENDER, g);
              }}
              type="button"
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Date & Time of Birth */}
      {showDateTimePickers && (
        <div className="mb-3">
          <div className="two-col">
            {/* DATE OF BIRTH */}
            <div>
              <div className="gen-info-field-label">
                <span>Date of Birth*</span>
              </div>
              <input
                type="date"
                className="gen-info-input"
                required
                value={data[KEY_DOB_DATE] || ""}
                onChange={(e) =>
                  onChange(KEY_DOB_DATE, e.target.value)
                }
              />
            </div>

            {/* TIME OF BIRTH (OPTIONAL) */}
            <div>
              <div className="gen-info-field-label">
                <span>Time of Birth <small style={{opacity: 0.7, fontSize: '0.8em'}}></small></span>
              </div>
              <input
                type="time"
                className="gen-info-input"
                value={data[KEY_DOB_TIME] || ""}
                onChange={(e) =>
                  onChange(KEY_DOB_TIME, e.target.value)
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Place of Birth */}
      <div className="mb-3">
        <div className="gen-info-field-label">
          <span>Place of Birth*</span>
        </div>
        <input
          className="gen-info-input"
          placeholder="City, State, Country"
          value={placeVal}
          onChange={(e) => handleFieldChange(KEY_PLACE, e.target.value)}
        />
      </div>

      {/* Email */}
      <div className="mb-3">
        <div className="gen-info-field-label">
          <span>Email-id*</span>
          <button
            type="button"
            className="gen-info-link-btn"
            onClick={() => setShowSignup(true)}
          >
            Create account
          </button>
        </div>
        <input
          type="email"
          className="gen-info-input"
          placeholder="abc@gmail.com"
          value={emailVal}
          onChange={(e) => handleFieldChange(KEY_EMAIL, e.target.value)}
        />
      </div>
    </div>
  );
}