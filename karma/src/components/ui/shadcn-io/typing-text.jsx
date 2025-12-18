"use client";
import { useEffect, useState } from "react";

export default function TypingText({
  text = [],
  typingSpeed = 80,
  pauseDuration = 1000,
  showCursor = true,
  className = "",
  cursorClassName = "",
  textColors = [],
  variableSpeed = null,
  onComplete = () => {},   // <-- ADD THIS
}) {
  const [currentText, setCurrentText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    let timeout;

    const type = () => {
      const fullText = text[index];

      if (charIndex < fullText.length) {
        setCurrentText((prev) => prev + fullText.charAt(charIndex));

        const speed = variableSpeed
          ? Math.floor(Math.random() * (variableSpeed.max - variableSpeed.min + 1)) +
            variableSpeed.min
          : typingSpeed;

        setCharIndex(charIndex + 1);

        timeout = setTimeout(type, speed);
      } else {
        timeout = setTimeout(() => {
          onComplete(); // <-- CALL HERE
        }, pauseDuration);
      }
    };

    timeout = setTimeout(type, typingSpeed);
    return () => clearTimeout(timeout);
  }, [charIndex]);

  return (
    <span
      className={`inline-flex items-center gap-1 ${className}`}
      style={{
        color: textColors.length > 0 ? textColors[colorIndex] : "inherit",
      }}
    >
      {currentText}

      {showCursor && (
        <span
          className={`inline-block bg-current w-1 ml-1 animate-pulse ${cursorClassName}`}
        ></span>
      )}
    </span>
  );
}
