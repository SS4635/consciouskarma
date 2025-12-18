// import { useState, useEffect } from "react";

// export default function useTypeSequence(lines, speed = 40, pause = 600) {
//   const [index, setIndex] = useState(0);
//   const [subIndex, setSubIndex] = useState(0);
//   const [typingDone, setTypingDone] = useState(false);

//   useEffect(() => {
//     if (index === lines.length) {
//       setTypingDone(true);
//       return;
//     }

//     if (subIndex === lines[index].length) {
//       setTimeout(() => {
//         setIndex((prev) => prev + 1);
//         setSubIndex(0);
//       }, pause);
//       return;
//     }

//     const timeout = setTimeout(() => {
//       setSubIndex((prev) => prev + 1);
//     }, speed);

//     return () => clearTimeout(timeout);
//   }, [subIndex, index, lines, speed, pause]);

//   return { typedLine: lines[index]?.substring(0, subIndex) || "", index, typingDone };
// }


import { useState, useEffect } from "react";

export default function useTypeSequence(lines, speed = 40, pause = 600) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Cursor blink effect
  useEffect(() => {
    const blink = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 400);
    return () => clearInterval(blink);
  }, []);

  useEffect(() => {

    // 🛑 FIX 1 — if index out of range, stop
    if (index >= lines.length) return;

    // 🛑 FIX 2 — if current line does not exist, stop
    if (!lines[index]) return;

    // SAME BEHAVIOR BELOW ↓
    if (subIndex === lines[index].length) {
      setTimeout(() => {
        setIndex((prev) => prev + 1);
        setSubIndex(0);
      }, pause);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, lines, speed, pause]);

  return {
    typedLine: lines[index]?.substring(0, subIndex) || "",
    index,
    cursor: cursorVisible ? "_" : ""
  };
}
