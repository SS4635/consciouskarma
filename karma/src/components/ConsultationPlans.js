// import React, { useState } from "react";
// import ConsultationBookingForm from './ConsultationBookingForm';
// import "bootstrap/dist/css/bootstrap.min.css";

// export default function ConsultationPlans() {
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const plans = [
//     {
//       id: 1,
//       title: "Unmarried Individual",
//       price: "$ 2000",
//       description:
//         "For students, freelancers, or solo entrepreneurs",
//     },
//     {
//       id: 2,
//       title: "Married Individual",
//       price: "$ 2500",
//       description:
//         "For those whose number must be considered alongside a spouse or partner",
//     },
//     {
//       id: 3,
//       title: "Individual with Extended Compatibility",
//       price: "$ 3000",
//       description:
//         "For entrepreneurs, co-founders, or professionals requiring compatibility checks with up to 4 other people.",
//     },
//   ];

//   const handleSelect = (plan) => {
//     setSelectedPlan(plan);
//   };

//   const renderBooking = () => {
//     if (!selectedPlan) return null;
//     // Map plan to max steps: Unmarried=4, Married=5, Extended=6
//     let planMaxSteps = 6;
//     if (selectedPlan.title === 'Unmarried Individual') planMaxSteps = 4;
//     else if (selectedPlan.title === 'Married Individual') planMaxSteps = 5;
//     else if (selectedPlan.title === 'Individual with Extended Compatibility') planMaxSteps = 6;
//     return (
//       <div className="mt-5">
//         <ConsultationBookingForm maxSteps={planMaxSteps} />
//       </div>
//     );
//   };

//   return (
//     <section className=" bg-black text-white d-flex align-items-center py-5">
//       <div className="container">
//         {/* Header Section */}
//         <div className="text-center mb-5">
//           <h1 className="fw-light display-5 mb-3">Consultation Plans</h1>
//           <p className="fs-5 fw-light  mb-1">
//             Each plan is designed for one mobile number.
//           </p>
//           <p className="fs-6 fw-light ">
//             The depth of analysis varies with your alignment needs.
//           </p>
//         </div>

//         {selectedPlan && (
//           <div className="text-center mb-4">
//             <div className="mb-2 fw-light">
//               Selected Plan: <span className="fw-normal">{selectedPlan.title}</span> ({selectedPlan.price})
//             </div>
//             <button
//               className="btn btn-sm"
//               style={{border:'1.5px solid #ff6b35',background:'transparent',color:'#fff'}}
//               onClick={() => setSelectedPlan(null)}
//             >
//               Change Plan
//             </button>
//           </div>
//         )}

//         {/* Plans Section - hidden once a plan is selected */}
//         {!selectedPlan && (
//           <div className="row justify-content-center g-4">
//             {plans.map((plan) => (
//               <div key={plan.id} className="col-12 col-md-10 col-lg-7">
//                 <div
//                   className="rounded-4 p-4 h-100 text-white bg-transparent"
//                   style={{
//                     border: "3px solid #ff6b35",
//                     transition: "0.3s",
//                     cursor: 'pointer'
//                   }}
//                   onClick={() => handleSelect(plan)}
//                 >
//                   <div className="d-flex justify-content-between flex-wrap mb-3">
//                     <h3 className="fw-normal fs-4 mb-2 text-start">{plan.title}</h3>
//                     <span className="fw-semibold fs-4">{plan.price}</span>
//                   </div>
//                   <p className="fs-6 fw-light mb-0 text-start">
//                     {plan.description}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Booking Form appears after plan click */}
//         {renderBooking()}

//       </div>
//     </section>
//   );
// }


import React, { useState, useEffect } from "react";
import ConsultationBookingForm from './ConsultationBookingForm';
import "bootstrap/dist/css/bootstrap.min.css";
import "./consultationform.css"

export default function ConsultationPlans() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalOpening, setModalOpening] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // lock page scroll while modal is open to prevent double scrollbars
  useEffect(() => {
    if (showModal) {
      // Calculate scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Hide scroll but add padding to prevent shift
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // trigger enter animation next tick
      const id = setTimeout(() => setModalOpening(true), 20);
      return () => clearTimeout(id);
    } else {
      // IMPORTANT: explicitly reset overflow and padding
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0px';
      setModalOpening(false);
    }
  }, [showModal]);

  // detect mobile viewport for modal sizing/animation tweaks
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 576);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const closeModal = () => {
    // play exit animation then unmount
    setModalOpening(false);
    setTimeout(() => {
      setShowModal(false);
      setSelectedPlan(null);
    }, 220);
  };
  
  const plans = [
    {
      id: 1,
      title: "Unmarried Individual",
      price: " ₹1",
      description:
        "For students, freelancers, or solo nentrepreneurs",
    },
    {
      id: 2,
      title: "Married Individual",
      price: " ₹2500",
      description:
        "For those whose number must be considered alongside a spouse or partner",
    },
    {
      id: 3,
      title: "Individual with Extended Compatibility",
      price: " ₹3000",
       description:
    "For entrepreneurs, co-founders, or professionals requiring compatibility\nchecks with up to 4 other people.",
    },
  ];

  const handleSelect = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const renderBooking = () => {
    if (!selectedPlan) return null;
    // Map plan to max steps: Unmarried=4, Married=5, Extended=6
    let planMaxSteps = 6;
    if (selectedPlan.title === 'Unmarried Individual') planMaxSteps = 4;
    else if (selectedPlan.title === 'Married Individual') planMaxSteps = 5;
    else if (selectedPlan.title === 'Individual with Extended Compatibility') planMaxSteps = 6;
    return (
      <div className="">
        {/* pass selectedPlan so the form can display dynamic price/data; inModal makes the form compact for modal */}
        <ConsultationBookingForm maxSteps={planMaxSteps} selectedPlan={selectedPlan} inModal={true} />
      </div>
    );
  };

  return (
    <section className=" bg-black text-white d-flex align-items-center py-5">
      <div className="container">
        {/* Hide modal scrollbar visually but keep scrolling functional */}
        <style>{`
          .ck-modal-card { -ms-overflow-style: none; scrollbar-width: none; }
          .ck-modal-card::-webkit-scrollbar { display: none; width: 0; height: 0; }
          .ck-modal-backdrop { -ms-overflow-style: none; scrollbar-width: none; }
          .ck-modal-backdrop::-webkit-scrollbar { display: none; width: 0; height: 0; }
        `}</style>
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="fw-light display-5 mb-3">Consultation Plans</h1>
          <p className="fs-5 fw-light  mb-1">
            Each plan is designed for one mobile number.
          </p>
          <p className="fs-6 fw-light ">
            The depth of analysis varies with your alignment needs.
          </p>
        </div>

        {/* Plans Section - HAMESHA DIKHEGA */}
        <div className="row justify-content-center g-4">
          {plans.map((plan) => (
            <div key={plan.id} className="col-12 col-md-10 col-lg-7">
              <div
                className="rounded-4 p-4 h-100 text-white bg-transparent"
                style={{
                  borderBottom: "3px solid #ff6b35",
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderTop: 'none',
                  transition: "0.3s",
                  cursor: 'default',
                  position: 'relative',
                  paddingRight: '7.5rem',
                  paddingBottom: '3rem'
                }}
              >
                <div className="d-flex justify-content-between flex-wrap mb-3" >
                  <h3 className="fw-normal fs-4 mb-2 text-start">{plan.title}</h3>
                  <span className="fw-semibold fs-4">{plan.price}</span>
                </div>
                <p className="mb-8" style={{ whiteSpace: "pre-line" }}>
                  {plan.description}
                </p>
                {/* Book Now button at right corner */}
                <button
  type="button"
  className="ck-primary-btn"
  onClick={(e) => {
    e.stopPropagation();
    handleSelect(plan);
  }}
>
  Book Now
</button>

              </div>
            </div>
          ))}
        </div>

        {/* Modal popup for booking (animated) */}
        {showModal && selectedPlan && (
          <div
            className="ck-modal-backdrop"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              opacity: modalOpening ? 1 : 0,
              transition: 'opacity 400ms ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000,
              padding: '20px'
            }}
            onClick={closeModal}
          >
            <div
              className="ck-modal-card"
              style={{
                // make modal a bit smaller so it doesn't force a large scrollbar
                width: isMobile ? '94vw' : 'min(50vw, 440px)',
                background: '#000',
                border: '2px solid #ff6b35',
                borderRadius: 12,
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                // constrain the modal height but allow internal scrolling if content is tall
              height:'32rem',
                overflowY: 'auto',
                transform: modalOpening 
                  ? 'translateY(0) scale(1)'
                  : (isMobile ? 'translateY(14px) scale(0.98)' : 'scale(0.92)'),
                opacity: modalOpening ? 1 : 0.85,
                transition: isMobile 
                  ? 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease'
                  : 'transform 220ms ease, opacity 220ms ease'
              }}
              onClick={(ev) => ev.stopPropagation()}
            >
              {/* Compact modal: show only the booking form. Provide a small close control. */}
              <button
                aria-label="Close booking"
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: 10,
                  background: '#222',
                  color: '#fff',
                  border: '1px solid #444',
                  padding: '6px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                ✕
              </button>

              {/* Render the booking form inside modal */}
              <div style={{ marginTop: 8 }}>
                {renderBooking()}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}