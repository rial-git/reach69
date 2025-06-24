// components/TutorialMode.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NumberBlock from '../ops&nums/numberBlock.jsx';
import OperationButton from '../ops&nums/OperationButton.jsx';
import { opShortcuts } from '../utils/constants';
import { tutorialSteps, tutorialNums, level1Nums, level1Steps, level2Nums, level2Steps, level3Nums, level3Steps } from '../utils/tutorialConst.js';
import '../css/tutorialMode.css';
import { calculateAndMerge } from './reducer';

export default function TutorialMode() {
  const [level, setLevel] = useState(0);
  const [step, setStep] = useState(0);
  const [blocks, setBlocks] = useState(() => {
    return tutorialNums.map((num, idx) => ({
      id: `tut-${idx}`,
      value: num,
      root: true
    }));
  });
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [selectedOp, setSelectedOp] = useState(null);
  const navigate = useNavigate();

  // Reset blocks when level changes
  const resetBlocks = (newLevel) => {
    switch(newLevel) {
      case 0:
        return tutorialNums.map((num, idx) => ({
          id: `tut-${idx}`,
          value: num,
          root: true
        }));
      case 1:
        return level1Nums.map((num, idx) => ({
          id: `lvl1-${idx}`,
          value: num,
          root: true
        }));
      case 2:
        return level2Nums.map((num, idx) => ({
          id: `lvl2-${idx}`,
          value: num,
          root: true
        }));
      case 3:
        return level3Nums.map((num, idx) => ({
          id: `lvl3-${idx}`,
          value: num,
          root: true
        }));
      default:
        return tutorialNums.map((num, idx) => ({
          id: `tut-${idx}`,
          value: num,
          root: true
        }));
    }
  };

  const handleNumberClick = (index) => {
    // Level 0
    if (level === 0) {
      if (step === 0 && index === 0) {
        setSelectedNumbers([0]);
        setStep(1);
      } else if (step === 1 && index === 1) {
        setSelectedNumbers([0, 1]);
        setStep(2);
      }
    }
    // Level 1
    else if (level === 1) {
      if (step === 0 && index === 0) {
        setSelectedNumbers([0]);
        setStep(1);
      } else if (step === 1 && index === 1) {
        setSelectedNumbers([0, 1]);
        setStep(2);
      } else if (step === 3 && index === 0) {
        setSelectedNumbers([0]);
        setStep(4);
      } else if (step === 4 && index === 1) {
        setSelectedNumbers([0, 1]);
        setStep(5);
      }
    }
    // Level 2
    else if (level === 2) {
      if (step === 0 && index === 0) {
        setSelectedNumbers([0]);
        setStep(1);
      } else if (step === 1 && index === 1) {
        setSelectedNumbers([0, 1]);
        setStep(2);
      } else if (step === 3 && index === 0) {
        setSelectedNumbers([0]);
        setStep(4);
      } else if (step === 4 && index === 1) {
        setSelectedNumbers([0, 1]);
        setStep(5);
      }
    }
    // Level 3
    else if (level === 3) {
      if (step === 0 && index === 0) {
        setSelectedNumbers([0]);
        setStep(1);
      } else if (step === 1 && index === 1) {
        setSelectedNumbers([0, 1]);
        setStep(2);
      } else if (step === 3 && index === 0) {
        setSelectedNumbers([0]);
        setStep(4);
      } else if (step === 4 && index === 1) {
        setSelectedNumbers([0, 1]);
        setStep(5);
      } 
      // After subtraction (71-2=69), blocks become [69, 0, 2]
      else if (step === 6 && index === 1) {  // 0 is now at index 1
        setSelectedNumbers([1]);
        setStep(7);
      } else if (step === 7 && index === 2) {  // 2 is now at index 2
        setSelectedNumbers([1, 2]);
        setStep(8);
      } 
      // After multiplication (0*2=0), blocks become [69, 0]
      else if (step === 9 && index === 0) {
        setSelectedNumbers([0]);
        setStep(10);
      } else if (step === 10 && index === 1) {
        setSelectedNumbers([0, 1]);
        setStep(11);
      }
    }
  };

  const handleOperationClick = (op) => {
    // Level 0
    if (level === 0 && step === 2 && op === 'merge') {
      performOperation(op);
      setStep(3);
    }
    // Level 1
    else if (level === 1) {
      if (step === 2 && op === 'merge') {
        performOperation(op);
        setStep(3);
      } else if (step === 5 && (op === '+' || op === '-')) {
        performOperation(op);
        setStep(6);
      }
    }
    // Level 2
    else if (level === 2) {
      if (step === 2 && op === 'merge') {
        performOperation(op);
        setStep(3);
      } else if (step === 5 && op === '-') {
        performOperation(op);
        setStep(6);
      }
    }
    // Level 3
    else if (level === 3) {
      if (step === 2 && op === 'merge') {
        performOperation(op);
        setStep(3);
      } else if (step === 5 && op === '-') {
        performOperation(op);
        setStep(6);
      } else if (step === 8 && op === '*') {
        performOperation(op);
        setStep(9);
      } else if (step === 11 && (op === '+' || op === '-')) {
        performOperation(op);
        setStep(12);
      }
    }
  };

  const performOperation = (op) => {
    if (selectedNumbers.length === 2) {
      const mockState = {
        blocks,
        selection: { numbers: selectedNumbers, operation: op },
        error: null
      };
      
      const newState = calculateAndMerge(
        mockState,
        selectedNumbers[0],
        selectedNumbers[1],
        op
      );
      
      setBlocks(newState.blocks);
      setSelectedNumbers([]);
      setSelectedOp(null);
    }
  };

  const handleContinue = () => {
    if (level < 3) {
      // Move to next level
      const nextLevel = level + 1;
      setLevel(nextLevel);
      setStep(0);
      setBlocks(resetBlocks(nextLevel));
      setSelectedNumbers([]);
      setSelectedOp(null);
    } else {
      // Tutorial completed
      localStorage.setItem('tutorialCompleted', 'true');
      navigate('/game');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('tutorialCompleted', 'true');
    navigate('/game');
  };

  // Get current step message based on level
  const getCurrentStepMessage = () => {
    switch(level) {
      case 0: return tutorialSteps[step];
      case 1: return level1Steps[step];
      case 2: return level2Steps[step];
      case 3: return level3Steps[step];
      default: return tutorialSteps[step];
    }
  };

  // Check if continue button should be shown
  const showContinueButton = () => {
    switch(level) {
      case 0: return step === 3;
      case 1: return step === 6;
      case 2: return step === 6;
      case 3: return step === 12;
      default: return step === 3;
    }
  };

  return (
    <div className="puzzle tutorial">
      <div className="tutorial-tip">
        {getCurrentStepMessage()}
      </div>

      <div className="numbers">
        {blocks.map((blk, idx) => (
          <NumberBlock
            key={blk.id}
            blk={blk}
            idx={idx}
            isSelected={selectedNumbers.includes(idx)}
            onClick={() => handleNumberClick(idx)}
            disabled={isNumberDisabled(level, step, idx)}
          />
        ))}
      </div>

      <div className="operations">
        <div className="basic-operations">
          <OperationButton
            op="merge"
            shortcut={opShortcuts.merge || '.'}
            isSelected={selectedOp === 'merge'}
            onClick={() => handleOperationClick('merge')}
            disabled={isOperationDisabled(level, step, 'merge')}
          />
          <OperationButton
            op="+"
            shortcut={opShortcuts['+'] || '+'}
            isSelected={selectedOp === '+'}
            onClick={() => handleOperationClick('+')}
            disabled={isOperationDisabled(level, step, '+')}
          />
          <OperationButton
            op="-"
            shortcut={opShortcuts['-'] || '-'}
            isSelected={selectedOp === '-'}
            onClick={() => handleOperationClick('-')}
            disabled={isOperationDisabled(level, step, '-')}
          />
          <OperationButton
            op="*"
            shortcut={opShortcuts['*'] || '*'}
            isSelected={selectedOp === '*'}
            onClick={() => handleOperationClick('*')}
            disabled={isOperationDisabled(level, step, '*')}
          />
        </div>
      </div>

      {showContinueButton() && (
        <button className="continue-button" onClick={handleContinue}>
          {level < 3 ? "Next Level" : "Continue to Game"}
        </button>
      )}
      <button className="skip-button" onClick={handleSkip}>
        Skip Tutorial
      </button>
    </div>
  );
}

// Helper function to determine if number is disabled
function isNumberDisabled(level, step, index) {
  // Level 0
  if (level === 0) {
    if (step === 0) return index !== 0;
    if (step === 1) return index !== 1;
    return step >= 2;
  }
  
  // Level 1
  if (level === 1) {
    if (step === 0) return index !== 0;
    if (step === 1) return index !== 1;
    if (step === 3) return index !== 0;
    if (step === 4) return index !== 1;
    return step >= 5;
  }
  
  // Level 2
  if (level === 2) {
    if (step === 0) return index !== 0;
    if (step === 1) return index !== 1;
    if (step === 3) return index !== 0;
    if (step === 4) return index !== 1;
    return step >= 5;
  }
  
  // Level 3
  if (level === 3) {
    if (step === 0) return index !== 0;
    if (step === 1) return index !== 1;
    if (step === 3) return index !== 0;
    if (step === 4) return index !== 1;
    // After subtraction (71-2=69), blocks are [69, 0, 2]
    if (step === 6) return index !== 1;  // Enable 0 at index 1
    if (step === 7) return index !== 2;  // Enable 2 at index 2
    // After multiplication (0*2=0), blocks are [69, 0]
    if (step === 9) return index !== 0;  // Enable 69 at index 0
    if (step === 10) return index !== 1; // Enable 0 at index 1
    return step >= 11;
  }
  
  return true;
}

// Helper function to determine if operation is disabled
function isOperationDisabled(level, step, op) {
  // Level 0
  if (level === 0) {
    return step !== 2 || op !== 'merge';
  }
  
  // Level 1
  if (level === 1) {
    if (step === 2) return op !== 'merge';
    if (step === 5) return op !== '+' && op !== '-';
    return true;
  }
  
  // Level 2
  if (level === 2) {
    if (step === 2) return op !== 'merge';
    if (step === 5) return op !== '-';
    return true;
  }
  
  // Level 3
  if (level === 3) {
    if (step === 2) return op !== 'merge';
    if (step === 5) return op !== '-';
    if (step === 8) return op !== '*';
    if (step === 11) return op !== '+' && op !== '-';
    return true;
  }
  
  return true;
}