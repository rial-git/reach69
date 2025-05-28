// components/Level1.jsx
import React, { useReducer, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { reducer, initState } from './reducer';
import { keyMap, opShortcuts } from '../utils/constants';

import { setupKeyboardShortcuts } from './keyboardhandler';
import { ACTIONS, basicOps, advancedTwoDigitOps, advancedSingleDigitOps, initialNums } from '../utils/constants';
import NumberBlock from './NumberBlock';
import OperationButton from './OperationButton';
import AdvancedOperations from './AdvancedOperations';
import ErrorMessage from './ErrorMessage';
import '../css/level1.css';


export default function Level1() {
  const [levelIndex, setLevelIndex] = React.useState(0);
  const [state, dispatch] = useReducer(reducer, initialNums[levelIndex], initState);
  const { blocks, selection: { numbers, operation }, error } = state;
  const blocksRef = useRef(blocks);
  const firstBlockRef = React.useRef(null);
  const navigate = useNavigate();

  useEffect(() => { blocksRef.current = blocks; }, [blocks]);

  useEffect(() => {
    const cleanup = setupKeyboardShortcuts(dispatch, ACTIONS, blocksRef);
    return cleanup;
  }, [dispatch]);

  useEffect(() => {
    dispatch({ type: ACTIONS.RESET, payload: initialNums[levelIndex] });
  }, [levelIndex]);

  // When pressing Next
  const handleNext = () => {
    if (levelIndex < initialNums.length - 1) {
      const nextLevel = levelIndex + 1;
      setLevelIndex(nextLevel);
      dispatch({ type: ACTIONS.RESET, payload: initialNums[nextLevel] }); // <-- add this line
    } else {
      alert('All levels complete!');
    }
  };

  // Success condition
  const isSuccess = blocks.length === 1 && Number(blocks[0].value) === 69;

  return (
    <div className="puzzle">
      <ErrorMessage error={error} dispatch={dispatch} />

      {/* Success Toast */}
      {isSuccess && (
        <div className="success-toast">
          <span>Success! 🎉</span>
        </div>
      )}

      <div className="numbers">
        {blocks.map((blk, idx) => (
          <NumberBlock key={blk.id} blk={blk} idx={idx} isSelected={numbers.includes(idx)} dispatch={dispatch} ref={idx === 0 ? firstBlockRef : null }  />
        ))}
      </div>

      <div className="operations">
        <div className="basic-operations">
          {basicOps.map(op => (
            <OperationButton
              key={op}
              op={op}
              shortcut={opShortcuts[op] || ''}
              isSelected={operation === op}
              onClick={() => dispatch({ type: ACTIONS.PICK_OPERATION, payload: op })}
            />
          ))}
        </div>

        <AdvancedOperations
          ops={{
            doubleDigit: advancedTwoDigitOps,
            singleDigit: advancedSingleDigitOps
          }}
          selectedOp={operation}
          keyMap={opShortcuts}
          onOperationSelect={(op) => dispatch({ type: ACTIONS.PICK_OPERATION, payload: op })}
        />

        <button className="reset-button" onClick={() => dispatch({ type: ACTIONS.RESET })}>
          Reset
        </button>
      </div>

      {/* Next Button */}
      {isSuccess && (
        <button className="next-button" onClick={handleNext}>
          Next
        </button>
      )}

      <button className="help-button" onClick={() => navigate('/howToPlay')}>
        ?
        <span className="help-tooltip">How to play?</span>
      </button>
    </div>
  );
}