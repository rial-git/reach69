// components/Level1.jsx
import React, { useReducer, useEffect, useRef, useState, useCallback, lazy, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
const Tips = lazy(() => import('../design/tips.jsx'));
import NumberBlock from '../ops&nums/numberBlock.jsx';
import OperationButton from '../ops&nums/OperationButton.jsx';
import AdvancedOperations from '../ops&nums/AdvancedOperations.jsx';
import ErrorMessage from '../design/ErrorMessage.jsx';
import { setupKeyboardShortcuts } from './keyboardhandler.jsx';
import '../css/game.css';
import '../css-mob/gameMob.css';
import ConfettiEffect from '../design/confetti.jsx';
import AccountIcon from "../design/accountIcon.jsx";
import { markLevelComplete, getCompletedLevelsByDifficulty, getCurrentLevel } from '../utils/userProgress';

const difficulties = ['easy', 'med', 'hard', 'impossible'];
const levelsByDifficulty = {
  easy: initialNumsEasy,
  med: initialNumsMedium,
  hard: initialNumsHard,
  impossible: initialNumsImpossible
};
const CONFETTI_DURATION = 2000;

export default function Game() {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  // Guest state
  const [guestDiff, setGuestDiff] = useState('easy');
  const [guestCompleted, setGuestCompleted] = useState({
    easy: [],
    med: [],
    hard: [],
    impossible: []
  });

  // Logged-in state
  const [currentDiff, setCurrentDiff] = useState('easy');
  const [completedByDiff, setCompletedByDiff] = useState({
    easy: [],
    med: [],
    hard: [],
    impossible: []
  });

  // Auth state
  useEffect(() => {
    import('firebase/auth').then(({ getAuth, onAuthStateChanged }) => {
      const auth = getAuth();
      const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
        setUser(firebaseUser);
        if (firebaseUser) {
          setLoading(true);
          const [dbCurrentLevel, dbCompleted] = await Promise.all([
            getCurrentLevel(),
            getCompletedLevelsByDifficulty()
          ]);
          // Find first incomplete difficulty if needed
          let startDiff = 'easy';
          for (const diff of difficulties) {
            const total = levelsByDifficulty[diff].length;
            const done = dbCompleted[diff]?.length || 0;
            if (done < total) {
              startDiff = diff;
              break;
            }
          }
          setCurrentDiff(dbCurrentLevel || startDiff);
          setCompletedByDiff(dbCompleted);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
      return unsub;
    });
  }, []);

  // Pick the right difficulty and completed list - memoized to avoid unnecessary recalcs
  const difficulty = user ? currentDiff : guestDiff;

  const allLevels = useMemo(() => levelsByDifficulty[difficulty], [difficulty]);
  const completedLevels = useMemo(
    () => (user ? completedByDiff[difficulty] : guestCompleted[difficulty]),
    [user, completedByDiff, difficulty, guestCompleted]
  );

  const notCompletedLevels = useMemo(
    () => allLevels.filter(lvl => !completedLevels.includes(lvl.id)),
    [allLevels, completedLevels]
  );

  const currentLevelData = notCompletedLevels[0] || null;

  // Reducer for the puzzle
  const [state, dispatch] = useReducer(
    reducer,
    currentLevelData ? currentLevelData.nums : [],
    initState
  );
  const { blocks, selection: { numbers, operation }, error } = state;
  const blocksRef = useRef(blocks);

  // Reset reducer when level changes
  useEffect(() => {
    if (currentLevelData) {
      dispatch({ type: ACTIONS.RESET, payload: currentLevelData.nums });
    }
  }, [currentLevelData]);

  const hasUndoable = blocks.some(block => block.root && block.meta);
  const isSuccess = blocks.length === 1 && Number(blocks[0].value) === 69;
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiTimeout = useRef(null);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const popupTimeout = useRef(null);

  const getNextDifficulty = (current) => {
    const idx = difficulties.indexOf(current);
    return idx < difficulties.length - 1 ? difficulties[idx + 1] : null;
  };

  // Handle level completion and progression
  const handleNext = useCallback(async () => {
    if (!currentLevelData) return;

    if (user) {
      await markLevelComplete(currentLevelData.id);
      const dbCompleted = await getCompletedLevelsByDifficulty();
      setCompletedByDiff(dbCompleted);

      // Check if all levels in this difficulty are done
      const total = levelsByDifficulty[difficulty].length;
      const done = dbCompleted[difficulty].length;
      if (done >= total) {
        const nextDiff = getNextDifficulty(difficulty);
        if (nextDiff) setCurrentDiff(nextDiff);
      }
    } else {
      setGuestCompleted(prev => {
        const updated = { ...prev };
        updated[difficulty] = [...prev[difficulty], currentLevelData.id];
        return updated;
      });

      // Check if all levels in this difficulty are done
      const total = levelsByDifficulty[difficulty].length;
      const done = completedLevels.length + 1; // +1 for just completed
      if (done >= total) {
        const nextDiff = getNextDifficulty(difficulty);
        if (nextDiff) setGuestDiff(nextDiff);
      }
    }

    // Clear existing timeouts
    if (confettiTimeout.current) clearTimeout(confettiTimeout.current);
    if (popupTimeout.current) clearTimeout(popupTimeout.current);

    // Show level complete popup and confetti
    setShowLevelComplete(true);
    setShowConfetti(true);

    // Set timeouts to hide them
    popupTimeout.current = setTimeout(() => {
      setShowLevelComplete(false);
    }, 1500);

    confettiTimeout.current = setTimeout(() => {
      setShowConfetti(false);
    }, CONFETTI_DURATION);
  }, [
    user,
    currentLevelData,
    difficulty,
    completedLevels,
    setGuestCompleted,
    setCurrentDiff,
    setGuestDiff
  ]);

  // Handle success condition - advance to next level
  useEffect(() => {
    if (isSuccess) {
      handleNext();
    }
  }, [isSuccess, handleNext]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (confettiTimeout.current) clearTimeout(confettiTimeout.current);
      if (popupTimeout.current) clearTimeout(popupTimeout.current);
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

  // After updating guestCompleted, check if all are done and advance difficulty
  useEffect(() => {
    const total = levelsByDifficulty[guestDiff].length;
    const done = guestCompleted[guestDiff].length;
    if (done >= total) {
      const nextDiff = getNextDifficulty(guestDiff);
      if (nextDiff) setGuestDiff(nextDiff);
    }
  }, [guestCompleted, guestDiff]);

  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (!currentLevelData) {
    return <div>No more levels to play! 🎉</div>;
  }

  return (
    <>
      {showConfetti && <ConfettiEffect />}
      <div className="puzzle">
        {showLevelComplete && (
          <div className="level-complete-popup">
            Level Complete!
          </div>
        )}
        {user && <AccountIcon user={user} />}
        <Tips />

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

          {hasUndoable && (
            <button
              className="reset-button"
              onClick={() => dispatch({ type: ACTIONS.RESET, payload: currentLevelData.nums })}
            >
              Reset
            </button>
          )}
        </div>

        <button className="help-button" onClick={() => navigate('/howToPlay')}>
          ?
          <span className="help-tooltip">How to play?</span>
        </button>
      </div>
    </>
  );
}
