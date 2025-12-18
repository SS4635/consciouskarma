import React, { useState } from "react";

export default function ContactUs() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const ADDRESS = "B1/H3, mohan estate, New delhi - 110044";
  const CONTACT_EMAIL = "hello@consciouskarma.co";
  const WHATSAPP = "+91 8094289536";

  const onSubmit = (e) => {
    e.preventDefault();
    const fullName = `${firstName} ${lastName}`.trim();
    const subject = encodeURIComponent("New contact from consciouskarma.co");
    const body = encodeURIComponent(
      `Name: ${fullName}\nEmail: ${email}\nWhatsApp/Phone: ${phone}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
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
      {/* MAIN WRAPPER FOR FULL PAGE */}
      <div className="min-h-screen bg-black text-white flex flex-col">

        {/* -------------------- PAGE CONTENT (flex-1) -------------------- */}
        <div className="flex-1 flex flex-col items-center px-4 sm:px-6 md:px-8 py-10 sm:py-12">

          {/* HEADER */}
          <header className="ck-header-bar pb-3 md:pt-1 md:pb-0 bg-black fixed top-0 left-0 right-0 z-50">
            <div className="ck-header-inner flex items-center justify-between px-4 py-3">
              <a href="/" className="ck-header-logo-link" aria-label="conscious KARMA home">
                <img src="/Logomy-cropped.svg" alt="conscious KARMA" className="ck-header-logo mt-4" draggable={false} />
              </a>
              <button
                className={"ck-hamburger" + (menuOpen ? " ck-hamburger-open" : "")}
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle navigation menu"
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </header>

          {/* HAMBURGER MENU */}
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-[2px] z-40"
                onClick={() => setMenuOpen(false)}
              />
              <nav
                className="fixed top-0 right-0 h-full w-[min(340px,92vw)] bg-[#0f0f0f] border-l border-[#333] shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-50 flex flex-col gap-[8px] p-[22px_20px]"
              >
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
                    className="p-3 border border-[#3a3a3a] rounded-[12px] bg-[#141414] hover:bg-[#191919] hover:border-[#555] transition text-gray-50 font-bold underline-none"
                    style={{ textDecoration: 'none' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </>
          )}

          <div className="pt-20"></div>

          {/* ---------------- CONTACT PAGE CONTENT ---------------- */}
          <div className="w-full max-w-5xl mx-auto">
            <h1 className="font-balgin text-2xl sm:text-3xl md:text-4xl mb-6">Contact Us</h1>

            <div className="flex flex-col md:flex-row gap-8 mb-8 items-start">

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
                        className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
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
                        className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">WhatsApp / Phone</label>
                      <input
                        type="tel"
                        placeholder="+91"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
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
                      className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
                    />
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <button type="submit" className="rotating-border-btn px-5 py-2 text-sm sm:text-base">
                      Send Email
                    </button>
                  </div>
                </form>
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
            `}</style>
          </div>
        </div>
        {/* ---------------- END PAGE CONTENT ---------------- */}

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
