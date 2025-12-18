// "use client";
// import { useEffect, useState } from "react";

// export default function DecryptedText({ children, speed = 30 }) {
//   const chars = "!<>-_\\/[]{}—=+*^?#________";

//   // Convert JSX children → plain text but preserve HTML positions later
//   const htmlString = (() => {
//     if (typeof children === "string") return children;

//     // Convert JSX to HTML string
//     const temp = document.createElement("div");
//     temp.appendChild(document.createTextNode(""));

//     try {
//       temp.innerHTML = children.props
//         ? children.props.children
//         : children;
//     } catch {
//       return "";
//     }

//     return temp.innerHTML;
//   })();

//   const cleanText = htmlString.replace(/<[^>]+>/g, ""); // remove HTML tags
//   const [output, setOutput] = useState(htmlString);

//   useEffect(() => {
//     let frame = 0;
//     let interval = setInterval(() => {
//       let scrambled = "";

//       for (let i = 0; i < cleanText.length; i++) {
//         if (i < frame) {
//           scrambled += cleanText[i];
//         } else {
//           scrambled += chars[Math.floor(Math.random() * chars.length)];
//         }
//       }

//       // Merge scrambled text back into original html structure
//       let formatted = "";
//     //   let si = 0;

//       for (let i = 0; i < htmlString.length; i++) {
//         if (htmlString[i] === "<") {
//           // copy tag as is
//           while (htmlString[i] !== ">" && i < htmlString.length) {
//             formatted += htmlString[i++];
//           }
//           formatted += ">";
//         } else {
//           formatted += scrambled[si++];
//         }
//       }

//       setOutput(formatted);

//       frame++;
//       if (frame > cleanText.length) clearInterval(interval);
//     }, speed);

//     return () => clearInterval(interval);
//   }, [htmlString, cleanText, speed]);

//   return <span dangerouslySetInnerHTML={{ __html: output }} />;
// }




// "use client";

// import { useEffect, useState } from "react";
// import parse from "html-react-parser";

// export default function DecryptedText({ children, speed = 30 }) {
//   const chars = "!<>-_\\/[]{}—=+*^?#________";

//   // Convert children (JSX or string) to HTML string safely
//   const htmlString = (() => {
//     try {
//       const temp = document.createElement("div");
//       temp.innerHTML = "";
//       temp.appendChild(document.createElement("span")).innerHTML =
//         typeof children === "string" ? children : children.props?.children;
//       return temp.innerHTML;
//     } catch {
//       return typeof children === "string" ? children : "";
//     }
//   })();

//   // Extract only the visible characters (no tags)
//   const cleanText = htmlString.replace(/<[^>]+>/g, "");

//   const [outputHTML, setOutputHTML] = useState(htmlString);

//   useEffect(() => {
//     let frame = 0;

//     const interval = setInterval(() => {
//       let scrambled = "";

//       for (let i = 0; i < cleanText.length; i++) {
//         scrambled += i < frame ? cleanText[i] : chars[Math.floor(Math.random() * chars.length)];
//       }

//       // Merge scrambled characters back inside original HTML structure
//       let finalHTML = "";
//       let textIndex = 0;

//       for (let i = 0; i < htmlString.length; i++) {
//         if (htmlString[i] === "<") {
//           while (htmlString[i] !== ">" && i < htmlString.length) {
//             finalHTML += htmlString[i++];
//           }
//           finalHTML += ">";
//         } else {
//           finalHTML += scrambled[textIndex++];
//         }
//       }

//       setOutputHTML(finalHTML);

//       frame++;
//       if (frame > cleanText.length) clearInterval(interval);
//     }, speed);

//     return () => clearInterval(interval);
//   }, [htmlString]);

//   return <span>{parse(outputHTML)}</span>;
// }



"use client";

import { useEffect, useState } from "react";
import parse from "html-react-parser";

// Convert JSX → Real HTML string (br, span, styles preserved)
function jsxToHtml(node) {
  if (typeof node === "string") return node;

  if (Array.isArray(node)) {
    return node.map((child) => jsxToHtml(child)).join("");
  }

  // Handle <br/> correctly
  if (node.type === "br") return "<br/>";

  let inner =
    typeof node.props?.children === "string"
      ? node.props.children
      : jsxToHtml(node.props?.children);

  return `<${node.type}${attrsToString(node.props)}>${inner}</${node.type}>`;
}

function attrsToString(attrs = {}) {
  return Object.entries(attrs)
    .filter(([key]) => key !== "children")
    .map(([key, value]) => {
      if (key === "className") key = "class";
      return ` ${key}="${value}"`;
    })
    .join("");
}

export default function DecryptedText({ children, speed = 30 }) {
  const chars = "!<>-_\\/[]{}—=+*^?#________";

  // Convert JSX → proper HTML string
  const htmlString = jsxToHtml(children);

  // Extract raw text only (ignore br tags)
  const cleanText = htmlString.replace(/<br\s*\/?>/g, "\n").replace(/<[^>]+>/g, "");

  const [outputHTML, setOutputHTML] = useState(htmlString);

  useEffect(() => {
    let frame = 0;

    const interval = setInterval(() => {
      let scrambled = "";

      for (let i = 0; i < cleanText.length; i++) {
        if (cleanText[i] === "\n") {
          scrambled += "\n";
        } else if (i < frame) {
          scrambled += cleanText[i];
        } else {
          scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      // Reconstruct HTML safely
      let finalHTML = "";
      let si = 0;
      let textOnly = scrambled;

      for (let i = 0; i < htmlString.length; i++) {
        if (htmlString[i] === "<") {
          // Copy tag
          while (i < htmlString.length && htmlString[i] !== ">") {
            finalHTML += htmlString[i++];
          }
          finalHTML += ">";
        } else {
          finalHTML += textOnly[si++] || "";
        }
      }

      setOutputHTML(finalHTML);

      frame++;
      if (frame > cleanText.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, []);

  return <span className="inline-block whitespace-pre-line">{parse(outputHTML)}</span>;
}
