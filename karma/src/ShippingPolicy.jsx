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

        <div className="sp-section mt-10">
          <h2 className="sp-heading">1. Delivery Method</h2>
          <p>
            After successful payment, you'll receive an order confirmation email and the PDF report
            sent to the email address provided at checkout.
          </p>
        </div>

  
        <div className="sp-section">
          <h2 className="sp-heading">2. Delivery Time</h2>
          <div className="">
            <p>
              <strong>Instant Report:</strong> Usually immediate; in rare cases, up to 1 hour.
            </p>
            <p>
              <strong>Personalised Report:</strong> 5–7 days. Any delays will be notified.
            </p>
          </div>
        </div>

  
        <div className="sp-section">
          <h2 className="sp-heading">3. If You Don't Receive Your Instant Report</h2>
          <p>
            Check your Spam/Junk folder. If not received within 1 hour, email{" "}
            <a href="mailto:hello@consciouskarma.co" className="sp-email">hello@consciouskarma.co</a>.
          </p>
        </div>

  
        <div className="sp-section">
          <h2 className="sp-heading">4. Incorrect Email Entered</h2>
          <p>
            Email{" "}
            <a href="mailto:hello@consciouskarma.co" className="sp-email">hello@consciouskarma.co</a>{" "}
            with correct details; we will resend after verification.
          </p>
        </div>

  
        <div className="sp-section">
          <h2 className="sp-heading">5. Non-Delivery</h2>
          <p>
            A digital order is considered delivered once the file is sent. If you report non-delivery,
            we will reissue after verifying your order.
          </p>
        </div>

  
        <div className="sp-section">
          <h2 className="sp-heading">6. Refunds</h2>
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


    </div>
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
    </>
    
  );
};

export default ShippingPolicy;
