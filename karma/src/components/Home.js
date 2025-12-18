// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// export default function UniqueLifeDesign() {
//   const features = [
//     ["Reducing stress", "Closing clients", "Love & support"],
//     ["Control Expenses", "Discipline & focus"],
//     ["Unlocking motivation", "Recognition & success"],
//   ];

//   return (
//     <div className="min-vh-100 d-flex align-items-center justify-content-center bg-black text-white p-4 ">
//       <div className="container text-center">
//         {/* Header */}
//         <h1 className="fw-light display-5 mb-2">Every person is unique</h1>
//         <h2 className="fw-light fs-2 mb-4">So are the needs of their life</h2>

//         {/* Role Section */}
//         <p className="fs-5 fw-light mb-0">A student, a professional, an entrepreneur,</p>
//         <p className="fs-5 fw-light mb-0">a homemaker, an elder -</p>
//         <p className="fs-5 fw-light mb-5">each role calls for different strengths.</p>

//         {/* Features */}
//         <div className="mx-auto" style={{ maxWidth: '900px' }}>
//           {features.map((row, rowIndex) => (
//             <div key={rowIndex} className="d-flex flex-wrap justify-content-center mb-3">
//               {row.map((text, index) => (
//                 <button
//                   key={index}
//                   type="button"
//                   className="btn btn-outline-light mx-2 mb-2 px-4 py-2 rounded-3"
//                   style={{
//                    border: "3px solid #ff6b35",
//                     color: 'white',
//                     transition: 'all 0.3s ease',
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.backgroundColor = '#ff6b35';
//                     e.target.style.transform = 'translateY(-2px)';
//                     e.target.style.boxShadow = '0 5px 15px rgba(255,107,53,0.3)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.backgroundColor = 'transparent';
//                     e.target.style.transform = 'translateY(0)';
//                     e.target.style.boxShadow = 'none';
//                   }}
//                 >
//                   {text}
//                 </button>
//               ))}
//             </div>
//           ))}
//         </div>

//         {/* Footer */}
//         <div className="mt-5">
//           <p className="fs-5 fw-light mb-1">Consciously chosen,</p>
//           <p className="fs-5 fw-light mb-1">A Mobile number can amplify good phases,</p>
//           <p className="fs-5 fw-light">and ease the path in times of challenge</p>
//         </div>
//       </div>
//     </div>
//   );
// }


import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ElectricBorder from '../ElectricBorder.jsx';

export default function UniqueLifeDesign() {
  const features = [
    ["Reducing stress", "Closing clients", "Love & support"],
    ["Control Expenses", "Discipline & focus"],
    ["Unlocking motivation", "Recognition & success"],
  ];

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-black text-white mt-5 ">
      <div className="container text-center">
        {/* Header */}
        <h1 className="fw-light mb-2" style={{ fontSize: '24px' }}>Every person is unique</h1>
        <h2 className="fw-light mb-4" style={{ fontSize: '24px' }}>So are the needs of their life</h2>

        {/* Role Section */}
        <p className="fw-light mb-0" style={{ fontSize: '18px' }}>A student, a professional, an entrepreneur,</p>
        <p className="fw-light mb-0" style={{ fontSize: '18px' }}>a homemaker, an elder -</p>
        <p className="fw-light mb-5" style={{ fontSize: '18px' }}>each role calls for different strengths.</p>

        {/* Features – reuse same ElectricBorder tag design as Personalized Report */}
        {/* <div className="mx-auto" style={{ maxWidth: '900px' }}>
          <div className="ck-tags-wrap">
            {features.map((row, rowIndex) => (
              <div key={rowIndex} className="ck-tags-row">
                {row.map((text, index) => (
                  <ElectricBorder
                    key={index}
                    color="#ff6b35"
                    speed={2.1}
                    chaos={0.5}
                    thickness={1}
                    style={{ borderRadius: 16 }}
                  >
                    <div style={{ height: '34px' }}>
                      <p
                        style={{
                          margin: '0px 0 0',
                          opacity: 0.8,
                          padding: '0 52px',
                          fontSize: '18px !important',
                        }}
                      >
                        {text}
                      </p>
                    </div>
                  </ElectricBorder>
                ))}
              </div>
            ))}
          </div>
        </div> */}


<div className="mx-auto max-w-[900px] px-3">
  <div className="ck-tags-wrap space-y-3">
    {features.map((row, rowIndex) => (
      <div
        key={rowIndex}
        className="ck-tags-row flex flex-wrap justify-center gap-3"
      >
        {row.map((text, index) => (
          <ElectricBorder
            key={index}
            color="#ff6b35"
            speed={2.1}
            chaos={0.5}
            thickness={1}
            style={{ borderRadius: 16 }}
          >
            <div className="h-[12px] sm:h-[34px] flex items-center px-4 sm:px-8 text-center">
              <p className="m-0 opacity-80 text-[10px] sm:text-[18px]">
                {text}
              </p>
            </div>
          </ElectricBorder>
        ))}
      </div>
    ))}
  </div>
</div>


        

        {/* Footer */}
        <div className="mt-5">
          <p className="fw-light mb-1" style={{ fontSize: '18px' }}>Consciously chosen,</p>
          <p className="fw-light mb-1" style={{ fontSize: '18px' }}>A Mobile number can amplify good phases,</p>
          <p className="fw-light" style={{ fontSize: '18px' }}>and ease the path in times of challenge</p>
        </div>
      </div>
    </div>
  );
}

