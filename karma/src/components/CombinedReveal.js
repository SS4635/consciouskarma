"use client";
import React, { useEffect, useRef, useState } from "react";

// =======================
//  Decrypt Text Component
// =======================
function SequentialDecrypt({ text, speed = 30, onComplete }) {
  const [decrypted, setDecrypted] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDecrypted(text.slice(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(interval);
        onComplete && onComplete();
      }
    }, speed);
  }, [text]);

  return <span>{decrypted}</span>;
}

// =======================================
//    MAIN CONTROLLER (FADE + DECRYPT)
// =======================================
export default function CombinedReveal() {
  const sectionRef = useRef(null);
  const [step, setStep] = useState(0); // 0 → nothing, 1 → fade1, 2 → decrypt1, 3 → fade2 …

  const lines = [
    "A mobile number is a DIGITAL AGE YANTRA, a tool threaded with different forms of energy.",

    "Consciously crafted, it holds the power to ease a journey, shape a path, and open new opportunities.",

    "Your mobile number is not just utility. It is your greatest asset — THE CODE OF YOUR JOURNEY.",

    "Invest in your greatest asset >>>"
  ];

  // Detect scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStep(1); // start animation
        else setStep(0); // reset when out of view
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="space-y-12">

      {/* ---------- BLOCK 1 ---------- */}
      <FadeAndDecrypt
        index={1}
        step={step}
        setStep={setStep}
        text={lines[0]}
      />

      {/* ---------- BLOCK 2 ---------- */}
      <FadeAndDecrypt
        index={2}
        step={step}
        setStep={setStep}
        text={lines[1]}
      />

      {/* ---------- BLOCK 3 ---------- */}
      <FadeAndDecrypt
        index={3}
        step={step}
        setStep={setStep}
        text={lines[2]}
      />

      {/* ---------- BLOCK 4 ---------- */}
      <FadeAndDecrypt
        index={4}
        step={step}
        setStep={setStep}
        text={lines[3]}
      />
    </div>
  );
}

// =======================================
//    REUSABLE Sub Component
// =======================================
function FadeAndDecrypt({ index, step, setStep, text }) {
  const fadeVisible = step === index * 2 - 1;
  const decryptVisible = step === index * 2;

  return (
    <div className="text-center">

      {/* Fade-in block */}
      <div
        className={`transition-all duration-700 text-[#d87d3d] text-lg opacity-0 translate-y-5
          ${fadeVisible ? "opacity-100 translate-y-0" : ""}
        `}
        onTransitionEnd={() => {
          if (fadeVisible) setStep(step + 1);
        }}
      >
        {fadeVisible && text} 
      </div>

      {/* Decrypt text block */}
      {decryptVisible && (
        <div className="text-[#d87d3d] text-lg mt-2">
          <SequentialDecrypt
            text={text}
            onComplete={() => setStep(step + 1)}
          />
        </div>
      )}
    </div>
  );
}
