import React, { useEffect, useState } from "react";

function Typewriter({
  lines,
  speed = 24,
  lineDelay = 520,
  onDone,                 // optional: fire when all lines finish
}) {
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState(() => lines.map(() => ""));

  // typing loop (left→right)
  useEffect(() => {
    let t;
    const full = lines[idx];
    if (!full) return;

    const cur = typed[idx];
    if (cur.length < full.length) {
      t = setTimeout(() => {
        setTyped(prev => {
          const next = [...prev];
          next[idx] = full.slice(0, cur.length + 1);
          return next;
        });
      }, speed);
    } else if (idx < lines.length - 1) {
      t = setTimeout(() => setIdx(i => i + 1), lineDelay);
    }
    return () => clearTimeout(t);
  }, [idx, lines, typed, speed, lineDelay]);

  // notify when finished (optional)
  useEffect(() => {
    const done = typed.every((t, i) => t.length === (lines[i] || "").length);
    if (done) onDone?.();
  }, [typed, lines, onDone]);

  const caretStyle = {
    display: "inline-block",
    width: 2,
    height: "1em",
    background: "var(--accent,#ff8a3d)",
    marginLeft: 4,
    verticalAlign: "-0.12em",
    animation: "caretBlink 1s steps(1) infinite",
  };

  return (
    <div
      aria-live="polite"
      dir="ltr"                                   // force LTR
      style={{
        display: "grid",
        rowGap: 0,                               // no vertical space
        margin: 0,
        padding: 0,
        textAlign: "left",                       // override any right-align parent
      }}
    >
      {lines.map((full, i) => {
        const active = i === idx;
        const done = typed[i].length === full.length;
        return (
          <div
            key={i}
            style={{
              margin: 0,
              lineHeight: 1.18,                  // compact lines
              fontSize: "clamp(13px,1.1vw,17px)",// smaller text
              letterSpacing: ".01em",
              whiteSpace: "normal",
              direction: "ltr",                  // left→right typing
            }}
          >
            {typed[i]}
            {active && !done ? <span style={caretStyle} /> : null}
          </div>
        );
      })}

      {/* caret animation keyframes (scoped inline) */}
      <style>{`@keyframes caretBlink { 50% { opacity: 0; } }`}</style>
    </div>
  );
}

export default Typewriter;
