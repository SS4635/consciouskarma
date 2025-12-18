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

        {/* Teaser */}
        <p className="mb-8">
          To read a mobile number, study how its digits interact — beginning with the overlapping pairs.
        </p>

        {/* Introduction */}
        <div className="mb-8 text-gray-300 leading-relaxed">
          <p className="mb-4">
            Every mobile number is a unique sequence of digits — and its uniqueness is the source of its power.
          </p>
          <p className="mb-1">When a mobile number is dialled, the entire sequence becomes active.</p>
          <p className="mb-1">Not an isolated digit.</p>
          <p className="mb-1">Not a reduced total.</p>
          <p className="mb-4">But the complete arrangement — digit by digit, in the exact order in which it is written.</p>
          <p className="mb-1">This order is never random.</p>
          <p className="mb-4">The position each digit occupies shapes how the number expresses its energy and how it interacts with the life of the person using it.</p>
        </div>

        {/* Section: The Importance of Sequence */}
        <div className="mb-8 text-gray-300 leading-relaxed">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
            The Importance of Sequence
          </h2>
          <p className="mb-2">Consider these numbers:</p>
          <div className="">
            4871365462<br/>
            4183672456<br/>
            4816653427
          </div>
          <p className="mb-1">All three have the same total, yet their behaviour is completely different.</p>
          <p className="mb-4">The reason is simple: the sequence is not the same.</p>
          <p className="mb-1">Just as rearranging words changes the meaning of a sentence, rearranging digits changes the meaning of a mobile number.</p>
          <p className="mb-4">A number is defined not only by what digits it contains, but by where those digits appear.</p>
        </div>

        {/* Section: Position Alters Meaning */}
        <div className="mb-8 text-gray-300 leading-relaxed">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
            Position Alters Meaning
          </h2>
          <p className="mb-2">Now look at another group:</p>
          <div className="">
            5876332415<br/>
            5876323415<br/>
            5876133415
          </div>
          <p className="mb-1">These numbers appear similar.</p>
          <p className="mb-1">They share digits.</p>
          <p className="mb-1">Their endings look familiar.</p>
          <p className="mb-4">Some clusters repeat.</p>
          <p className="mb-4">And yet, each number carries a different influence.</p>
          <p className="mb-1">A digit expresses itself according to its placement.</p>
          <p className="mb-1">Its effect changes depending on what comes before it, what follows it, and the overall movement of the sequence.</p>
          <p className="mb-4">The energy of a mobile number arises from interaction, not isolation.</p>
        </div>

        {/* Section: Reading a Mobile Number Correctly */}
        <div className="mb-8 text-gray-300 leading-relaxed">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
            Reading a Mobile Number Correctly
          </h2>
          <p className="mb-4">
            To understand the energy of a mobile number, the interaction between digits must be studied across the entire sequence.
          </p>
          <p className="mb-2">A clear and effective method is to break the number into overlapping pairs.</p>
          <p className="mb-2">For example, for <span className="text-white font-mono">5876332415</span>, the overlapping pairs are:</p>
          <p className="mb-4 font-mono text-white">58, 87, 76, 63, 33, 32, 24, 41, 15</p>
          <p className="mb-1">These pairs reveal the flow of the number — how one digit transitions into the next, and how each interaction contributes to the overall pattern that moves through the sequence.</p>
          <p className="mb-4">This movement is what defines the number’s influence.</p>
        </div>

        {/* Section: The User Matters */}
        <div className="mb-8 text-gray-300 leading-relaxed">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
            The User Matters
          </h2>
          <p className="mb-1">A mobile number does not behave identically for everyone.</p>
          <p className="mb-4">The same sequence can express different results depending on who is using it.</p>
          <p className="mb-2">Key factors include:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-gray-300">
            <li>gender</li>
            <li>age</li>
            <li>nature of work</li>
            <li>purpose for which the number is used</li>
          </ul>
          <p className="mb-1">The number remains constant, but the relationship between the number and the user shapes the way its energy is experienced.</p>
          <p className="mb-4">Each individual brings a different background, and the number interacts with that background in its own way.</p>
        </div>

        {/* Section: The Role of Time */}
        <div className="mb-8 text-gray-300 leading-relaxed">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
            The Role of Time
          </h2>
          <p className="mb-4">Time is an essential element in mobile number analysis.</p>
          <p className="mb-4">
            When a number enters a person’s life, the stage they are in — their circumstances, responsibilities, and priorities — forms the backdrop against which the number begins to express itself.
          </p>
          <p className="mb-4">As life changes, this backdrop changes, and the way the number is experienced evolves with it.</p>
          <p className="mb-1">Duration also matters.</p>
          <p className="mb-1">The longer a number is carried, the deeper its patterns settle, stabilise, and reveal themselves.</p>
          <p className="mb-4">Some influences appear early, while others unfold gradually over years of consistent use.</p>
        </div>

        {/* Conclusion */}
        <div className="mb-8 text-gray-300 leading-relaxed border-t border-gray-800 pt-6">
          <p className="mb-4">
            When read correctly, a mobile number reveals the rhythm with which a person moves through life — the way they attract, respond, communicate, decide, and navigate opportunities and challenges.
          </p>
          <p className="mb-1">A mobile number is not merely a mode of contact.</p>
          <p className="mb-4">It is an active pattern — distinct, continuous, and closely woven into the life of the person who carries it.</p>
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
}

export default HowToReadMobileNumberBlog;