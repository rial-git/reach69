// components/OperationButton.jsx
import React from 'react';
import MergeIcon from '../assets/merge.svg';

export default function OperationButton({ op, isSelected, onClick }) {
  return (
    <button className={`operation-button ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      {op === 'merge' ? <img src={MergeIcon} alt="merge" /> : op}
    </button>
  );
}