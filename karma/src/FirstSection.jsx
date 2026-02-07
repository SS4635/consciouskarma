import React, { useState, useRef, useEffect } from "react";

export default function FirstSection({ resolvedRoute }) {
  // Array of 10 strings for individual inputs
  const [otp, setOtp] = useState(new Array(10).fill(""));
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  // Refs for each input to manage focus
  const inputRefs = useRef([]);

  const API_BASE = `${process.env.REACT_APP_API_URL}/api/get-energy`;

  useEffect(() => {
    // Focus first input on load
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

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
    // Allow only last entered character (agar user purane par type kare)
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Agar value enter hui hai aur ye last box nahi hai, toh next pe jump karo
    if (val && index < 9) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace (Smooth & Continuous Delete)
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault(); // Browser ka default behavior roko (Zaroori hai)

      if (otp[index]) {
        // Case 1: Agar current box mein number hai -> Sirf usko clear karo
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Case 2: Agar current box khali hai -> Piche focus karo AUR piche wala bhi delete karo
        inputRefs.current[index - 1].focus();

        const newOtp = [...otp];
        newOtp[index - 1] = ""; // Piche wala box turant clear karo
        setOtp(newOtp);
      }
    }
  };

  // Handle Paste (Pura number ek saath paste karne ke liye)
  const handlePaste = (e) => {
    e.preventDefault();
    const val = e.clipboardData.getData("text").slice(0, 10);
    if (/^[0-9]+$/.test(val)) {
      const newOtp = val.split("");
      // Fill remaining with empty if pasted length < 10
      while (newOtp.length < 10) newOtp.push("");
      setOtp(newOtp);
      // Focus last filled index
      const focusIndex = val.length < 10 ? val.length : 9;
      inputRefs.current[focusIndex].focus();
    }
  };

  const inputValue = otp.join(""); // Combine array to string for API
  const isComplete = inputValue.length === 10;

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

    // Common Icon Definition (Bar Chart with Grey Color)
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
        style={{ color: "#b0b0b0" }} // Yahan color set kar diya
      >
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
    );

    // Agar special route hai toh title change hoga
    if (r.endsWith("a1")) return { title: "abc", icon: commonIcon };
    if (r.endsWith("a2")) return { title: "ggg", icon: commonIcon };
    if (r.endsWith("a3")) return { title: "aaa", icon: commonIcon };

    // Default Fallback
    return {
      title: "Result",
      icon: commonIcon,
    };
  };
  const routeDetails = getRouteDetails(resolvedRoute);

  // Parse Score
  let numericScore = 0;
  if (apiData?.score) {
    numericScore = parseInt(apiData.score);
    if (isNaN(numericScore)) numericScore = 0;
  }

  // ✅ LOGIC CHANGE: Check if we have results to toggle layout
  const hasResults = !!apiData;

  return (
    <section
      className={`
  bg-black text-white min-h-screen flex flex-col items-center relative overflow-hidden
  transition-all duration-700 ease-in-out
  ${
    hasResults
      ? "justify-start pt-24 md:pt-10 pb-10" // Result Mode: Top alignment
      : "justify-center pt-16 md:pt-20"      // Input Mode: Center
  }
`}
    >
      <main className="flex flex-col items-center w-full max-w-[95rem] transition-all duration-500 ease-in-out">
        <div className="w-full p-4 flex flex-col items-center">
          <form
            className="flex flex-col items-center w-full"
            onSubmit={(e) => e.preventDefault()}
          >

            {/* 2. OTP INPUT GRID (Individual Inputs) */}
            <div className="relative flex gap-[8px] md:gap-12 w-full justify-center cursor-text h-24 md:h-32 items-center z-10">
              {otp.map((data, index) => {
                // Logic: Pehla khaali box dhoondo
                const firstEmptyIndex = otp.findIndex((val) => val === "");

                // Sirf wahi box bounce karega jo 'firstEmptyIndex' hai.
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
                    className={`flex items-center justify-center text-center shrink-0
                            h-10 w-8 md:h-[75px] md:w-16
                            text-2xl md:text-3xl font-mono
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
              
              {!isComplete ? (
                /* CASE A: Number Incomplete -> Stack Layout (Column) */
                <div className="flex flex-col items-center animate-in fade-in duration-300">
                  
                  {/* Row 1: ARROW IMAGE (Pointing Up) */}
                  <div className="">
                    <img 
                      src="/arroww.png" 
                      alt="Pointing to input"
                      className="
                        rotate-[-155deg]  
                        bottom-[120%]     /* Angle */
                        opacity-90 
                        pointer-events-none
                        mr-5rem 
                        ml-[-350px]
                        mt-[-30px]
                        h-[4px] md:h-[30px]    /* ✅ Height: Jitna lamba chahiye yahan badha */
    w-[300px] md:w-[624px]      /* ✅ Width: Jitna mota chahiye yahan set kar */
    object-fill
                        
                      "
                    />
                  </div>

                  {/* Row 2: TEXT + ICON (Side by Side) */}
                  <div className="flex items-center gap-3 mt-3">
                    <span 
                      className="text-#E5E7EB tracking-widest font-thin text-gray-200 leading-tight" style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', lineHeight: '1.3' }} 
                    >
                      Enter Mobile Number
                    </span>
                    
                    {/* 'i' Icon */}
                    <button
                      type="button"
                      onClick={() => setShowInfo(true)}
                      className="flex items-center justify-center text-[#ff914d] hover:text-white transition-colors duration-300 p-1"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                /* CASE B: Number Complete (Show GET ENERGY Button) */
                <button
                  type="button"
                  onClick={handleFetch}
                  className="px-8 py-3 bg-[#ff914d] text-white rounded-lg text-lg md:text-xl font-medium tracking-wide shadow-[0_0_20px_rgba(255,145,77,0.5)] hover:bg-[#ff8033] transition-all duration-300 animate-in zoom-in-90 mt-8"
                >
                  Get Number Energy
                </button>
              )}
            </div>

            {/* ✅ FLASH MESSAGE BAR */}
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
                <h2 className="text-2xl md:text-3xl font-light text-center mb-6 capitalize tracking-widest text-white">
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
                      style={{ border: "3px solid #b0b0b0" }} // Using your grey border color
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
                  <p className="text-lg md:text-2xl font-light leading-relaxed text-gray-200">
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
        {/* ✅ BEAUTIFUL INFO MODAL */}
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