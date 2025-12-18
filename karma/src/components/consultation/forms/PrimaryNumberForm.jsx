import React, { useMemo, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PrimaryNumberForm({
  data = {},
  onChange,
  showTitle = true,
  className = "",
}) {
  const usageFromData = data["Usage type"] || data.usageType || "";
  const [selectedUsageType, setSelectedUsageType] = useState(usageFromData);

  useEffect(() => {
    setSelectedUsageType(usageFromData || "");
  }, [usageFromData]);

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

  const mobileObj = data["Mobile Number"] || data.mobileNumber || {};
  const sinceArr = data["Using this number since"] || data.usingSince || ["", ""];

  return (
    <div className={`${className} font-arsenal`}>
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
            calc(100% - 18px) calc(50% - 3px),
            calc(100% - 12px) calc(50% - 3px);
          background-size: 6px 6px, 6px 6px;
          background-repeat: no-repeat;
          padding-right: 34px;
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
          color: #0b0b0b;
          font-weight: 700;
        }

        @media (max-width: 420px) {
          .primary-number-title { font-size: 24px; }
          .primary-mobile-row { grid-template-columns: 80px 1fr; gap: 10px; }
          .primary-two-col { gap: 10px; }
        }
      `}</style>

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
            className="primary-select"
            value={mobileObj.isd || "+91"}
            onChange={(e) =>
              handleFieldChange("Mobile Number", { ...mobileObj, isd: e.target.value })
            }
          >
            <option value="+91">+91</option>
            <option value="+1">+1</option>
            <option value="+44">+44</option>
            <option value="+61">+61</option>
            <option value="+81">+81</option>
            <option value="+971">+971</option>
            <option value="+49">+49</option>
            <option value="+33">+33</option>
          </select>

          <input
            type="text"
            className="primary-input"
            placeholder="Mobile Number"
            value={mobileObj.mobile || ""}
            onChange={(e) =>
              handleFieldChange("Mobile Number", { ...mobileObj, mobile: e.target.value })
            }
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
            <option value="">Month</option>
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            className="primary-select"
            value={sinceArr?.[1] || ""}
            onChange={(e) => handleFieldChange("Using this number since", [sinceArr?.[0] || "", e.target.value])}
          >
            <option value="">Year</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
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
