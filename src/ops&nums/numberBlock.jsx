// components/NumberBlock.jsx
import React from 'react';
import { ACTIONS } from '../utils/constants';
import '../css/numberBlock.css';
import '../css-mob/numberBlockMob.css';

export default function NumberBlock({ 
  blk, 
  idx, 
  isSelected, 
  dispatch, 
  onClick,   // Added for tutorial
  disabled   // Added for tutorial
}) {
  const handleClick = () => {
    if (disabled) return;  // Block clicks when disabled
    
    if (onClick) {
      // Use custom click handler from tutorial
      onClick(idx);
    } else {
      // Default behavior for main game
      dispatch({ type: ACTIONS.PICK_NUMBER, payload: idx });
    }
  };

  // Safely access meta.infoOfRoot only if it exists
  const rootInfo = blk.meta?.infoOfRoot;

  return (
    <div
      className={`number ${isSelected ? 'selected' : ''} ${blk.root ? 'merged undoable' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      onContextMenu={(e) => {
        if (disabled) return;  // Block right-click when disabled
        e.preventDefault();
        dispatch({ type: ACTIONS.UNDO, payload: idx });
      }}
    >
      {blk.value}
      {rootInfo && <div className="root-info">{rootInfo}</div>}
    </div>
  );
}