import React, { useState, useRef, useEffect } from "react";

export default function FirstSection({ resolvedRoute }) {
  // Array of 10 strings for individual inputs
  const [otp, setOtp] = useState(new Array(10).fill(""));
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  
  // ✅ NEW STATE: Tracks if user ever hit 10 digits
  const [hasVisitedTen, setHasVisitedTen] = useState(false);

  // Refs for each input to manage focus
  const inputRefs = useRef([]);

  const API_BASE = `${process.env.REACT_APP_API_URL}/api/get-energy`;

  const inputValue = otp.join(""); // Combine array to string for API
  const isComplete = inputValue.length === 10;

  useEffect(() => {
    // Focus first input on load
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // ✅ LOGIC: Once isComplete becomes true, lock hasVisitedTen to true
  useEffect(() => {
    if (isComplete) {
      setHasVisitedTen(true);
    }
  }, [isComplete]);

  // ✅ AUTO-HIDE LOGIC: 4 second baad message gayab
  useEffect(() => {
    let timer;
    if (showInfo) {
      timer = setTimeout(() => {
        setShowInfo(false);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [showInfo]);

  // Handle typing in individual boxes
  const handleChange = (element, index) => {
    const val = element.value;
    if (isNaN(val)) return; // Only numbers

    const newOtp = [...otp];
    // Allow only last entered character
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Jump to next
    if (val && index < 9) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
        const newOtp = [...otp];
        newOtp[index - 1] = ""; 
        setOtp(newOtp);
      }
    }
  };

  // Handle Paste
  const handlePaste = (e) => {
    e.preventDefault();
    const val = e.clipboardData.getData("text").slice(0, 10);
    if (/^[0-9]+$/.test(val)) {
      const newOtp = val.split("");
      while (newOtp.length < 10) newOtp.push("");
      setOtp(newOtp);
      const focusIndex = val.length < 10 ? val.length : 9;
      inputRefs.current[focusIndex].focus();
    }
  };

  const handleFetch = async () => {
    if (!isComplete) return;
    setLoading(true);
    setError(null);
    setApiData(null);

    try {
      const response = await fetch(`${API_BASE}${resolvedRoute}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "CK_Score_2365abhnf895asfw",
        },
        body: JSON.stringify({ mobile_number: inputValue }),
      });

      if (!response.ok) throw new Error("API failed");
      const data = await response.json();
      setApiData(data);
    } catch (err) {
      setError("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleScrollNext = () => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  // ✅ HELPER: Get Heading & Icon based on Route
  const getRouteDetails = (route) => {
    const r = route?.replace(/\/$/, "") || "";
    const commonIcon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6 md:w-10 md:h-10"
        style={{ color: "#b0b0b0" }} 
      >
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
    );

    if (r.endsWith("a1")) return { title: "abc", icon: commonIcon };
    if (r.endsWith("a2")) return { title: "ggg", icon: commonIcon };
    if (r.endsWith("a3")) return { title: "aaa", icon: commonIcon };

    return { title: "Result", icon: commonIcon };
  };
  const routeDetails = getRouteDetails(resolvedRoute);

  let numericScore = 0;
  if (apiData?.score) {
    numericScore = parseInt(apiData.score);
    if (isNaN(numericScore)) numericScore = 0;
  }

  const hasResults = !!apiData;

  return (
    <section
      className={`
  bg-black text-white min-h-screen flex flex-col items-center relative overflow-hidden font-arsenal
  transition-all duration-700 ease-in-out
  ${
    hasResults
      ? "justify-start pt-24 md:pt-10 pb-10" 
      : "justify-center pt-16 md:pt-20"      
  }
`}
    >
      <main className="flex flex-col items-center w-full max-w-[95rem] transition-all duration-500 ease-in-out">
        <div className="w-full p-4 flex flex-col items-center">
          <form
            className="flex flex-col items-center w-full"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* 2. OTP INPUT GRID */}
            <div className="relative flex gap-[8px] md:gap-12 w-full justify-center cursor-text h-24 md:h-32 items-center z-10">
              {otp.map((data, index) => {
                const firstEmptyIndex = otp.findIndex((val) => val === "");
                const shouldBounce = index === firstEmptyIndex;

                return (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={data}
                    onClick={(e) => e.target.select()}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    style={{ fontSize: 'clamp(20px, 4vw, 36px)' }}
                    className={`flex items-center justify-center text-center shrink-0
                            h-10 w-8 md:h-[75px] md:w-16
                            font-mono
                            border-[1.5px] rounded-md md:rounded-lg
                            transition-all duration-300 outline-none
                            bg-transparent
                            border-[#ff914d]
                            text-white caret-transparent selection:bg-transparent
                            focus:bg-[#ff914d]/10
                            ${shouldBounce ? "animate-bounce" : ""} 
                        `}
                  />
                );
              })}
            </div>

            {/* 3. SWITCHING LOGIC: Text/Icon vs Button */}
            <div className="flex items-center justify-center w-full min-h-[100px] mt-6 relative">
              
              {/* LOGIC: 
                  Display "Enter Mobile Number" ONLY if user has NEVER reached 10 digits.
                  Otherwise, display "Get Number Energy" (active or inactive state).
              */}
              {!hasVisitedTen ? (
                /* CASE A: Never reached 10 digits yet -> Show Arrow & Text */
                <div className="flex flex-col items-center animate-in fade-in duration-300">
                  
                  {/* Row 1: ARROW IMAGE */}
                  <div className="relative">
                    <img 
  src="/aw.png" 
  alt="Pointing to input"
  className="
    /* --- MOBILE (Default) --- */
    /* Image ko upar overlap karwane ke liye */
    h-[70px] w-[250px] 
    rotate-[30deg] 
    ml-[-145px] 
    mt-[-90px]      /* Overlap badhane ke liye -60 se -110 kiya */
    relative z-50    /* Content ke upar dikhne ke liye */
    opacity-90 
    pointer-events-none 
    object-fill
    
    /* --- LAPTOP (Strictly Maintained) --- */
    md:rotate-[-355deg]
    md:ml-[-330px]
    md:mt-[-20px]
    md:h-[180px]
    md:w-[694px]
    md:z-10          /* Laptop par normal layer */
  "
  style={{ backgroundPosition: '-120%' }} /* background-[-120%] style tag mein safe rehta hai */
/>
                  </div>

                  {/* Row 2: TEXT + SUPERSCRIPT ICON */}
                  {/* Change 1: items-start use kiya taaki icon upar (top) align ho */}
                  <div className="flex items-start md:items-center -mt-[49px] md:-mt-[89px]">
                    <span 
                      className="text-[#E5E7EB] font-thin text-gray-200 leading-none" 
                      style={{ fontSize: 'clamp(22px, 3.5vw, 32px)' }} 
                    >
                      Enter Mobile Number
                    </span>
                    
                    {/* 'i' Icon acting as Power/Superscript */}
                    <button
                      type="button"
                      onClick={() => setShowInfo(true)}
                      // Change 2: -mt-1 (negative margin) se upar uthaya, ml-1 se thoda gap diya
                      className="text-[#ff914d] hover:text-white transition-colors duration-300 ml-1 -mt-1"
                    >
                       <svg 
                         xmlns="http://www.w3.org/2000/svg" 
                         fill="none" 
                         viewBox="0 0 24 24" 
                         strokeWidth={2.5} 
                         stroke="currentColor" 
                         // Change 3: Icon ka size chhota kiya (w-4 h-4)
                         className="w-4 h-4 md:w-5 md:h-5"
                       >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                /* CASE B: Visited 10 digits at least once -> Show Button Logic */
                <button
                  type="button"
                  onClick={handleFetch}
                  disabled={!isComplete} // Disable click if digits removed
                  style={{ fontSize: 'clamp(16px, 4vw, 20px)' }}
                  className={`
                    px-6 py-2 md:px-8 md:py-3 
                    rounded-lg font-medium tracking-wide 
                    transition-all duration-300 animate-in zoom-in-90 mt-1 border-1
                    ${isComplete 
                        ? "border-[#ff914d] bg-black text-[#ff914d] cursor-pointer" 
                        : "border-white bg-transparent text-[white] opacity-80 cursor-default"
                    }
                  `}
                >
                  Get Number Energy
                </button>
              )}
            </div>

            {/* FLASH MESSAGE BAR */}
            {showInfo && (
              <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300 w-full max-w-md">
                <div className="bg-[#111] border border-[#ff914d] text-gray-200 px-6 py-3 rounded-lg text-center text-sm tracking-wide shadow-[0_0_15px_rgba(255,145,77,0.2)]">
                  Add leading <strong>0</strong>s if less than 10 digits. Enter
                  first 10 if more.
                </div>
              </div>
            )}
          </form>

          {/* RESPONSE AREA */}
          <div className="w-full mt-6 min-h-[150px] flex flex-col items-center">
            {loading && (
              <div className="text-[#ff914d] animate-pulse text-lg text-center tracking-widest">
                ANALYZING ENERGY...
              </div>
            )}

            {error && (
              <div className="text-red-400 border border-red-900 p-4 rounded bg-red-900/10 text-center">
                {error}
              </div>
            )}

            {apiData && !loading && (
              <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col items-center">
                
                <h2 
                    className="font-light text-center mb-6 capitalize tracking-widest text-white"
                    style={{ fontSize: 'clamp(24px, 5vw, 36px)' }}
                >
                  {routeDetails.title}
                </h2>

                {/* CHART SECTION */}
                <div className="relative flex items-center justify-center w-full mb-6 px-0 max-w-5xl">
                  {/* Left Bars */}
                  <div className="flex flex-1 justify-end gap-1">
                    {[-5, -4, -3, -2, -1].map((val, index) => {
                      const isActive = numericScore < 0 && numericScore <= val;
                      const roundedClass =
                        index === 0 ? "rounded-l-full" : "rounded-none";
                      return (
                        <div
                          key={val}
                          className={`h-6 md:h-8 w-full max-w-[100px] transition-all duration-500 ${roundedClass} ${
                            isActive ? "bg-[#B23A41]" : "bg-[#b0b0b0]"
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* Center Circle with Icon */}
                  <div className="relative z-20 flex-shrink-0 -mx-4 md:-mx-6">
                    <div
                      className="flex items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-full bg-black shadow-2xl"
                      style={{ border: "3px solid #b0b0b0" }}
                    >
                      {routeDetails.icon}
                    </div>
                  </div>

                  {/* Right Bars */}
                  <div className="flex flex-1 justify-start gap-1">
                    {[1, 2, 3, 4, 5].map((val, index) => {
                      const isActive = numericScore > 0 && numericScore >= val;
                      const roundedClass =
                        index === 4 ? "rounded-r-full" : "rounded-none";
                      return (
                        <div
                          key={val}
                          className={`h-6 md:h-8 w-full max-w-[100px] transition-all duration-500 ${roundedClass} ${
                            isActive ? "bg-[#15803d]" : "bg-[#b0b0b0]"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* INSIGHT TEXT */}
                <div className="text-center px-4 md:px-12 max-w-4xl">
                  <p className="text-white text-[10px] uppercase mb-4 tracking-[0.2em]">
                    INSIGHT
                  </p>
                  
                  <p 
                    className="font-light leading-relaxed text-gray-200"
                    style={{ fontSize: 'clamp(18px, 2.5vw, 24px)' }}
                  >
                    "{apiData.point}"
                  </p>
                </div>

                {/* EXPLORE BUTTON */}
                <div className="mt-6 mb-4 animate-in fade-in duration-1000 delay-500">
                  <button
                    onClick={handleScrollNext}
                    className="flex flex-col items-center justify-center group cursor-pointer"
                  >
                    <span className="text-[12px] uppercase tracking-[0.2em] mb-2 text-[#ff914d] group-hover:text-white transition-colors bg-black/80 px-3 py-1 rounded-full backdrop-blur-sm border border-[#ff914d]/30">
                      Explore More
                    </span>
                    <div className="animate-bounce text-[#ff914d] group-hover:text-white transition-colors text-2xl drop-shadow-md">
                      ↓
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BEAUTIFUL INFO MODAL */}
        {showInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-300">
            {/* Background Blur */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowInfo(false)}
            />

            {/* Modal Box */}
            <div className="relative bg-[#111] border border-[#ff914d]/40 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-[0_0_30px_rgba(255,145,77,0.15)] flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-[#ff914d]/10 flex items-center justify-center mb-4 text-[#ff914d]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18v-5.25m0-4.5h.007v.008H12v-.008ZM11.25 10.5h1.5m-7.5 9.75h12a2.25 2.25 0 0 0 2.25-2.25v-12a2.25 2.25 0 0 0-2.25-2.25h-12a2.25 2.25 0 0 0-2.25 2.25v12a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              </div>

              <h3 className="text-xl md:text-2xl font-light text-white mb-2 tracking-wide">
                Entry Instructions
              </h3>

              <div className="w-12 h-[1px] bg-[#ff914d] mb-6"></div>

              <div className="space-y-4 text-gray-300 text-sm md:text-base font-light leading-relaxed">
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <p className="text-white mb-1 font-medium">
                    Fewer than 10 digits?
                  </p>
                  <p className="opacity-80">
                    Add leading <span className="text-[#ff914d] font-bold">0</span>s
                    to fill the empty boxes.
                  </p>
                </div>

                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <p className="text-white mb-1 font-medium">
                    More than 10 digits?
                  </p>
                  <p className="opacity-80">
                    Enter as many digits as possible (first 10).
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowInfo(false)}
                className="mt-8 px-8 py-2 bg-[#ff914d] hover:bg-[#ff8033] text-black font-semibold rounded-full text-sm tracking-widest uppercase transition-all shadow-lg shadow-[#ff914d]/20"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </main>
    </section>
  );
}