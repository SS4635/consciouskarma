import React, { useState } from "react";

const Blog = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-black min-h-screen w-full flex flex-col font-sans text-gray-100">
      
      {/* Header */}
      <header className="ck-header-bar pb-3 md:pt-1 md:pb-0 bg-black text-white">
        <div className="ck-header-inner flex items-center justify-between px-4 py-2">
          <a href="/" aria-label="conscious KARMA home">
            <img
              src="/Logomy-cropped.svg"
              alt="conscious KARMA"
              className="ck-header-logo"
              draggable={false}
            />
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
      {/* Backdrop + Sidebar */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-[2px] z-20"
            onClick={() => setMenuOpen(false)}
          />

          <nav
            className={`fixed top-0 right-0 h-full w-[min(340px,92vw)]
            bg-[#0f0f0f] border-l border-[#333] shadow-[0_20px_60px_rgba(0,0,0,0.5)]
            z-[50] flex flex-col gap-[8px] p-[22px_20px]
            transition-transform duration-300 ease-in-out text-white
            ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="font-bold mb-2">Menu</div>

            {[
              ["Create Account", "/create-account"],
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
                className="no-underline p-3 border border-[#3a3a3a] rounded-[12px]
                bg-[#141414] hover:bg-[#191919] hover:border-[#555]
                transition text-gray-50 font-balgin font-bold"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>
        </>
      )}
<div className="flex-2 w-full max-w-3xl mx-auto p-6 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 pt-3 text-white">
          Why a Mobile Number
        </h1>
        <div className="text-gray-300 leading-relaxed space-y-4">

          <p>
            “Everything is energy.” <br/>
            Einstein’s words are more than a scientific statement —
            they are a lens through which the universe can be understood. <br/>
         <br/>
            Everything in existence — from stars and objects to bodies and thoughts — is a form of
            energy. What appears solid is simply energy in a denser state, just as ice is only concentrated water.
         <br/><br/>
            Modern science continues to explore how these energies shape the universe.<br/>
            But this understanding is ancient.
        <br/><br/>
            The sages of Bharat recognised thousands of years ago that the universe is made of energy
            and that it flows through life in patterns.  
            To express and organise this insight, they used something simple,precise, and timeless:
            <br/><br/>
            <strong>Numbers.</strong>
         <br/><br/>
            Numbers are stable symbols.  
            <br/>They do not depend on culture, language, or geography.<br/>  
            Though written differently across the world, their meaning stays the same.<br/>
         <br/>
            Because of this universality, numbers became the perfect medium to explain energy,
            time, and human experience. <br/>
         <br/>
            Numbers are woven into daily life at every level.<br/>  
            We use them to measure time, track resources, organise information,
            and identify everything — <br/>from bank accounts to home addresses.  
            In the digital age, numbers run systems, networks, and algorithms that connect the world.
         <br/><br/>
            Among all these systems, one sequence holds a special place today:
            <br /><br/> <strong>The mobile number.</strong>
          
           <br/><br/> Unlike other numbers in life — names, addresses, or even dates — this one is activated
            daily through intention and interaction.
          <br/><br/>
            It seems simple — just a set of digits used to call someone — but its role is far deeper.
        <br/><br/>
            A mobile number connects a person to every domain of life:<br/>
            work, finances, relationships, interactions, opportunities, and identity.<br/><br/>
         <strong>Every mobile number is unique.</strong>
<br/><br/>
             Dialled with the correct ISD code, it reaches the same user anywhere in the world,
            regardless of how it is saved — by name, spelling, or language.<br/>
            The sequence does not change.<br/>  
            It always leads back to the same individual.<br/><br/>
          
            This makes a mobile number a kind of personal address — one that belongs only to you.
        <br/><br/>
            In the universal web of energy, a mobile number functions as an individual node —
            a unique channel through which interactions and exchanges continually flow.<br/>
         <br/>
         
            Every call, message, transaction, and verification activates it.<br/> <br/>
            It does not sit idle. <br/>  
            It is not random.  <br/>
            It is a digital yantra — continuously active, continuously influencing,
            continuously shaping the flow of life.
          </p>

        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto w-full bg-black text-white border-t-2 border-orange-400 py-3 sm:py-2 md:py-3">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-center">
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
                  className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline"
                >
                  {label}
                </a>
                {i < 4 && (
                  <hr className="border-none bg-white w-[1px] h-[15px] opacity-100" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
