// components/Level1.jsx
import React, { useReducer, useEffect, useRef } from 'react';
import { reducer, initState } from './reducer';
import { setupKeyboardShortcuts } from './keyboardhandler';
import { ACTIONS, basicOps, advancedTwoDigitOps, advancedSingleDigitOps, initialNums } from './constants';
import NumberBlock from './NumberBlock';
import OperationButton from './OperationButton';
import AdvancedOperations from './AdvancedOperations';
import ErrorMessage from './ErrorMessage';
import '../css/level1.css';

export default function Level1() {
  const [state, dispatch] = useReducer(reducer, initialNums, initState);
  const { blocks, selection: { numbers, operation }, error } = state;

  const blocksRef = useRef(blocks);
  useEffect(() => { blocksRef.current = blocks; }, [blocks]);

  useEffect(() => {
    const cleanup = setupKeyboardShortcuts(dispatch, ACTIONS, blocksRef);
    return cleanup;
  }, [dispatch]);

  return (
    <div className="puzzle">
      <ErrorMessage error={error} dispatch={dispatch} />
      
      <div className="numbers">
        {blocks.map((blk, idx) => (
          <NumberBlock key={blk.id} blk={blk} idx={idx} isSelected={numbers.includes(idx)} dispatch={dispatch} />
        ))}
      </div>

      <div className="operations">
        <div className="basic-operations">
          {basicOps.map(op => (
            <OperationButton
              key={op}
              op={op}
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
          onOperationSelect={(op) => dispatch({ type: ACTIONS.PICK_OPERATION, payload: op })}
        />

        <button className="reset-button" onClick={() => dispatch({ type: ACTIONS.RESET })}>
          Reset
        </button>
      </div>
    </div>
  );
}