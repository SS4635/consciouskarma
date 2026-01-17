import React, { useState } from "react";

import CKNavbar from "./components/CKNavbar";

import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";
import axios from "axios";
const API = process.env.REACT_APP_API_URL;

export default function ContactUs() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const ADDRESS = "B1/H3, mohan estate, New delhi - 110044";
  const CONTACT_EMAIL = "hello@consciouskarma.co";
  const WHATSAPP = "+91 8094289536";

  // const onSubmit = (e) => {
  //   e.preventDefault();
  //   const fullName = `${firstName} ${lastName}`.trim();
  //   const subject = encodeURIComponent("New contact from consciouskarma.co");
  //   const body = encodeURIComponent(
  //     `Name: ${fullName}\nEmail: ${email}\nWhatsApp/Phone: ${phone}\n\nMessage:\n${message}`
  //   );
  //   window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  // };

  const onSubmit = async (e) => {
  e.preventDefault();

  try {
    await axios.post(`${API}/api/contact`, {
      firstName,
      lastName,
      email,
      phone,
      message,
      page: "Contact Us",
    });

    alert("Thank you! We’ll get back to you shortly.");

    // reset (optional)
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setMessage("");

  } catch (err) {
    alert("Something went wrong. Please try again.");
  }
};
  const waHref = () => {
    const fullName = `${firstName} ${lastName}`.trim();
    const text = encodeURIComponent(
      `Hi, this is ${fullName || ''}. ${message || ''}`
    );
    const number = "918094289536"; 
    return `https://wa.me/${number}?text=${text}`;
  };

  return (
    <>
    <CKNavbar
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              setShowSignup={setShowSignup}
            />
      {/* MAIN WRAPPER FOR FULL PAGE */}
      <div className="min-h-screen bg-black text-white flex flex-col">

        {/* -------------------- PAGE CONTENT (flex-1) -------------------- */}
        <div className="flex-1 flex flex-col items-center px-4 sm:px-6 md:px-8 py-10 sm:py-12">

         
          <div className="pt-20"></div>

          {/* ---------------- CONTACT PAGE CONTENT ---------------- */}
          <div className="w-full max-w-5xl mx-auto">
            <h1 className="font-balgin text-2xl sm:text-3xl md:text-4xl mb-6">Contact Us</h1>

            <div className="flex flex-col md:flex-col gap-8 mb-8 items-center">
              {/* RIGHT FORM */}
              <div className="md:w-1/2 w-full">
                <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="contact-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="contact-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="contact-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">WhatsApp / Phone</label>
                      <input
                        type="tel"
                        placeholder="+91"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="contact-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Message</label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="contact-input"
                    />
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <button type="submit" className="rotating-border-btn px-5 py-2 text-sm sm:text-base">
                      Send Email
                    </button>
                  </div>
                </form>
              </div>
              {/* LEFT ADDRESS CARD */}
              <div className="md:w-1/2 w-full pt-4 md:pt-6">
                <div className="border border-orange-400 rounded-lg p-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="text-orange-400 font-semibold mb-1">Address</div>
                      <div className="text-gray-200 text-sm sm:text-base">{ADDRESS}</div>
                    </div>
                    <div>
                      <div className="text-orange-400 font-semibold mb-1">Email</div>
                      <a href={`mailto:${CONTACT_EMAIL}`} className="text-gray-200 text-sm sm:text-base underline break-all">
                        {CONTACT_EMAIL}
                      </a>
                    </div>
                    <div>
                      <div className="text-orange-400 font-semibold mb-1">WhatsApp</div>
                      <a href={waHref()} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-200 text-sm sm:text-base underline">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 48 48" fill="none">
                          <circle cx="24" cy="24" r="24" fill="#25D366" />
                          <path d="M34.5 29.5c-.5-.2-2.9-1.4-3.3-1.6-.4-.2-.7-.2-1 .2-.3.4-1.1 1.3-1.4 1.6-.3.3-.5.3-1 .1-.5-.2-2.1-.8-4-2.5-1.5-1.3-2.5-2.9-2.8-3.4-.3-.5-.1-.8.1-1.1.2-.2.4-.5.6-.8.2-.3.3-.5.5-.8.2-.3.1-.6 0-.8-.1-.2-1.1-2.7-1.5-3.7-.4-1-.8-.8-1.1-.8-.3 0-.6 0-.9 0-.3 0-.8.1-1.2.5-.4.4-1.5 1.5-1.5 3.6 0 2.1 1.5 4.1 1.7 4.4.2.3 3.2 5.1 7.8 6.7 4.6 1.6 5.5 1.1 6.5 1.1.9 0 2.9-1.2 3.3-2.3.4-1.1.4-2 .3-2.2-.1-.2-.4-.3-.9-.5z" fill="#fff" />
                        </svg>
                        {WHATSAPP}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BUTTON CSS */}
            <style>{`
              .rotating-border-btn {
                position: relative;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: #000;
                color: #fff;
                border: 2px solid #ff8a3d;
                border-radius: 10px;
                overflow: hidden;
              }
              .rotating-border-btn::before {
                display: none;
              }
              .contact-input {
                width: 100%;
                background: transparent;
                border: 1.5px solid #666;
                border-radius: 12px;
                padding: 0.65rem 0.85rem;
                color: #fff;
                font-size: 1rem;
                transition: all 0.25s ease;
                outline: none;
              }
              .contact-input:focus {
                border-color: #ff914d;
                box-shadow: 0 0 0 0.2rem rgba(255, 145, 77, 0.25);
              }
            `}</style>
          </div>
        </div>
        {/* ---------------- END PAGE CONTENT ---------------- */}
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

        {/* ---------------------- FOOTER (ALWAYS BOTTOM) ---------------------- */}
        <footer className="mt-auto w-full bg-black text-white border-t-2 border-orange-400 py-3 sm:py-2 md:py-3">
          <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center gap-3 sm:gap-4 md:gap-5">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5">

              <a href="/termsandconditions" className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 no-underline">Terms & Conditions</a>
              <hr style={{ background: "white", width: "1px", height: "15px", margin: 0 }} />

              <a href="/privacy-policy" className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 no-underline">Privacy Policy</a>
              <hr style={{ background: "white", width: "1px", height: "15px", margin: 0 }} />

              <a href="/refund-policy" className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 no-underline">Refund Policy</a>
              <hr style={{ background: "white", width: "1px", height: "15px", margin: 0 }} />

              <a href="/shipping-policy" className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 no-underline">Shipping & Delivery</a>
              <hr style={{ background: "white", width: "1px", height: "15px", margin: 0 }} />

              <a href="/contact-us" className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 no-underline">Contact Us</a>

            </div>
          </div>
        </footer>

      </div>
      {/* END MAIN WRAPPER */}
    </>
  );
}
