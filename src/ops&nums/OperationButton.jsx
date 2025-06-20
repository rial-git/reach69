// components/OperationButton.jsx
import React from 'react';
import MergeIcon from '../assets/merge.svg';
import '../css/operationButton.css';
import '../css-mob/operationButtonMob.css'; // Adjust the path as necessary

export default function OperationButton({ op, shortcut, isSelected, onClick }) {
  return (
    <button className={`operation-button ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      {op === 'merge' ? <img className="op-text" src={MergeIcon} alt="merge" /> : <span className="op-text">{op}</span>}
    
      <span className="operation-button_badge">{shortcut}</span>
    </button>
  );
}