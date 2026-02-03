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

  const getBorderColor = (index) => {
    const lightness = 60 - (index * 4);
    return `hsl(28, 100%, ${lightness}%)`;
  };

  // ✅ HELPER: Get Heading & Icon based on Route
  const getRouteDetails = (route) => {
    // Normalize route string (remove trailing slashes if any)
    const r = route?.replace(/\/$/, "") || "";

    if (r.endsWith("a1")) {
      return { 
        title: "abc", 
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) 
      };
    } 
    if (r.endsWith("a2")) {
      return { 
        title: "ggg", 
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ) 
      };
    } 
    if (r.endsWith("a3")) {
      return { 
        title: "aaa", 
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        ) 
      };
    }
    // Default Fallback
    return { 
      title: "Result", 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ) 
    };
  };

  const isComplete = inputValue.length === 10;
  const routeDetails = getRouteDetails(resolvedRoute);

  // Parse Score safely
  let numericScore = 0;
  if (apiData?.score) {
    // If score is a string like "-2, +3", take the sum or first part. 
    // Assuming single number logic for the bar chart (-5 to 5)
    // If it's a pure string number "4" or "-3":
    numericScore = parseInt(apiData.score); 
    if (isNaN(numericScore)) numericScore = 0;
  }

  return (
    <section className="bg-black text-white min-h-screen flex flex-col justify-center relative overflow-hidden pt-20">
      
      <main className={`flex items-center m-2 md:m-8 transition-transform duration-500 ease-in-out ${ (apiData || loading) ? "-translate-y-16 md:-translate-y-24" : "translate-y-0"}`}>
        <div className="flex flex-col w-full">
          <div className="self-center w-full p-6 md:w-4/5">
            <div className="flex flex-col items-start w-full">
              
              <form
                className="flex flex-col items-start w-full"
                onSubmit={(e) => e.preventDefault()}
              >
                {/* Header: Arrow + Button */}
                <div className="flex justify-end items-center w-full mb-8 gap-4 mt-2">
                  
                  {/* ✅ IMAGE ARROW */}
                  {isComplete && (
                    <div className="transform rotate-[-10deg] pb-0" style={{ paddingBottom: "-14px", marginTop:"0px", marginRight:"-20px"}}> 
                      <img 
                        src="/arrow.png" 
                        alt="Arrow"
                        className="w-24 h-14 md:w-44 md:h-24 object-contain opacity-90" 
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleFetch}
                    disabled={!isComplete}
                    className={`text-2xl md:text-3xl font-bold transition-colors duration-300 ease-in-out z-10 mb-5 pb-0 mt-5${
                      isComplete 
                        ? "text-green-500 cursor-pointer scale-105" 
                        : "text-white opacity-80 cursor-default"
                    }`}
                    style={{marginBottom:"-9px"}}
                  >
                    number energy
                  </button>
                </div>

                {/* OTP INPUT */}
                <div
                  className="relative flex gap-2 w-full justify-between cursor-text h-24 items-center"
                  onClick={() => inputRef.current?.focus()}
                >
                  {Array.from({ length: 10 }).map((_, i) => {
                    const isActive = i === inputValue.length;
                    const char = inputValue[i] || "";

                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-center
                          h-8 w-6 md:h-16 md:w-12
                          text-xl md:text-3xl font-mono
                          border-[1px] rounded-lg
                          ${isActive ? "animate-bounce" : ""}
                        `}
                        style={{
                          borderColor: getBorderColor(i),
                          color: "white",
                        }}
                      >
                        {char}
                        {isActive && (
                          <div 
                            className="absolute h-1/2 w-[2px] animate-pulse"
                            style={{ backgroundColor: getBorderColor(i) }}
                          ></div>
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
              </form>

              {/* RESPONSE AREA */}
              <div className="w-full mt-12 min-h-[150px]">
                {loading && (
                  <div className="text-[#ff914d] animate-pulse text-lg text-center">
                    Analyzing energy...
                  </div>
                )}

                {error && (
                  <div className="text-red-500 border border-red-900 p-4 rounded bg-red-900/20 text-center">
                    {error}
                  </div>
                )}

                {apiData && !loading && (
                  <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                    
                    {/* 1. Dynamic Heading */}
                    <h2 className="text-3xl font-light text-center mb-6 capitalize tracking-wide text-white">
                      {routeDetails.title}
                    </h2>

                    {/* 2. Visual Bar Chart (-5 to +5) */}
                    <div className="relative flex items-center justify-center w-full mb-8">
  
  {/* Left Side Bars (Negative) */}
  <div className="flex flex-1 justify-end gap-1 md:gap-1.5 pr-0">
    {[-5, -4, -3, -2, -1].map((val, index) => {
      const isActive = numericScore < 0 && numericScore <= val;
      const roundedClass = index === 0 ? "rounded-l-full" : "";
      return (
        <div
          key={val}
          className={`h-4 md:h-6 w-full max-w-[70px] transition-all duration-500 ${roundedClass} ${
            isActive ? "bg-[#B23A41]" : "bg-[#B7B0A9]"
          }`}
        />
      );
    })}
  </div>

  {/* CENTER PART: Overlapping Icon */}
  {/* Isko bars ke upar laane ke liye z-index aur negative margin ka use kiya hai */}
  <div className="relative z-30 flex-shrink-0 -mx-4 md:-mx-6">
    <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-white bg-black p-2 shadow-xl">
      {routeDetails.icon}
    </div>
  </div>

  {/* Right Side Bars (Positive) */}
  <div className="flex flex-1 justify-start gap-1 md:gap-1.5 pl-0">
    {[1, 2, 3, 4, 5].map((val, index) => {
      const isActive = numericScore > 0 && numericScore >= val;
      const roundedClass = index === 4 ? "rounded-r-full" : "";
      return (
        <div
          key={val}
          className={`h-4 md:h-6 w-full max-w-[70px] transition-all duration-500 ${roundedClass} ${
            isActive ? "bg-[#15803d] " : "bg-[#B7B0A9]"
          }`}
        />
      );
    })}
  </div>

</div>
                    {/* 3. Insight Text */}
                    <div className="text-center px-4">
                      <p className="text-gray-400 text-xs uppercase mb-2 tracking-widest">
                        Insight
                      </p>
                      <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-100">
                        "{apiData.point}"
                      </p>
                    </div>

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Scroll to Next Section Button */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <button 
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="flex flex-col items-center text-gray-500 hover:text-[#ff914d] transition-colors cursor-pointer p-4"
          style={{color:"#ff914d"}}
        >
          <span className="text-[10px] uppercase tracking-widest mb-1"  style={{ fontSize: "20px" }}>Scroll to Next Section</span>
          <div className="animate-bounce text-xl"  style={{ fontSize: "20px" }}>↓</div>
        </button>
      </div>

    </section>
  );
}