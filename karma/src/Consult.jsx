import React, { useState } from 'react';
import ConsultationSection from './components/consultation/ConsultationSection.js';
import ConsultationPlans from './components/consultation/ConsultationPlans.js';
// import ConsultationBookingForm from './components/consultation/ConsultationBookingForm.js';
import Home from './components/Home.js';
import FaqAccordion from './components/FaqAccordion.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import CKNavbar from "./components/CKNavbar";
import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";


export default function Consult() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
const [showLogin, setShowLogin] = useState(false);


  return (
    <div className="bg-black min-vh-100 font-arsenal">
      <style>{`
        .consult-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: black;
          border-bottom: 2px solid #333;
        }
        
        .brand-logo {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1;
        }
        
        .brand-top {
          font-family: 'Arsenal', system-ui, sans-serif;
          font-size: clamp(24px, 2.2vw, 32px);
          letter-spacing: 0.2px;
          color: #fff;
        }
        
        .brand-bottom {
          font-family: 'Balgin', 'Arsenal', system-ui, sans-serif;
          font-size: clamp(28px, 2.4vw, 36px);
          letter-spacing: 2px;
          color: #ff6b35;
          margin-top: 2px;
        }
        
        .hamburger {
          display: grid;
          place-items: center;
          gap: 6px;
          width: 46px;
          height: 42px;
          padding: 8px;
          border-radius: 12px;
          background: transparent;
          cursor: pointer;
          border: none;
        }
        
        .hamburger span {
          display: block;
          width: 24px;
          height: 3px;
          background: #ff6b35;
          border-radius: 2px;
          transition: transform 0.25s ease, opacity 0.25s ease;
        }
        
        .hamburger.is-open span:nth-child(1) {
          transform: translateY(9px) rotate(45deg);
        }
        
        .hamburger.is-open span:nth-child(2) {
          opacity: 0;
        }
        
        .hamburger.is-open span:nth-child(3) {
          transform: translateY(-9px) rotate(-45deg);
        }
        
        .nav-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(2px);
          z-index: 1000;
        }
        
        .nav-drawer {
          position: fixed;
          top: 0;
          right: -340px;
          height: 100vh;
          width: min(340px, 92vw);
          background: #0f0f0f;
          border-left: 1px solid #333;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          z-index: 1001;
          padding: 22px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: right 0.28s ease;
        }
        
        .nav-drawer.open {
          right: 0;
        }
        
        .nav-title {
          font-family: 'Balgin', system-ui, sans-serif;
          font-weight: 800;
          font-size: 18px;
          margin-bottom: 8px;
          color: #fff;
        }
        
        .nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 14px;
          border: 1px solid #3a3a3a;
          border-radius: 12px;
          background: #141414;
          color: #f2f2f2;
          text-decoration: none;
          font-weight: 700;
          font-family: 'Balgin', system-ui, sans-serif;
        }
        
        .nav-link:hover {
          background: #191919;
          border-color: #555;
          color: #f2f2f2;
        }
        
        .nav-hint {
          font-size: 12px;
          color: #cfcfcf;
          font-family: 'Arsenal', system-ui, sans-serif;
        }
    /* -----------------------------
   MOBILE RESPONSIVE – CK
------------------------------*/

@media (max-width: 768px) {
  .ck-mobile-section {
    padding: 28px 18px;
    text-align: center;
  }

  .ck-mobile-section h1,
  .ck-mobile-section h2 {
    font-size: 22px;
    line-height: 1.35;
    margin-bottom: 14px;
  }

  .ck-mobile-section p {
    font-size: 15px;
    line-height: 1.6;
    margin-bottom: 18px;
    color: #eaeaea;
  }

  /* Orange glowing pills */
  .ck-needs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 26px 0;
  }

  .ck-need-pill {
    font-size: 13px;
    padding: 10px 12px;
    border-radius: 999px;
    text-align: center;
    white-space: nowrap;
  }

  /* Single center pill */
  .ck-need-pill.center {
    grid-column: span 2;
    justify-self: center;
  }

  /* Consultation steps */
  .ck-steps {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  .ck-step {
    display: flex;
    align-items: center;
    gap: 14px;
    max-width: 320px;
  }

  .ck-step-icon {
    flex-shrink: 0;
  }

  .ck-step-text {
    font-size: 15px;
    line-height: 1.4;
    color: #ff6b35;
  }

  /* Footer */
  footer a {
    font-size: 11px;
  }
}
  .ck-section-divider {
  width: 100%;
  height: 2px;
  margin: 0 auto;
  background: linear-gradient(
    to right,
    transparent,
    #444,
    #666,
    #444,
    transparent
  );
  opacity: 0.8;
}

  `}</style>

      
      <CKNavbar
  menuOpen={menuOpen}
  setMenuOpen={setMenuOpen}
  setShowSignup={setShowSignup}
/>


      {/* Main Content */}
      <Home />
      <div className="ck-section-divider" />
      <ConsultationSection />
      <ConsultationPlans />
      {/* <ConsultationBookingForm /> */}
      <FaqAccordion />
{(showSignup || showLogin) && (
  <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
    {showSignup && (
      <SignupModal
        onClose={() => setShowSignup(false)}
        onSwitch={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    )}

    {showLogin && (
      <LoginModal
        onClose={() => setShowLogin(false)}
        onSwitch={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />
    )}
  </div>
)}

      {/* Footer */}
      <footer className="mt-auto w-full bg-black text-white border-t-2 border-orange-400 py-3 sm:py-2 md:py-3">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center gap-3 sm:gap-4 md:gap-5">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5">
            <a
              href="/termsandconditions"
              className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline hover:no-underline focus:no-underline"
            >
              Terms & Conditions
            </a>
            <hr
              style={{
                border: "none",
                background: "white",
                width: "1px",
                height: "15px",
                opacity: "1",
                margin: "0",
              }}
            />

            <a
              href="/privacy-policy"
              className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline hover:no-underline focus:no-underline"
            >
              Privacy Policy
            </a>
            <hr
              style={{
                border: "none",
                background: "white",
                width: "1px",
                height: "15px",
                opacity: "1",
                margin: "0",
              }}
            />

            <a
              href="/refund-policy"
              className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline hover:no-underline focus:no-underline"
            >
              Refund Policy
            </a>
            <hr
              style={{
                border: "none",
                background: "white",
                width: "1px",
                height: "15px",
                opacity: "1",
                margin: "0",
              }}
            />

            <a
              href="/shipping-policy"
              className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline hover:no-underline focus:no-underline"
            >
              Shipping & Delivery
            </a>
            <hr
              style={{
                border: "none",
                background: "white",
                width: "1px",
                height: "15px",
                opacity: "1",
                margin: "0",
              }}
            />

            <a
              href="/contact-us"
              className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline hover:no-underline focus:no-underline"
            >
              Contact Us
            </a>
          </div>
          {/* <div className="text-white font-bold text-xs sm:text-sm break-all sm:break-normal">
            <a href="mailto:hello@consciouskarma.co" className="underline">hello@consciouskarma.co</a>
          </div> */}
        </div>
      </footer>
    </div>
  );
}
