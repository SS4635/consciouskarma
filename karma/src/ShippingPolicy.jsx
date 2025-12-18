import React, { useState } from 'react';
import './ShippingPolicy.css';

const ShippingPolicy = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="sp-container">

      {/* HEADER */}
      <header className="ck-header-bar pb-3 md:pt-1 md:pb-0 bg-black fixed top-0 left-0 right-0 z-50">
        <div className="ck-header-inner flex items-center justify-between px-4 py-3">
          <a href="/" className="ck-header-logo-link" aria-label="conscious KARMA home">
            <img src="/Logomy-cropped.svg" alt="conscious KARMA" className="ck-header-logo mt-4" draggable={false} />
          </a>

          <button
            className={"ck-hamburger" + (menuOpen ? " ck-hamburger-open" : "")}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* SIDEBAR + BACKDROP */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-[2px] z-40"
            onClick={() => setMenuOpen(false)}
          />

          <nav className="fixed top-0 right-0 h-full w-[min(340px,92vw)] bg-[#0f0f0f]
            border-l border-[#333] shadow-[0_20px_60px_rgba(0,0,0,0.5)]
            z-50 flex flex-col gap-[8px] p-[22px_20px]">

            <div className="font-bold text-white mb-2">Menu</div>

            {[
              ["Home", "/"],
              ["Instant Report", "/"],
              ["Personalised Report", "/personalised-report"],
              ["Consult", "/consult"],
              ["Blog", "/blogs"],
              ["Terms & Conditions", "/termsandconditions"],
              ["Privacy Policy", "/privacy-policy"],
              ["Refund Policy", "/refund-policy"],
              ["Shipping & Delivery", "/shipping-policy"],
              ["Contact Us", "/contact-us"],
            ].map(([label, link], i) => (
              <a
                key={i}
                href={link}
                onClick={() => setMenuOpen(false)}
                className="p-3 border border-[#3a3a3a] rounded-[12px]
                bg-[#141414] hover:bg-[#191919] hover:border-[#555]
                transition text-gray-50 font-bold no-underline"
                style={{ textDecoration: "none" }}
              >
                {label}
              </a>
            ))}
          </nav>
        </>
      )}

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
  );
};

export default ShippingPolicy;
