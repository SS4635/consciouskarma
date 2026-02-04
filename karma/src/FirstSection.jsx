import React, { useState, useRef, useEffect } from "react";

export default function FirstSection({ resolvedRoute }) {
  const [inputValue, setInputValue] = useState("");
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);
  const API_BASE = "https://api.consciouskarma.co/micro";

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    if (/^[0-9]*$/.test(val) && val.length <= 10) {
      setInputValue(val);
      if (apiData) setApiData(null);
    }
  };

  const handleFetch = async () => {
    if (inputValue.length !== 10) return;
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
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  // ✅ HELPER: Get Heading & Icon based on Route
  const getRouteDetails = (route) => {
    const r = route?.replace(/\/$/, "") || "";

    if (r.endsWith("a1")) return { title: "abc", icon: null };
    if (r.endsWith("a2")) return { title: "ggg", icon: null };
    if (r.endsWith("a3")) return { title: "aaa", icon: null };

    // Default Fallback
    return { 
      title: "Result", 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 18l6-6" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 20h18" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 20V16" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20V12" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 20V8" />
        </svg>
      ) 
    };
  };

  const isComplete = inputValue.length === 10;
  const routeDetails = getRouteDetails(resolvedRoute);

  // Parse Score
  let numericScore = 0;
  if (apiData?.score) {
    numericScore = parseInt(apiData.score); 
    if (isNaN(numericScore)) numericScore = 0;
  }

  return (
    // FIXED ALIGNMENT:
    // Removed 'justify-center'. Used 'pt-24 md:pt-32' to pin content to the top.
    // This prevents the "Enter Mobile Number" section from moving up when results appear.
    <section className="bg-black text-white min-h-screen flex flex-col items-center relative overflow-hidden pt-24 md:pt-10 pb-10">
      
      <main className="flex flex-col items-center w-full max-w-[95rem] transition-all duration-500 ease-in-out">
        
        <div className="w-full p-4 flex flex-col items-center">
            
            <form
            className="flex flex-col items-center w-full"
            onSubmit={(e) => e.preventDefault()}
            >
            
            {/* 1. LABEL & ARROW */}
            <div className="w-full flex justify-center mb-4">
                <div className="relative w-full max-w-[360px] md:max-w-[1100px]"> 
                    <span className="block text-left text-gray-300 text-xl md:text-lg tracking-wider font-light mb-1 ml-1">
                        Enter Mobile Number
                    </span>
                    
                    {/* Arrow */}
                    <div className="absolute left-[90px] top-[30px] md:left-[140px] md:top-[25px]">
                        <svg 
                            className="w-8 h-8 md:w-12 md:h-12 text-gray-200 opacity-100 transform rotate-[10deg]" 
                            viewBox="0 0 100 100" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                        >
                            <path d="M 0 0 Q 30 10 20 60" strokeLinecap="round" />
                            <path d="M 10 50 L 20 60 L 35 50" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* 2. OTP INPUT GRID */}
            {/* <div
                className="relative flex gap-5 md:gap-20 w-full justify-center cursor-text h-24 md:h-32 items-center"
                onClick={() => inputRef.current?.focus()}
            >
                {Array.from({ length: 10 }).map((_, i) => {
                const isActive = i === inputValue.length;
                const char = inputValue[i] || "";

                return (
                    <div
                    key={i}
                    className={`flex items-center justify-center
                        h-10 w-8 md:h-20 md:w-16
                        text-xl md:text-4xl font-mono
                        border-[1.5px] rounded-md md:rounded-lg
                        transition-all duration-300
                        border-[#ff914d]
                        ${isActive ? "animate-bounce bg-[#ff914d]/10" : ""}
                    `}
                    style={{
                        color: "white",
                    }}
                    >
                    {char}
                    {isActive && (
                        <div 
                        className="absolute h-1/2 w-[2px] bg-[#ff914d]"
                        />
                    )}
                    </div>
                );
                })}

                <input
                ref={inputRef}
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={inputValue}
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0"
                autoComplete="off"
                />
            </div> */}

{/* 2. OTP INPUT GRID */}
<div
  // CORRECT WAY:
  // gap-[2px] -> Mobile ke liye (Jo aapne manga)
  // md:gap-12 -> Desktop ke liye (Bada gap)
  className="relative flex gap-[10px] md:gap-12 w-full justify-center cursor-text h-24 md:h-32 items-center"
  onClick={() => inputRef.current?.focus()}
>
  {Array.from({ length: 10 }).map((_, i) => {
    const isActive = i === inputValue.length;
    const char = inputValue[i] || "";

    return (
      <div
        key={i}
        // shrink-0 zaroor lagana, warna gap-12 aate hi dabbe wapas pichak jayenge
        className={`flex items-center justify-center shrink-0
          h-10 w-7 md:h-20 md:w-16
          text-xl md:text-4xl font-mono
          border-[1.5px] rounded-md md:rounded-lg
          transition-all duration-300
          border-[#ff914d]
          ${isActive ? "animate-bounce bg-[#ff914d]/10" : ""}
        `}
        style={{ color: "white" }}
      >
        {char}
        {isActive && (
          <div className="absolute h-1/2 w-[2px] bg-[#ff914d]" />
        )}
      </div>
    );
  })}

  <input
    ref={inputRef}
    type="tel"
    inputMode="numeric"
    maxLength={10}
    value={inputValue}
    onChange={handleChange}
    className="absolute inset-0 w-full h-full opacity-0"
    autoComplete="off"
  />
</div>

            {/* 3. BUTTON */}
            {/* GAP REDUCED: Changed mt-5 to mt-2 */}
            <button
                type="button"
                onClick={handleFetch}
                disabled={!isComplete}
                className={`text-xl md:text-2xl mt-2 transition-colors duration-300 ease-in-out font-normal tracking-wider ${
                    isComplete 
                    ? "text-[#ff914d] cursor-pointer hover:scale-105 opacity-100" 
                    : "text-white cursor-default opacity-80" 
                }`}
                >
                number energy
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
                
                {/* Result Heading */}
                <h2 className="text-2xl md:text-3xl font-light text-center mb-6 capitalize tracking-widest text-white">
                    {routeDetails.title}
                </h2>

                {/* CHART SECTION */}
                <div className="relative flex items-center justify-center w-full mb-6 px-0 max-w-5xl">

                    {/* Left Side Bars (Negative) */}
                    <div className="flex flex-1 justify-end gap-1">
                        {[-5, -4, -3, -2, -1].map((val, index) => {
                        const isActive = numericScore < 0 && numericScore <= val;
                        const roundedClass = index === 0 ? "rounded-l-full" : "rounded-none";
                        
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

                    {/* CENTER CIRCLE */}
                    <div className="relative z-20 flex-shrink-0 -mx-4 md:-mx-6">
                        <div className="flex items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-full border-[3px] border-white bg-black shadow-2xl">
                            {routeDetails.icon}
                        </div>
                    </div>

                    {/* Right Side Bars (Positive) */}
                    <div className="flex flex-1 justify-start gap-1">
                        {[1, 2, 3, 4, 5].map((val, index) => {
                        const isActive = numericScore > 0 && numericScore >= val;
                        const roundedClass = index === 4 ? "rounded-r-full" : "rounded-none";
                        
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

                {/* EXPLORE MORE BUTTON */}
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
      </main>

    </section>
  );
}