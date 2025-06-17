// components/Level1.jsx
import React, { useReducer, useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { reducer, initState } from './reducer';
import { 
  ACTIONS, 
  basicOps, 
  opShortcuts, 
  advancedTwoDigitOps, 
  advancedSingleDigitOps, 
  initialNumsEasy, 
  initialNumsMedium, 
  initialNumsHard 
} from '../utils/constants';
import { shuffle } from '../utils/gameHelpers'; // NEW - import helper function
import NumberBlock from './NumberBlock';
import OperationButton from './OperationButton';
import AdvancedOperations from './AdvancedOperations';
import ErrorMessage from './ErrorMessage';
import { setupKeyboardShortcuts } from './keyboardhandler';
import '../css/level1.css';

// Define a difficulties array and a mapping of levels based on difficulty.
const difficulties = ['easy', 'med', 'hard'];
const levelsByDifficulty = {
  easy: initialNumsEasy,
  med: initialNumsMedium,
  hard: initialNumsHard
};

export default function Level1() {
  const navigate = useNavigate();
  
  // Start with easy levels.
  const [difficulty, setDifficulty] = useState('easy');
  
  // Create a randomized order for the current difficulty.
  const [order, setOrder] = useState(shuffle([...Array(levelsByDifficulty[difficulty].length).keys()]));
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);

  // Get current level data based on the order array.
  const currentLevelData = levelsByDifficulty[difficulty][order[currentLevelIdx]];

  const [state, dispatch] = useReducer(reducer, currentLevelData, initState);
  const { blocks, selection: { numbers, operation }, error } = state;
  const blocksRef = useRef(blocks);

  const isSuccess = blocks.length === 1 && Number(blocks[0].value) === 69;

  // handleNext advances through levels; when done with current difficulty, moves to the next.
  const handleNext = useCallback(() => {
    if (currentLevelIdx < order.length - 1) {
      const nextLevelIdx = currentLevelIdx + 1;
      setCurrentLevelIdx(nextLevelIdx);
      const nextLevelData = levelsByDifficulty[difficulty][order[nextLevelIdx]];
      dispatch({ type: ACTIONS.RESET, payload: nextLevelData });
    } else {
      // Completed all levels in the current difficulty - move to the next difficulty.
      const currentDifficultyIndex = difficulties.indexOf(difficulty);
      if (currentDifficultyIndex < difficulties.length - 1) {
        const newDifficulty = difficulties[currentDifficultyIndex + 1];
        setDifficulty(newDifficulty);
        const newOrder = shuffle([...Array(levelsByDifficulty[newDifficulty].length).keys()]);
        setOrder(newOrder);
        setCurrentLevelIdx(0);
        dispatch({ type: ACTIONS.RESET, payload: levelsByDifficulty[newDifficulty][newOrder[0]] });
      } else {
        navigate('/gameover');
      }
    }
  }, [currentLevelIdx, order, difficulty, navigate]);

  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  useEffect(() => {
    if (isSuccess) {
      handleNext();
    }
  }, [isSuccess, handleNext]);

  useEffect(() => {
    const cleanup = setupKeyboardShortcuts(dispatch, ACTIONS, blocksRef, isSuccess, handleNext);
    return cleanup;
  }, [dispatch, isSuccess, handleNext]);

  useEffect(() => {
    dispatch({ type: ACTIONS.RESET, payload: currentLevelData });
  }, [currentLevelData]);

  return (
    <div className="puzzle">
      {error && (
        <ErrorMessage error={error} dispatch={dispatch} />
      )}

      {isSuccess && (
        <Confetti
          recycle={false}
          numberOfPieces={300}
          gravity={0.75}
        />
      )}

      <div className="numbers">
        {blocks.map((blk, idx) => (
          <NumberBlock 
            key={blk.id} 
            blk={blk} 
            idx={idx} 
            isSelected={numbers.includes(idx)} 
            dispatch={dispatch} 
          />
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

        <button className="reset-button" onClick={() => dispatch({ type: ACTIONS.RESET, payload: currentLevelData })}>
          Reset
        </button>
      </div>

      <button className="help-button" onClick={() => navigate('/howToPlay')}>
        ?
        <span className="help-tooltip">How to play?</span>
      </button>
    </div>
  );
}