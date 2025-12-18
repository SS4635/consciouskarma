// import { useEffect, useRef, useState } from "react";

// export default function FadeInOnScroll({ children, delay = 0 }) {
//   const ref = useRef(null);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setVisible(true);
//         }
//       },
//       { threshold: 0.3 }
//     );

//     if (ref.current) observer.observe(ref.current);

//     return () => {
//       if (ref.current) observer.unobserve(ref.current);
//     };
//   }, []);

//   return (
//     <div
//       ref={ref}
//       style={{
//         opacity: visible ? 1 : 0,
//         transform: visible ? "translateY(0px)" : "translateY(20px)",
//         transition: `all 700ms ease ${delay}ms`,
//       }}
//     >
//       {children}
//     </div>
//   );
// }


// import { useEffect, useRef, useState } from "react";

// export default function FadeInOnScroll({ children, delay = 0, onComplete }) {
//   const ref = useRef(null);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setVisible(true);
//           setTimeout(() => {
//             onComplete && onComplete();
//           }, 700 + delay); // animation time + delay
//         }
//       },
//       { threshold: 0.2 }
//     );

//     if (ref.current) observer.observe(ref.current);
//     return () => {
//       if (ref.current) observer.unobserve(ref.current);
//     };
//   }, []);

//   return (
//     <div
//       ref={ref}
//       style={{
//         opacity: visible ? 1 : 0,
//         transform: visible ? "translateY(0px)" : "translateY(20px)",
//         transition: `all 700ms ease ${delay}ms`,
//       }}
//     >
//       {children}
//     </div>
//   );
// }


import { useEffect, useRef, useState } from "react";

export default function FadeInOnScroll({ children, delay = 0, onComplete, active }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) {
      setVisible(false); // reset
      return;
    }

    const t = setTimeout(() => {
      setVisible(true);
      setTimeout(() => onComplete && onComplete(), 700 + delay);
    }, delay);

    return () => clearTimeout(t);
  }, [active]);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `all 700ms ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

