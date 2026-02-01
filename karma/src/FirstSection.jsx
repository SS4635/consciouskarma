import React, { useState, useRef, useEffect } from "react";

export default function FirstSection({ resolvedRoute }) {
  const [inputValue, setInputValue] = useState("");
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);

  // ✅ route fallback
  const apiRoute = resolvedRoute;
  const API_BASE = "https://api.consciouskarma.co/micro";

  // 🔎 DEBUG: route check
  useEffect(() => {
    console.log("Resolved Route:", resolvedRoute);
    console.log("API Route Used:", apiRoute);
  }, [resolvedRoute, apiRoute]);

  // Auto focus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ✅ API CALL LOGIC (FINAL)
  useEffect(() => {
    if (inputValue.length !== 10) {
      setApiData(null);
      setError(null);
      return;
    }

    const fetchScore = async () => {
      setLoading(true);
      setError(null);
      setApiData(null);

      try {
        const response = await fetch(`${API_BASE}${apiRoute}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": "CK_Score_2365abhnf895asfw",
          },
          body: JSON.stringify({ mobile_number: inputValue }),
        });

        if (!response.ok) throw new Error("API failed");

        const data = await response.json();
        console.log("API DATA:", data);

        setApiData(data);
      } catch (err) {
        console.error(err);
        setError("Connection failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchScore, 300);
    return () => clearTimeout(timer);
  }, [inputValue, apiRoute]);

  const handleChange = (e) => {
    const val = e.target.value;
    if (/^[0-9]*$/.test(val) && val.length <= 10) {
      setInputValue(val);
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const isComplete = inputValue.length === 10;

  return (
    <section className="bg-black text-white mt-20">
      <main className="flex items-center m-2 md:m-8">
        <div className="flex flex-col w-full">
          <div className="self-center w-full p-6 md:w-4/5">
            <div className="flex flex-col items-start w-full">

              {/* FORM */}
              <form
                className="flex flex-col items-start w-full"
                onSubmit={(e) => e.preventDefault()}
              >
                {/* Header */}
                <div className="flex justify-end items-end w-full mb-6">
                  <span
                    className={`text-2xl md:text-3xl font-bold ${
                      isComplete ? "text-green-500" : "text-white"
                    }`}
                  >
                    number energy
                  </span>
                </div>

                {/* OTP INPUT */}
                <div
                  className="relative flex gap-2 w-full justify-between cursor-text h-24 items-center"
                  onClick={handleContainerClick}
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
                          border-2 rounded-lg
                          ${isActive ? "animate-bounce" : ""}
                        `}
                        style={{
                          borderColor: "#ff914d",
                          color: "white",
                        }}
                      >
                        {char}
                        {isActive && (
                          <div className="absolute h-1/2 w-[2px] bg-[#ff914d] animate-pulse"></div>
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

              {/* RESPONSE */}
              <div className="w-full mt-10 min-h-[150px]">

                {loading && (
                  <div className="text-[#ff914d] animate-pulse text-lg">
                    Analyzing energy...
                  </div>
                )}

                {error && (
                  <div className="text-red-500 border border-red-900 p-4 rounded bg-red-900/20">
                    {error}
                  </div>
                )}

                {apiData && !loading && (
                  <div className="border border-[#ff914d] p-6 rounded-xl bg-[#ff914d]/5">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-xs uppercase">Area</p>
                        <p className="text-2xl font-bold">{apiData.area}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase">Score</p>
                        <p className="text-2xl font-bold text-[#ff914d]">
                          {apiData.score}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs uppercase mb-1">
                        Insight
                      </p>
                      <p className="text-lg font-light">
                        {apiData.point}
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
