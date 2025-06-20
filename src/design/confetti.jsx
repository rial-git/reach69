// components/confetti.jsx
import React from 'react';
import Confetti from 'react-confetti';
import '../css-mob/confettiMob.css'; // Adjust the path as necessary

export default function ConfettiEffect() {
  return (
    <div className="confetti-wrapper">
      <Confetti
        recycle={false}
        numberOfPieces={300}
        gravity={0.75}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
}