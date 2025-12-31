import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ConsultationSection() {
  return (
    <section className="position-relative d-flex align-items-center justify-content-center bg-black text-white font-arsenal">
      <div
        className="container"
        style={{ paddingTop: "10rem", paddingBottom: "10rem" }}
      >
        <div className="text-center mx-auto" style={{ maxWidth: "800px" }}>
          
          {/* Main Description */}
          <div
            className="text-center mx-auto"
            style={{ display: "inline-block", textAlign: "center" }}
          >
            <p className="fs-4 fs-md-4 fw-light mb-3 font-arsenal">
              At Conscious Karma, we understand what an
              <br className="d-none d-md-block" />
              aligned number can bring to a person's life.
              <br className="d-none d-md-block" />
            </p>
            <p className="fs-4 fs-md-4 fw-light mb-4 mt-4 font-arsenal">
              {" "}
              Our consultation is designed to help you find &nbsp;
              <br className="d-none d-md-block" />
              that alignment –
            </p>

            <style>
              {`
                .consultation-text {
                  white-space: normal;
                  font-size: 1.75rem;
                }
                
                .consultation-icon {
                  font-size: 2rem;
                }
                
                .consultation-container {
                  padding: 0;
                }
                
                /* Desktop: Keep text on one line if possible */
                @media (min-width: 769px) {
                  .consultation-text {
                    white-space: nowrap;
                  }
                }
                
                /* Mobile tweaks */
                @media (max-width: 768px) {
                  .consultation-text {
                    font-size: 1.5rem !important;
                    padding-left: 1rem !important;
                    padding-right: 1rem !important;
                  }
                  .consultation-icon {
                    font-size: 2rem !important;
                  }
                  .consultation-container {
                    padding-left: 0.5rem;
                    padding-right: 0.5rem;
                  }
                }
                
                @media (max-width: 576px) {
                  .consultation-text {
                    font-size: 1.35rem !important;
                    padding-left: 0.75rem !important;
                    padding-right: 0.75rem !important;
                  }
                  .consultation-icon {
                    font-size: 1.85rem !important;
                  }
                }
              `}
            </style>
            
            {/* UPDATED CONTAINER: 
               1. d-inline-flex: Makes the div shrink to fit the content.
               2. flex-column: Stacks items vertically.
               3. text-start: Ensures text aligns left relative to the icon.
               4. mx-auto: Centers the whole block in the parent.
            */}
            <div className="d-inline-flex flex-column gap-3 consultation-container text-start mx-auto">
              
              {/* Step 1 */}
              <div className="d-flex align-items-center">
                <i
                  className="bi bi-clipboard-check text-white me-3 consultation-icon"
                  style={{ flexShrink: 0 }}
                ></i>
                <span
                  className="fw-light font-arsenal consultation-text"
                  style={{
                    color: "#ff6b35",
                    lineHeight: "1.3",
                  }}
                >
                  Beginning with a discovery form,
                </span>
              </div>

              {/* Step 2 */}
              <div className="d-flex align-items-center">
                <i
                  className="bi bi-camera-video text-white me-3 consultation-icon"
                  style={{ flexShrink: 0 }}
                ></i>
                <span
                  className="fw-light font-arsenal consultation-text"
                  style={{
                    color: "#ff6b35",
                    lineHeight: "1.3",
                  }}
                >
                  Focused 25-minute video call,
                </span>
              </div>

              {/* Step 3 */}
              <div className="d-flex align-items-center">
                <i
                  className="bi bi-chat-dots text-white me-3 consultation-icon"
                  style={{ flexShrink: 0 }}
                ></i>
                <span
                  className="fw-light font-arsenal consultation-text"
                  style={{
                    color: "#ff6b35",
                    lineHeight: "1.3",
                  }}
                >
                  Continued guidance via chat,
                </span>
              </div>

              {/* Step 4 */}
              <div className="d-flex align-items-center">
                <i
                  className="bi bi-check-circle text-white me-3 consultation-icon"
                  style={{ flexShrink: 0 }}
                ></i>
                <span
                  className="fw-light font-arsenal consultation-text"
                  style={{
                    color: "#ff6b35",
                    lineHeight: "1.3",
                  }}
                >
                  Until the right number is chosen.
                </span>
              </div>
            </div>
          </div>

          {/* CTA Text */}
          <div className="mt-5">
            <h2
              className="fw-light mb-1 font-arsenal"
              style={{ color: "white" }}
            >
              Change your number
            </h2>
            <h2 className="fw-light font-arsenal" style={{ color: "white" }}>
              Change your destiny
            </h2>
          </div>
        </div>
      </div>

      {/* Gradient line separator */}
      <div
        className="position-absolute bottom-0 start-0 end-0"
        style={{
          height: "4px",
          background: "linear-gradient(to right, #bbb, #444, #222)",
          opacity: "0.5",
        }}
      />
    </section>
  );
}