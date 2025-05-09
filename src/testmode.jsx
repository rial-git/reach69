import React, { useState } from "react";

const mode = () => {

    const [ blocks, setBlock ] = useState([
        { value: '1', merged: false, operations: false},
        { value: '2', merged: false, operations: false},
        { value: '3', merged: false, operations: false},
        { value: '4', merged: false, operations: false}


    ]); 

    const [selectedIndex, setSelectedIndex] = useState(null);
    const [additionMode, setAdditionMode] = useState(true);


    const handleclick = (index) => {
        if (selectedIndex === null ) {
            setSelectedIndex(index);
            return
        }

    const newBlocks = [...blocks];
    const first = selectedIndex;
    const second = index;

    if (first === second) {
      setSelectedIndex(null);
      return;
    }

    if (

        Math.abs(first-second) === 1 &&
        !newBlocks[first].merged &&
        !newBlocks[second].merged 
    ) {
                  const sum =
          parseInt(newBlocks[first].value, 10) +
          parseInt(newBlocks[second].value, 10);
        const mergedBlock = { value: String(sum), merged: true };
        const minIndex = Math.min(first, second);

        // Merge adjacent blocks
        newBlocks.splice(minIndex, 2, mergedBlock); // Replace two blocks with the merged one

        // After merging, reset merged flags and update the state
        setBlocks(resetMergedFlags(newBlocks));  
        }

        setSelectedIndex(null);
    
    };




    





return (

    <div className="rendering">

        {blocks.map((block, index) => (
                      <div
                    
            key={index}
            className="number"
            onClick={() => setSelectedIndex(index)} // Example onClick
            style={{ padding: '10px', border: '1px solid black', margin: '5px' }}
          >
            {block.value}

            
          </div>
        ))}
        
        <div> selected Index: {selectedIndex} </div>
        <div> setSelected Index: {setSelectedIndex} </div>
        {/* <div> first: {first} </div>
      <div> second: {second} </div> */}
  

      </div>
);

};



// myr debbuging koodi ponu






const Level1 = () => {
  const [blocks, setBlocks] = useState([
    { value: '7', merged: false },
    { value: '1', merged: false },
    { value: '2', merged: false },
    { value: '0', merged: false },
    { value: '2', merged: false },
  ]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [additionMode, setAdditionMode] = useState(true);


  // Helper function to reset the 'merged' flags
  const resetMergedFlags = (blocks) =>
    blocks.map((block) => ({ ...block, merged: false }));

  const handleClick = (index) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
      return;
    }

    const newBlocks = [...blocks];
    const first = selectedIndex;
    const second = index;

    // If the selected index is the same, reset selection
    if (first === second) {
      setSelectedIndex(null);
      return;
    }

    if (additionMode == true ) {
      // ADDITION MODE: add any two numbers, even if they're not adjacent
      const sum =
        parseInt(newBlocks[first].value, 10) +
        parseInt(newBlocks[second].value, 10);
      const resultBlock = { value: String(sum), merged: true };

      // Remove the second block and replace the first with the result
      const [min, max] = first < second ? [first, second] : [second, first];
      newBlocks.splice(max, 1); // Remove the second block
      newBlocks.splice(min, 1, resultBlock); // Insert the sum at the first block's position

      // After addition, reset merged flags and update the state
      setBlocks(resetMergedFlags(newBlocks));
      setSelectedIndex(null);
      // Removed setAdditionMode(false) to keep addition mode active
    } else if (additionMode == false ) {
      // NORMAL MODE: merge only if adjacent and both not already merged
      
        Math.abs(first - second) === 1 &&
        !newBlocks[first].merged &&
        !newBlocks[second].merged
      {
        const sum =
          parseInt(newBlocks[first].value, 10) +
          parseInt(newBlocks[second].value, 10);
        const mergedBlock = { value: String(sum), merged: true };
        const minIndex = Math.min(first, second);

        // Merge adjacent blocks
        newBlocks.splice(minIndex, 2, mergedBlock); // Replace two blocks with the merged one

        // After merging, reset merged flags and update the state
        setBlocks(resetMergedFlags(newBlocks));
      }

      // Reset selection either way
      setSelectedIndex(null);
    }
  };

  // The rest of the code remains unchanged

  return (
    <div className="puzzle">
      <div className="level1">Level 1</div>

      {/* toggle addition mode */}
      <button
        onClick={() => {
          setAdditionMode((prev) => !prev);
          setSelectedIndex(null);
        }}
        className={`addition-button ${additionMode ? 'active' : ''}`}
        title="Addition Mode"
      >
        +
      </button>

      <div className="numbers">
        {blocks.map((block, index) => (
          <div
            key={index}
            className={`number ${
              index === selectedIndex ? 'selected' : ''
            } ${block.merged ? 'merged' : ''}`}
            onClick={() => handleClick(index)}
            onContextMenu={(e) => handleRightClick(index, e)}
            title={block.merged ? 'Right-click to split' : ''}
          >
            {block.value}
          </div>
        ))}

        <div> selected Index: {selectedIndex} </div>
        <div> setSelected Index: {setSelectedIndex} </div>
        <div> addition Mode: {additionMode} </div>

      </div>
    </div>
  );
};


export default mode;