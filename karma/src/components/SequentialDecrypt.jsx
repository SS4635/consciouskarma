import React, { useEffect, useState, useRef } from "react";

export default function SequentialType({
  active = true,
  start = false,
  duration = 40,    // ms per character
  gap = 300,        // ms gap between lines
  lines = [],
  onComplete = () => {}
}) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [finished, setFinished] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  const typingIntervalRef = useRef(null);
  const nextLineTimeoutRef = useRef(null);
  const blinkIntervalRef = useRef(null);
  const startRef = useRef(start);

  // Blink cursor
  useEffect(() => {
    blinkIntervalRef.current = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);
    return () => clearInterval(blinkIntervalRef.current);
  }, []);

  // Start/restart typing when `active && start` changes to true
  useEffect(() => {
    // Restart only if start became true or active toggled true
    if (!active || !start) {
      // If not active or not started, clear everything
      clearInterval(typingIntervalRef.current);
      clearTimeout(nextLineTimeoutRef.current);
      return;
    }

    // If start toggled from false -> true, or user wants restart
    if (!startRef.current && start) {
      // reset sequence
      clearInterval(typingIntervalRef.current);
      clearTimeout(nextLineTimeoutRef.current);
      setCurrentLineIndex(0);
      setTypedText("");
      setFinished(false);
    }
    startRef.current = start;

    // Begin typing for currentLineIndex (handles initial start as well)
    const startTypingLine = (index) => {
      const line = lines[index] ?? "";
      setTypedText("");
      let charIndex = 0;

      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = setInterval(() => {
        if (charIndex < line.length) {
          setTypedText((prev) => prev + line[charIndex]);
          charIndex++;
        } else {
          // finished current line
          clearInterval(typingIntervalRef.current);

          if (index >= lines.length - 1) {
            // last line finished
            setFinished(true);
            onComplete();
            return;
          }

          // wait `gap` ms then move to next line
          nextLineTimeoutRef.current = setTimeout(() => {
            setCurrentLineIndex((prev) => prev + 1);
          }, gap);
        }
      }, duration);
    };

    // Kick off typing for whichever index we're at
    startTypingLine(currentLineIndex);

    // cleanup on effect re-run or unmount
    return () => {
      clearInterval(typingIntervalRef.current);
      clearTimeout(nextLineTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, start, currentLineIndex, duration, gap, lines]); // currentLineIndex included so it types next line

  // Reset startRef when start becomes false
  useEffect(() => {
    if (!start) startRef.current = false;
  }, [start]);

  // If user toggles active to false or component unmounts, clear timers
  useEffect(() => {
    return () => {
      clearInterval(typingIntervalRef.current);
      clearTimeout(nextLineTimeoutRef.current);
      clearInterval(blinkIntervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-start justify-start space-y-1">
      {/* Fully typed lines */}
      {lines.slice(0, currentLineIndex).map((line, idx) => (
        <p key={idx} className="text-gray-200 font-light text-[18px]">
          {line}
        </p>
      ))}

      {/* Current typing line (or last line when finished) */}
      {!finished ? (
        <p className="text-gray-200 font-light text-[18px]">
          {typedText}
          <span aria-hidden style={{ display: "inline-block", width: "10px" }}>
            {cursorVisible ? "|" : " "}
          </span>
        </p>
      ) : (
        // show all lines when finished
        <div>
          {lines.map((line, idx) => (
            <p key={"f-"+idx} className="text-gray-200 font-light text-[18px]">
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
