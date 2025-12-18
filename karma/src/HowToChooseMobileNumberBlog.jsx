import React, { useState } from "react";

import CKNavbar from "./components/CKNavbar";

import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";

const HowToChooseMobileNumberBlog = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  
      const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

  return (
    // Updated: bg-black for background, text-gray-100 for main text
   <>
   
       <CKNavbar
                 menuOpen={menuOpen}
                 setMenuOpen={setMenuOpen}
                 setShowSignup={setShowSignup}
               />
   <div className="bg-black min-h-screen w-full flex flex-col font-sans text-gray-100">
    
      {/* Main Blog Content */}
      <div className="flex-1 w-full max-w-3xl mx-auto p-6 md:p-12">
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6 pt-3 text-white">
          How to Choose a Mobile Number
        </h1>
        
        {/* Teaser Paragraph */}
        <p className="mb-8 text-lg text-gray-300 leading-relaxed font-medium">
          A mobile number must be chosen according to who you are, your stage of life, and the direction you’re moving toward.
        </p>

        {/* Intro Section */}
        <div className="mb-8 text-gray-300 leading-relaxed">
          <p className="mb-4">
            Choosing the right mobile number is not a one-size-fits-all process.
          </p>
          <p className="mb-4">
            Every person moves through life with different responsibilities, priorities, and aspirations — and a mobile number should be chosen to support that journey.
          </p>
          <p className="mb-2">
            A mobile number influences life through the energy pattern created by its sequence.
          </p>
          <p className="mb-2">
            For this reason, it must be selected according to:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-gray-300">
            <li>who the person is</li>
            <li>the stage of life they are in</li>
            <li>and the direction they wish to move toward</li>
          </ul>
        </div>

        {/* Section: Specific Need */}
        <div className="mb-8 text-gray-300 leading-relaxed">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
            A Number Should Solve a Specific Need</h2>
          <p className="mb-4">
            At any point in life,every individual carries a dominant area of focus — career, family, finances, stability, clarity, confidence, learning, or emotional balance.
          </p>
          <p className="mb-2">For example:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-gray-300">
            <li>A student may need support in focus and learning.</li>
            <li>A working professional may require confidence and opportunity.</li>
            <li>An entrepreneur may seek leadership, clarity, and decision-making strength.</li>
            <li>A homemaker or parent may benefit from harmony, stability, and emotional balance.</li>
          </ul>
          <p className="mb-1">As life changes, needs change.</p>
          <p className="mb-1">What supported someone a decade ago may not support them today.</p>
          <p className="mb-4">A mobile number should match the current phase of life and the direction in which the individual intends to grow.</p>
        </div>

        {/* Section: Balance Matters */}
        <div className="mb-8 text-gray-300 leading-relaxed">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
            Balance Matters
          </h2>
          <p className="mb-4">
            Even when a number is chosen to strengthen a particular area, it must maintain balance across life.
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-gray-300">
            <li>A number that improves finances should not disturb relationships.</li>
            <li>A number that enhances ambition should not create restlessness.</li>
            <li>A number that brings emotional comfort should not weaken resolve.</li>
          </ul>
          <p className="mb-4">
            The right number creates a stable, supportive field — one that uplifts multiple aspects of life without creating inner conflict.
          </p>
        </div>

        {/* Section: Purpose of Selection */}
        <div className="mb-8 text-gray-300 leading-relaxed">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
            The Purpose of Selection
          </h2>
          <p className="mb-2">A consciously chosen mobile number should:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-gray-300">
            <li>reduce friction</li>
            <li>support growth</li>
            <li>enhance strengths</li>
            <li>stabilise weaker areas</li>
            <li>bring clarity and balance to everyday life</li>
          </ul>
          <p className="mb-1">A number is not chosen for symmetry, aesthetics, or memorability.</p>
          <p className="mb-4">It is chosen because its sequence aligns with the individual’s path and creates a harmonious field around their actions.</p>
        </div>

        {/* Section: More Than Convenience */}
        <div className="mb-8 text-gray-300 leading-relaxed">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
            More Than Convenience
          </h2>
          <p className="mb-1">A mobile number is not just a point of contact.</p>
          <p className="mb-1">It is a Digital Age Yantra — a tool threaded with energy.</p>
          <p className="mb-4">It becomes active each time it is used, shared, or engaged in interaction — shaping experiences in subtle and continuous ways.</p>
        </div>

        {/* Section: A Number That Shapes Destiny */}
        <div className="mb-8 text-gray-300 leading-relaxed">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
            A Number That Shapes Destiny
          </h2>
          <p className="mb-1">Consciously chosen, a mobile number becomes your greatest asset.</p>
          <p className="mb-1">It influences how opportunities arise, how challenges are absorbed, and how progress unfolds.</p>
          <p className="mb-4 font-semibold text-white">A small change — with the power to transform your path.</p>
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
      <footer className="mt-auto w-full bg-black text-white border-t-2 border-orange-400 py-3 sm:py-2 md:py-3">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center gap-3 sm:gap-4 md:gap-5">
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

export default HowToChooseMobileNumberBlog;