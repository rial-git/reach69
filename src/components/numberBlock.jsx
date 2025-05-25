// components/NumberBlock.jsx
import React from 'react';
import { ACTIONS } from '../utils/constants';
import '../css/numberBlock.css';

export default function NumberBlock({ blk, idx, isSelected, dispatch }) {
  return (
    <div
      className={`number ${isSelected ? 'selected' : ''} ${blk.root ? 'merged undoable' : ''}`}
      onClick={() => dispatch({ type: ACTIONS.PICK_NUMBER, payload: idx })}
      onContextMenu={(e) => {
        e.preventDefault();
        dispatch({ type: ACTIONS.UNDO, payload: idx });
      }}
    >
      {blk.value}
      {blk.root && <div className="root-info">{blk.meta.infoOfRoot}</div>}
    </div>
  );
}