import React, { useState } from "react";

import CKNavbar from "./components/CKNavbar";

import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";

const HowToChooseMobileNumberBlog = () => {
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
    
  
      <div className="flex-1 w-full max-w-3xl mx-auto p-6 md:p-12 pt-24">
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6  text-white">
          How to Choose a Mobile Number
        </h1>
        <p>Choosing the right mobile number is not a one-size-fits-all process.<br/>
Every person moves through life with different responsibilities, priorities, and aspirations — and a
mobile number should be chosen to support that journey.<br/><br/>
A mobile number influences life through the energy pattern created by its sequence.<br/>
For this reason, it must be selected according to:<br/><br/>
• Who the person is,<br/>
• The stage of life they are in,<br/>
• And the direction they wish to move toward.<br/><br/>
<span style={{"color":"#ff914d"}}>A Number Should Solve a Specific Need</span><br/><br/>
At any point in life, every individual carries a dominant area of focus — career, family, finances,
stability, clarity, confidence, learning, or emotional balance.<br/><br/>
For example:<br/>
• A student may need support in focus and learning.<br/>
• A working professional may require confidence and opportunity.<br/>
• An entrepreneur may seek leadership, clarity, and decision-making strength.<br/>
• A homemaker or parent may benefit from harmony, stability, and emotional balance.<br/><br/>
As life changes, needs change.<br/>
What supported someone a decade ago may not support them today.<br/>
A mobile number should match the current phase of life and the direction in which the individual
intends to grow.<br/><br/>    
<span style={{"color":"#ff914d"}}>Balance Matters</span><br/><br/>
Even when a number is chosen to strengthen a particular area, it must maintain balance across life.<br/><br/>
• A number that improves finances should not disturb relationships.<br/>
• A number that enhances ambition should not create restlessness.<br/>
• A number that brings emotional comfort should not weaken resolve.<br/><br/>
The right number creates a stable, supportive field — one that uplifts multiple aspects of life without
creating inner conflict.<br/><br/>
 <span style={{"color":"#ff914d"}}>The Purpose of Selection</span><br/><br/>
A consciously chosen mobile number should:<br/>
• reduce friction<br/>
• support growth<br/>
• enhance strengths<br/>
• stabilise weaker areas<br/>
• bring clarity and balance to everyday life<br/><br/>
A number is not chosen for symmetry, aesthetics, or memorability.<br/>
It is chosen because its sequence aligns with the individual’s path and creates a harmonious field
around their actions.<br/><br/>
<span style={{"color":"#ff914d"}}>More Than Convenience</span><br/><br/>
A mobile number is not just a point of contact.<br/>
It is a Digital Age Yantra — a tool threaded with energy.<br/>
It becomes active each time it is used, shared, or engaged in interaction — shaping experiences in
subtle and continuous ways.<br/><br/>
<span style={{"color":"#ff914d"}}>A Number That Shapes Destiny</span><br/><br/>
Consciously chosen, a mobile number becomes your greatest asset.<br/>
It influences how opportunities arise, how challenges are absorbed, and how progress unfolds.<br/><br/>
A small change — with the power to transform your path.</p>
        
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