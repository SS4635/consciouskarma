import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ElectricBorder from "../ElectricBorder.jsx";

const FeatureTag = ({ text }) => (
  <ElectricBorder
    color="#ff6b35"
    speed={2.1}
    chaos={0.5}
    thickness={1}
    style={{ borderRadius: 16 }}
  >
    <div className="unique-tag">
      <p className="unique-tag-text">{text}</p>
    </div>
  </ElectricBorder>
);

export default function UniqueLifeDesign() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-black text-white mt-5">
      <div className="container text-center">

        {/* Header */}
        <h1 className="fw-light unique-title mb-2">
          Every person is unique
        </h1>
        <h2 className="fw-light unique-title mb-4">
          So are the needs of their life
        </h2>

        {/* Role text */}
        <p className="fw-light unique-text mb-0">
          A student, a professional, an entrepreneur,
        </p>
        <p className="fw-light unique-text mb-0">
          a homemaker, an elder –
        </p>
        <p className="fw-light unique-text mb-5">
          each role calls for different strengths.
        </p>

        {/* FEATURES */}
        <div className="unique-features-wrapper mx-auto">

          {/* Row 1 – 3 */}
          <div className="unique-feature-row row-3">
            <FeatureTag text="Reducing stress" />
            <FeatureTag text="Closing clients" />
            <FeatureTag text="Love & support" />
          </div>

          

          {/* Row 3 – 2 */}
          <div className="unique-feature-row row-2">
            <FeatureTag text="Discipline & focus" />
            <FeatureTag text="Unlocking motivation" />
          </div>

          {/* Row 4 – 2 */}
          <div className="unique-feature-row row-2">
            <FeatureTag text="Recognition & success" />
            <FeatureTag text="Growth & confidence" />
          </div>

        </div>

        {/* Footer text */}
        <div className="mt-5">
          <p className="fw-light unique-text mb-1">
            Consciously chosen,
          </p>
          <p className="fw-light unique-text mb-1">
            A mobile number can amplify good phases,
          </p>
          <p className="fw-light unique-text">
            and ease the path in times of challenge
          </p>
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        /* =====================
           DESKTOP / DEFAULT
        ====================== */

        .unique-title {
          font-size: 24px;
        }

        .unique-text {
          font-size: 18px;
        }

        .unique-features-wrapper {
          max-width: 900px;
        }

        .unique-feature-row {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .unique-tag {
          height: 34px;
          padding: 0 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .unique-tag-text {
          margin: 0;
          font-size: 18px;
          opacity: 0.85;
          white-space: nowrap;
        }

        /* =====================
           MOBILE ONLY
        ====================== */

        @media (max-width: 768px) {
          .unique-title {
            font-size: 28px;
          }

          .unique-text {
            font-size: 20px;
          }

          .unique-feature-row {
            gap: 10px;
            margin-bottom: 14px;
          }

          .row-3,
          .row-2 {
            flex-wrap: nowrap;
          }

          .row-1 {
            justify-content: center;
          }

          .unique-tag {
            height: 30px;        /* reduced height */
            padding: 0 18px;     /* reduced padding */
          }

          .unique-tag-text {
            font-size: 15px;
          }
        }

        /* =====================
           VERY SMALL PHONES
        ====================== */

        @media (max-width: 480px) {
          .unique-title {
            font-size: 26px;
          }

          .unique-text {
            font-size: 18px;
          }

          .unique-tag {
            height: 28px;
            padding: 0 14px;
          }

          .unique-tag-text {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
