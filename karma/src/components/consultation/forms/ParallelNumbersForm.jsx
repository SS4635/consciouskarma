import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// ✅ Verify path
import { COUNTRY_CODES } from "../../constants/countryCodes"; 

export default function ParallelNumbersForm({
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
    // When added/removed, keep only the newest open by default
    if (!numbers.length) {
      setOpenIndex(null);
      onToggle?.(false);
      return;
    }
    const idx = numbers.length - 1;
    setOpenIndex(idx);
    onToggle?.(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numbers.length]);

  const handleFieldChange = (index, field, value) => {
    onChange?.(index, field, value);
  };

  const toggleOpen = (index) => {
    setOpenIndex((prev) => {
      const next = prev === index ? null : index;
      onToggle?.(next !== null);
      return next;
    });
  };

  const handleAdd = () => {
    if (numbers.length < maxNumbers) onAdd?.();
  };

  return (
    <div className={`${className} font-arsenal`}>
      <style>{`
        .pn-title {
          font-size: 28px;
          font-weight: 300;
          margin-bottom: 2rem;
          text-align: center;
          color: #fff;
        }

        .pn-block { padding: 0; background: transparent; }

        .pn-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 1rem;
        }
        .pn-header-label {
          font-size: 17.6px;
          font-weight: 300;
          color: #fff;
        }
        .pn-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .pn-toggle {
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
        .pn-toggle:hover { border-color: #ff6b35; }

        .pn-remove {
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
        .pn-remove:hover { border-color: #ff6b35; background: rgba(255, 107, 53, 0.08); }

        .pn-label {
          font-size: 17.6px;
          font-weight: 300;
          margin-bottom: 0.45rem;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .pn-star { color: #fff; }

        /* Fixed Height to match Primary Form */
        .pn-input, .pn-select {
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
        .pn-input:focus, .pn-select:focus {
          outline: none;
          border-color: #ff6b35;
          box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.25);
        }
        .pn-input::placeholder { color: #999; }

        /* General Select Arrow */
        .pn-select {
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

        /* Dropdown Options Black Background */
        .pn-select option {
            background-color: #000;
            color: #fff;
        }

        .pn-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        
        /* ✅ FIXED GRID FOR MOBILE ROW */
        .pn-mobile-row { display: grid; grid-template-columns: 105px 1fr; gap: 12px; }

        .pn-pill {
          background: transparent;
          border: 1.5px solid #666;
          border-radius: 12px;
          color: #fff;
          height: 44px;
          flex: 1;
          transition: all 0.25s ease;
        }
        .pn-pill:hover { border-color: #ff6b35; }
        
        .pn-pill.active {
          background: #ff6b35;
          border-color: #ff6b35;
          color: #000; 
          font-weight: 700;
        }

        .pn-add-wrap { display: flex; align-items: center; gap: 12px; margin-top: 1rem; }
        .pn-add {
          background: transparent;
          border: 1.5px solid #666;
          border-radius: 12px;
          height: 44px;
          padding: 0 18px;
          color: #fff;
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .pn-add:hover { border-color: #ff6b35; }

        @media (max-width: 420px) {
          .pn-title { font-size: 24px; }
          .pn-mobile-row { grid-template-columns: 80px 1fr; gap: 10px; }
          .pn-two-col { gap: 10px; }
          .pn-remove { padding: 0 10px; }
        }
      `}</style>

      {showTitle && <h1 className="pn-title">Parallel Numbers</h1>}

      <div className="d-flex flex-column gap-3">
        {numbers.map((num, index) => {
          const isOpen = openIndex === index;
          // Default ISD to +91 if not set
          const currentIsd = num.isd || "+91";

          return (
            <div key={index} className="pn-block">
              <div className="pn-header">
                <div className="pn-header-label">Parallel Number #{index + 1}</div>

                <div className="pn-actions">
                  <button type="button" className="pn-toggle" onClick={() => toggleOpen(index)}>
                    {isOpen ? "−" : "+"}
                  </button>
                  <button type="button" className="pn-remove" onClick={() => onRemove?.(index)}>
                    Remove
                  </button>
                </div>
              </div>

              {isOpen && (
                <>
                  {/* Mobile */}
                  <div className="mb-3">
                    <div className="pn-label">
                      <span>Mobile Number</span><span className="pn-star">*</span>
                    </div>

                    <div className="pn-mobile-row">
                      {/* Country Dropdown Container */}
                      <div style={{ position: "relative", width: "100%", height: "44px" }}>
                         <select
                           value={currentIsd}
                           onChange={(e) => handleFieldChange(index, "isd", e.target.value)}
                           className="pn-select"
                           style={{
                             padding: "0 12px",
                             color: "transparent", // Text invisible
                             cursor: "pointer",
                             appearance: "none",
                             WebkitAppearance: "none",
                             backgroundImage: "none", // Remove default arrow
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

                         {/* Overlay: Code + SVG Arrow */}
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
                        type="tel"
                        className="pn-input"
                        placeholder="Mobile Number"
                        value={num.number || ""}
                        onChange={(e) => {
                           const val = e.target.value;
                           if (/[^0-9]/.test(val)) return;
                           handleFieldChange(index, "number", val);
                        }}
                      />
                    </div>
                  </div>

                  {/* Using since */}
                  <div className="mb-3">
                    <div className="pn-label">
                      <span>Using this number since</span><span className="pn-star">*</span>
                    </div>

                    <div className="pn-two-col">
                      <select
                        className="pn-select"
                        value={num.sinceMonth || ""}
                        onChange={(e) => handleFieldChange(index, "sinceMonth", e.target.value)}
                      >
                        <option value="" style={{backgroundColor: '#000', color: '#fff'}}>Month</option>
                        {months.map((m) => (
                          <option key={m} value={m} style={{backgroundColor: '#000', color: '#fff'}}>{m}</option>
                        ))}
                      </select>

                      <select
                        className="pn-select"
                        value={num.sinceYear || ""}
                        onChange={(e) => handleFieldChange(index, "sinceYear", e.target.value)}
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
                    <div className="pn-label">
                      <span>Usage type</span><span className="pn-star">*</span>
                    </div>

                    <div className="d-flex gap-2 flex-wrap">
                      {["Personal", "Work", "Both"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`pn-pill ${num.usageType === option ? "active" : ""}`}
                          onClick={() => handleFieldChange(index, "usageType", option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Line of work */}
                  {(num.usageType === "Work" || num.usageType === "Both") && (
                    <div className="mb-3">
                      <div className="pn-label">
                        <span>Line of Work</span><span className="pn-star">*</span>
                      </div>
                      <input
                        type="text"
                        className="pn-input"
                        placeholder="IT, Finance, Marketing, Public-relations, etc."
                        value={num.lineOfWork || ""}
                        onChange={(e) => handleFieldChange(index, "lineOfWork", e.target.value)}
                      />
                    </div>
                  )}

                  {/* Role */}
                  <div className="mb-3">
                    <div className="pn-label">
                      <span>Role</span><span className="pn-star">*</span>
                    </div>
                    <input
                      type="text"
                      className="pn-input"
                      placeholder="Student, Shop Keeper, Accountant, etc."
                      value={num.role || ""}
                      onChange={(e) => handleFieldChange(index, "role", e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {numbers.length < maxNumbers && (
        <div className="pn-add-wrap">
          <button type="button" className="pn-add" onClick={handleAdd}>
            Add Number
          </button>
          <span style={{ color: "#fff", opacity: 0.8 }}>If any</span>
        </div>
      )}
    </div>
  );
}