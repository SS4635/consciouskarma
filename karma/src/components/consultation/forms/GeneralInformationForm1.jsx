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
  const timeVal = data[KEY_DOB_TIME] ?? ""; // Format: "HH:mm"

  const [selectedGender, setSelectedGender] = useState(genderVal);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState(emailVal);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailCooldown, setEmailCooldown] = useState(0);

  useEffect(() => setSelectedGender(genderVal || ""), [genderVal]);

  // Generate arrays for Hours (01 to 00) and Minutes (01 to 00)
  // This ensures the list is finite and follows your specific order
  const hourOptions = ["-", ...Array.from({ length: 23 }, (_, i) => (i + 1).toString().padStart(2, '0')), "00"];
  const minuteOptions = ["-", ...Array.from({ length: 59 }, (_, i) => (i + 1).toString().padStart(2, '0')), "00"];

  // Split current time value into HH and mm
  const [currentH, currentM] = timeVal && timeVal.includes(":") ? timeVal.split(":") : ["-", "-"];

  const handleTimeChange = (type, value) => {
    let newH = currentH || "-";
    let newM = currentM || "-";

    if (type === "hour") newH = value;
    if (type === "min") newM = value;

    handleFieldChange(KEY_DOB_TIME, `${newH}:${newM}`);
  };

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

  const modal = (
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

        .gen-info-input[type="date"] {
          color-scheme: dark;
        }

        /* Styling for the dropdown arrows in select */
        select.gen-info-input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: calc(100% - 12px) center;
          padding-right: 30px;
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

        .time-picker-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        @media (max-width: 420px) {
           .two-col { gap: 10px; }
        }
      `}</style>

      {showTitle && (
        <h2 style={{ color: "white", marginBottom: "24px", fontWeight: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
}}>
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

            {/* TIME OF BIRTH (CUSTOM DROPDOWNS) */}
            <div>
              <div className="gen-info-field-label">
                <span>Time of Birth</span>
              </div>
              <div className="time-picker-row">
                {/* Hours Dropdown */}
                <select
                  className="gen-info-input"
                  value={currentH || "-"}
                  onChange={(e) => handleTimeChange("hour", e.target.value)}
                >
                  {hourOptions.map(h => (
                    <option key={h} value={h} style={{background: '#333'}}>{h}</option>
                  ))}
                </select>
                
                <span style={{color: 'white'}}>:</span>

                {/* Minutes Dropdown */}
                <select
                  className="gen-info-input"
                  value={currentM || "-"}
                  onChange={(e) => handleTimeChange("min", e.target.value)}
                >
                  {minuteOptions.map(m => (
                    <option key={m} value={m} style={{background: '#333'}}>{m}</option>
                  ))}
                </select>
              </div>
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