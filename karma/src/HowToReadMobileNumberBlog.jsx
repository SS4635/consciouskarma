import { useState } from 'react';

import CKNavbar from "./components/CKNavbar";

import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";

function HowToReadMobileNumberBlog() {
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
      
      {/* Main Blog Content */}
      <div className="flex-1 w-full max-w-3xl mx-auto p-6 md:p-12">
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6 pt-3 text-white text-center sm:text-left">
          How to Read a Mobile Number
        </h1>

       

       <p>Every mobile number is a unique sequence of digits — and its uniqueness is the source of its power.<br/><br/>
When a mobile number is dialled, the entire sequence becomes active.<br/>
Not an isolated digit.<br/>
Not a reduced total.<br/>
But the complete arrangement — digit by digit, in the exact order in which it is written.<br/><br/>
This order is never random.<br/>
The position each digit occupies shapes how the number expresses its energy and how it interacts
with the life of the person using it.<br/><br/>
<b>The Importance of Sequence</b><br/><br/>
Consider these numbers:<br/>
4871365462<br/>
4183672456<br/>
4816653427<br/><br/>
All three have the same total, yet their behaviour is completely different.<br/>
The reason is simple: the sequence is not the same.<br/><br/>
Just as rearranging words changes the meaning of a sentence, rearranging digits changes the
meaning of a mobile number.<br/>
A number is defined not only by what digits it contains, but by where those digits appear.<br/><br/>
<b>Position Alters Meaning</b><br/><br/>
Now look at another group:<br/>
5876332415<br/>
5876323415<br/>
5876133415  <br/><br/>
These numbers appear similar.<br/>
They share digits.<br/>
Their endings look familiar.<br/>
Some clusters repeat.<br/><br/>
And yet, each number carries a different influence.<br/><br/>
A digit expresses itself according to its placement.<br/>
Its effect changes depending on what comes before it, what follows it, and the overall movement of
the sequence.<br/>
The energy of a mobile number arises from interaction, not isolation.<br/><br/>
<b>Reading a Mobile Number Correctly</b><br/><br/>
To understand the energy of a mobile number, the interaction between digits must be studied across
the entire sequence.<br/>
A clear and effective method is to break the number into overlapping pairs.<br/><br/>
For example, for 5876332415, the overlapping pairs are:
58, 87, 76, 63, 33, 32, 24, 41, 15 <br/><br/>
These pairs reveal the flow of the number — how one digit transitions into the next, and how each
interaction contributes to the overall pattern that moves through the sequence.<br/><br/>
This movement is what defines the number’s influence.<br/><br/>
The User Matters<br/><br/>
A mobile number does not behave identically for everyone.<br/>
The same sequence can express different results depending on who is using it.<br/><br/>
Key factors include:<br/>
• gender<br/>
• age<br/>
• nature of work<br/>
• purpose for which the number is used<br/><br/>
The number remains constant, but the relationship between the number and the user shapes the
way its energy is experienced.<br/>
Each individual brings a different background, and the number interacts with that background in its
own way.<br/><br/>
<b>The Role of Time</b><br/><br/>
Time is an essential element in mobile number analysis.<br/><br/>
When a number enters a person’s life, the stage they are in — their circumstances, responsibilities,
and priorities — forms the backdrop against which the number begins to express itself.<br/><br/>
As life changes, this backdrop changes, and the way the number is experienced evolves with it.<br/><br/>
Duration also matters.<br/>
The longer a number is carried, the deeper its patterns settle, stabilise, and reveal themselves.<br/><br/>
Some influences appear early, while others unfold gradually over years of consistent use.<br/><br/>
When read correctly, a mobile number reveals the rhythm with which a person moves through life —
the way they attract, respond, communicate, decide, and navigate opportunities and challenges.<br/><br/>
A mobile number is not merely a mode of contact.<br/>
It is an active pattern — distinct, continuous, and closely woven into the life of the person who
carries it.</p>

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
}

export default HowToReadMobileNumberBlog;