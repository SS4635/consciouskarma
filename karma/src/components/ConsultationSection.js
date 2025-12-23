import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ConsultationSection() {
  return (
    <section className="d-flex align-items-center justify-content-center bg-black text-white">
      <div className="container py-5">
        <div className="text-center mx-auto" style={{ maxWidth: "800px" }}>
          
          {/* Main Description */}
          <div
            className="text-start mx-auto"
            style={{ display: "inline-block", textAlign: "left" }}
          >
            <p className="fs-4 fw-light mb-3">
              At Conscious Karma, we understand what an
              <br className="d-none d-md-block" />
              aligned number can bring to a person's life.
            </p>

            {/* <p className="fs-4 fw-light mb-4">
              Our consultation is designed to help you find 
              that alignment –
            </p> */}

            {/* PROCESS LIST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

  {/* Item 1 */}
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
    <div style={{ flexShrink: 0, marginTop: '5px' }}>
      <i className="bi bi-clipboard-check text-[#ff6b35]" style={{ fontSize: '1rem' }}></i>
    </div>
    <span className="fs-4 fw-light">
      Beginning with a discovery form,
    </span>
  </div>

  {/* Item 2 */}
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
    <div style={{ flexShrink: 0, marginTop: '5px' }}>
      <i className="bi bi-camera-video text-[#ff6b35]" style={{ fontSize: '1rem' }}></i>
    </div>
    <span className="fs-4 fw-light">
      Moving to a focused 25-minute video call,
    </span>
  </div>

  {/* Item 3 */}
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
    <div style={{ flexShrink: 0, marginTop: '5px' }}>
      <i className="bi bi-chat-dots text-[#ff6b35]" style={{ fontSize: '1rem' }}></i>
    </div>
    <span className="fs-4 fw-light">
      Followed continued guidance on chat,
    </span>
  </div>

  {/* Item 4 */}
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
    <div style={{ flexShrink: 0, marginTop: '5px' }}>
      <i className="bi bi-check-circle text-[#ff6b35]" style={{ fontSize: '1rem' }}></i>
    </div>
    <span className="fs-4 fw-light">
      Until the right number is chosen.
    </span>
  </div>

</div>
          </div>

          {/* CTA */}
          <div className="mt-4">
            <h2 className="fw-light mb-1" style={{ color: "#ff6b35" }}>
              Change your number
            </h2>
            <h2 className="fw-light" style={{ color: "#ff6b35" }}>
              Change your destiny
            </h2>
          </div>
        </div>
      </div>

      {/* INLINE STYLES */}
      <style>{`
        .process-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .icon-wrap {
          width: 28px;
          display: flex;
          justify-content: center;
          flex-shrink: 0;
          font-size: 1.5rem;
        }

        @media (max-width: 768px) {
          .process-row {
            align-items: flex-start;
          }
        }
      `}</style>
    </section>
  );
}
