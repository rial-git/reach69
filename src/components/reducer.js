// components/level1Reducer.js
import { makeBlock } from '../utils/utils';
import { singleDigitOp } from '../ops&nums/singledigitops';

import { 
  ACTIONS,
  advancedSingleDigitOps,
  initialNumsEasy,
  initialNumsMedium,
  initialNumsHard,
} from '../utils/constants';


export function initState(nums) { 
    
    
      return {
        blocks: nums.map(n => makeBlock(n)),
        selection: { numbers: [], operation: null },
        error: null,
      };


}


 export function calculateAndMerge(state, i1, i2, op) {

  const { blocks } = state;
  const b1 = blocks[i1], b2 = blocks[i2];
  const v1 = parseFloat(b1.value), v2 = parseFloat(b2.value);

  if (op === '/' && v2 === 0) {
    return { ...state, error: 'Division by zero is not allowed.' };
  }


  if (op === 'merge' && Math.abs(i1 - i2) !== 1) {
    return { ...state, error: 'Only adjacent blocks can be merged!' };
  }

  let result;
  switch (op) {
    case '+': result = v1 + v2; break;
    case '-': result = v1 - v2; break;
    case '*': result = v1 * v2; break;
    case '/': result = v1 / v2; break;
    case '%': result = v1 % v2; break;
    case '^': result = Math.pow(v1, v2); break;
    case 'merge': result = parseFloat(`${blocks[Math.min(i1, i2)].value}${blocks[Math.max(i1, i2)].value}`); break;
    default: return state;
  }


  result = Math.round(result * 100) / 100;

  const [leftChild, rightChild] = i1 < i2 ? [b1, b2] : [b2, b1];
  const [leftIdx, rightIdx] = i1 < i2 ? [i1, i2] : [i2, i1];
  let gap = rightIdx - leftIdx - 1;

  for (let idx = leftIdx + 1; idx < rightIdx; idx++) {
    const blk = blocks[idx];
    // If undoable, add the number of numbers in root to gap
    function countLeaves(block) {
      if (!block.root || block.root.length === 0) return 1;
      return block.root.reduce((sum, child) => sum + countLeaves(child), 0);
    }
    if (blk.root && blk.meta) {
      gap += countLeaves(blk) - 1; // Only add if undoable
    }
  }
  

  let infoOfRoot = `${v1} ${op == "merge" ? "&" : op } ${v2}`;
  const merged = makeBlock(result, [leftChild, rightChild], { gap, infoOfRoot : infoOfRoot, mergedTime: Date.now() });

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


export function reducer(state, action) { 

const { type, payload } = action;
    
      switch (type) {
        case ACTIONS.CLEAR_ERROR:
          return { ...state, error: null };
    
        case ACTIONS.PICK_NUMBER: {
          const idx = payload;
          const { numbers, operation } = state.selection;
    
          // If user already has 2 numbers and no operation, start fresh with this click
          if (numbers.length === 2 && !operation) {
            if (numbers[0] === idx) {
              return {
                ...state,
                selection: { numbers: [numbers[1]], operation: null },
                error: null,
              };
            }
            if (numbers[1] === idx) {
              return {
                ...state,
                selection: { numbers: [numbers[0]], operation: null },
                error: null,
              };
            }

            return { ...state, error: 'Cannot select anymore numbers' };
          }
    
          // First pick
          if (numbers.length === 0) {

            if (advancedSingleDigitOps.includes(state.selection.operation)) {
              return singleDigitOp(state, idx, state.selection.operation);
            }

            return {
              ...state,
              selection: { numbers: [idx], operation: state.selection.operation }, // <--- keep operation
              error: null,
            };
          }
    
          // Second pick
          if (numbers.length === 1) {
            if (numbers[0] === idx) {
              return {
                ...state, selection: { numbers: [], operation: state.selection.operation }, // <--- keep operation
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
              selection: { numbers: [numbers[0], idx], operation: state.selection.operation }, // <--- keep operation
              error: null,
            };
          }
    
          return state;
        }
    
        case ACTIONS.PICK_OPERATION: {
          const op = payload;
          const { numbers, operation: currentOp } = state.selection;
    
            if (currentOp === op) {
        return {
          ...state,
          selection: { ...state.selection, operation: null },
          error: null,
        };
      }
    
            if (advancedSingleDigitOps.includes(op)) {
        if (numbers.length === 1) {
          return singleDigitOp(state, numbers[0], op);
        }
        else if (numbers.length === 2) {
          return { ...state, error: 'Select exactly one number for this operation.' };
        }
      }
    
          if (advancedSingleDigitOps.includes(op) && numbers.length === 1) {
          return calculateAndMerge(state, numbers[0], null, op);
          }
    
    
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
      if (!block.root || !block.meta) {
        return { ...state, error: 'Nothing to undo here.' };
      }
    
      const newBlocks = [...state.blocks];
      newBlocks.splice(idx, 1); // Remove the current block
    
      if (block.root.length === 1) {
        // Handle single root (from single-digit operations)
        newBlocks.splice(idx, 0, ...block.root);
      } else if (block.root.length === 2) {
        // Handle two roots (from merge operations)
        const [left, right] = block.root;
        const gap = block.meta.gap;
        const insertAt = Math.min(idx, idx + gap + 1);
        newBlocks.splice(insertAt, 0, left);
        newBlocks.splice(insertAt + gap + 1, 0, right);
      } else {
        return { ...state, error: 'Cannot undo this block.' };
      }
    
      return {
        blocks: newBlocks,
        selection: { numbers: [], operation: null },
        error: null,
      };
    }
    
        case ACTIONS.RESET:
          return initState(payload || state.blocks.map(b => b.value));
        
        case ACTIONS.SET_ERROR:
  return { ...state, error: typeof action.payload === 'string' ? action.payload : JSON.stringify(action.payload) };
        case ACTIONS.CLEAR_SELECTION:
  if (action.payload?.type === 'numbers') {
    return {
      ...state,
      selection: {
        ...state.selection,
        numbers: []
      }
    };
  }
  return state;

        default:
          return state;
      }

      
 }