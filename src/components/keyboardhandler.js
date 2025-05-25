import { ACTIONS } from '../utils/constants';

// src/utils/keyboardHandler.js
export function setupKeyboardShortcuts(dispatch, ACTIONS, blocksRef) {
  const keyMap = {
    '+': '+',
    '-': '-',
    '*': '*',
    '/': '/',
    '%': '%',
    '^': '^',
    'm': 'merge',   // 'm' for merge (custom key)
    '!': '!',
    'r': '√',       // 'r' for root (√)
    'Escape': 'RESET', // Escape key to reset
    'Backspace': 'UNDO', // Backspace to undo
  };

  function handleKeyDown(event) {
    console.log('KeyDown event:', event.key);
    const key = event.key;
    const blocks = blocksRef.current;
    if (keyMap[key]) {
      dispatch({ type: ACTIONS.PICK_OPERATION, payload: keyMap[key] });
      
    } else if (/^[0-9]$/.test(key)) {
      // Find the index of the block whose value matches the key pressed
      const idx = blocks.findIndex(blk => String(blk.value) === key);
      if (idx !== -1) {
        dispatch({ type: ACTIONS.PICK_NUMBER, payload: idx });
      } else {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Please select a number available' });
      }
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  // Return a cleanup function
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}
