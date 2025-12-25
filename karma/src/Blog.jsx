import React, { useState } from "react";

import CKNavbar from "./components/CKNavbar";

import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";

const Blog = () => {
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
    <div className="bg-black min-h-screen w-full flex flex-col font-sans text-gray-100">
      
      
<div className="flex-2 w-full max-w-3xl mx-auto p-6 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 pt-24 text-white">
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
            <span style={{"color":"#ff914d"}}>Numbers.</span>
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
            <br /><br/> <span style={{"color":"#ff914d"}}>The mobile number.</span>
          
           <br/><br/> Unlike other numbers in life — names, addresses, or even dates — this one is activated
            daily through intention and interaction.
          <br/><br/>
            It seems simple — just a set of digits used to call someone — but its role is far deeper.
        <br/><br/>
            A mobile number connects a person to every domain of life:<br/>
            work, finances, relationships, interactions, opportunities, and identity.<br/><br/>
         <span style={{"color":"#ff914d"}}>Every mobile number is unique.</span>
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

      {/* Footer */}
      <footer className="mt-auto w-full bg-black text-white border-t-2 border-orange-400 py-3 sm:py-2 md:py-3 mt-5">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center gap-3 sm:gap-4 md:gap-5 ">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5">
            <a href="/termsandconditions" className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline hover:no-underline focus:no-underline">Terms & Conditions</a>
            <hr style={{ border: "none", background: "white", width: "1px", height: "15px", opacity: "1", margin: "0" }} />
            <a href="/privacy-policy" className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline hover:no-underline focus:no-underline">Privacy Policy</a>
            <hr style={{ border: "none", background: "white", width: "1px", height: "15px", opacity: "1", margin: "0" }} />
            <a href="/refund-policy" className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline hover:no-underline focus:no-underline">Refund Policy</a>
            <hr style={{ border: "none", background: "white", width: "1px", height: "15px", opacity: "1", margin: "0" }} />
            <a href="/shipping-policy" className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline hover:no-underline focus:no-underline">Shipping & Delivery</a>
            <hr style={{ border: "none", background: "white", width: "1px", height: "15px", opacity: "1", margin: "0" }} />
            <a href="/contact-us" className="text-white font-bold text-xs sm:text-sm hover:text-gray-300 transition-colors no-underline hover:no-underline focus:no-underline">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Blog;
