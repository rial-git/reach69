// components/AdvancedOperations.jsx
import React from 'react';
import OperationButton from './OperationButton';

export default function AdvancedOperations({ ops, selectedOp, keyMap, onOperationSelect }) {
  return (
    <div className="advanced-operations">
      <div className="advanced-double-digit">
        {ops.doubleDigit.map(op => (
          <OperationButton key={op} op={op} shortcut={keyMap[op] || ''} isSelected={selectedOp === op} onClick={() => onOperationSelect(op)} />
        ))}
      </div>
      <div className="advanced-single-digit">
        {ops.singleDigit.map(op => (
          <OperationButton key={op} op={op} shortcut={keyMap[op] || ''} isSelected={selectedOp === op} onClick={() => onOperationSelect(op)} />
        ))}
      </div>
    </div>
  );
}