"use client";
import TypingText from "./typing-text";

export default function TypingLine({ before, highlight, after }) {
  const fullText = `${before} ${highlight}${after ? " " + after : ""}`;

  return (
    <TypingText
      text={[fullText]}
         typingSpeed={70}
        pauseDuration={1500}
        showCursor={true}
        className="text-5xl"
        // textColors={["#ffba00", "#ff007a", "#00d4ff"]}
        variableSpeed={{ min: 40, max: 120 }}

    />
  );
}
