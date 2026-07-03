import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import axios from "axios";

import { COUNTRY_CODES } from "./constants/countryCodes";

const API = process.env.REACT_APP_API_URL;

export default function InlineInstantReportForm1({
  ctaLabel = "Instant Report",
  onSubmit,
  initialIsd = "+91",
  initialMobile = "",
}) {
  const intl = useIntl();

  const [isd, setIsd] = useState(initialIsd);
  const [mobile, setMobile] = useState(initialMobile);
  const [price, setPrice] = useState(0);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });

  useEffect(() => {
    setIsd(initialIsd);
  }, [initialIsd]);

  useEffect(() => {
    setMobile(initialMobile);
  }, [initialMobile]);

  useEffect(() => {
    if (!toast.show) return undefined;

    const timer = setTimeout(() => {
      setToast({
        show: false,
        message: "",
        type: "error",
      });
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.show]);

  useEffect(() => {
    let isMounted = true;

    async function fetchPrice() {
      try {
        const response = await axios.get(`${API}/api/config/price`);

        const receivedPrice = Number(response?.data?.price || 0);

        if (isMounted) {
          setPrice(Number.isFinite(receivedPrice) ? receivedPrice : 0);
        }
      } catch (error) {
        if (isMounted) {
          setPrice(0);
        }
      }
    }

    fetchPrice();

    return () => {
      isMounted = false;
    };
  }, []);

  function showToast(message, type = "error") {
    setToast({
      show: true,
      message,
      type,
    });
  }

  function handleMobileChange(event) {
    const value = event.target.value;

    // Only numbers and spaces are allowed.
    const cleanedValue = value.replace(/[^\d ]/g, "");

    setMobile(cleanedValue);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const mobileDigits = mobile
      .replace(/\s+/g, "")
      .replace(/\D/g, "");

    const full = `${isd}${mobileDigits}`.replace(/\s+/g, "");

    const selectedCountry = COUNTRY_CODES.find(
      (country) => country.dial_code === isd
    );

    if (!/^\+[0-9]+$/.test(full)) {
      showToast(
        intl.formatMessage({
          id: "form.validation.invalidNumber",
        })
      );

      return;
    }

    if (selectedCountry?.max_length) {
      const exactLength = Number(selectedCountry.max_length);

      if (mobileDigits.length !== exactLength) {
        showToast(
          `Phone number must be ${exactLength} digits for ${selectedCountry.name}`
        );

        return;
      }
    } else if (!/^\+[0-9]{6,15}$/.test(full)) {
      showToast(
        intl.formatMessage({
          id: "form.validation.invalidNumber",
        })
      );

      return;
    }

    if (onSubmit) {
      onSubmit({
        isd,
        mobile: mobileDigits,
        full,
      });

      return;
    }

    alert(
      intl.formatMessage(
        {
          id: "form.alert.generatingReport",
        },
        {
          number: full,
        }
      )
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="ck-inline-report-form"
        aria-label={intl.formatMessage({
          id: "form.aria.instantReportForm",
        })}
      >
        {/* Country code and mobile input */}
        <div className="ck-inline-report-grid">
          <div className="ck-inline-country-wrapper">
            <select
              value={isd}
              onChange={(event) => setIsd(event.target.value)}
              className="ck-inline-country-select"
              aria-label={intl.formatMessage({
                id: "form.aria.countryCode",
              })}
            >
              {COUNTRY_CODES.map((country) => (
                <option
                  key={`${country.code}-${country.dial_code}`}
                  value={country.dial_code}
                  className="ck-inline-country-option"
                >
                  {country.name} ({country.dial_code})
                </option>
              ))}
            </select>

            <div className="ck-inline-country-display">
              <span>{isd}</span>

              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <input
            className="ck-inline-mobile-input"
            type="tel"
            inputMode="numeric"
            pattern="[0-9 ]*"
            maxLength={12}
            placeholder={intl.formatMessage({
              id: "form.placeholder.mobile",
            })}
            value={mobile}
            onChange={handleMobileChange}
            aria-label={intl.formatMessage({
              id: "form.aria.mobileNumber",
            })}
          />
        </div>

        {/* Price and report button */}
        <div className="ck-inline-report-grid ck-inline-action-grid">
          <span className="ck-inline-price">
            ₹ {price}
          </span>

          <button
            type="submit"
            className="ck-inline-report-button"
          >
            <span>{ctaLabel}</span>
          </button>
        </div>
      </form>

      {toast.show && (
        <div className="ck-inline-toast-wrapper">
          <div
            className={`ck-inline-toast ${
              toast.type === "error"
                ? "ck-inline-toast-error"
                : "ck-inline-toast-success"
            }`}
          >
            <span>{toast.message}</span>

            <button
              type="button"
              className="ck-inline-toast-close"
              aria-label="Close notification"
              onClick={() =>
                setToast({
                  show: false,
                  message: "",
                  type: "error",
                })
              }
            >
              ×
            </button>
          </div>
        </div>
      )}

      <style>{`
        * {
          box-sizing: border-box;
        }

        .ck-inline-report-form {
          width: 100%;
          max-width: 100%;
          padding: 0 0 12px;
          margin: 0;
          background: transparent;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ck-inline-report-grid {
          width: 100%;
          display: grid;
          grid-template-columns: 105px minmax(0, 1fr);
          column-gap: 12px;
          align-items: center;
        }

        .ck-inline-country-wrapper {
          position: relative;
          width: 100%;
          min-width: 0;
          height: 44px;
        }

        .ck-inline-country-select {
          width: 100%;
          height: 44px;
          padding: 0 12px;
          border: 1.5px solid #666;
          border-radius: 7px;
          outline: none;
          background: transparent;
          color: transparent;
          font-family: Arsenal, sans-serif;
          font-size: 0.95rem;
          appearance: none;
          cursor: pointer;
          transition:
            border-color 250ms ease,
            box-shadow 250ms ease;
        }

        .ck-inline-country-select:focus {
          border-color: #f59255;
          box-shadow: 0 0 0 1px rgba(245, 146, 85, 0.15);
        }

        .ck-inline-country-option {
          background: #000;
          color: #fff;
        }

        .ck-inline-country-display {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          color: #fff;
          font-family: Arsenal, sans-serif;
          font-size: 0.95rem;
          pointer-events: none;
        }

        .ck-inline-mobile-input {
          width: 100%;
          min-width: 0;
          height: 44px;
          margin: 0;
          padding: 0 1.5rem;
          border: 1.5px solid #666;
          border-radius: 7px;
          outline: none;
          background: transparent;
          color: #fff;
          font-family: Arsenal, sans-serif;
          font-size: 0.95rem;
          font-weight: 400;
          letter-spacing: 4px;
          transition:
            border-color 250ms ease,
            box-shadow 250ms ease;
        }

        .ck-inline-mobile-input::placeholder {
          color: #999;
          opacity: 1;
          font-weight: 400;
        }

        .ck-inline-mobile-input:focus {
          border-color: #f59255;
          box-shadow: 0 0 0 1px rgba(245, 146, 85, 0.15);
        }

        .ck-inline-action-grid {
          margin: 0;
        }

        .ck-inline-price {
          width: 100%;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          color: #fff;
          font-family: Arsenal, sans-serif;
          font-size: clamp(20px, 3vw, 26px);
          font-weight: 400;
          line-height: 1;
          white-space: nowrap;
        }

        .ck-inline-report-button {
          position: relative;
          justify-self: start;
          align-self: center;

          width: auto;
          max-width: 100%;
          min-width: 0;
          min-height: 44px;

          margin: 0;
          padding: 8px clamp(16px, 4vw, 40px);

          display: flex;
          align-items: center;
          justify-content: center;

          overflow: hidden;
          border: 2px solid transparent;
          border-radius: 7px;
          outline: none;

          background: #000;
          color: #fff;

          font-family: Balgin, sans-serif;
          font-size: clamp(14px, 2vw, 16px);
          font-weight: 700;
          line-height: 1.2;

          cursor: pointer;
          transform: none;
          transition:
            opacity 200ms ease,
            transform 200ms ease;
        }

        .ck-inline-report-button:hover {
          opacity: 0.95;
        }

        .ck-inline-report-button:active {
          transform: scale(0.98);
        }

        .ck-inline-report-button:focus-visible {
          outline: 2px solid #f59255;
          outline-offset: 3px;
        }

        .ck-inline-report-button span {
          position: relative;
          z-index: 3;
          white-space: nowrap;
        }

        @property --ck-inline-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        .ck-inline-report-button::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;

          padding: 3px;
          border-radius: 7px;

          background: conic-gradient(
            from var(--ck-inline-angle),
            #f59255,
            #f59255 20%,
            transparent 60%
          );

          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);

          -webkit-mask-composite: xor;
          mask-composite: exclude;

          animation: ckInlineRotateBorder 2.5s linear infinite;
          pointer-events: none;
        }

        .ck-inline-report-button::after {
          content: "";
          position: absolute;
          inset: 2px;
          z-index: 2;
          background: #000;
          border-radius: 5px;
          pointer-events: none;
        }

        .ck-inline-toast-wrapper {
          position: fixed;
          top: 20px;
          left: 50%;
          z-index: 999999;
          transform: translateX(-50%);
          animation: ckInlineToastSlide 300ms ease-out;
        }

        .ck-inline-toast {
          width: max-content;
          min-width: 280px;
          max-width: 90vw;
          padding: 12px 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
        }

        .ck-inline-toast-error {
          background: #dc2626;
        }

        .ck-inline-toast-success {
          background: #16a34a;
        }

        .ck-inline-toast-close {
          margin: 0 0 0 auto;
          padding: 0;
          border: none;
          outline: none;
          background: transparent;
          color: #fff;
          font-size: 20px;
          line-height: 1;
          cursor: pointer;
        }

        @keyframes ckInlineRotateBorder {
          from {
            --ck-inline-angle: 0deg;
          }

          to {
            --ck-inline-angle: 360deg;
          }
        }

        @keyframes ckInlineToastSlide {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }

          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        /*
         * Mobile and tablet:
         * button occupies the complete second grid column.
         * Therefore its width is exactly equal to the mobile input.
         */
        @media (max-width: 768px) {
          .ck-inline-report-grid {
            grid-template-columns: 105px minmax(0, 1fr);
            column-gap: 12px;
          }

          .ck-inline-report-button {
            width: 100%;
            max-width: none;
            min-width: 0;
            justify-self: stretch;
            align-self: stretch;
            margin: 0;
            padding-left: 8px;
            padding-right: 8px;
            transform: none;
          }

          .ck-inline-price {
            justify-content: flex-end;
          }
        }

        @media (max-width: 380px) {
          .ck-inline-report-grid {
            grid-template-columns: 96px minmax(0, 1fr);
            column-gap: 10px;
          }

          .ck-inline-mobile-input {
            padding-left: 1rem;
            padding-right: 1rem;
            letter-spacing: 3px;
          }

          .ck-inline-report-button {
            font-size: 13px;
          }

          .ck-inline-price {
            font-size: 19px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ck-inline-report-button::before {
            animation: none;
          }

          .ck-inline-toast-wrapper {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}