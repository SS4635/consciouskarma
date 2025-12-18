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
import ConsultationBookingForm from "./ConsultationBookingForm";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ConsultationPlans() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalOpening, setModalOpening] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // lock page scroll while modal is open to prevent double scrollbars
  useEffect(() => {
    if (showModal) {
      // Calculate scrollbar width
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Hide scroll but add padding to prevent shift
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      // trigger enter animation next tick
      const id = setTimeout(() => setModalOpening(true), 20);
      return () => clearTimeout(id);
    } else {
      // IMPORTANT: explicitly reset overflow and padding
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
      setModalOpening(false);
    }
  }, [showModal]);

  // detect mobile viewport for modal sizing/animation tweaks
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 576);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
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
      description: "For students, freelancers, or solo nentrepreneurs",
       isExtended: false,
    },
    {
      id: 2,
      title: "Married Individual",
      price: " ₹2500",
      description:
        "For those whose number must be considered alongside a spouse or partner",
    isExtended: false,
    },
    {
      id: 3,
      title: "Individual with \nExtended Compatibility",
      price: " ₹3000",
      description:
        "For entrepreneurs, co-founders, or professionals requiring compatibility checks with up to 4 other people.",
    isExtended: true,
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
    if (selectedPlan.title === "Unmarried Individual") planMaxSteps = 4;
    else if (selectedPlan.title === "Married Individual") planMaxSteps = 5;
    else if (selectedPlan.title === "Individual with Extended Compatibility")
      planMaxSteps = 5;
    return (
      <div className="">
        {/* pass selectedPlan so the form can display dynamic price/data; inModal makes the form compact for modal */}
        <ConsultationBookingForm
  maxSteps={planMaxSteps}
  selectedPlan={selectedPlan}
  inModal={true}
  onClose={closeModal}
/>
      </div>
    );
  };

  return (
    <section className=" bg-black text-white d-flex align-items-center py-5 font-arsenal">
      <div className="container">
        {/* Hide modal scrollbar visually but keep scrolling functional */}
        <style>{`
          .ck-modal-card { -ms-overflow-style: none; scrollbar-width: none; }
          .ck-modal-card::-webkit-scrollbar { display: none; width: 0; height: 0; }
          .ck-modal-backdrop { -ms-overflow-style: none; scrollbar-width: none; }
          .ck-modal-backdrop::-webkit-scrollbar { display: none; width: 0; height: 0; }
          
          /* Desktop styles */
          @media (min-width: 769px) {
            .col-12.col-md-10.col-lg-7 {
              position: relative;
            }
            .consultation-plan-card {
              padding: 2rem !important;
              padding-right: 2rem !important;
              min-height: 160px;
            }
            .consultation-plan-card .d-flex {
              align-items: flex-start !important;
              margin-bottom: 1rem !important;
            }
            .consultation-plan-card h3 {
              margin-bottom: 0 !important;
              line-height: 1.3;
            }
            .consultation-plan-card .fw-semibold {
              position: absolute !important;
              right: 2rem !important;
              top: 1.75rem !important;
              font-size: 2rem !important;
              z-index: 10;
              line-height: 1;
            }
            .consultation-plan-card p {
              max-width: calc(100% - 180px);
              margin-bottom: 0 !important;
              line-height: 1.6;
            }
            .consultation-plan-button {
              position: absolute !important;
              right: 1.5rem !important;
              top: 5rem !important;
            }
            .consultation-plan-button::before {
              display: none !important;
            }
          }
          
          /* Tablet styles */
          @media (min-width: 577px) and (max-width: 768px) {
            .consultation-plan-card {
              padding-right: 2rem !important;
              padding-bottom: 5rem !important;
            }
            .consultation-plan-card .fw-semibold {
              display: none !important;
            }
            .consultation-plan-button {
              position: absolute !important;
              right: 1rem !important;
              bottom: 1rem !important;
              left: auto !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              gap: 0.5rem !important;
            }
            .consultation-plan-button::before {
              content: attr(data-price);
              font-size: 1.25rem;
              font-weight: 600;
              color: white;
              font-family: 'Arsenal', sans-serif;
              display: block;
            }
          }
          
          /* Mobile styles */
          @media (max-width: 576px) {
            .consultation-plan-card {
              padding-right: 1.5rem !important;
              padding-left: 1.5rem !important;
              padding-bottom: 1.5rem !important;
              display: flex;
              flex-direction: column;
            }
            .consultation-plan-card .d-flex {
              align-items: flex-start !important;
              gap: 0.5rem;
            }
            .consultation-plan-card h3 {
              flex: 1 1 auto;
              margin-bottom: 0 !important;
              min-width: 0;
              max-width: calc(100% - 80px);
              line-height: 1.4;
              white-space: pre-line;
            }
            .consultation-plan-card .fw-semibold {
              flex: 0 0 auto;
              margin-left: auto;
            }
            .consultation-plan-button {
              position: static !important;
              margin-top: 1rem !important;
              width: 100% !important;
              max-width: 150px !important;
              align-self: center;
            }
            .consultation-plan-button::before {
              display: none !important;
            }
          }

          .consultation-plan-button {
  border: 1.5px solid #ff6b35;
  background-color: #000;
  color: #ff6b35;
  padding: 8px 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.consultation-plan-button:hover {
  background-color: #ff6b35;
  color: #000;
}

        `}</style>
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="fw-light display-5 mb-3 font-arsenal">
            Consultation Plans
          </h1>
          <p className="fs-5 fw-light  mb-1 font-arsenal">
            Each plan is designed for one mobile number.
          </p>
          <p className="fs-6 fw-light font-arsenal">
            The depth of analysis varies with your alignment needs.
          </p>
        </div>

        {/* Plans Section - HAMESHA DIKHEGA */}
        <div className="row justify-content-center g-4">
          {plans.map((plan) => (
            <div key={plan.id} className="col-12 col-md-10 col-lg-7">
              <div
                className="consultation-plan-card rounded-4 p-4 h-100 text-white bg-transparent"
                style={{
                  borderBottom: "3px solid #ff6b35",
                  borderLeft: "none",
                  borderRight: "none",
                  borderTop: "none",
                  transition: "0.3s",
                  cursor: "default",
                  position: "relative",
                }}
              >
                <div className="d-flex justify-content-between flex-wrap mb-3">
                  <h3 className="fw-normal fs-4 mb-2 text-start font-arsenal">
                    {plan.title}
                  </h3>
                  <span className="fw-semibold fs-4 font-arsenal">
                    {plan.price}
                  </span>
                </div>
                <p
                  className="mb-8 font-arsenal"
                  style={{ whiteSpace: "pre-line", wordWrap: "break-word" }}
                >
                  {plan.description}
                </p>
                {/* Book Now button at right corner */}
                <button
  type="button"
  className="consultation-plan-button btn btn-sm"
  data-price={plan.price}
  onClick={(e) => {
    e.stopPropagation();
    handleSelect(plan);
  }}
>
  <b>Book Now</b>
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
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              opacity: modalOpening ? 1 : 0,
              transition: "opacity 400ms ease-in-out",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
              padding: "20px",
            }}
            onClick={closeModal}
          >
            <div
              className="ck-modal-card"
              style={{
                // make modal a bit smaller so it doesn't force a large scrollbar
                width: isMobile ? "94vw" : "min(50vw, 440px)",
                background: "#000",
                border: "2px solid #ff6b35",
                borderRadius: 12,
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                // constrain the modal height but allow internal scrolling if content is tall
                maxHeight: isMobile ? "90vh" : "80vh",
                overflowY: "auto",
                transform: modalOpening
                  ? "translateY(0) scale(1)"
                  : isMobile
                  ? "translateY(14px) scale(0.98)"
                  : "scale(0.92)",
                opacity: modalOpening ? 1 : 0.85,
                transition: isMobile
                  ? "transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease"
                  : "transform 220ms ease, opacity 220ms ease",
              }}
              onClick={(ev) => ev.stopPropagation()}
            >

              {/* Render the booking form inside modal */}
              <div style={{ marginTop: 8 }}>{renderBooking()}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
