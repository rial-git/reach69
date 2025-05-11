import React, { useReducer } from 'react';
import './level1.css';

/**
 * Block object represents a number block in the game.
 * @typedef {Object} Block
 * @property {string} id        Unique identifier.
 * @property {string} value     Numeric value as string.
 * @property {Block[]|null} root Children blocks if merged, null otherwise.
 */

/** Initial numbers (replace with backend fetch later) */
const initialNums = [7, 1, 2, 0, 2];

/** Generate blocks from the initial numbers */
const generateInitBlocks = (nums) =>
  nums.map((num, i) => ({
    id: `block-${i}-${Date.now()}`,
    value: num.toString(),
    root: null,
  }));

/** The reducer’s initial state */
const initialState = {
  blocks: generateInitBlocks(initialNums),
  selection: { numbers: [], operation: null },
  error: null,
};

/** Core reducer handling selections, calculations, and undo */
function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_NUMBER': {
      const idx = action.payload;
      const { numbers, operation } = state.selection;

      // Can't pick a third number before an operation
      if (numbers.length === 2 && !operation) {
        return { ...state, error: 'Select an operation or reset before choosing another number.' };
      }

      // First click
      if (numbers.length === 0) {
        return { ...state, selection: { numbers: [idx], operation: null }, error: null };
      }

      // Second click
      if (numbers.length === 1) {
        if (numbers[0] === idx) {
          // ignore re-clicking same block
          return state;
        }
        // If op already chosen, do calculation now
        if (operation) {
          return performCalculation(state, numbers[0], idx, operation);
        }
        // Otherwise just select the second number
        return {
          ...state,
          selection: { numbers: [numbers[0], idx], operation: null },
          error: null,
        };
      }

      return state;
    }

    case 'SELECT_OPERATION': {
      const op = action.payload;
      const { numbers } = state.selection;

      // If two numbers already picked, calculate immediately
      if (numbers.length === 2) {
        return performCalculation(state, numbers[0], numbers[1], op);
      }

      // Otherwise just set the operation
      return {
        ...state,
        selection: { numbers: [...numbers], operation: op },
        error: null,
      };
    }

    case 'UNDO': {
      const idx = action.payload;
      const block = state.blocks[idx];

      if (!block.root) {
        // Nothing to split
        return { ...state, error: 'Nothing to undo here.' };
      }

      // Replace the merged block with its two children
      const newBlocks = [...state.blocks];
      newBlocks.splice(idx, 1, ...block.root);

      return {
        blocks: newBlocks,
        selection: { numbers: [], operation: null },
        error: null,
      };
    }

    default:
      return state;
  }
}

/**
 * Helper to perform the calculation and return the next state.
 */
function performCalculation(state, i1, i2, op) {
  const b1 = state.blocks[i1];
  const b2 = state.blocks[i2];
  const v1 = parseFloat(b1.value);
  const v2 = parseFloat(b2.value);

  if (op === '/' && v2 === 0) {
    return {
      ...state,
      selection: { numbers: [], operation: null },
      error: 'Division by zero is not allowed.',
    };
  }

  let result;
  switch (op) {
    case '+': result = v1 + v2; break;
    case '-': result = v1 - v2; break;
    case '*': result = v1 * v2; break;
    case '/': result = v1 / v2; break;
    case 'merge': result = parseFloat(`${v1.toString()}${v2.toString()}`); break;
    default: return state;
  }

  const mergedBlock = {
    id: `block-${Date.now()}-${Math.random()}`,
    value: result.toString(),
    root: [b1, b2],
  };

  const newBlocks = [...state.blocks];
  const minIndex = Math.min(i1, i2);
  newBlocks.splice(minIndex, 2, mergedBlock);

  return {
    blocks: newBlocks,
    selection: { numbers: [], operation: null },
    error: null,
  };
}

/**
 * Level1 component
 */
const Level1 = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    blocks,
    selection: { numbers, operation },
    error,
  } = state;

  const onNumberClick = (idx) => {
    dispatch({ type: 'SELECT_NUMBER', payload: idx });
  };

  const onOperationClick = (op) => {
    dispatch({ type: 'SELECT_OPERATION', payload: op });
  };

  const onRightClick = (e, idx) => {
    e.preventDefault();
    dispatch({ type: 'UNDO', payload: idx });
  };

  return (
    <div className="puzzle-container">
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <div className="numbers">
        {blocks.map((block, idx) => (
          <div
            key={block.id}
            className={`number ${numbers.includes(idx) ? 'selected' : ''}`}
            onClick={() => onNumberClick(idx)}
            onContextMenu={(e) => onRightClick(e, idx)}
            title={block.root ? 'Right-click to split' : ''}
          >
            {block.value}
          </div>
        ))}
      </div>
      <br></br>
      <div className="operations">
        {['+', '-', '*', '/', 'merge'].map((op) => (
          <button
            key={op}
            type="button"
            className={`operation-button ${operation === op ? 'selected' : ''}`}
            onClick={() => onOperationClick(op)}
          >
            {op}
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(Level1);
