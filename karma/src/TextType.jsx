import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function TextType({ text, speed = 0.05 }) {
  const textRef = useRef(null);

  useEffect(() => {
    const element = textRef.current;
    element.innerHTML = ""; // clear first

    const tl = gsap.timeline();

    // Typing animation
    text.split("").forEach((char, i) => {
      tl.to(
        element,
        {
          duration: speed,
          onStart: () => {
            element.innerHTML += char;
          },
        },
        i * speed
      );
    });
  }, [text, speed]);

  return (
    <span
      ref={textRef}
      style={{
        display: "inline-block",
        whiteSpace: "pre",
      }}
    ></span>
  );
}
