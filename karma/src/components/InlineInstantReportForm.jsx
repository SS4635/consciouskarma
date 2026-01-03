import React, { useEffect, useState } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { COUNTRY_CODES } from "../components/constants/countryCodes";
import sampleReportPdf from "../instant_report.pdf";

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

  return (
    <form
      onSubmit={handleSubmit}
      className="px-0 pb-3 sm:pb-4 pt-0 bg-transparent rounded-[10px] flex flex-col gap-3 sm:gap-4 w-full"
      aria-label={intl.formatMessage({ id: "form.aria.instantReportForm" })}
    >
      <div className="flex gap-2 sm:gap-3 w-full items-center justify-center">
        <div className="relative">
          <select
            value={isd}
            onChange={(e) => setIsd(e.target.value)}
            className="w-[85px] sm:w-[85px] py-2.5 sm:py-3 pl-3 sm:pl-3 pr-7 rounded-md bg-black border border-gray-500
                     text-gray-50 font-medium appearance-none bg-no-repeat text-center
                     cursor-pointer hover:border-gray-400 focus:border-orange-400 focus:outline-none transition-colors"
            style={{
           
              backgroundPosition: "right 0.35rem center",
              backgroundSize: "0.9em",
              fontSize: 'clamp(14px, 2vw, 16px)',
              letterSpacing: '0.15em',
              paddingRight: '0.15em',
              color: 'transparent'
            }}
            aria-label={intl.formatMessage({ id: "form.aria.countryCode" })}
          >
            {/* render list */}
            {COUNTRY_CODES.map((c) => (
              <option key={c.code + c.dial_code} value={c.dial_code} style={{ color: '#f9fafb' }}>
                {c.name} ({c.dial_code})
              </option>
            ))}
          </select>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#f9fafb', letterSpacing: '0.15em', paddingRight: '0.15em' }}>
            {isd}
          </div>
        </div>

        <input
          className="flex-1 py-2.5 sm:py-3 px-3 rounded-md bg-black border border-gray-500 text-gray-50 placeholder:text-gray-500 hover:border-gray-400 focus:border-orange-400 focus:outline-none transition-colors text-center"
          style={{ fontSize: 'clamp(14px, 2vw, 16px)', letterSpacing: '0.15em', paddingRight: '0.15em' }}
          type="tel"
          inputMode="numeric"
          pattern="[0-9 ]*"
          maxLength={12}
          placeholder={intl.formatMessage({ id: "form.placeholder.mobile" })}
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          aria-label={intl.formatMessage({ id: "form.aria.mobileNumber" })}
        />
      </div>

      <div className="flex flex-row items-start justify-between w-full" style={{ marginTop: '-12px' }}>
        <span className="text-white font-arsenal flex items-center whitespace-nowrap" style={{ fontSize: 'clamp(20px, 3vw, 26px)', marginLeft: '24px', paddingTop: 'clamp(8px, 2vw, 12px)', paddingBottom: 'clamp(8px, 2vw, 12px)', transform: 'translateY(-4px)' }}>
        269
        </span>

        <div className="flex flex-col items-start gap-1" style={{ marginRight: '28px' }}>
          <button
            type="submit"
            className="relative overflow-hidden rounded-md text-white font-balgin font-bold animated-border-btn"
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

          <a
            href={sampleReportPdf}
            target="_blank"
            rel="noopener noreferrer"
            className="font-balgin no-underline hover:no-underline transition-colors"
            style={{ fontSize: 'clamp(13px, 2vw, 16px)', color: '#ff914d' }}
          >
            sample report
          </a>
        </div>
      </div>

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

