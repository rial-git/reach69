import React, { useReducer } from 'react';
import MergeIcon from './assets/merge.svg';
import './level1.css';

/** Allowed operations, including “merge” */
const OPS = ['+', '-', 'merge', '*', '/',];

/** Initial digits (later replace with backend fetch) */
const initialNums = [7, 1, 2, 0, 2];

/** Reducer actions */
const ACTIONS = {
  PICK_NUMBER:    'PICK_NUMBER',
  PICK_OPERATION: 'PICK_OPERATION',
  UNDO:           'UNDO',
  RESET:          'RESET',
  CLEAR_ERROR:    'CLEAR_ERROR',
};

/** Create a fresh Block with a UUID */
function makeBlock(value, root = null, meta=null) {
  const obj =  {
    id: crypto.randomUUID(),
    value: String(value),
    root, 
    meta,
  };
  return obj;
}

/** Lazy initializer for useReducer */
function initState(nums) {
  return {
    blocks: nums.map(n => makeBlock(n)),
    selection: { numbers: [], operation: null },
    error: null,
  };
}

/** Centralized calculation + merge logic */
function calculateAndMerge(state, i1, i2, op) {

  const { blocks } = state;
  const b1 = blocks[i1], b2 = blocks[i2];
  const v1 = parseFloat(b1.value), v2 = parseFloat(b2.value);

  if (op === '/' && v2 === 0) {
    return { ...state, error: 'Division by zero is not allowed.' };
  }


  if (op === 'merge' && Math.abs(i1-i2) !== 1) {
    return { ...state, error: 'Only adjacent blocks can be merged!' };
  }

  let result;
  switch (op) {
    case '+':      result = v1 + v2; break;
    case '-':      result = v1 - v2; break;
    case '*':      result = v1 * v2; break;
    case '/':      result = v1 / v2; break;
    case 'merge':  result = parseFloat(`${blocks[Math.min(i1,i2)].value}${blocks[Math.max(i1,i2)].value}`); break;
    default:       return state;
  }



  const [leftChild, rightChild] = i1 < i2 ? [b1, b2] : [b2, b1];
  const gap = Math.abs((i1 - i2) + 1 );
  console.log('gap=', gap)
  const merged = makeBlock(result, [leftChild, rightChild], {gap});
  
 const removeSet = new Set([i1, i2]);
  const newBlocks = blocks
    .map((blk, idx) => ({ blk, idx }))
    .filter(({ idx }) => !removeSet.has(idx))
    .map(({ blk }) => blk);

  const insertAt = Math.min(i1, i2);
  newBlocks.splice(insertAt, 0, merged);
  return {
    blocks: newBlocks,
    selection: { numbers: [], operation: null },
    error: null,
  };
}

/** Reducer */
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case ACTIONS.PICK_NUMBER: {
      const idx = payload;
      const { numbers, operation } = state.selection;

      // If user already has 2 numbers and no operation, start fresh with this click
      if (numbers.length === 2 && !operation) {
        if (numbers[0] === (idx)) {
          return {
            ...state, 
            selection: {numbers: [numbers[1]], operation: null},
            error:null,
          };
        } 
        
        
        if (numbers[1] === (idx)) {
          return { 
            ...state,
            selection: {numbers: [numbers[0]], operation:null},
            error:null,
          };
        }
      } 

      // First pick
      if (numbers.length === 0) {
        return {
          ...state,
          selection: { numbers: [idx], operation: null },
          error: null,
         
        };
        
      }



      // Second pick
      if (numbers.length === 1) {
        // clicking same block twice? ignore
        if (numbers[0] === idx) { return  { 
          ...state, selection: { numbers:[], operations: null },
          error: null,
        };
      }

        // if we already chose an operation, do it immediately
        if (operation) {
          return calculateAndMerge(state, numbers[0], idx, operation);
        }

        // otherwise just record the second number
        return {
          ...state,
          selection: { numbers: [numbers[0], idx], operation: null },
          error: null,
        };
      }

      return state;
    }

    case ACTIONS.PICK_OPERATION: {
      const op = payload;
      const { numbers } = state.selection;

      // if two numbers are already selected, calculate now
      if (numbers.length === 2) {
        return calculateAndMerge(state, numbers[0], numbers[1], op);
      }

      // otherwise just record the op
      return {
        ...state,
        selection: { numbers: [...numbers], operation: op },
        error: null,
      };
    }

    case ACTIONS.UNDO: {
      const idx = payload;
      const block = state.blocks[idx];
      console.log(block)
      if (!block.root || !block.meta || typeof block.meta.gap !== 'number') {
        return { ...state, error: 'Nothing to undo here.' };
      }
      const newBlocks = [...state.blocks];
      newBlocks.splice(idx, 1);

      const [left, right] = block.root;
      const insertAt = idx;
      const rightInsertAt = insertAt + block.meta.gap; 

      newBlocks.splice(rightInsertAt, 0, right);
      newBlocks.splice(insertAt, 0, left);

      return {
        blocks: newBlocks,
        selection: { numbers: [], operation: null },
        error: null,
      };
    }

    case ACTIONS.RESET:
      return initState(initialNums);

    default:
      return state;
  }
}

/** The Level1 component */
export default function Level1() {
  const [state, dispatch] = useReducer(reducer, initialNums, initState);
  const { blocks, selection: { numbers, operation }, error } = state;

  return (
    <div className="puzzle-container" >
      {error && (
        <div className="error-message" role="alert" onClick={() => dispatch({ type: ACTIONS.CLEAR_ERROR })}>
          {error}
        </div>
      )}

      <div className="numbers">
        {blocks.map((blk, idx) => (
          <div
            key={blk.id}
            className={`number ${numbers.includes(idx) ? 'selected' : ''}`}
            onClick={() => dispatch({ type: ACTIONS.PICK_NUMBER, payload: idx })}
            onContextMenu={e => { e.preventDefault(); dispatch({ type: ACTIONS.UNDO, payload: idx }); }}
            title={blk.root ? 'Right-click to split' : 'Click to select'}
          >
            {blk.value}
          </div>
        ))}
      </div>

      <br></br>

      <div className="operations">
        {OPS.map(op => (
          <button
            key={op}
            className={`operation-button ${operation === op ? 'selected' : ''}`}
            onClick={() => dispatch({ type: ACTIONS.PICK_OPERATION, payload: op })}
          >
            {op === 'merge'
  ? <img src={MergeIcon} alt="merge" style={{ width: 24, height: 24 }} />
  : op} 
          </button>
        ))}
        <button
          className="reset-button"
          onClick={() => dispatch({ type: ACTIONS.RESET })}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
