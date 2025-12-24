import React, { useEffect, useMemo, useState } from "react";
// Ensure this path is correct based on your folder structure
import { COUNTRY_CODES } from "../../constants/countryCodes"; 

export default function PreviousNumbersForm({
  numbers = [],
  onChange,
  onAdd,
  onRemove,
  onToggle,
  maxNumbers = 3,
  showTitle = true,
  className = "",
}) {
  const [openIndex, setOpenIndex] = useState(numbers.length ? numbers.length - 1 : null);

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

  useEffect(() => {
    if (!numbers.length) {
      setOpenIndex(null);
      onToggle?.(false);
      return;
    }
    setOpenIndex(numbers.length - 1);
    onToggle?.(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numbers.length]);

  const toggleOpen = (index) => {
    setOpenIndex((prev) => {
      const next = prev === index ? null : index;
      onToggle?.(next !== null);
      return next;
    });
  };

  const handleFieldChange = (index, field, value) => {
    onChange?.(index, field, value);
  };

  const handleAdd = () => {
    if (numbers.length < maxNumbers) onAdd?.();
  };

  return (
    <div className={`${className} font-arsenal`}>
      <style>{`
        .pr-title {
          font-size: 28px;
          font-weight: 300;
          margin-bottom: 2rem;
          text-align: center;
          color: #fff;
        }

        .pr-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 1rem;
        }
        .pr-label-top {
          font-size: 17.6px;
          font-weight: 300;
          color: #fff;
        }
        .pr-actions { display: flex; gap: 10px; align-items: center; }

        .pr-toggle {
          background: transparent;
          border: 1.5px solid #666;
          border-radius: 12px;
          color: #ff6b35;
          width: 44px;
          height: 44px;
          font-size: 22px;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .pr-toggle:hover { border-color: #ff6b35; }

        .pr-remove {
          background: transparent;
          border: 1.5px solid #666;
          border-radius: 12px;
          color: #ff6b35;
          padding: 0 14px;
          height: 44px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
        }
        .pr-remove:hover { border-color: #ff6b35; background: rgba(255, 107, 53, 0.08); }

        .pr-field-label {
          font-size: 17.6px;
          font-weight: 300;
          margin-bottom: 0.45rem;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .pr-star { color: #fff; }

        /* FIXED HEIGHT for Inputs & Selects */
        .pr-input, .pr-select {
          width: 100%;
          background: transparent;
          border: 1.5px solid #666;
          border-radius: 12px;
          padding: 0.65rem 0.85rem;
          color: #fff;
          font-size: 0.95rem;
          height: 44px !important; 
          transition: all 0.25s ease;
        }
        .pr-input:focus, .pr-select:focus {
          outline: none;
          border-color: #ff6b35;
          box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.25);
        }
        .pr-input::placeholder { color: #999; }

        /* ARROW ALIGNMENT CENTER */
        .pr-select {
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

        /* DRAWER THEME BLACK */
        .pr-select option {
            background-color: #000;
            color: #fff;
        }

        .pr-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        
        /* Fixed Grid for Mobile Row */
        .pr-mobile-row { display: grid; grid-template-columns: 105px 1fr; gap: 12px; }

        .pr-pill {
          background: transparent;
          border: 1.5px solid #666;
          border-radius: 12px;
          color: #fff;
          height: 44px;
          min-width: 90px;
          transition: all 0.25s ease;
        }
        .pr-pill:hover { border-color: #ff6b35; }
        
        /* ACTIVE STATE: Orange BG, Black Text */
        .pr-pill.active {
          background: #ff6b35;
          border-color: #ff6b35;
          color: #000;
          font-weight: 700;
        }

        .pr-add-wrap { display: flex; align-items: center; gap: 12px; margin-top: 1rem; }
        .pr-add {
          background: transparent;
          border: 1.5px solid #666;
          border-radius: 12px;
          height: 44px;
          padding: 0 18px;
          color: #fff;
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .pr-add:hover { border-color: #ff6b35; }

        @media (max-width: 420px) {
          .pr-title { font-size: 24px; }
          .pr-mobile-row { grid-template-columns: 80px 1fr; gap: 10px; }
          .pr-two-col { gap: 10px; }
          .pr-remove { padding: 0 10px; }
        }
      `}</style>

      {showTitle && <h1 className="pr-title">Previous Numbers</h1>}

      <div className="d-flex flex-column gap-3">
        {numbers.map((p, i) => {
          const isOpen = openIndex === i;
          
          // --- COUNTRY CODE LOGIC ---
          const currentIsd = p.isd || "+91";

          // --- DATE LOGIC ---
          const startYear = p.usedSinceYear ? parseInt(p.usedSinceYear) : 0;
          const startMonthIdx = p.usedSinceMonth ? months.indexOf(p.usedSinceMonth) : -1;

          // 1. Filter Years: Till Year >= Start Year
          const availableTillYears = years.filter(y => y >= startYear);

          // 2. Filter Months: If Years are same, Till Month >= Start Month
          let availableTillMonths = months;
          const tillYear = p.usedTillYear ? parseInt(p.usedTillYear) : 0;
          
          if (startYear > 0 && tillYear === startYear && startMonthIdx !== -1) {
             availableTillMonths = months.slice(startMonthIdx);
          }

          return (
            <div key={i}>
              <div className="pr-header">
                <div className="pr-label-top">Previous Number #{i + 1}</div>

                <div className="pr-actions">
                  <button type="button" className="pr-toggle" onClick={() => toggleOpen(i)}>
                    {isOpen ? "−" : "+"}
                  </button>
                  <button type="button" className="pr-remove" onClick={() => onRemove?.(i)}>
                    Remove
                  </button>
                </div>
              </div>

              {isOpen && (
                <>
                  {/* Mobile */}
                  <div className="mb-3">
                    <div className="pr-field-label">
                      <span>Mobile Number</span><span className="pr-star">*</span>
                    </div>

                    <div className="pr-mobile-row">
                      {/* Country Dropdown (FIXED) */}
                      <div style={{ position: "relative", width: "100%", height: "44px" }}>
                          <select
                            className="pr-select text-center"
                            value={currentIsd}
                            onChange={(e) => handleFieldChange(i, "isd", e.target.value)}
                            style={{
                              padding: "0 12px",
                              color: "transparent",
                              cursor: "pointer",
                              appearance: "none",
                              WebkitAppearance: "none",
                              backgroundImage: "none",
                              height: "100%",
                              width: "100%"
                            }}
                          >
                            {COUNTRY_CODES.map((c) => (
                                <option key={c.code + c.dial_code} value={c.dial_code} style={{backgroundColor: '#000', color: '#fff'}}>
                                  {c.name} ({c.dial_code})
                                </option>
                            ))}
                          </select>
                          
                          {/* Overlay */}
                          <div style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            pointerEvents: "none",
                            color: "#fff",
                            fontSize: "0.95rem",
                            gap: "5px"
                          }}>
                            <span>{currentIsd}</span>
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                      </div>

                      <input
                        type="text"
                        className="pr-input"
                        placeholder="Mobile Number"
                        value={p.number || ""}
                        onChange={(e) => {
                           const val = e.target.value;
                           if (/[^0-9]/.test(val)) return;
                           handleFieldChange(i, "number", val);
                        }}
                      />
                    </div>
                  </div>

                  {/* Used Since */}
                  <div className="mb-3">
                    <div className="pr-field-label">
                      <span>Used Since</span><span className="pr-star">*</span>
                    </div>

                    <div className="pr-two-col">
                      <select
                        className="pr-select"
                        value={p.usedSinceMonth || ""}
                        onChange={(e) => handleFieldChange(i, "usedSinceMonth", e.target.value)}
                      >
                        <option value="" style={{backgroundColor: '#000', color: '#fff'}}>Month</option>
                        {months.map((m) => <option key={m} value={m} style={{backgroundColor: '#000', color: '#fff'}}>{m}</option>)}
                      </select>

                      <select
                        className="pr-select"
                        value={p.usedSinceYear || ""}
                        onChange={(e) => {
                           // If Year changes, check if current Till Year becomes invalid
                           handleFieldChange(i, "usedSinceYear", e.target.value);
                        }}
                      >
                        <option value="" style={{backgroundColor: '#000', color: '#fff'}}>Year</option>
                        {years.map((y) => <option key={y} value={y} style={{backgroundColor: '#000', color: '#fff'}}>{y}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Used Till (Filtered) */}
                  <div className="mb-3">
                    <div className="pr-field-label">
                      <span>Used Till</span><span className="pr-star">*</span>
                    </div>

                    <div className="pr-two-col">
                      <select
                        className="pr-select"
                        value={p.usedTillMonth || ""}
                        onChange={(e) => handleFieldChange(i, "usedTillMonth", e.target.value)}
                        disabled={!p.usedSinceYear} // Optional: Disable until Year selected
                      >
                        <option value="" style={{backgroundColor: '#000', color: '#fff'}}>Month</option>
                        {/* ✅ Filtered Months */}
                        {availableTillMonths.map((m) => <option key={m} value={m} style={{backgroundColor: '#000', color: '#fff'}}>{m}</option>)}
                      </select>

                      <select
                        className="pr-select"
                        value={p.usedTillYear || ""}
                        onChange={(e) => handleFieldChange(i, "usedTillYear", e.target.value)}
                        disabled={!p.usedSinceYear} // Optional: Disable until Start Year selected
                      >
                        <option value="" style={{backgroundColor: '#000', color: '#fff'}}>Year</option>
                        {/* ✅ Filtered Years */}
                        {availableTillYears.map((y) => <option key={y} value={y} style={{backgroundColor: '#000', color: '#fff'}}>{y}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Usage type */}
                  <div className="mb-3">
                    <div className="pr-field-label">
                      <span>Usage type</span><span className="pr-star">*</span>
                    </div>

                    <div className="d-flex gap-2 flex-wrap">
                      {["Personal", "Work", "Both"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          className={`pr-pill ${p.usageType === type ? "active" : ""}`}
                          onClick={() => handleFieldChange(i, "usageType", type)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Line of Work */}
                  {(p.usageType === "Work" || p.usageType === "Both") && (
                    <div className="mb-3">
                      <div className="pr-field-label">
                        <span>Line of Work</span><span className="pr-star">*</span>
                      </div>
                      <input
                        className="pr-input"
                        placeholder="IT, Finance, Marketing, Public-relations, etc."
                        value={p.lineOfWork || ""}
                        onChange={(e) => handleFieldChange(i, "lineOfWork", e.target.value)}
                      />
                    </div>
                  )}

                  {/* Role */}
                  <div className="mb-3">
                    <div className="pr-field-label">
                      <span>Role</span><span className="pr-star">*</span>
                    </div>
                    <input
                      className="pr-input"
                      placeholder="Student, Shop Keeper, Accountant, etc."
                      value={p.role || ""}
                      onChange={(e) => handleFieldChange(i, "role", e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {numbers.length < maxNumbers && (
        <div className="pr-add-wrap">
          <button type="button" className="pr-add" onClick={handleAdd}>
            Add Number
          </button>
          <span style={{ color: "#fff", opacity: 0.8 }}>If any</span>
        </div>
      )}
    </div>
  );
}