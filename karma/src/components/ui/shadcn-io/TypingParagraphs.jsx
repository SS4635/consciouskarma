// "use client";
// import { useState, useEffect, useRef } from "react";
// import TypingText from "./typing-text";

// export default function TypingParagraphs({ blocks }) {
//   const [index, setIndex] = useState(0);
//   const [reset, setReset] = useState(false);
//   const sectionRef = useRef(null);

//   // Restart animation when section enters screen
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIndex(0);
//           setReset(true);
//           setTimeout(() => setReset(false), 10);
//         }
//       },
//       { threshold: 0.4 }
//     );

//     if (sectionRef.current) observer.observe(sectionRef.current);
//     return () => observer.disconnect();
//   }, []);

//   const onComplete = () => {
//     if (index < blocks.length - 1) {
//       setIndex(index + 1);
//     }
//   };

//   if (reset) return <div ref={sectionRef} className="min-h-[200px]" />;

//   return (
//     <div ref={sectionRef}>
//       {blocks.map((block, i) => (
//         <div key={i} className={block.wrapperClass}>
//           {i === index && (
//             <TypingText
//               text={[block.text]}
//               typingSpeed={50}
//               pauseDuration={1000}
//               variableSpeed={{ min: 40, max: 90 }}
//               showCursor={true}
//               className={block.textClass}
//               onComplete={onComplete}
//             />
//           )}

//           {i < index && (
//             <p className={block.textClass}>{block.text}</p>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }



"use client";
import { useState, useEffect, useRef } from "react";
import TypingText from "./typing-text";

export default function TypingParagraphs({ blocks }) {
  const [index, setIndex] = useState(0);
  const [reset, setReset] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIndex(0);
          setReset(true);
          setTimeout(() => setReset(false), 10);
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const onComplete = () => {
    if (index < blocks.length - 1) {
      setIndex(index + 1);
    }
  };

  if (reset) return <div ref={sectionRef} className="min-h-[200px]" />;

  return (
    <div ref={sectionRef}>
      {blocks.map((block, i) => {
        const Wrapper = block.isCTA ? "a" : "div";

        const wrapperProps = block.isCTA
          ? { href: "/consult", className: block.wrapperClass }
          : { className: block.wrapperClass };

        return (
          <Wrapper key={i} {...wrapperProps}>
            
            {/** LIVE TYPING PART */}
            {i === index && (
              <TypingText
                text={[block.text]}
                typingSpeed={50}
                pauseDuration={700}
                variableSpeed={{ min: 40, max: 90 }}
                showCursor={true}
                className={block.textClass}
                onComplete={onComplete}
              />
            )}

            {/** STATIC PART AFTER TYPING FINISH */}
            {i < index &&
              (block.isCTA ? (
                <span className={block.textClass}>{block.text}</span>
              ) : (
                <p className={block.textClass}>{block.text}</p>
              ))}
          </Wrapper>
        );
      })}
    </div>
  );
}

