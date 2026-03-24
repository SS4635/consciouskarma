import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ElectricBorder from "../ElectricBorder.jsx";
import { motion } from "framer-motion";

function SubsectionSpacer() {
  return <div style={{ height: "48px" }} />;
}

const FeatureTag = ({ text }) => (
  <div className="feature-tag-item">
    <ElectricBorder
      color="#f59255"
      speed={2.1}
      chaos={0.5}
      thickness={1}
      style={{
        borderRadius: 16,
        width: "100%",
        background: "transparent",
        boxShadow: "none",
        filter: "none",
      }}
    >
      <div className="unique-tag">
        <p className="unique-tag-text">{text}</p>
      </div>
    </ElectricBorder>
  </div>
);

export default function UniqueLifeDesign() {
  return (
    <div className="bg-black text-white unique-life-design-section">
      <div className="container text-center py-4">
        <h1
          className="fw-light unique-title mb-0"
          style={{ fontSize: "clamp(22px, 4vw, 30px)" }}
        >
          Every person is unique
        </h1>
        <h2
          className="fw-light unique-title mb-0"
          style={{ fontSize: "clamp(22px, 4vw, 30px)" }}
        >
          So are the needs of their life
        </h2>

        <SubsectionSpacer />

        <p
          className="fw-light unique-text mb-0 font-arsenal"
          style={{ fontSize: "clamp(18px, 2.5vw, 22px)" }}
        >
          A student, a professional, an entrepreneur,
        </p>
        <p
          className="fw-light unique-text mb-0 font-arsenal"
          style={{ fontSize: "clamp(18px, 2.5vw, 22px)" }}
        >
          a homemaker, an elder –
        </p>
        <p
          className="fw-light unique-text mb-0 font-arsenal"
          style={{ fontSize: "clamp(18px, 2.5vw, 22px)" }}
        >
          each role calls for different strengths.
        </p>

        <SubsectionSpacer />

        <div className="unique-features-wrapper mx-auto">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="unique-feature-row row-3-fixed"
          >
            <FeatureTag text="Reducing stress" />
            <FeatureTag text="Closing clients" />
            <FeatureTag text="Love & support" />
          </motion.div>

          <motion.div
            initial={{ x: 40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="unique-feature-row row-2-fixed"
          >
            <FeatureTag text="Discipline & focus" />
            <FeatureTag text="Unlocking motivation" />
          </motion.div>

          <motion.div
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="unique-feature-row row-2-fixed"
          >
            <FeatureTag text="Recognition & success" />
            <FeatureTag text="Growth & confidence" />
          </motion.div>
        </div>

        <SubsectionSpacer />

        <div>
          <p
            className="fw-light unique-text mb-0 font-arsenal"
            style={{ fontSize: "clamp(18px, 2.5vw, 22px)" }}
          >
            Consciously chosen,
          </p>
          <p
            className="fw-light unique-text mb-0 font-arsenal"
            style={{ fontSize: "clamp(18px, 2.5vw, 22px)" }}
          >
            A mobile number can amplify good phases,
          </p>
          <p
            className="fw-light unique-text mb-0 font-arsenal"
            style={{ fontSize: "clamp(18px, 2.5vw, 22px)" }}
          >
            and ease the path in times of challenge.
          </p>
        </div>
      </div>

      <style>{`
        .unique-life-design-section {
          overflow-x: hidden;
          width: 100%;
          background: transparent !important;
        }

        .unique-text {
          line-height: 1.5;
        }

        .unique-features-wrapper {
          width: 100%;
          max-width: 920px;
          margin: 0 auto;
          padding: 0 12px;
          box-sizing: border-box;
          overflow: visible;
          background: transparent !important;
          box-shadow: none !important;
          filter: none !important;
          border: none !important;
        }

        .unique-feature-row {
          display: flex;
          justify-content: center;
          align-items: stretch;
          gap: 16px;
          margin-bottom: 20px;
          width: 100%;
          flex-wrap: nowrap;
          background: transparent !important;
          box-shadow: none !important;
          filter: none !important;
          border: none !important;
        }

        .feature-tag-item {
          display: flex;
          min-width: 0;
          box-sizing: border-box;
          background: transparent !important;
          box-shadow: none !important;
          filter: none !important;
          border: none !important;
        }

        .row-3-fixed .feature-tag-item {
          width: calc((100% - 32px) / 3);
          max-width: calc((100% - 32px) / 3);
          flex: 0 0 calc((100% - 32px) / 3);
        }

        .row-2-fixed .feature-tag-item {
          width: calc((100% - 16px) / 2);
          max-width: calc((100% - 16px) / 2);
          flex: 0 0 calc((100% - 16px) / 2);
        }

        .unique-tag {
          min-height: 56px;
          width: 100%;
          padding: 10px 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          box-sizing: border-box;
          background: transparent !important;
          box-shadow: none !important;
          filter: none !important;
          border: none !important;
        }

        .unique-tag-text {
          margin: 0;
          font-size: 18px;
          line-height: 1.2;
          opacity: 0.88;
          white-space: normal;
          word-break: break-word;
          overflow-wrap: anywhere;
          text-align: center;
        }

        @media (max-width: 991px) {
          .unique-features-wrapper {
            padding: 0 10px;
          }

          .unique-feature-row {
            gap: 12px;
            margin-bottom: 16px;
          }

          .row-3-fixed .feature-tag-item {
            width: calc((100% - 24px) / 3);
            max-width: calc((100% - 24px) / 3);
            flex: 0 0 calc((100% - 24px) / 3);
          }

          .row-2-fixed .feature-tag-item {
            width: calc((100% - 12px) / 2);
            max-width: calc((100% - 12px) / 2);
            flex: 0 0 calc((100% - 12px) / 2);
          }

          .unique-tag {
            min-height: 52px;
            padding: 10px 14px;
          }

          .unique-tag-text {
            font-size: 16px;
          }
        }

        @media (max-width: 576px) {
          .unique-features-wrapper {
            padding: 0 8px;
          }

          .unique-feature-row {
            gap: 8px;
            margin-bottom: 12px;
          }

          .row-3-fixed .feature-tag-item {
            width: calc((100% - 16px) / 3);
            max-width: calc((100% - 16px) / 3);
            flex: 0 0 calc((100% - 16px) / 3);
          }

          .row-2-fixed .feature-tag-item {
            width: calc((100% - 8px) / 2);
            max-width: calc((100% - 8px) / 2);
            flex: 0 0 calc((100% - 8px) / 2);
          }

          .unique-tag {
            min-height: 44px;
            padding: 8px 8px;
            border-radius: 12px;
          }

          .unique-tag-text {
            font-size: 13px;
            line-height: 1.15;
          }

          .unique-text {
            line-height: 1.6;
          }
        }

        @media (max-width: 400px) {
          .unique-features-wrapper {
            padding: 0 6px;
          }

          .unique-feature-row {
            gap: 6px;
          }

          .row-3-fixed .feature-tag-item {
            width: calc((100% - 12px) / 3);
            max-width: calc((100% - 12px) / 3);
            flex: 0 0 calc((100% - 12px) / 3);
          }

          .row-2-fixed .feature-tag-item {
            width: calc((100% - 6px) / 2);
            max-width: calc((100% - 6px) / 2);
            flex: 0 0 calc((100% - 6px) / 2);
          }

          .unique-tag {
            min-height: 40px;
            padding: 7px 6px;
          }

          .unique-tag-text {
            font-size: 12px;
            line-height: 1.1;
          }
        }
      `}</style>
    </div>
  );
}