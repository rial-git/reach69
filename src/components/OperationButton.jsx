// components/OperationButton.jsx
import React from 'react';
import MergeIcon from '../assets/merge.svg';
import '../css/operationButton.css';

export default function OperationButton({ op, isSelected, onClick }) {
  return (
    <button className={`operation-button ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      {op === 'merge' ? <img src={MergeIcon} alt="merge" /> : <span className="op-text">{op}</span>}
    </button>
  );
}