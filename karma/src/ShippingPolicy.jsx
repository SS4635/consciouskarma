import React, { useState } from 'react';
import './ShippingPolicy.css';
import CKNavbar from "./components/CKNavbar";

import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";

const ShippingPolicy = () => {
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
    <div className="sp-container">
      {/* SPACE BELOW FIXED HEADER */}
      <div className="pt-20"></div>

      {/* MAIN CONTENT */}
      <div className="sp-content">

        <h1 className="sp-title">Shipping & Delivery Policy</h1>

        <div className="">
          <p>All our products are digital and delivered electronically—no physical shipping.</p>
        </div>

        <div className="sp-section">
          <h2 className="sp-heading">Delivery Method</h2>
          <p>
            After successful payment, you'll receive an order confirmation email and the PDF report
            sent to the email address provided at checkout.
          </p>
        </div>

        <div className="sp-divider"></div>

        <div className="sp-section">
          <h2 className="sp-heading">Delivery Time</h2>
          <div className="">
            <p>
              <strong>Instant Report:</strong> Usually immediate; in rare cases, up to 1 hour.
            </p>
            <p>
              <strong>Personalised Report:</strong> 5–7 days. Any delays will be notified.
            </p>
          </div>
        </div>

        <div className="sp-divider"></div>

        <div className="sp-section">
          <h2 className="sp-heading">If You Don't Receive Your Instant Report</h2>
          <p>
            Check your Spam/Junk folder. If not received within 1 hour, email{" "}
            <a href="mailto:hello@consciouskarma.co" className="sp-email">hello@consciouskarma.co</a>.
          </p>
        </div>

        <div className="sp-divider"></div>

        <div className="sp-section">
          <h2 className="sp-heading">Incorrect Email Entered</h2>
          <p>
            Email{" "}
            <a href="mailto:hello@consciouskarma.co" className="sp-email">hello@consciouskarma.co</a>{" "}
            with correct details; we will resend after verification.
          </p>
        </div>

        <div className="sp-divider"></div>

        <div className="sp-section">
          <h2 className="sp-heading">Non-Delivery</h2>
          <p>
            A digital order is considered delivered once the file is sent. If you report non-delivery,
            we will reissue after verifying your order.
          </p>
        </div>

        <div className="sp-divider"></div>

        <div className="sp-section">
          <h2 className="sp-heading">Refunds</h2>
          <p>
            Since access is digital, sales are final except duplicate purchases or technical issues.
          </p>
        </div>

      </div>
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

      {/* FOOTER OUTSIDE CONTENT */}
      <footer className="mt-12 w-full bg-black text-white border-t-2 border-orange-400 py-1 sm:py-2 md:py-3">
        <div className="w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 gap-4">

          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              ["Terms & Conditions", "/termsandconditions"],
              ["Privacy Policy", "/privacy-policy"],
              ["Refund Policy", "/refund-policy"],
              ["Shipping & Delivery", "/shipping-policy"],
              ["Contact Us", "/contact-us"],
            ].map(([label, link], i) => (
              <React.Fragment key={i}>
                <a
                  href={link}
                  className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 no-underline"
                >
                  {label}
                </a>
                {i < 4 && <hr className="border-none bg-white w-[1px] h-[15px] opacity-100" />}
              </React.Fragment>
            ))}
          </div>

        </div>
      </footer>

    </div>
    </>
  );
};

export default ShippingPolicy;
