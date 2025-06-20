import React, { useEffect, useState, useRef } from "react";
import "../css/tips.css";

const TIPS = [
"Use the Merge operation to combine blocks.",
  "Try using the Add operation to increase numbers.",
    "Subtracting can help you reach the target number.",
  "You can use any operation in any order!",
  "Try combining numbers in different ways.",
  "Undoable blocks can be reset with the Reset button.",
  "Use keyboard shortcuts for faster play.",
  "Think ahead before merging blocks.",
  "Some levels require creative use of advanced operations.",
  "You can always reset the level if stuck.",
  "Hover over operation buttons to see what they do.",
  "Try to reach 69 with as few moves as possible!",
  "Experiment with different strategies for each level."
];

function getRandomTip(prevTip) {
  let tip;
  do {
    tip = TIPS[Math.floor(Math.random() * TIPS.length)];
  } while (tip === prevTip && TIPS.length > 1);
  return tip;
}

export default function Tips() {
  const [showTips, setShowTips] = useState(() => {
    // Persist user preference in localStorage
    const stored = localStorage.getItem("showTips");
    return stored === null ? true : stored === "true";
  });
  const [tip, setTip] = useState(getRandomTip());
  const [visible, setVisible] = useState(false);
  const [timerPercent, setTimerPercent] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  // For pausing/resuming
  const elapsedRef = useRef(0);
  const intervalRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const gapTimeoutRef = useRef(null);
  const lastTipRef = useRef(tip);

  // Show a new tip
  const showNextTip = () => {
    const nextTip = getRandomTip(lastTipRef.current);
    setTip(nextTip);
    lastTipRef.current = nextTip;
    setVisible(true);
    setTimerPercent(100);
    elapsedRef.current = 0;
  };

  // Hide the tip and schedule the next one
  const hideTipAndScheduleNext = () => {
    setVisible(false);
    setTimerPercent(0);
    gapTimeoutRef.current = setTimeout(() => {
      showNextTip();
    }, 2500); // gap between tips
  };

  // Main effect: show the first tip and start cycling
  useEffect(() => {
    if (!showTips) return;

    const initialTimeout = setTimeout(() => {
      showNextTip();
    }, 3000); // 3 seconds delay

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(hideTimeoutRef.current);
      clearTimeout(gapTimeoutRef.current);
      clearTimeout(initialTimeout);
    };
    // eslint-disable-next-line
  }, [showTips]);

  // Effect to handle timer and hiding
  useEffect(() => {
    if (!visible) {
      clearInterval(intervalRef.current);
      clearTimeout(hideTimeoutRef.current);
      return;
    }

    const duration = 5000;
    // Timer for progress bar and auto-hide
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        elapsedRef.current += 100;
        setTimerPercent(100 - (elapsedRef.current / duration) * 100);
        if (elapsedRef.current >= duration) {
          clearInterval(intervalRef.current);
          hideTipAndScheduleNext();
        }
      }
    }, 100);

    // Fallback: hide after duration (in case interval is missed)
    hideTimeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current);
      hideTipAndScheduleNext();
    }, duration - elapsedRef.current);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(hideTimeoutRef.current);
    };
    // eslint-disable-next-line
  }, [visible, isPaused]);

  // Save preference
  useEffect(() => {
    localStorage.setItem("showTips", showTips);
  }, [showTips]);

  if (!showTips) return (
    <div className="tips-bar tips-top-left tips-hidden">
      <button className="tips-toggle tips-show-btn" onClick={() => setShowTips(true)}>Show</button>
    </div>
  );

  return visible ? (
    <div
      className="tips-bar tips-top-left"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <span className="tips-message">{tip}</span>
      <div className="tips-hide-btn-row">
        <button className="tips-toggle" onClick={() => setShowTips(false)}>
          Hide
        </button>
      </div>
      <div className="tips-progress-bar">
        <div
          className="tips-progress"
          style={{ width: `${timerPercent}%` }}
        ></div>
      </div>
    </div>
  ) : null;
}