import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ElectricBorder from "../ElectricBorder.jsx";

function SubsectionSpacer({ small = false }) {
  return (
    <div
      className={
        small
          ? "h-[18px] md:h-[24px]"
          : "h-[24px] md:h-[32px]"
      }
    />
  );
}

const FeatureTag = ({ text, className = "" }) => {
  return (
    <div className={`unique-tag-shell ${className}`}>
      <ElectricBorder
        color="#f59255"
        speed={2.1}
        chaos={0.5}
        thickness={1}
        style={{
          borderRadius: 16,
          width: "max-content",
          maxWidth: "100%",
        }}
      >
        <div className="unique-tag">
          <p className="unique-tag-text">{text}</p>
        </div>
      </ElectricBorder>
    </div>
  );
};

export default function UniqueLifeDesign() {
  return (
    <section className="unique-section bg-black text-white">
      <div className="unique-container text-center">
        {/* Header */}
        <div className="unique-heading-wrapper">
          <h1 className="unique-title">
            Every person is unique
          </h1>

          <h2 className="unique-title">
            So are the needs of their life
          </h2>
        </div>

        <SubsectionSpacer />

        {/* Intro */}
        <div className="unique-intro">
          <p className="unique-text">
            A student, a professional, an entrepreneur,
          </p>

          <p className="unique-text">
            a homemaker, an elder –
          </p>

          <p className="unique-text">
            each role calls for different strengths.
          </p>
        </div>

        <SubsectionSpacer />

        {/* Feature tags */}
        <div className="unique-features-wrapper">
          <div className="unique-feature-row unique-row-one">
            <FeatureTag text="Reducing stress" />
            <FeatureTag text="Closing clients" />
            <FeatureTag text="Love & support" />
          </div>

          <div className="unique-feature-row unique-row-two">
            <FeatureTag text="Discipline & focus" />
            <FeatureTag text="Unlocking motivation" />
          </div>

          <div className="unique-feature-row unique-row-three">
            <FeatureTag text="Recognition & success" />
            <FeatureTag text="Growth & confidence" />
          </div>
        </div>

        <SubsectionSpacer />

        {/* Footer */}
        <div className="unique-footer-text">
          <p className="unique-footer-heading">
            Consciously chosen,
          </p>

          <p className="unique-text">
            A mobile number can amplify good phases,
          </p>

          <p className="unique-text">
            and ease the path in times of challenge.
          </p>
        </div>
      </div>

      <style>{`
        .unique-section {
          width: 100%;
          margin: 0;
          padding: 0 8px;
          overflow-x: hidden;
        }

        /*
         * Bootstrap container class is intentionally not used,
         * because it adds unwanted horizontal gutters.
         */
        .unique-container {
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
          padding: 0;
        }

        .unique-heading-wrapper,
        .unique-intro,
        .unique-footer-text {
          width: 100%;
          margin: 0;
          padding: 0;
        }

        .unique-title {
          margin: 0;
          padding: 0;
          color: #ffffff;
          font-family: Arsenal, sans-serif;
          font-size: 28px;
          font-weight: 300;
          line-height: 1.25;
        }

        .unique-text {
          margin: 0;
          padding: 0;
          color: rgba(255, 255, 255, 0.92);
          font-family: Arsenal, sans-serif;
          font-size: 20px;
          font-weight: 300;
          line-height: 1.35;
        }

        .unique-footer-heading {
          margin: 0 0 4px;
          padding: 0;
          color: #ffffff;
          font-family: Arsenal, sans-serif;
          font-size: 24px;
          font-weight: 300;
          line-height: 1.25;
        }

        .unique-features-wrapper {
          width: 100%;
          margin: 0 auto;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .unique-feature-row {
          width: 100%;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: nowrap;
          gap: 14px;
        }

        /* Slight natural misalignment like reference */
        .unique-row-one {
          transform: translateX(-8px);
        }

        .unique-row-two {
          transform: translateX(14px);
        }

        .unique-row-three {
          transform: translateX(-5px);
        }

        .unique-tag-shell {
          width: max-content;
          max-width: 100%;
          flex: 0 0 auto;
          margin: 0;
          padding: 0;
          display: inline-flex;
        }

        .unique-tag {
          width: max-content;
          max-width: 100%;
          margin: 0;
          padding: 9px 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .unique-tag-text {
          margin: 0;
          padding: 0;
          color: rgba(255, 255, 255, 0.88);
          font-family: Arsenal, sans-serif;
          font-size: 20px;
          font-weight: 300;
          line-height: 1.1;
          text-align: center;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .unique-section {
            padding-left: 5px;
            padding-right: 5px;
          }

          .unique-title {
            font-size: 24px;
          }

          .unique-text {
            font-size: 18px;
          }

          .unique-footer-heading {
            font-size: 22px;
          }

          .unique-features-wrapper {
            gap: 10px;
          }

          .unique-feature-row {
            gap: 8px;
          }

          .unique-row-one {
            transform: translateX(-3px);
          }

          .unique-row-two {
            transform: translateX(7px);
          }

          .unique-row-three {
            transform: translateX(-3px);
          }

          .unique-tag {
            padding: 7px 10px;
          }

          .unique-tag-text {
            font-size: clamp(12px, 2.8vw, 16px);
          }
        }

        @media (max-width: 480px) {
          .unique-section {
            padding-left: 3px;
            padding-right: 3px;
          }

          .unique-title {
            font-size: 22px;
            line-height: 1.2;
          }

          .unique-text {
            font-size: 17px;
            line-height: 1.3;
          }

          .unique-footer-heading {
            font-size: 21px;
          }

          .unique-features-wrapper {
            gap: 8px;
          }

          .unique-feature-row {
            gap: 6px;
          }

          .unique-tag {
            padding: 6px 7px;
          }

          .unique-tag-text {
            font-size: clamp(10px, 2.75vw, 13px);
            line-height: 1;
          }
        }

        @media (max-width: 380px) {
          .unique-section {
            padding-left: 2px;
            padding-right: 2px;
          }

          .unique-feature-row {
            gap: 4px;
          }

          .unique-tag {
            padding: 5px 5px;
          }

          .unique-tag-text {
            font-size: clamp(9px, 2.7vw, 12px);
          }

          .unique-row-one {
            transform: translateX(-1px);
          }

          .unique-row-two {
            transform: translateX(3px);
          }

          .unique-row-three {
            transform: translateX(-1px);
          }
        }
      `}</style>
    </section>
  );
}