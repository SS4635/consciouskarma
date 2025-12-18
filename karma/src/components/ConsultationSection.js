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


import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ConsultationSection() {
  return (
    <section className="d-flex align-items-center justify-content-center bg-black text-white">
      <div className="container py-5">
        <div
          className="text-center mx-auto"
          style={{ maxWidth: '800px' }}
        >
          {/* Main Description */}
          <div className="text-start mx-auto" style={{ display: 'inline-block', textAlign: 'left' }}>
            <p className="fs-4 fs-md-4 fw-light mb-3">
              At Conscious Karma, we understand what an<br className="d-none d-md-block" />
              aligned number can bring to a person's life.<br className="d-none d-md-block" /></p>
            <p className="fs-4 fs-md-4 fw-light mb-4"> Our consultation is designed to help you find<br className="d-none d-md-block" />
              that alignment –</p>
            

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


            <div className="d-flex flex-column gap-1">

  <p className="fs-4 fs-md-4 fw-light mb-0 d-flex align-items-start">
    <i className="bi bi-clipboard-check me-2 text-[#ff6b35]"></i>
    beginning with a discovery form,
  </p>

  <p className="fs-4 fs-md-4 fw-light mb-0 d-flex align-items-start">
    <i className="bi bi-camera-video me-2 text-[#ff6b35]"></i>
    moving to a focused 25-minute video call,
  </p>

  <p className="fs-4 fs-md-4 fw-light mb-0 d-flex align-items-start">
    <i className="bi bi-chat-dots me-2 text-[#ff6b35]"></i>
    followed continued guidance on chat
  </p>

  <p className="fs-4 fs-md-4 fw-light d-flex align-items-start">
    <i className="bi bi-check-circle me-2 text-[#ff6b35]"></i>
    until the right number is chosen.
  </p>

</div>

          </div>

          {/* CTA Text */}
          <div className="mt-4">
            <h2 className="fw-light mb-1" style={{ color: '#ff6b35' }}>
              Change your number
            </h2>
            <h2 className="fw-light" style={{ color: '#ff6b35' }}>
              Change your destiny
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}

