import { ACTIONS } from '../utils/constants';

export const initState = (initialBlocks) => ({
  blocks: initialBlocks.map((num, idx) => ({
    id: `block-${idx}`,
    value: num,
    root: true
  })),
  selection: {
    numbers: [],
    operation: null
  },
  history: [],
  error: null
});

export function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.PICK_NUMBER: {
      const { numbers } = state.selection;
      const index = action.payload;
      
      // Prevent selecting more than 2 numbers
      if (numbers.length >= 2) return state;
      
      // Toggle selection
      const newNumbers = numbers.includes(index)
        ? numbers.filter(i => i !== index)
        : [...numbers, index];
      
      return {
        ...state,
        selection: {
          ...state.selection,
          numbers: newNumbers
        },
        error: null
      };
    }
    
    case ACTIONS.PICK_OPERATION: {
      const op = action.payload;
      const { numbers } = state.selection;
      
      // Validate selection
      if (numbers.length === 0) {
        return {
          ...state,
          error: "Please select numbers first"
        };
      }
      
      // For merge, we need exactly 2 numbers
      if (op === 'merge' && numbers.length !== 2) {
        return {
          ...state,
          error: "Merge requires exactly two numbers"
        };
      }
      
      // For other operations, we need exactly 2 numbers
      if (['+', '-', '*', '/'].includes(op) && numbers.length !== 2) {
        return {
          ...state,
          error: "This operation requires exactly two numbers"
        };
      }
      
      return {
        ...state,
        selection: {
          ...state.selection,
          operation: op
        },
        error: null
      };
    }
    
    case ACTIONS.PERFORM_OPERATION: {
      const { numbers, operation } = state.selection;
      const { blocks } = state;
      
      if (!operation || numbers.length === 0) return state;
      
      // Create a history snapshot
      const history = [...state.history, { blocks, selection: state.selection }];
      
      let newBlocks = [...blocks];
      let newValue;
      
      if (operation === 'merge') {
        // Merge operation
        const val1 = blocks[numbers[0]].value;
        const val2 = blocks[numbers[1]].value;
        newValue = parseInt(`${val1}${val2}`);
      } else {
        // Math operation
        const a = blocks[numbers[0]].value;
        const b = blocks[numbers[1]].value;
        
        switch(operation) {
          case '+': newValue = a + b; break;
          case '-': newValue = a - b; break;
          case '*': newValue = a * b; break;
          case '/': newValue = a / b; break;
          default: return state;
        }
      }
      
      // Remove the selected blocks and add the new one
      newBlocks = newBlocks.filter((_, idx) => !numbers.includes(idx));
      newBlocks.push({
        id: `new-${Date.now()}`,
        value: newValue,
        root: false
      });
      
      return {
        ...state,
        blocks: newBlocks,
        selection: {
          numbers: [],
          operation: null
        },
        history,
        error: null
      };
    }
    
    case ACTIONS.UNDO: {
      if (state.history.length === 0) return state;
      
      const prevState = state.history[state.history.length - 1];
      return {
        ...prevState,
        history: state.history.slice(0, -1)
      };
    }
    
    case ACTIONS.RESET: {
      return initState(action.payload);
    }
    
    case ACTIONS.CLEAR_ERROR: {
      return {
        ...state,
        error: null
      };
    }
    
    default:
      return state;
  }
}