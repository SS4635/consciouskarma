import React, { useEffect, useState } from "react";
import "./InlineInstantReportForm.css";
import { useIntl, FormattedMessage } from "react-intl";
import { COUNTRY_CODES } from "../components/constants/countryCodes";
import sampleReportPdf from "../instant_report.pdf";
import axios from "axios";
const API = process.env.REACT_APP_API_URL;
export default function InlineInstantReportForm({
  ctaLabel = "Instant Report",
  onSubmit,
  initialIsd = "+91",
  initialMobile = "",
}) {
  const intl = useIntl();
  const [isd, setIsd] = useState(initialIsd);
  const [mobile, setMobile] = useState(initialMobile);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });
 const [price, setPrice] = useState(0);
  useEffect(() => {
    setIsd(initialIsd);
  }, [initialIsd]);

  useEffect(() => {
    setMobile(initialMobile);
  }, [initialMobile]);


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

  function handleSubmit(e) {
    e.preventDefault();
    const full = `${isd}${mobile}`.replace(/\s+/g, "");
    
    // Find the selected country code
    const selectedCountry = COUNTRY_CODES.find(c => c.dial_code === isd);
    
    // Validate format first
    if (!/^[+][0-9]+$/.test(full)) {
      showToast(intl.formatMessage({ id: "form.validation.invalidNumber" }));
      return;
    }

    // Validate length based on country's max_length (must match exactly)
    const mobileDigits = mobile.replace(/\s+/g, "");
    if (selectedCountry && selectedCountry.max_length) {
      const exactLength = selectedCountry.max_length;
      if (mobileDigits.length !== exactLength) {
        showToast(
          `Phone number must be ${exactLength} digits for ${selectedCountry.name}`
        );
        return;
      }
    } else {
      // Fallback validation if country not found
      if (!/^[+][0-9]{6,15}$/.test(full)) {
        showToast(intl.formatMessage({ id: "form.validation.invalidNumber" }));
        return;
      }
    }

    onSubmit
      ? onSubmit({ isd, mobile, full })
      : alert(intl.formatMessage({ id: "form.alert.generatingReport" }, { number: full }));
  }
 useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await axios.get(`${API}/api/config/price`);
        setPrice(Number(res.data.price) * 100); // paise
      } catch (e) {
        setPrice(0);
      }
    }
    fetchPrice();
  }, []);
  return (
    <form
      onSubmit={handleSubmit}
      className="px-0 pb-3 sm:pb-4 pt-0 bg-transparent rounded-[7px] flex flex-col gap-3 sm:gap-4 w-full"
      aria-label={intl.formatMessage({ id: "form.aria.instantReportForm" })}
    >
      <div className="inline-report-grid grid grid-cols-[105px_1fr] gap-[12px] w-full items-center justify-center">
        <div className="relative w-full h-[44px]">
          <select
            value={isd}
            onChange={(e) => setIsd(e.target.value)}
            className="w-full h-full px-3 rounded-[7px] bg-transparent border-[1.5px] border-[#666]
                     text-transparent appearance-none cursor-pointer focus:outline-none focus:border-[#ff6b35] transition-all duration-250"
            style={{
              fontSize: '0.95rem',
            }}
            aria-label={intl.formatMessage({ id: "form.aria.countryCode" })}
          >
            {/* render list */}
            {COUNTRY_CODES.map((c) => (
              <option key={c.code + c.dial_code} value={c.dial_code} style={{ backgroundColor: '#000', color: '#fff' }}>
                {c.name} ({c.dial_code})
              </option>
            ))}
          </select>
          
          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white text-[0.95rem] gap-[5px]">
             <span>{isd}</span>
             <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </div>
        </div>

        <input
          className="inline-report-mobile-input w-full h-[44px] px-[2.1rem] rounded-[7px] bg-transparent border-[1.5px] border-[#666] text-white placeholder-[#999] focus:border-[#ff6b35] focus:outline-none transition-all duration-250 text-[0.95rem]"
          type="tel"
          inputMode="numeric"
          pattern="[0-9 ]*"
          maxLength={12}
          placeholder={intl.formatMessage({ id: "form.placeholder.mobile" })}
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          aria-label={intl.formatMessage({ id: "form.aria.mobileNumber" })} style={{"letterSpacing":'4px'}}
        />
      </div>

      <div className="action-row" >
        <span className="text-white font-arsenal flex items-center whitespace-nowrap" style={{ fontSize: 'clamp(20px, 3vw, 26px)', marginLeft: '24px', paddingTop: 'clamp(8px, 2vw, 12px)', paddingBottom: 'clamp(8px, 2vw, 12px)', transform: 'translateY(-4px)' }}>
      ₹ {price/100}
        </span>

        <div className="flex flex-col gap-1" style={{ marginRight: '28px' }}>
          <button
            type="submit"
            className="relative overflow-hidden rounded-md text-white font-balgin font-bold animated-border-btn butt"
            style={{ padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 40px)', fontSize: 'clamp(13px, 2vw, 16px)' }}
          >
            <span className="relative z-10 whitespace-nowrap">{ctaLabel}</span>

            <style>{`
            @property --angle {
              syntax: '<angle>';
              initial-value: 0deg;
              inherits: true;
            }

            .animated-border-btn {
              position: relative;
              border: 2px solid transparent;
              border-radius: 6px;
              padding: 0;
            }

            .animated-border-btn::before {
              content: "";
              position: absolute;
              inset: 0;
              border-radius: 6px;
              padding: 3px;
              background: conic-gradient(
                from var(--angle),
                #ff914d,
                #ff914d 20%,
                transparent 60%
              );
              -webkit-mask:
                linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
              animation: rotateBorder 2.5s linear infinite;
            }

            .animated-border-btn::after {
              content: "";
              position: absolute;
              inset: 2px;
              background: #000;
              border-radius: 4px;
              z-index: 1;
            }

            @keyframes rotateBorder {
              0%   { --angle: 0deg; }
              100% { --angle: 360deg; }
            }
          `}</style>
          </button>
        </div>
      </div>
      <a
            href={sampleReportPdf}
            target="_blank"
            rel="noopener noreferrer"
            className="font-balgin no-underline hover:no-underline transition-colors sample-rep"
            style={{ fontSize: 'clamp(13px, 2vw, 16px)', color: '#ff914d' }}
          >
            sample report
          </a>
      {/* Toast Notification */}
      {toast.show && (
        <div
          className="fixed"
          style={{
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'slideDown 0.3s ease-out',
            zIndex: 9999,
          }}
        >
          <div
            className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              toast.type === 'error' 
                ? 'bg-red-600 text-white' 
                : 'bg-green-600 text-white'
            }`}
            style={{
              minWidth: '280px',
              maxWidth: '90vw',
            }}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => setToast({ show: false, message: "", type: "error" })}
              className="ml-auto text-white hover:text-gray-200"
              style={{ fontSize: '18px', lineHeight: '1', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </form>
  );
}