// components/TutorialMode.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NumberBlock from '../ops&nums/numberBlock.jsx';
import OperationButton from '../ops&nums/OperationButton.jsx';
import { tutorialNums, tutorialSteps, opShortcuts } from '../utils/constants';
import '../css/tutorialMode.css';

export default function TutorialMode() {
  const [step, setStep] = useState(0);
// In TutorialMode.jsx
const [blocks] = useState(tutorialNums.map((num, idx) => ({ 
  id: `tut-${idx}`, 
  value: num, 
  root: true 
  // No meta property needed for tutorial blocks
})));
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [selectedOp, setSelectedOp] = useState(null);
  const navigate = useNavigate();

  const handleNumberClick = (index) => {
    // Step 0: Select first number (6)
    if (step === 0 && index === 0) {
      setSelectedNumbers([0]);
      setStep(1);
    }
    // Step 1: Select second number (9)
    else if (step === 1 && index === 1) {
      setSelectedNumbers([0, 1]);
      setStep(2);
    }
  };

  const handleOperationClick = (op) => {
    // Step 2: Select merge operation
    if (step === 2 && op === 'merge') {
      setSelectedOp('merge');
      setStep(3);
    }
  };

  const handleContinue = () => {
    localStorage.setItem('tutorialCompleted', 'true');
    navigate('/game');
  };

  const handleSkip = () => {
    localStorage.setItem('tutorialCompleted', 'true');
    navigate('/game');
  };

  return (
    <div className="puzzle tutorial">
      <button className="skip-button" onClick={handleSkip}>
        Skip Tutorial
      </button>

      <div className="tutorial-tip">
        {tutorialSteps[step]}
      </div>

      <div className="numbers">
        {blocks.map((blk, idx) => (
          <NumberBlock
            key={blk.id}
            blk={blk}
            idx={idx}
            isSelected={selectedNumbers.includes(idx)}
            onClick={() => handleNumberClick(idx)}
            disabled={
              (step === 0 && idx !== 0) || 
              (step === 1 && idx !== 1) || 
              step === 2 || 
              step === 3
            }
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
            disabled={step !== 2}
          />
        </div>
      </div>

      {step === 3 && (
        <button className="continue-button" onClick={handleContinue}>
          Continue to Game
        </button>
      )}
    </div>
  );
}