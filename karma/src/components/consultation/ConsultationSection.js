// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// export default function ConsultationSection() {
//   return (
//     <section className="d-flex align-items-center justify-content-center bg-black text-white">
//       <div className="container py-5">
//         <div
//           className="text-center mx-auto"
//           style={{ maxWidth: '800px' }}
//         >
//           {/* Main Description */}
//           <div className="text-start mx-auto" style={{ display: 'inline-block', textAlign: 'left' }}>
//             <p className="fs-4 fs-md-4 fw-light mb-4">
//               At Conscious Karma, we understand what an<br className="d-none d-md-block" />
//               aligned number can bring to a person's life.<br className="d-none d-md-block" />
//               Our consultation is designed to help you find<br className="d-none d-md-block" />
//               that alignment –
//             </p>

//             {/* Process Description */}
//             <p className="fs-4 fs-md-4 fw-light mb-4">
//               beginning with a discovery form,<br className="d-none d-md-block" />
//               moving to a focused 25-minute video call,<br className="d-none d-md-block" />
//               followed continued guidance on chat<br className="d-none d-md-block" />
//               until the right number is chosen.
//             </p>
//           </div>

//           {/* CTA Text */}
//           <div className="mt-4">
//             <h2 className="fw-semibold mb-1" style={{ color: '#ff6b35' }}>
//               Change your number
//             </h2>
//             <h2 className="fw-semibold" style={{ color: '#ff6b35' }}>
//               Change your destiny
//             </h2>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }/

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
              Our consultation is designed to help you find
              <br className="d-none d-md-block" />
              that alignment –
            </p>

            {/* Process Description */}
            {/* <p className="fs-4 fs-md-4 fw-light mb-4">
              beginning with a discovery form,<br className="d-none d-md-block" />
              moving to a focused 25-minute video call,<br className="d-none d-md-block" />
              followed continued guidance on chat<br className="d-none d-md-block" />
              until the right number is chosen.
            </p> */}

            {/* <p className="fs-4 fs-md-4 fw-light mb-0">
              beginning with a discovery form,<br className="d-none d-md-block" /></p>
             <p className="fs-4 fs-md-4 fw-light mb-0 ">  moving to a focused 25-minute video call,<br className="d-none d-md-block" /> </p>
           <p className="fs-4 fs-md-4 fw-light mb-0 ">    followed continued guidance on chat<br className="d-none d-md-block" /> </p>
             <p className="fs-4 fs-md-4 fw-light ">  until the right number is chosen.
            </p> */}

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
                
                @media (min-width: 769px) {
                  .consultation-text {
                    white-space: nowrap;
                  }
                }
                
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
                  .consultation-container {
                    padding-left: 0.5rem;
                    padding-right: 0.5rem;
                  }
                }
                  @media (max-width: 768px) {
  .consultation-row {
    display: flex;
    align-items: center;
    justify-content: center; /* KEY FIX */
    gap: 12px;
    width: 100%;
    max-width: 360px;
    margin-left: auto;
    margin-right: auto;
  }

  .consultation-text {
    font-size: 1.4rem !important;
    line-height: 1.45;
    text-align: left;
    padding: 0 !important;
  }

  .consultation-icon {
    width: 26px;
    height: 26px;
    flex-shrink: 0;
  }
}

              `}
            </style>
            <div className="d-flex flex-column gap-3 consultation-container">
  {/* Step 1 */}
  <div className="d-flex align-items-center">
    <i
      className="bi bi-clipboard-check text-white me-3"
      style={{ fontSize: "1.5rem", flexShrink: 0 }}
    ></i>
    <span
      className="fw-light font-arsenal"
      style={{
        color: "#ff6b35",
        fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", // Mobile: 1.1rem, Desktop: 1.5rem
        lineHeight: "1.3",
      }}
    >
      Beginning with a discovery form,
    </span>
  </div>

  {/* Step 2 */}
  <div className="d-flex align-items-center">
    <i
      className="bi bi-camera-video text-white me-3"
      style={{ fontSize: "1.5rem", flexShrink: 0 }}
    ></i>
    <span
      className="fw-light font-arsenal"
      style={{
        color: "#ff6b35",
        fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
        lineHeight: "1.3",
      }}
    >
      Moving to a focused 25-minute video call,
    </span>
  </div>

  {/* Step 3 */}
  <div className="d-flex align-items-center">
    <i
      className="bi bi-chat-dots text-white me-3"
      style={{ fontSize: "1.5rem", flexShrink: 0 }}
    ></i>
    <span
      className="fw-light font-arsenal"
      style={{
        color: "#ff6b35",
        fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
        lineHeight: "1.3",
      }}
    >
      Followed continued guidance on chat,
    </span>
  </div>

  {/* Step 4 */}
  <div className="d-flex align-items-center">
    <i
      className="bi bi-check-circle text-white me-3"
      style={{ fontSize: "1.5rem", flexShrink: 0 }}
    ></i>
    <span
      className="fw-light font-arsenal"
      style={{
        color: "#ff6b35",
        fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
        lineHeight: "1.3",
      }}
    >
      Until the right number is chosen.
    </span>
  </div>
</div>
          </div>

          {/* CTA Text */}
          <div className="mt-4">
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
