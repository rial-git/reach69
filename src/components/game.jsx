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
  initialNumsHard, 
  initialNumsImpossible
} from '../utils/constants';
import { shuffle } from '../utils/gameHelpers';
import NumberBlock from './NumberBlock';
import OperationButton from './OperationButton';
import AdvancedOperations from './AdvancedOperations';
import ErrorMessage from './ErrorMessage';
import { setupKeyboardShortcuts } from './keyboardhandler';
import '../css/game.css';
import ConfettiEffect from './confetti.jsx';

const difficulties = ['easy', 'med', 'hard', 'impossible'];
const levelsByDifficulty = {
  easy: initialNumsEasy,
  med: initialNumsMedium,
  hard: initialNumsHard,
  impossible: initialNumsImpossible
  
};

const CONFETTI_DURATION = 2000; // Duration in milliseconds

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
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiTimeout = useRef(null);

  // NEW state for level complete pop-up
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  // Handle advancing to next level
  const handleNext = useCallback(() => {
    let nextLevelData;
    
    if (currentLevelIdx < order.length - 1) {
      // Advance to next level for current difficulty
      const nextLevelIdx = currentLevelIdx + 1;
      setCurrentLevelIdx(nextLevelIdx);
      nextLevelData = levelsByDifficulty[difficulty][order[nextLevelIdx]];
    } else {
      // Completed all levels in current difficulty - move to next difficulty
      const currentDifficultyIndex = difficulties.indexOf(difficulty);
      if (currentDifficultyIndex < difficulties.length - 1) {
        const newDifficulty = difficulties[currentDifficultyIndex + 1];
        setDifficulty(newDifficulty);
        const newOrder = shuffle([...Array(levelsByDifficulty[newDifficulty].length).keys()]);
        setOrder(newOrder);
        setCurrentLevelIdx(0);
        nextLevelData = levelsByDifficulty[newDifficulty][newOrder[0]];
      } else {
        navigate('/gameover');
        return;
      }
    }

    // Reset state for new level
    dispatch({ type: ACTIONS.RESET, payload: nextLevelData });

    // Show confetti for new level
    if (confettiTimeout.current) {
      clearTimeout(confettiTimeout.current);
    }
    
    setShowConfetti(true);
    confettiTimeout.current = setTimeout(() => {
      setShowConfetti(false);
    }, CONFETTI_DURATION);
  }, [currentLevelIdx, order, difficulty, navigate, dispatch]);

  // Handle success condition - advance to next level
  useEffect(() => {
    if (isSuccess) {
      handleNext();
    }
  }, [isSuccess, handleNext]);

  // Cleanup confetti timeout on unmount
  useEffect(() => {
    return () => {
      if (confettiTimeout.current) {
        clearTimeout(confettiTimeout.current);
      }
    };
  }, []);

  // Update blocks ref
  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  // Setup keyboard shortcuts
  useEffect(() => {
    const cleanup = setupKeyboardShortcuts(dispatch, ACTIONS, blocksRef, isSuccess, handleNext);
    return cleanup;
  }, [dispatch, isSuccess, handleNext]);

  // When currentLevelIdx changes (and is NOT the first level), trigger the pop-up.
  useEffect(() => {
    if (currentLevelIdx > 0) {
      setShowLevelComplete(true);
      const timer = setTimeout(() => {
        setShowLevelComplete(false);
      }, 1500); // pop-up visible for 4000ms (4 seconds)
      return () => clearTimeout(timer);
    }
  }, [currentLevelIdx]);

  return (
    <>
      {showConfetti && <ConfettiEffect />}
      <div className="puzzle">
        {/* Render the "Level Complete" pop-up if active */}
        {showLevelComplete && (
          <div className="level-complete-popup">
            Level Complete!
          </div>
        )}

        {error && (
          <ErrorMessage error={error} dispatch={dispatch} />
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
    </>
  );
}