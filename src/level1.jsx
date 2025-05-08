// Suggested React-based implementation for intuitive number selection and merging
import React, { useState } from 'react';
import './level1.css';

const Level1 = () => {
  const [blocks, setBlocks] = useState([
    { value: '7', merged: false },
    { value: '1', merged: false },
    { value: '2', merged: false },
    { value: '0', merged: false },
    { value: '2', merged: false },
  ]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleClick = (index) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else if (
      Math.abs(selectedIndex - index) === 1 &&
      !blocks[selectedIndex].merged 
    //   &&
    //   !blocks[index].merged
    ) {
      const newBlocks = [...blocks];
      const mergedValue = newBlocks[selectedIndex].value + newBlocks[index].value;
      const minIndex = Math.min(selectedIndex, index);
      newBlocks.splice(minIndex, 2, { value: mergedValue, merged: true });
      setBlocks(newBlocks);
      setSelectedIndex(null);
    } else {
      setSelectedIndex(index);
    }
  };

  const handleRightClick = (index, e) => {
    e.preventDefault();
    const block = blocks[index];
    if (block.merged) {
      const newBlocks = [...blocks];
      const splitValues = block.value.split('');
      newBlocks.splice(index, 1, ...splitValues.map(v => ({ value: v, merged: false })));
      setBlocks(newBlocks);
    }
  };

  return (
    <div className="puzzle">
      <div className="level1">Level 1</div>
      <div className="numbers">
        {blocks.map((block, index) => (
          <div
            key={index}
            className={`number ${index === selectedIndex ? 'selected' : ''} ${block.merged ? 'merged' : ''}`}
            onClick={() => handleClick(index)}
            onContextMenu={(e) => handleRightClick(index, e)}
            title={block.merged ? 'Right-click to split' : ''}
          >
            {block.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Level1;