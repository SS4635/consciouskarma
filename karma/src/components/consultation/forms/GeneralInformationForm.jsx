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
  // --- DIRECT DATA ACCESS ---
  const nameVal = data["Name"] || "";
  const emailVal = data["Email-id"] || "";
  const genderVal = data["Gender"] || "";
  
  // Ensure values are strings for Dropdowns
  const ageYearsVal = data["AgeYears"] ? String(data["AgeYears"]) : "";
  const ageMonthsVal = data["AgeMonths"] ? String(data["AgeMonths"]) : "";

  const dobTime = data["Date of Birth and Time"] || [];
  const dateVal = dobTime[0] || "";
  const timeVal = dobTime[1] || "";

  const [selectedGender, setSelectedGender] = useState(genderVal);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    setSelectedGender(genderVal || "");
  }, [genderVal]);

  const yearsOptions = useMemo(() => Array.from({ length: 100 }, (_, i) => i + 1), []);
  const monthsOptions = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);

  const handleFieldChange = (field, value) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    handleFieldChange("Gender", gender);
  };

  const modal = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onSwitch={() => { setShowSignup(false); setShowLogin(true); }}
        />
      )}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitch={() => { setShowLogin(false); setShowSignup(true); }}
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
          background: transparent;
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

        /* General Select Arrow */
        .gen-info-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 16px 12px;
          padding-right: 2.5rem;
          cursor: pointer;
        }
        .gen-info-select option {
          background-color: #0f0f0f; 
          color: white;
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
        {showTitle && <h1 className="gen-info-title" >General Information</h1>}

        {/* Name */}
        <div className="mb-3">
          <div className="gen-info-field-label">
            <span>Name<span className="gen-info-required-star">*</span></span>
          </div>
          <input
            type="text"
            className="gen-info-input fw-light"
            placeholder="Name"
            value={nameVal}
            onChange={(e) => handleFieldChange("Name", e.target.value)}
          />
        </div>

        {/* Gender */}
        <div className="mb-3">
          <div className="gen-info-field-label">
            <span>Gender<span className="gen-info-required-star">*</span></span>
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
              <span>Age<span className="gen-info-required-star">*</span></span>
            </div>
            <div className="gen-info-two-col">
              <select
                className="gen-info-select fw-light"
                value={ageYearsVal}
                onChange={(e) => handleFieldChange("AgeYears", e.target.value)}
              >
                <option value="">Years</option>
                {yearsOptions.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}+ {/* Plus Sign */}
                  </option>
                ))}
              </select>

              <select
                className="gen-info-select fw-light"
                value={ageMonthsVal}
                onChange={(e) => handleFieldChange("AgeMonths", e.target.value)}
              >
                <option value="">Months</option>
                {monthsOptions.map((m) => (
                  <option key={m} value={String(m)}>
                    {m}+ {/* Plus Sign */}
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
              <span>Date &amp; Time of Birth<span className="gen-info-required-star">*</span></span>
            </div>
            <div className="gen-info-two-col">
              <input
                type="date"
                className="gen-info-input fw-light"
                value={dateVal}
                onChange={(e) => handleFieldChange("Date of Birth and Time", [e.target.value, timeVal])}
              />
              <input
                type="time"
                step="60"
                className="gen-info-input fw-light"
                value={timeVal}
                onChange={(e) => handleFieldChange("Date of Birth and Time", [dateVal, e.target.value])}
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div className="mb-3">
          <div className="gen-info-field-label">
            <span>Email-id<span className="gen-info-required-star">*</span></span>
            <button type="button" className="gen-info-link-btn" onClick={() => setShowSignup(true)}>
              Create account
            </button>
          </div>
          <input
            type="email"
            className="gen-info-input"
            placeholder="abc@gmail.com"
            value={emailVal}
            onChange={(e) => handleFieldChange("Email-id", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}