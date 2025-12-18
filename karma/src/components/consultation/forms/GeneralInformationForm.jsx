import React, { useEffect, useMemo, useState } from "react";
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
  const pickKey = (a, b) =>
    Object.prototype.hasOwnProperty.call(data, a) ? a : b;

  const KEY_NAME = pickKey("Name", "name");
  const KEY_GENDER = pickKey("Gender", "gender");
  const KEY_EMAIL = pickKey("Email-id", "email");
  const KEY_PLACE = pickKey("Place of Birth", "placeOfBirth");
  const KEY_DOB_DATE = "Date of Birth";
  const KEY_DOB_TIME = "Time of Birth";

  const nameVal = data[KEY_NAME] ?? "";
  const genderVal = data[KEY_GENDER] ?? "";
  const emailVal = data[KEY_EMAIL] ?? "";
  const placeVal = data[KEY_PLACE] ?? "";
  const dateVal = data[KEY_DOB_DATE] ?? "";
  const timeVal = data[KEY_DOB_TIME] ?? "";

  const [selectedGender, setSelectedGender] = useState(genderVal);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => setSelectedGender(genderVal || ""), [genderVal]);

  const handleFieldChange = (field, value) => {
    if (!onChange) return;
    onChange(field, value);
  };

  const modal = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80">
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
        ReactDOM.createPortal(modal, document.body)}

      <style>{`
        .gen-info-field-label {
          font-size: 17px;
          font-weight: 300;
          margin-bottom: 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #fff;
        }

        .gen-info-input {
          width: 100%;
          background: #0f0f0f !important;
          border: 1.5px solid #666;
          border-radius: 12px;
          padding: 10px 12px;
          color: white;
          height: 44px;
        }

        .gen-info-input:focus {
          outline: none;
          border-color: #ff6b35;
        }

        .gen-info-input[type="date"],
        .gen-info-input[type="time"] {
          color-scheme: dark;
          -webkit-appearance: none;
        }

        .gen-info-btn-option {
          border: 1.5px solid #666;
          background: transparent;
          color: white;
          border-radius: 12px;
          height: 44px;
          flex: 1;
        }

        .gen-info-btn-option.active {
          background: #ff6b35;
          color: black;
          border-color: #ff6b35;
        }

        .gen-info-link-btn {
          background: none;
          border: none;
          color: #ff7a33;
          cursor: pointer;
          padding: 0;
        }

        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
      `}</style>

      {showTitle && (
        <h2 style={{ color: "white", marginBottom: "24px" }}>
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

      {/* DOB + Time */}
      {/* Date & Time of Birth */}
{showDateTimePickers && (
  <div className="mb-3">
    <div className="gen-info-field-label">
      <span>Date & Time of Birth*</span>
    </div>

    <div className="two-col">
      {/* DATE */}
      <input
        type="date"
        className="gen-info-input"
        value={data["Date of Birth"] || ""}
        onChange={(e) =>
          onChange("Date of Birth", e.target.value)
        }
      />

      {/* TIME */}
      <input
        type="time"
        className="gen-info-input"
        value={data["Time of Birth"] || ""}
        onChange={(e) =>
          onChange("Time of Birth", e.target.value)
        }
      />
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
          value={emailVal}
          onChange={(e) => handleFieldChange(KEY_EMAIL, e.target.value)}
        />
      </div>
    </div>
  );
}
