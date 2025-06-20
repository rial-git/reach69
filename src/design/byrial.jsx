import React, { useState, useRef } from "react";
import "../css/byrial.css";

const ORIGINAL = "by rial.";
const TARGET = "Visit us!";

export default function ByRialGlitch() {
  const [hovered, setHovered] = useState(false);
  const [display, setDisplay] = useState(ORIGINAL);
  const intervalRef = useRef(null);

  // Glitchy morphing effect
  const handleMouseEnter = () => {
    setHovered(true);
    let frame = 0;
    const maxLen = Math.max(ORIGINAL.length, TARGET.length);

    // Clear any previous interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      let next = "";
      for (let i = 0; i < maxLen; i++) {
        if (frame < 6) {
          // Show random glitch chars for first few frames
          next += String.fromCharCode(33 + Math.floor(Math.random() * 94));
        } else {
          // Morph to target letter by letter
          if (i < TARGET.length) {
            if (display[i] !== TARGET[i]) {
              next += TARGET[i];
            } else {
              next += display[i];
            }
          }
        }
      }
      setDisplay(next.slice(0, maxLen));
      frame++;
      if (frame > 10) {
        setDisplay(TARGET);
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 25);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplay(ORIGINAL);
  };

  return (
    <a
      href="https://github.com/rial-git"
      target="_blank"
      rel="noopener noreferrer"
      className="byrial-link"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
    >
      <span className={`byrial-glitch-text${hovered ? " hovered" : ""}`}>
        {display}
      </span>
    </a>
  );
}