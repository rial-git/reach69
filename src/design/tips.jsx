import React, { useEffect, useState, useRef } from "react";
import "../css/tips.css";

const TIPS = [
  "Use the Merge function to glue the numbers together.",
  "Only adjacent numbers can be merged.",
  "Single digit operations like root and factorial can be the key to solving some levels.",
  "Try combining numbers in different ways.",
  "Backspace undos your last operation.",
  "Right click on a block to undo it.",
  "Hit reset if you get stuck.",
  "Use keyboard shortcuts for faster play.",
  "Feeling stuck? Try a different approach.",
  "Click the '?' button below to see the How To Play page.",
  "Think ahead before merging blocks.",
  "Some levels require creative use of advanced operations.",
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
    const stored = localStorage.getItem("showTips");
    return stored === null ? true : stored === "true";
  });
  const [tip, setTip] = useState(getRandomTip());
  const [visible, setVisible] = useState(false);
  const [timerPercent, setTimerPercent] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  const elapsedRef = useRef(0);
  const intervalRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const gapTimeoutRef = useRef(null);
  const lastTipRef = useRef(tip);
  const hideTipAndScheduleNextRef = useRef(() => {});

  const showNextTip = () => {
    const nextTip = getRandomTip(lastTipRef.current);
    setTip(nextTip);
    lastTipRef.current = nextTip;
    setVisible(true);
    setTimerPercent(100);
    elapsedRef.current = 0;
  };

  const hideTipAndScheduleNext = () => {
    setVisible(false);
    setTimerPercent(0);
    gapTimeoutRef.current = setTimeout(() => {
      showNextTip();
    }, 2500);
  };

  hideTipAndScheduleNextRef.current = hideTipAndScheduleNext;

  useEffect(() => {
    if (!showTips) return;
    
    showNextTip();
    
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(hideTimeoutRef.current);
      clearTimeout(gapTimeoutRef.current);
    };
    // eslint-disable-next-line
  }, [showTips]);

  useEffect(() => {
    if (!visible) {
      clearInterval(intervalRef.current);
      clearTimeout(hideTimeoutRef.current);
      return;
    }

    if (isPaused) {
      clearInterval(intervalRef.current);
      clearTimeout(hideTimeoutRef.current);
    } else {
      clearInterval(intervalRef.current);
      clearTimeout(hideTimeoutRef.current);
      
      const duration = 5000;
      
      intervalRef.current = setInterval(() => {
        elapsedRef.current += 100;
        setTimerPercent(100 - (elapsedRef.current / duration) * 100);
        if (elapsedRef.current >= duration) {
          clearInterval(intervalRef.current);
          hideTipAndScheduleNextRef.current();
        }
      }, 100);
      
      hideTimeoutRef.current = setTimeout(() => {
        clearInterval(intervalRef.current);
        hideTipAndScheduleNextRef.current();
      }, duration - elapsedRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(hideTimeoutRef.current);
    };
    // eslint-disable-next-line
  }, [visible, isPaused]);

  useEffect(() => {
    localStorage.setItem("showTips", showTips);
  }, [showTips]);

  if (!showTips) return (
    <div className="tips-bar tips-top-left tips-hidden">
      <button 
        className="tips-toggle tips-show-btn" 
        onClick={() => setShowTips(true)}
      >
        Show Tips
      </button>
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
        <button 
          className="tips-toggle" 
          onClick={() => setShowTips(false)}
        >
          Hide Tips
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