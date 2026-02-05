import React, { useState, useRef, useEffect } from "react";

export default function FirstSection({ resolvedRoute }) {
  // Array of 10 strings for individual inputs
  const [otp, setOtp] = useState(new Array(10).fill(""));
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refs for each input to manage focus
  const inputRefs = useRef([]);

  const API_BASE = `${process.env.REACT_APP_API_URL}/api/get-energy`;

  useEffect(() => {
    // Focus first input on load
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

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

  // Handle Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const target = e.target;
      // Check karein ki user ne text select kiya hai ya nahi
      const isSelected = target.selectionStart !== target.selectionEnd;

      if (otp[index]) {
        // Case 1: Box BHARA hua hai
        if (!isSelected) {
           // Agar user ne select NAHI kiya hai, toh delete mat hone do
           e.preventDefault();
        } 
        // Else: Agar select kiya hai, toh browser ka default delete chalne do
      } else {
        // Case 2: Box KHALI hai -> Piche jao
        if (index > 0) {
          e.preventDefault();
          inputRefs.current[index - 1].focus();
        }
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
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  };

  // ✅ HELPER: Get Heading & Icon based on Route
  // const getRouteDetails = (route) => {
  //   const r = route?.replace(/\/$/, "") || "";

  //   // Common Icon Definition (Bar Chart)
  //   const commonIcon = (
  //     <svg 
  //       xmlns="http://www.w3.org/2000/svg" 
  //       viewBox="0 0 24 24" 
  //       fill="none" 
  //       stroke="currentColor" 
  //       strokeWidth="2" 
  //       strokeLinecap="round" 
  //       strokeLinejoin="round" 
  //       className="w-6 h-6 md:w-10 md:h-10"
  //       style={{color:"#bobobo"}}
  //     >
  //       <line x1="18" y1="20" x2="18" y2="10"></line>
  //       <line x1="12" y1="20" x2="12" y2="4"></line>
  //       <line x1="6" y1="20" x2="6" y2="14"></line>
  //     </svg>
  //   );

  //   // Agar special route hai toh title change hoga, par icon abhi sabme dikhega
  //   if (r.endsWith("a1")) return { title: "abc", icon: commonIcon };
  //   if (r.endsWith("a2")) return { title: "ggg", icon: commonIcon };
  //   if (r.endsWith("a3")) return { title: "aaa", icon: commonIcon };

  //   // Default Fallback
  //   return { 
  //     title: "Result", 
  //     icon: commonIcon
  //   };
  // };
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
      icon: commonIcon
    };
  };
  const routeDetails = getRouteDetails(resolvedRoute);
  
  // Parse Score
  let numericScore = 0;
  if (apiData?.score) {
    numericScore = parseInt(apiData.score); 
    if (isNaN(numericScore)) numericScore = 0;
  }

  return (
    <section className="bg-black text-white min-h-screen flex flex-col items-center relative overflow-hidden pt-24 md:pt-10 pb-10">
      <main className="flex flex-col items-center w-full max-w-[95rem] transition-all duration-500 ease-in-out">
        
        <div className="w-full p-4 flex flex-col items-center">
            
            <form className="flex flex-col items-center w-full" onSubmit={(e) => e.preventDefault()}>
            
            {/* 1. LABEL & ARROW - CENTERED */}
            <div className="w-full flex justify-center mb-4">
                <div className="relative text-center w-full max-w-[360px] md:max-w-[1100px] flex justify-center"> 
                    <div className="relative">
                        <span className="block text-gray-300 text-xl md:text-lg tracking-wider font-light mb-1">
                            Enter Mobile Number
                        </span>
                        {/* Arrow Adjustments */}
                        {/* You can re-enable the arrow here if needed */}
                    </div>
                </div>
            </div>

            {/* 2. OTP INPUT GRID (Individual Inputs) */}
            <div className="relative flex gap-[8px] md:gap-12 w-full justify-center cursor-text h-24 md:h-32 items-center">
                {/* {otp.map((data, index) => {
                    const isActive = index === otp.findIndex(val => val === "") || (isComplete && index === 9);
                    

                    return (
                        <input
                            key={index}
                            ref={el => inputRefs.current[index] = el}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={data}
                            onChange={e => handleChange(e.target, index)}
                            onKeyDown={e => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            className={`flex items-center justify-center text-center shrink-0
                                h-10 w-7 md:h-20 md:w-16
                                text-xl md:text-3xl font-mono
                                border-[1.5px] rounded-md md:rounded-lg
                                transition-all duration-300 outline-none
                                bg-transparent
                                border-[#ff914d]
                                text-white caret-transparent selection:bg-transparent
                                `}
                        />
                    );
                })} */}
                {otp.map((data, index) => {
    // Logic: Pehla khaali box dhoondo
    const firstEmptyIndex = otp.findIndex((val) => val === "");
    
    // Sirf wahi box bounce karega jo 'firstEmptyIndex' hai. 
    // Agar sab bhar gaye hain (firstEmptyIndex -1 hoga), toh koi bounce nahi karega.
    const shouldBounce = index === firstEmptyIndex;

    return (
        <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={data}
            onClick={(e) => e.target.select()}
            onChange={e => handleChange(e.target, index)}
            onKeyDown={e => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={`flex items-center justify-center text-center shrink-0
                h-10 w-7 md:h-20 md:w-16
                text-xl md:text-3xl font-mono
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

            {/* 3. BUTTON */}
            <button
                type="button"
                onClick={handleFetch}
                disabled={!isComplete}
                className={"ck-btn1"}                >
                get number energy
            </button>

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
                            const roundedClass = index === 0 ? "rounded-l-full" : "rounded-none";
                            return (
                                <div key={val} className={`h-6 md:h-8 w-full max-w-[100px] transition-all duration-500 ${roundedClass} ${isActive ? "bg-[#B23A41]" : "bg-[#b0b0b0]"}`} />
                            );
                            })}
                        </div>
                        
                        {/* Center Circle with Icon */}
                        <div className="relative z-20 flex-shrink-0 -mx-4 md:-mx-6">
                            <div 
                                className="flex items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-full bg-black shadow-2xl" 
                                style={{border:"3px solid #b0b0b0"}} // Using your grey border color
                            >
                                {routeDetails.icon}
                            </div>
                        </div>
                        
                        {/* Right Bars */}
                        <div className="flex flex-1 justify-start gap-1">
                            {[1, 2, 3, 4, 5].map((val, index) => {
                            const isActive = numericScore > 0 && numericScore >= val;
                            const roundedClass = index === 4 ? "rounded-r-full" : "rounded-none";
                            return (
                                <div key={val} className={`h-6 md:h-8 w-full max-w-[100px] transition-all duration-500 ${roundedClass} ${isActive ? "bg-[#15803d]" : "bg-[#b0b0b0]"}`} />
                            );
                            })}
                        </div>
                    </div>

                    {/* INSIGHT TEXT */}
                    <div className="text-center px-4 md:px-12 max-w-4xl">
                        <p className="text-white text-[10px] uppercase mb-4 tracking-[0.2em]">INSIGHT</p>
                        <p className="text-lg md:text-2xl font-light leading-relaxed text-gray-200">"{apiData.point}"</p>
                    </div>

                    {/* EXPLORE BUTTON */}
                    <div className="mt-6 mb-4 animate-in fade-in duration-1000 delay-500">
                        <button onClick={handleScrollNext} className="flex flex-col items-center justify-center group cursor-pointer">
                            <span className="text-[12px] uppercase tracking-[0.2em] mb-2 text-[#ff914d] group-hover:text-white transition-colors bg-black/80 px-3 py-1 rounded-full backdrop-blur-sm border border-[#ff914d]/30">Explore More</span>
                            <div className="animate-bounce text-[#ff914d] group-hover:text-white transition-colors text-2xl drop-shadow-md">↓</div>
                        </button>
                    </div>
                </div>
            )}
            </div>
            
        </div>
      </main>
    </section>
  );
}