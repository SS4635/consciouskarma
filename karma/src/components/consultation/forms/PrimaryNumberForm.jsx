import React, { useMemo, useState, useEffect } from "react";
import ReactDOM from "react-dom"; // 1. Yahan import add kiya
import "bootstrap/dist/css/bootstrap.min.css";
// Path check kar lena apne hisab se
import { COUNTRY_CODES } from "../../constants/countryCodes"; 

export default function PrimaryNumberForm({
  data = {},
  onChange,
  showTitle = true,
  className = "",
}) {
  const usageFromData = data["Usage type"] || data.usageType || "";
  const [selectedUsageType, setSelectedUsageType] = useState(usageFromData);
  
  // Toast State
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  useEffect(() => {
    setSelectedUsageType(usageFromData || "");
  }, [usageFromData]);

  // Toast Timer
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: "", type: "error" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  function showToast(message, type = "error") {
    setToast({ show: true, message, type });
  }

  const months = useMemo(
    () => [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ],
    []
  );

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const start = 1955;
    return Array.from({ length: currentYear - start + 1 }, (_, i) => start + i);
  }, []);

  const handleFieldChange = (field, value) => {
    if (onChange) onChange(field, value);
  };

  const handleUsageTypeSelect = (type) => {
    setSelectedUsageType(type);
    handleFieldChange("Usage type", type);
  };

  // Helper to get current country details
  const getSelectedCountry = () => {
     const currentIsd = (data["Mobile Number"]?.isd || data.mobileNumber?.isd || "+91");
     return COUNTRY_CODES.find(c => c.dial_code === currentIsd);
  };

  // Validation Function (Triggered on Blur)
  const validateMobile = () => {
    const mobileObj = data["Mobile Number"] || data.mobileNumber || {};
    const currentNumber = mobileObj.mobile || "";
    const mobileDigits = currentNumber.replace(/\s+/g, ""); // Remove spaces
    
    const selectedCountry = getSelectedCountry();

    if (currentNumber && selectedCountry && selectedCountry.max_length) {
       const exactLength = selectedCountry.max_length;
       
       if (mobileDigits.length !== exactLength) {
         showToast(`Phone number must be exactly ${exactLength} digits for ${selectedCountry.name}`);
       }
    } else if (currentNumber) {
       // Fallback checks
       if (!/^[0-9]{6,15}$/.test(mobileDigits)) {
             showToast("Invalid phone number format");
       }
    }
  };

  const handleMobileChange = (e) => {
    const val = e.target.value;
    if (/[^0-9]/.test(val)) return; 

    const mobileObj = data["Mobile Number"] || data.mobileNumber || {};
    handleFieldChange("Mobile Number", { ...mobileObj, mobile: val });
  };

  const mobileObj = data["Mobile Number"] || data.mobileNumber || {};
  const sinceArr = data["Using this number since"] || data.usingSince || ["", ""];
  
  const currentCountry = getSelectedCountry();
  const maxAllowedLength = currentCountry?.max_length || 15;

  // --- 2. Toast UI Component via Portal ---
  // Yeh ensure karega ki toast hamesha screen ke top par aaye, 
  // chahe slider kahin bhi ho.
  const toastComponent = toast.show ? (
    <div
      className="fixed"
      style={{
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        animation: 'slideDown 0.3s ease-out',
        zIndex: 9999999, // Very high Z-index
      }}
    >
      <div
        className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
        }`}
      >
        <span>{toast.message}</span>
        <button
          onClick={() => setToast({ show: false, message: "", type: "error" })}
          className="ml-auto text-white hover:text-gray-200 border-0 bg-transparent"
          style={{ fontSize: '18px', lineHeight: '1', cursor: 'pointer' }}
        >
          ×
        </button>
      </div>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  ) : null;

  return (
    <div className={`${className} font-arsenal relative`}>
      <style>{`
        .primary-number-title {
          font-size: 28px;
          font-weight: 300;
          margin-bottom: 2rem;
          text-align: center;
          color: #fff;
        }

        .primary-label {
          font-size: 17.6px;
          font-weight: 300;
          margin-bottom: 0.35rem;
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .primary-star { color: #fff; margin-left: 4px; }

        .primary-input, .primary-select {
          width: 100%;
          background: transparent;
          border: 1.5px solid #666;
          border-radius: 12px;
          padding: 0.65rem 0.85rem;
          color: #fff;
          font-size: 0.95rem;
          transition: all 0.25s ease;
          height: 44px !important;
        }
        .primary-input:focus, .primary-select:focus {
          outline: none;
          border-color: #ff6b35;
          box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.25);
        }
        .primary-input::placeholder { color: #999; }

        .primary-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image:
            linear-gradient(45deg, transparent 50%, #fff 50%),
            linear-gradient(135deg, #fff 50%, transparent 50%);
          background-position:
            calc(100% - 18px) center,
            calc(100% - 12px) center;
          background-size: 6px 6px, 6px 6px;
          background-repeat: no-repeat;
          padding-right: 34px;
        }
        
        .primary-select option {
            background-color: #000;
            color: #fff;
        }

        .primary-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .primary-mobile-row {
          display: grid;
          grid-template-columns: 90px 1fr;
          gap: 12px;
        }

        .primary-btn {
          background: transparent;
          border: 1.5px solid #666;
          border-radius: 12px;
          color: #fff;
          height: 44px;
          flex: 1;
          transition: all 0.25s ease;
        }
        .primary-btn:hover { border-color: #ff6b35; }
        
        .primary-btn.active {
          background: #ff6b35;
          border-color: #ff6b35;
          color: #000;
          font-weight: 700;
        }

        @media (max-width: 420px) {
          .primary-number-title { font-size: 24px; }
          .primary-mobile-row { grid-template-columns: 80px 1fr; gap: 10px; }
          .primary-two-col { gap: 10px; }
        }
      `}</style>

      {/* 3. Render Toast via Portal outside the component hierarchy */}
      {typeof document !== 'undefined' 
        ? ReactDOM.createPortal(toastComponent, document.body) 
        : toastComponent
      }

      {showTitle && <h1 className="primary-number-title">Primary Number</h1>}

      {/* Mobile */}
      <div className="mb-3">
        <div className="primary-label">
          <span>
            Mobile Number<span className="primary-star">*</span>
          </span>
        </div>

        <div className="primary-mobile-row">
          <select
            className="primary-select text-center"
            value={mobileObj.isd || "+91"}
            onChange={(e) =>
              handleFieldChange("Mobile Number", { ...mobileObj, isd: e.target.value })
            }
          >
            {COUNTRY_CODES.map((c) => (
                <option key={c.code + c.dial_code} value={c.dial_code} style={{backgroundColor: '#000', color: '#fff'}}>
                  {c.dial_code}
                </option>
            ))}
          </select>

          <input
            type="tel"
            className="primary-input"
            placeholder="Mobile Number"
            value={mobileObj.mobile || ""}
            onChange={handleMobileChange}
            onBlur={validateMobile}
            maxLength={maxAllowedLength} 
          />
        </div>
      </div>

      {/* Using since */}
      <div className="mb-3">
        <div className="primary-label">
          <span>
            Using this number since<span className="primary-star">*</span>
          </span>
        </div>

        <div className="primary-two-col">
          <select
            className="primary-select"
            value={sinceArr?.[0] || ""}
            onChange={(e) => handleFieldChange("Using this number since", [e.target.value, sinceArr?.[1] || ""])}
          >
            <option value="" style={{backgroundColor: '#000', color: '#fff'}}>Month</option>
            {months.map((m) => (
              <option key={m} value={m} style={{backgroundColor: '#000', color: '#fff'}}>{m}</option>
            ))}
          </select>

          <select
            className="primary-select"
            value={sinceArr?.[1] || ""}
            onChange={(e) => handleFieldChange("Using this number since", [sinceArr?.[0] || "", e.target.value])}
          >
            <option value="" style={{backgroundColor: '#000', color: '#fff'}}>Year</option>
            {years.map((y) => (
              <option key={y} value={y} style={{backgroundColor: '#000', color: '#fff'}}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Usage type */}
      <div className="mb-3">
        <div className="primary-label">
          <span>
            Usage type<span className="primary-star">*</span>
          </span>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          {["Personal", "Work", "Both"].map((option) => (
            <button
              key={option}
              type="button"
              className={`primary-btn ${selectedUsageType === option ? "active" : ""}`}
              onClick={() => handleUsageTypeSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Line of Work */}
      {(selectedUsageType === "Work" || selectedUsageType === "Both") && (
        <div className="mb-3">
          <div className="primary-label">
            <span>
              Line of Work<span className="primary-star">*</span>
            </span>
          </div>
          <input
            type="text"
            className="primary-input fw-light"
            placeholder="IT, Finance, Marketing, Public-relations, etc."
            value={data["Line of Work"] || ""}
            onChange={(e) => handleFieldChange("Line of Work", e.target.value)}
          />
        </div>
      )}

      {/* Role */}
      <div className="mb-3">
        <div className="primary-label">
          <span>
            Role<span className="primary-star">*</span>
          </span>
        </div>
        <input
          type="text"
          className="primary-input fw-light"
          placeholder="Student, Shop Keeper, Accountant, etc."
          value={data["Role"] || ""}
          onChange={(e) => handleFieldChange("Role", e.target.value)}
        />
      </div>
    </div>
  );
}