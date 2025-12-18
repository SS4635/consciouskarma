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
  // Pick the key that your parent actually uses (backward compatible)
  const pickKey = (a, b) => (Object.prototype.hasOwnProperty.call(data, a) ? a : b);

  const KEY_NAME = pickKey("Name", "name");
  const KEY_GENDER = pickKey("Gender", "gender");
  const KEY_EMAIL = pickKey("Email-id", "email");
  const KEY_AGE_YEARS = pickKey("AgeYears", "ageYears");
  const KEY_AGE_MONTHS = pickKey("AgeMonths", "ageMonths");
  const KEY_DOB = "Date of Birth and Time"; // your existing structure

  const nameVal = data[KEY_NAME] ?? "";
  const genderVal = data[KEY_GENDER] ?? "";
  const emailVal = data[KEY_EMAIL] ?? "";
  const ageYearsVal = data[KEY_AGE_YEARS] ?? "";
  const ageMonthsVal = data[KEY_AGE_MONTHS] ?? "";

  const dobTime = data[KEY_DOB] || [];
  const dateVal = dobTime[0] || "";
  const timeVal = dobTime[1] || "";

  const [selectedGender, setSelectedGender] = useState(genderVal);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => setSelectedGender(genderVal || ""), [genderVal]);

  const yearsOptions = useMemo(() => Array.from({ length: 100 }, (_, i) => i + 1), []);
  const monthsOptions = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);

  const handleFieldChange = (field, value) => {
    if (!onChange) return;
    onChange(field, value);
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    handleFieldChange(KEY_GENDER, gender);
  };

  const modal = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
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
        .gen-info-title {
          font-size: 28px;
          font-weight: 300;
          margin-bottom: 2rem;
          text-align: center;
          color: #fff;
        }
        .gen-info-field-label {
          font-size: 17.6px;
          font-weight: 300;
          margin-bottom: 0.35rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #fff;
        }
        .gen-info-required-star { color: #ffffff; margin-left: 4px; }

        .gen-info-input, .gen-info-select {
          width: 100%;
          background: #0f0f0f;
          border: 1.5px solid #666;
          border-radius: 12px;
          padding: 0.65rem 0.85rem;
          color: white;
          font-size: 0.95rem;
          transition: all 0.25s ease;
          height: 44px !important;
        }
        .gen-info-input:focus, .gen-info-select:focus {
          outline: none;
          border-color: #ff6b35;
          box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.25);
        }
        .gen-info-input::placeholder { color: #999; }

        .gen-info-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image:
            linear-gradient(45deg, transparent 50%, #fff 50%),
            linear-gradient(135deg, #fff 50%, transparent 50%);
          background-position:
            calc(100% - 18px) calc(50% - 3px),
            calc(100% - 12px) calc(50% - 3px);
          background-size: 6px 6px, 6px 6px;
          background-repeat: no-repeat;
          padding-right: 34px;
        }

        .gen-info-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .gen-info-btn-option {
          background: transparent;
          border: 1.5px solid #666;
          border-radius: 12px;
          color: white;
          font-size: 0.95rem;
          transition: all 0.25s ease;
          cursor: pointer;
          height: 44px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
        }
        .gen-info-btn-option:hover { border-color: #ff6b35; }
        .gen-info-btn-option.active {
          background: #ff6b35;
          border-color: #ff6b35;
          color: #0b0b0b;
          font-weight: 600;
        }

        .gen-info-link-btn {
          background: transparent;
          border: none;
          padding: 0;
          color: #ff7a33;
          font-weight: 400;
          cursor: pointer;
        }
      `}</style>

      <div className="gen-info-form">
        {showTitle && <h1 className="gen-info-title">General Information</h1>}

        {/* Name */}
        <div className="mb-3">
          <div className="gen-info-field-label">
            <span>
              Name<span className="gen-info-required-star">*</span>
            </span>
          </div>
          <input
            type="text"
            className="gen-info-input fw-light"
            placeholder="ABCXYZ"
            value={nameVal}
            onChange={(e) => handleFieldChange(KEY_NAME, e.target.value)}
          />
        </div>

        {/* Gender */}
        <div className="mb-3">
          <div className="gen-info-field-label">
            <span>
              Gender<span className="gen-info-required-star">*</span>
            </span>
          </div>
          <div className="d-flex gap-2 flex-wrap w-100">
            {["Female", "Male", "Other"].map((option) => (
              <button
                key={option}
                className={`gen-info-btn-option ${selectedGender === option ? "active" : ""}`}
                onClick={() => handleGenderSelect(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Age (Years + Months) */}
        {!showDateTimePickers && (
          <div className="mb-3">
            <div className="gen-info-field-label">
              <span>
                Age<span className="gen-info-required-star">*</span>
              </span>
            </div>

            <div className="gen-info-two-col">
              <select
                className="gen-info-select fw-light"
                value={String(ageYearsVal || "")}
                onChange={(e) => handleFieldChange(KEY_AGE_YEARS, e.target.value)}
              >
                <option value="">Years</option>
                {yearsOptions.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>

              <select
                className="gen-info-select fw-light"
                value={String(ageMonthsVal || "")}
                onChange={(e) => handleFieldChange(KEY_AGE_MONTHS, e.target.value)}
              >
                <option value="">Months</option>
                {monthsOptions.map((m) => (
                  <option key={m} value={String(m)}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* DOB */}
        {showDateTimePickers && (
          <div className="mb-3">
            <div className="gen-info-field-label">
              <span>
                Date &amp; Time of Birth<span className="gen-info-required-star">*</span>
              </span>
            </div>

            <div className="gen-info-two-col">
              <input
                type="date"
                className="gen-info-input fw-light"
                value={dateVal}
                onChange={(e) => handleFieldChange(KEY_DOB, [e.target.value, timeVal])}
              />
              <input
                type="time"
                step="60"
                className="gen-info-input fw-light"
                value={timeVal}
                onChange={(e) => handleFieldChange(KEY_DOB, [dateVal, e.target.value])}
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div className="mb-3">
          <div className="gen-info-field-label">
            <span>
              Email-id<span className="gen-info-required-star">*</span>
            </span>
            <button type="button" className="gen-info-link-btn" onClick={() => setShowSignup(true)}>
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
    </div>
  );
}
