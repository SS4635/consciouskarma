import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function SubsectionSpacer() {
  return <div style={{ height: "36px" }} />;
}

export default function ConsultationSection() {
  return (
    <section className="position-relative bg-black text-white font-arsenal">
      <div
        className="container"
        style={{ padding: 0 }}
      >
        <div className="text-center mx-auto" style={{ maxWidth: "800px" }}>
          
         
          <div
            className="text-center mx-auto"
            style={{ display: "inline-block", textAlign: "center" }}
          >
            <p className="fw-light mb-0 font-arsenal " style={{ fontSize: "clamp(20px, 4vw, 30px)",paddingLeft:"18px",paddingRight:"18px"}}> 
              At Conscious Karma, we understand what an
              <br className="d-none d-md-block" />
              aligned number can bring to a person's life.
            </p>

            <SubsectionSpacer />

            <p className=" mb-0 mt-0 font-arsenal " style={{ fontSize: "clamp(20px, 4vw, 30px)" ,paddingLeft:"18px",paddingRight:"18px"}}>
              {" "}
              Our consultation is designed to help you find &nbsp;
              <br className="d-none d-md-block" />
              that alignment –
            </p>

            <SubsectionSpacer />

            <style>
              {`
                .consultation-text {
                  white-space: normal;
                  font-size: clamp(20px, 2.7vw, 22px);
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
                    font-size: clamp(20px, 3vw, 22px) !important;
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
                    font-size: clamp(20px, 3.5vw, 20px) !important;
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
                  className="font-arsenal consultation-text"
                  style={{
                    color: "#FFFFFF",
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
                    color: "#FFFFFF",
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
                    color: "#FFFFFF",
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
                    color: "#FFFFFF",
                    lineHeight: "1.3",
                  }}
                >
                  Until the right number is chosen.
                </span>
              </div>
            </div>
          </div>

          <SubsectionSpacer />

          {/* CTA Text */}
          <div className="">
            <h2
              className="fw-light mb-0 font-balgin"
              style={{ color: "#f59255", fontSize: "clamp(25px, 4vw, 28px)" }}
            >
              Change your number
            </h2>
            <h2 className="fw-light font-balgin mb-0" style={{ color: "#f59255", fontSize: "clamp(25px, 4vw, 28px)" }}>
              Change your destiny
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}