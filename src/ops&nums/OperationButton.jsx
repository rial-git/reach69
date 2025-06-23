// components/OperationButton.jsx
import React from 'react';
import MergeIcon from '../assets/Merge.svg';
import '../css/operationButton.css';
import '../css-mob/operationButtonMob.css';

export default function OperationButton({ 
  op, 
  shortcut, 
  isSelected, 
  onClick,   // Added for tutorial
  disabled   // Added for tutorial
}) {
  const handleClick = () => {
    if (disabled) return;  // Block clicks when disabled
    if (onClick) {
      onClick(op);  // Pass the operation type to the handler
    }
    // Note: The main game doesn't use the onClick handler directly here
    // as it passes its own handler from Game.jsx
  };

  return (
    <button 
      className={`operation-button ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`} 
      onClick={handleClick}
      disabled={disabled}
    >
      {op === 'merge' ? (
        <img className="op-text" src={MergeIcon} alt="merge" />
      ) : (
        <span className="op-text">{op}</span>
      )}
      <span className="operation-button_badge">{shortcut}</span>
    </button>
  );
}