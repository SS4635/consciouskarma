
import React, { useState } from "react";
import "./PrivacyPolicy.css";
import CKNavbar from "./components/CKNavbar";

import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";

const PrivacyPolicy = () => {
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
    <div className="pp-page">

      {/* Add padding-top to prevent content from going under fixed header */}
      <div className="pt-20"></div>

      {/* MAIN CONTENT */}
      <main className="pp-content">
        <h1 className="pp-title">Privacy Policy</h1>

        <p className="pp-intro">
          At Conscious Karma, we respect your privacy and are committed to
          protecting your personal information.
        </p>

        <section className="pp-section">
          <h2 className="pp-heading">1. Information We Collect</h2>
          <p className="pp-text">
            We collect basic personal details (such as name, email, gender, age,
            and mobile numbers) that you voluntarily share while booking a
            service or requesting a report.
          </p>
        </section>

        <div className="pp-divider"></div>

        <section className="pp-section">
          <h2 className="pp-heading">2. How We Use Your Information</h2>
          <ul className="pp-list">
            <li className="pp-list-item">
              To generate your personalised report or consultation.
            </li>
            <li className="pp-list-item">
              To contact you regarding updates or clarifications related to your
              order.
            </li>
            <li className="pp-list-item">
              To improve our services and user experience.
            </li>
          </ul>
        </section>

        <div className="pp-divider"></div>

        <section className="pp-section">
          <h2 className="pp-heading">3. Data Security</h2>
          <p className="pp-text">
            Your information is stored securely and is never shared with third
            parties, except where required by law.
          </p>
        </section>

        <div className="pp-divider"></div>

        <section className="pp-section">
          <h2 className="pp-heading">4. Payment Information</h2>
          <p className="pp-text">
            All payments are processed through secure and encrypted third-party
            gateways. We do not store your card or banking details.
          </p>
        </section>

        <div className="pp-divider"></div>

        <section className="pp-section">
          <h2 className="pp-heading">5. Communication</h2>
          <p className="pp-text">
            You may occasionally receive service-related or informational emails.
            You can opt out of non-essential communications at any time.
          </p>
        </section>

        <div className="pp-divider"></div>

        <section className="pp-section">
          <h2 className="pp-heading">6. Your Consent</h2>
          <p className="pp-text">
            By using our website and services, you consent to the collection and
            use of your information as described in this policy.
          </p>
        </section>

        <div className="pp-divider"></div>

        <section className="pp-section">
          <h2 className="pp-heading">Contact</h2>
          <p className="pp-text">
            For any privacy-related questions, contact us at:
          </p>
          <p className="pp-contact">hello@consciouskarma.co</p>
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
      <footer className="pp-footer bg-black text-white py-3 sm:py-2 md:py-3 mt-8">
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

export default PrivacyPolicy;
