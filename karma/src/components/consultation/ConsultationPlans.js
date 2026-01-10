import React, { useState, useEffect } from "react";
import ConsultationBookingForm from "./ConsultationBookingForm";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE =  process.env.REACT_APP_API_URL || "https://server.consciouskarma.co";


export default function ConsultationPlans() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalOpening, setModalOpening] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // lock page scroll while modal is open
  useEffect(() => {
    if (showModal) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      const id = setTimeout(() => setModalOpening(true), 20);
      return () => clearTimeout(id);
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
      setModalOpening(false);
    }
  }, [showModal]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showModal) {
        closeModal();
      }
    };
    if (showModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal]);

  // detect mobile viewport
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 576);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeModal = () => {
    setModalOpening(false);
    setTimeout(() => {
      setShowModal(false);
      setSelectedPlan(null);
    }, 220);
  };

  // --- PLANS DATA FROM ENV ---
  const [plans, setPlans] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadPlans() {
    try {
      const res = await fetch(`${API_BASE}/api/consultation/plans`);
      const data = await res.json();
      if (data.ok) {
        setPlans(data.plans);
      }
    } catch (err) {
      console.error("Failed to load plans", err);
    } finally {
      setLoading(false);
    }
  }
  loadPlans();
}, []);


  const handleSelect = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const renderBooking = () => {
    if (!selectedPlan) return null;

    // Steps mapping based on Title (matched with env or default)
    let planMaxSteps = 6;

    if (selectedPlan.id === 1) planMaxSteps = 4;
    else if (selectedPlan.id === 2) planMaxSteps = 5;
    else if (selectedPlan.id === 3) planMaxSteps = 5;

    // ⚡ FIX: Strip "₹" and spaces so the form gets a raw number (e.g. "2500")
    // This prevents the "NaN" error on the backend
    const numericPrice = String(selectedPlan.price).replace(/[^0-9.]/g, "");

    const planForForm = {
      ...selectedPlan,
      price: numericPrice, // Pass clean number to form
    };

    return (
      <div className="">
        <ConsultationBookingForm
          maxSteps={planMaxSteps}
          selectedPlan={planForForm} // Use the sanitized plan object
          inModal={true}
          onClose={closeModal}
        />
      </div>
    );
  };

  return (
    <section className="bg-black text-white d-flex align-items-center py-5 font-arsenal">
      <div className="container">
        <style>{`
          /* Thin Scrollbar */
          .ck-modal-card {
            scrollbar-width: thin;
            scrollbar-color: #ff914d #000;
          }
          .ck-modal-card::-webkit-scrollbar {
            width: 4px;
          }
          .ck-modal-card::-webkit-scrollbar-track {
            background: #000;
          }
          .ck-modal-card::-webkit-scrollbar-thumb {
            background-color: #ff914d;
            border-radius: 4px;
          }
          
          .ck-modal-backdrop { -ms-overflow-style: none; scrollbar-width: none; }
          .ck-modal-backdrop::-webkit-scrollbar { display: none; width: 0; height: 0; }
          
          @media (min-width: 769px) {
            .col-12.col-md-10.col-lg-7 { position: relative; }
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
            .consultation-plan-button::before { display: none !important; }
          }
          
          @media (min-width: 577px) and (max-width: 768px) {
            .consultation-plan-card {
              padding-right: 2rem !important;
              padding-bottom: 5rem !important;
            }
            .consultation-plan-card .fw-semibold { display: none !important; }
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
            .consultation-plan-button::before { display: none !important; }
          }

          .consultation-plan-button {
            border: 1.5px solid #ff914d;
            background-color: #000;
            color: #ff914d;
            padding: 8px 16px;
            font-weight: 500;
            transition: all 0.3s ease;
          }

          .consultation-plan-button:hover {
            background-color: #ff914d;
            color: #000;
          }
        `}</style>

        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="fw-light display-5 mb-3 font-arsenal">
            Consultation Plans
          </h1>
          <p className="fs-5 fw-light mb-1 font-arsenal">
            Each plan is designed for one mobile number.
          </p>
          <p className="fs-6 fw-light font-arsenal">
            The depth of analysis varies with your alignment needs.
          </p>
        </div>

        {/* Plans Section */}
        <div className="row justify-content-center g-4 mt-5">
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
                  <span className=" fs-4 font-arsenal">
                    ₹{plan.price}
                  </span>
                </div>
                <p
                  className="mb-8 font-arsenal"
                  style={{ whiteSpace: "pre-line", wordWrap: "break-word" }}
                >
                  {plan.description}
                </p>
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

        {/* Modal popup */}
        {showModal && selectedPlan && (
          <div
            className="ck-modal-backdrop"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.9)",
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
    width: "100%",
    maxWidth: "400px",
    maxHeight: "min(44.9rem, calc(100vh - 32px))", // fixed height, responsive
    background: "#000",
   
    borderRadius: 12,
    boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
    overflow: "hidden",            // ✅ IMPORTANT (modal itself must NOT scroll)
    display: "flex",
    flexDirection: "column",
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
  <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
    {renderBooking()}
  </div>
</div>

          </div>
        )}
      </div>
    </section>
  );
}