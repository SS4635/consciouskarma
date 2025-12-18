
import React, { useState } from "react";
import "./TermsAndConditions.css";
import CKNavbar from "./components/CKNavbar";

import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";

const TermsAndConditions = () => {
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


    <div className="tc-page">
      {/* HEADER same as landing page */}
      

      {/* Add padding-top to prevent content from going under fixed header */}
      <div className="pt-20"></div>

      {/* MAIN CONTENT */}
      <main className="tc-content">
        <h1 className="tc-title">Terms and Conditions</h1>

        <section className="tc-section">
          <h2 className="tc-heading">1. Introduction</h2>
          <p className="tc-text">Welcome to Conscious Karma.</p>
          <p className="tc-text">
            By accessing or using our website (www.consciouskarma.co) and its
            services, you agree to comply with and be bound by these Terms and
            Conditions.
          </p>
          <p className="tc-text">Please read them carefully before proceeding.</p>
        </section>

        <div className="tc-divider"></div>

        <section className="tc-section">
          <h2 className="tc-heading">2. Accountability</h2>
          <p className="tc-text">
            You are responsible for any actions or decisions taken based on the
            insights provided by our services.
          </p>
        </section>

        <div className="tc-divider"></div>

        <section className="tc-section">
          <h2 className="tc-heading">3. Booking and Payments</h2>
          <ul className="tc-list">
            <li className="tc-list-item">
              <strong>Service Fees:</strong> All fees for consultations and
              reports are listed on our website and may change without prior
              notice.
            </li>
            <li className="tc-list-item">
              <strong>Payment:</strong> Payments must be completed in full at
              the time of booking. All transactions are processed securely
              through trusted third-party payment gateways. Conscious Karma does
              not store your payment details.
            </li>
            <li className="tc-list-item">
              <strong>Refund Policy:</strong> All purchases are final and
              non-refundable once processing has begun. (Please refer to our
              Refund Policy for details.)
            </li>
          </ul>
        </section>

        <div className="tc-divider"></div>

        <section className="tc-section">
          <h2 className="tc-heading">4. Use of Information</h2>
          <p className="tc-text">
            We use the information you provide for the following purposes:
          </p>
          <ol className="tc-list tc-list-ordered">
            <li className="tc-list-item">
              To prepare and deliver personalised reports and consultations.
            </li>
            <li className="tc-list-item">
              To manage orders, payments, and communication.
            </li>
            <li className="tc-list-item">
              To improve website functionality and service experience.
            </li>
            <li className="tc-list-item">
              To send updates or communication only if you have opted in.
            </li>
            <li className="tc-list-item">
              To comply with legal or regulatory requirements.
            </li>
          </ol>
        </section>

        <div className="tc-divider"></div>

        <section className="tc-section">
          <h2 className="tc-heading">5. Sharing of Information</h2>
          <p className="tc-text">
            We respect your privacy and only share your information in the
            following circumstances:
          </p>
          <ul className="tc-list">
            <li className="tc-list-item">
              <strong>Service Providers:</strong> With third-party vendors who
              assist in payment processing, communication, or service delivery.
            </li>
            <li className="tc-list-item">
              <strong>Legal Obligations:</strong> When required by law or to
              protect our rights, users, or business operations.
            </li>
          </ul>
        </section>

        <div className="tc-divider"></div>

        <section className="tc-section">
          <h2 className="tc-heading">6. Third-Party Links</h2>
          <p className="tc-text">
            Our website may contain links to external websites or resources.
          </p>
          <p className="tc-text">
            Conscious Karma is not responsible for the content, accuracy, or
            privacy practices of these third-party sites. Please review their
            terms and policies before use.
          </p>
        </section>

        <div className="tc-divider"></div>

        <section className="tc-section">
          <h2 className="tc-heading">7. Prohibited Activities</h2>
          <p className="tc-text">You agree not to:</p>
          <ol className="tc-list tc-list-ordered">
            <li className="tc-list-item">
              Use the website or its services for any unlawful or unauthorised
              purpose.
            </li>
            <li className="tc-list-item">
              Interfere with or disrupt website functionality, data, or security
              systems.
            </li>
            <li className="tc-list-item">
              Misrepresent your identity or provide false information.
            </li>
          </ol>
        </section>

        <div className="tc-divider"></div>

        <section className="tc-section">
          <h2 className="tc-heading">8. Modifications</h2>
          <p className="tc-text">
            Conscious Karma reserves the right to update or modify these Terms
            and Conditions at any time without prior notice.
          </p>
          <p className="tc-text">
            Continued use of the website or services after changes are posted
            constitutes acceptance of the updated terms.
          </p>
        </section>

        <div className="tc-divider"></div>

        <section className="tc-section">
          <h2 className="tc-heading">9. Contact</h2>
          <p className="tc-text">
            For questions regarding these Terms and Conditions, please contact
            us at:
          </p>
          <p className="tc-contact">hello@consciouskarma.co</p>
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
      {/* Orange line above footer, same as landing page */}
      <div style={{ width: "100%", height: "1px", background: "#ff8a3d", marginTop: "32px", marginBottom: "-30px", borderRadius: "2px" }}></div>
      <footer className="tc-footer bg-black text-white py-3 sm:py-2 md:py-3 mt-8">
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

export default TermsAndConditions;
