// src/components/OTPVerificationStep.jsx
import React, { useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * Props:
 * items: [
 *   { key: "primary", label: "Primary Number", phone: "+91 8506952947", otp: "1234", verified: true }
 * ]
 * onOtpChange: (key, otp) => void
 * onVerify: async (key) => void
 */
export default function OTPVerificationStep({
  items = [],
  onOtpChange,
  onVerify,
  className = "",
}) {
  const allVerified = useMemo(
    () => items.length > 0 && items.every((x) => !!x.verified),
    [items]
  );

  return (
    <div className={`${className} font-arsenal`}>
      <style>{`
        .otp-wrap *{ font-family:"Arsenal", sans-serif; }

        .otp-title {
          font-size: 34px;
          font-weight: 300;
          text-align: center;          /* FIX: center title */
          margin: 0 0 1.2rem 0;
        }

        .otp-section-label{
          font-size: 18px;
          font-weight: 300;
          margin: 1.1rem 0 0.6rem;
          color:#fff;
        }

        .otp-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1.5px solid #666;
          border-radius: 12px;
          padding: 0.65rem 0.9rem;
          color: #fff;
          font-size: 1rem;
          height: 46px;
          transition: all .25s ease;
        }
        .otp-input:focus{
          outline:none;
          border-color:#ff6b35;
          box-shadow:0 0 0 .2rem rgba(255,107,53,.18);
        }

        .otp-row {
          display: flex;
          gap: 14px;
          align-items: stretch;
          flex-wrap: wrap;
        }

        .otp-row .otp-input.phone {
          flex: 1 1 260px;
          opacity: 0.9;
        }

        .otp-row .otp-input.otp {
          flex: 1 1 180px;
          min-width: 160px;
          letter-spacing: 2px;
        }

        .otp-verify-btn{
          flex: 0 0 140px;
          min-width: 130px;
          height: 46px;
          border-radius: 12px;
          border: 1.5px solid #666;
          background: transparent;
          color: #ff6b35;
          font-size: 18px;
          font-weight: 300;
          transition: all .25s ease;
        }
        .otp-verify-btn:hover{
          border-color:#ff6b35;
          background: rgba(255,107,53,.08);
        }

        /* FIX: Verified becomes FULL orange */
        .otp-verify-btn.verified{
          background:#ff6b35;
          border-color:#ff6b35;
          color:#fff;
          opacity: 1 !important;
        }

        .otp-verify-btn:disabled{
          opacity: .55;
          cursor: not-allowed;
        }

        /* FIX: if it's verified AND disabled, keep it orange */
        .otp-verify-btn.verified:disabled{
          opacity: 1 !important;
        }

        .otp-hint{
          margin-top: 16px;
          color: ${allVerified ? "#b9ffb9" : "#999"};
          font-size: 14px;
          font-weight: 300;
          text-align: center;
        }

        @media (max-width: 576px){
          .otp-title{ font-size: 30px; }
          .otp-verify-btn{ flex: 1 1 100%; min-width: 100%; }
        }
      `}</style>

      <div className="otp-wrap">
        <h1 className="otp-title">OTP Verification</h1>

        {items.map((it) => (
          <div key={it.key}>
            <div className="otp-section-label">{it.label}</div>

            <input className="otp-input phone" value={it.phone || ""} readOnly />

            <div className="otp-row mt-3">
              <input
                className="otp-input otp"
                placeholder="Enter OTP"
                inputMode="numeric"
                value={it.otp || ""}
                onChange={(e) => onOtpChange?.(it.key, e.target.value)}
                disabled={!!it.verified}
              />

              <button
                type="button"
                className={`otp-verify-btn ${it.verified ? "verified" : ""}`}
                onClick={() => onVerify?.(it.key)}
                disabled={!!it.verified || !(it.otp || "").trim()}
              >
                {it.verified ? "Verified" : "Verify"}
              </button>
            </div>
          </div>
        ))}

        <div className="otp-hint">
          {allVerified
            ? "All numbers verified. You can proceed."
            : "Verify all numbers to proceed."}
        </div>
      </div>
    </div>
  );
}
