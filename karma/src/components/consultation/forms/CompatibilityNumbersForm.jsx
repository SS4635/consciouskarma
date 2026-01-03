import React, { useEffect, useState } from "react";
// Ensure this path is correct based on your folder structure
import { COUNTRY_CODES } from "../../constants/countryCodes"; 

export default function CompatibilityNumbersForm({
  primaryData = {},
  numbers = [],
  onPrimaryChange,
  onChange,
  onAdd,
  onRemove,
  isExtended = false,
  showTitle = false,
  maxNumbers = 3, // LIMIT SET TO 4
  className = "",
}) {
  const [openIndex, setOpenIndex] = useState(null);

  // Auto-open new number when added
  useEffect(() => {
    if (numbers.length) setOpenIndex(numbers.length - 1);
  }, [numbers.length]);

  return (
    <div className={`${className} font-arsenal`}>
      <style>{`
        .pn-title {
          font-size: 28px;
          font-weight: 300;
          margin-top: 1rem;
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

        /* FIXED HEIGHT FOR INPUTS */
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

        /* ARROW CENTERED */
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
        
        /* BLACK DRAWER THEME */
        .pn-select option {
            background-color: #000;
            color: #fff;
        }

        .pn-mobile-row { display: grid; grid-template-columns: 105px 1fr; gap: 12px; }

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
          .pn-remove { padding: 0 10px; }
        }
      `}</style>

      {showTitle && <h1 className="pn-title">Compatibility Numbers</h1>}

      {/* =========================================
          PRIMARY COMPATIBILITY NUMBER (Fixed)
         ========================================= */}
      <div className="pn-block mb-4">

        {/* Mobile Number */}
        <div className="mb-3">
          <div className="pn-label">
            <span>Mobile Number</span>
            <span className="pn-star">*</span>
          </div>

          <div className="pn-mobile-row">
            {/* Country Dropdown Container */}
            <div style={{ position: "relative", width: "100%", height: "44px" }}>
               <select
                 value={primaryData.isd || "+91"}
                 onChange={(e) =>
                   onPrimaryChange?.({ ...primaryData, isd: e.target.value })
                 }
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
                 <span>{primaryData.isd || "+91"}</span>
                 <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </div>
             </div>

            <input
              type="text"
              className="pn-input"
              placeholder="Mobile number"
              value={primaryData.mobile || ""}
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) => {
                // Allow only digits, max 10
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                onPrimaryChange?.({ ...primaryData, mobile: val });
              }}
            />
          </div>
        </div>

        {/* Relationship */}
        <div className="mb-3">
          <div className="pn-label">
            <span>Relationship with the user</span>
            <span className="pn-star">*</span>
          </div>
          <input
            type="text"
            className="pn-input"
            placeholder="Spouse, Partner, Friend"
            value={primaryData.relationship || ""}
            onChange={(e) =>
              onPrimaryChange?.({ ...primaryData, relationship: e.target.value })
            }
          />
        </div>
      </div>

      {/* =========================================
          EXTRA NUMBERS – EXTENDED PLAN (Dynamic)
         ========================================= */}
      {isExtended && (
        <>
          <div className="d-flex flex-column gap-3">
            {numbers.map((num, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={index} className="pn-block">
                  <div className="pn-header">
                    <div className="pn-header-label">
                      Compatibility Number #{index + 2}
                    </div>

                    <div className="pn-actions">
                      <button
                        type="button"
                        className="pn-toggle"
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                      >
                        {isOpen ? "−" : "+"}
                      </button>
                      <button
                        type="button"
                        className="pn-remove"
                        onClick={() => onRemove?.(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <>
                      {/* Dynamic Mobile */}
                      <div className="mb-3">
                        <div className="pn-label">
                          <span>Mobile Number</span>
                          <span className="pn-star">*</span>
                        </div>

                        <div className="pn-mobile-row">
                          {/* Country Dropdown Container */}
                          <div style={{ position: "relative", width: "100%", height: "44px" }}>
                             <select
                               value={num.isd || "+91"}
                               onChange={(e) =>
                                 onChange?.(index, "isd", e.target.value)
                               }
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
                               <span>{num.isd || "+91"}</span>
                               <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                               </svg>
                             </div>
                           </div>

                          <input
                            type="text"
                            className="pn-input"
                            placeholder="Mobile number"
                            value={num.mobile || ""}
                            maxLength={10}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            onChange={(e) => {
                              // Allow only digits, max 10
                              const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                              onChange?.(index, "mobile", val);
                            }}
                          />
                        </div>
                      </div>

                      {/* Dynamic Relationship */}
                      <div className="mb-3">
                        <div className="pn-label">
                          <span>Relationship with the user</span>
                          <span className="pn-star">*</span>
                        </div>
                        <input
                          type="text"
                          className="pn-input"
                          placeholder="Spouse, Partner, Friend"
                          value={num.relationship || ""}
                          onChange={(e) =>
                            onChange?.(index, "relationship", e.target.value)
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* ADD BUTTON (Only visible if count < maxNumbers) */}
          {numbers.length < maxNumbers && (
            <div className="pn-add-wrap">
              <button type="button" className="pn-add" onClick={onAdd}>
                Add Number
              </button>
              <span style={{ color: "#fff", opacity: 0.8 }}>If any</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}