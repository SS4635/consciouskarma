
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

          <p className="pp-text">
            At Conscious Karma, we respect your privacy and are committed to
            protecting your personal information.
          </p>

          <section className="pp-section mt-10">
            <h2 className="pp-heading">1. Information We Collect</h2>
            <p className="pp-text">
              We collect basic personal details (such as name, email, gender, age,
              and mobile numbers) that you voluntarily share while booking a
              service or requesting a report.
            </p>
          </section>


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


          <section className="pp-section">
            <h2 className="pp-heading">3. Data Security</h2>
            <p className="pp-text">
              Your information is stored securely and is never shared with third
              parties, except where required by law.
            </p>
          </section>


          <section className="pp-section">
            <h2 className="pp-heading">4. Payment Information</h2>
            <p className="pp-text">
              All payments are processed through secure and encrypted third-party
              gateways. We do not store your card or banking details.
            </p>
          </section>


          <section className="pp-section">
            <h2 className="pp-heading">5. Communication</h2>
            <p className="pp-text">
              You may occasionally receive service-related or informational emails.
              You can opt out of non-essential communications at any time.
            </p>
          </section>


          <section className="pp-section">
            <h2 className="pp-heading">6. Your Consent</h2>
            <p className="pp-text">
              By using our website and services, you consent to the collection and
              use of your information as described in this policy.
            </p>
          </section>


          <section className="pp-section">
            <h2 className="pp-heading">7. Contact</h2>
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

    <footer className="font-arsenal mt-auto w-full bg-black text-white border-t-2 border-orange-400 py-3 sm:py-2 md:py-3">
  <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center gap-3 sm:gap-4 md:gap-5">
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5">
      <a
        href="/termsandconditions"
        className="text-white font-bold text-sm sm:text-sm hover:text-gray-300 no-underline hover:no-underline focus:no-underline"
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
        className="text-white font-bold text-sm sm:text-sm hover:text-gray-300 no-underline hover:no-underline focus:no-underline"
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
        className="text-white font-bold text-sm sm:text-sm hover:text-gray-300 no-underline hover:no-underline focus:no-underline"
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
        className="text-white font-bold text-sm sm:text-sm hover:text-gray-300 no-underline hover:no-underline focus:no-underline"
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
        className="text-white font-bold text-sm sm:text-sm hover:text-gray-300 no-underline hover:no-underline focus:no-underline"
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
    </>
  );
};

export default PrivacyPolicy;
