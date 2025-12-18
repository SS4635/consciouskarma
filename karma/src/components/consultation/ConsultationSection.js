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
              `}
            </style>
            <div className="d-flex flex-column gap-2 consultation-container">
              <p
                className="fs-3 fw-light mb-0 d-flex align-items-center consultation-text font-arsenal"
                style={{
                  color: "#ff6b35",
                }}
              >
                <i
                  className="bi bi-clipboard-check me-2 me-md-3 text-white consultation-icon"
                  style={{ fontSize: "2rem", flexShrink: 0 }}
                ></i>
                <span>Beginning with a discovery form,</span>
              </p>

              <p
                className="fs-3 fw-light mb-0 d-flex align-items-center consultation-text font-arsenal"
                style={{
                  color: "#ff6b35",
                }}
              >
                <i
                  className="bi bi-camera-video me-2 me-md-3 text-white consultation-icon"
                  style={{ fontSize: "2rem", flexShrink: 0 }}
                ></i>
                <span>Moving to a focused 25-minute video call,</span>
              </p>

              <p
                className="fs-3 fw-light mb-0 d-flex align-items-center consultation-text font-arsenal"
                style={{
                  color: "#ff6b35",
                }}
              >
                <i
                  className="bi bi-chat-dots me-2 me-md-3 text-white consultation-icon"
                  style={{ fontSize: "2rem", flexShrink: 0 }}
                ></i>
                <span>Followed continued guidance on chat,</span>
              </p>

              <p
                className="fs-3 fw-light d-flex align-items-center consultation-text font-arsenal"
                style={{
                  color: "#ff6b35",
                }}
              >
                <i
                  className="bi bi-check-circle me-2 me-md-3 text-white consultation-icon"
                  style={{ fontSize: "2rem", flexShrink: 0 }}
                ></i>
                <span>Until the right number is chosen.</span>
              </p>
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
