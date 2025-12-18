
import React, { useState } from "react";
import "./RefundPolicy.css";
import CKNavbar from "./components/CKNavbar";

import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";

const RefundPolicy = () => {
  const [menuOpen, setMenuOpen] = useState(false);
      const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
  return (
    <>
    <CKNavbar
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          setShowSignup={setShowSignup}
        />
    <div className="rp-page">
      
      {/* Add padding-top to prevent content from going under fixed header */}
      <div className="pt-20"></div>

      {/* MAIN CONTENT */}
      <main className="rp-content">
        <h1 className="rp-title">Refund & Cancellation Policy</h1>

        <section className="rp-section">
          <h2 className="rp-heading">Digital Products & Services</h2>
          <p className="rp-text">
            All our products and services are digitally delivered. Once payment
            is received, your order is confirmed and processed automatically, and
            we're therefore unable to offer cancellations or refunds.
          </p>
        </section>

        <div className="rp-divider"></div>

        <section className="rp-section">
          <h2 className="rp-heading">Video Consultations</h2>
          <p className="rp-text">
            For video consultations, rescheduling is possible up to 7 days before
            the scheduled slot and is subject to availability.
          </p>
        </section>

        <div className="rp-divider"></div>

        <section className="rp-section">
          <h2 className="rp-heading">Exceptional Circumstances</h2>
          <p className="rp-text">
            In rare situations such as a duplicate payment, technical issue, or
            non-delivery due to a system error, we will review the case and
            ensure a fair resolution — either by reissuing the report or
            correcting the payment.
          </p>
        </section>

        <div className="rp-divider"></div>

        <section className="rp-section">
          <h2 className="rp-heading">Important Note</h2>
          <p className="rp-text">
            Please make sure that your email address is entered correctly at
            checkout, as delivery depends on this information.
          </p>
        </section>

        <div className="rp-divider"></div>

        <section className="rp-section">
          <h2 className="rp-heading">Contact</h2>
          <p className="rp-text">
            For any queries or assistance, please contact us at:
          </p>
          <p className="rp-contact">hello@consciouskarma.co</p>
        </section>
      </main>
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

      {/* FOOTER */}
       {/* Orange line above footer, same as TermsAndConditions */}
      <div style={{ width: "100%", height: "1px", background: "#ff8a3d", marginTop: "32px", marginBottom: "-30px", borderRadius: "2px" }}></div>
      <footer className="rp-footer bg-black text-white border-t-2 border-orange-400 py-3 sm:py-2 md:py-3 mt-8">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center gap-3 sm:gap-4 md:gap-5">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5">
            <a
              href="/termsandconditions"
              className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline"
            >
              Terms & Conditions
            </a>
            <hr style={{ border: "none", background: "white", width: "1px", height: "15px", opacity: "1", margin: "0" }} />
            <a
              href="/privacy-policy"
              className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline"
            >
              Privacy Policy
            </a>
            <hr style={{ border: "none", background: "white", width: "1px", height: "15px", opacity: "1", margin: "0" }} />
            <a
              href="/refund-policy"
              className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline"
            >
              Refund Policy
            </a>
            <hr style={{ border: "none", background: "white", width: "1px", height: "15px", opacity: "1", margin: "0" }} />
            <a
              href="/shipping-policy"
              className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline"
            >
              Shipping & Delivery
            </a>
            <hr style={{ border: "none", background: "white", width: "1px", height: "15px", opacity: "1", margin: "0" }} />
            <a
              href="/contact-us"
              className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline"
            >
              Contact Us
            </a>
          </div>
          {/* <div className="text-white font-bold text-xs sm:text-sm mt-2">© 2025 Conscious Karma. All rights reserved.</div> */}
        </div>
      </footer>
    </div>
    </>
  );
};

export default RefundPolicy;
