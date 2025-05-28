import { ACTIONS, keyMap  } from '../utils/constants';

// src/utils/keyboardHandler.js
export function setupKeyboardShortcuts(dispatch, ACTIONS, blocksRef) {


let lastKeyPressTime = 0;
let lastKeyPressed = null;

function handleKeyDown(event) {
  const key = event.key;
  const blocks = blocksRef.current;
  const currentTime = Date.now();

  // Prevent browser default for keys you want to capture
  if (
    keyMap[key] ||
    key === 'Escape' ||
    key === 'Backspace' ||
    /^[0-9]$/.test(key)
  ) {
    event.preventDefault();
  }

  // for escape key to reset the state
    if (key === 'Escape') {
    dispatch({ type: ACTIONS.RESET });
    return;
  }



// for backspace key to undo the last merged block
if (key === 'Backspace') {
  // Find the last merged block (assuming merged blocks have a .root property)
  const lastMergedIdx = [...blocks]
    .map((blk, idx) => ({ blk, idx }))
    .reverse()
    .find(({ blk }) => blk.root)?.idx;

  if (typeof lastMergedIdx === 'number') {
    dispatch({ type: ACTIONS.UNDO, payload: lastMergedIdx });
  } else {
    dispatch({ type: ACTIONS.SET_ERROR, payload: 'No merged block to undo.' });
  }
  return;
}

  if (keyMap[key]) {
    dispatch({ type: ACTIONS.PICK_OPERATION, payload: keyMap[key] });
    return;
  }

  if (/^[0-9]$/.test(key)) {
    // If same key pressed again within 1 second, expand search
    const isRepeat = key === lastKeyPressed && currentTime - lastKeyPressTime <= 1000;
    lastKeyPressTime = currentTime;
    lastKeyPressed = key;

    let idx = blocks.findIndex(blk => !blk.root && String(blk.value) === key);

    if (idx === -1 && isRepeat) {
      // Expanded search if user presses the same key again within 1 sec
      idx = blocks.findIndex(blk => String(blk.value).includes(key));
    }

    if (idx === -1) {
      idx = blocks.findIndex(blk => !blk.root && String(blk.value).startsWith(key));
    }

    if (idx === -1) {
      idx = blocks.findIndex(blk => blk.root && String(blk.value).startsWith(key));
    }

    if (idx !== -1) {
      dispatch({ type: ACTIONS.PICK_NUMBER, payload: idx });
    } else {
      // fallback logic
      const lastSelectedIndex = blocksRef.lastSelectedIndex ?? -1;
      const lastBlock = blocks[lastSelectedIndex];

      if (
        lastBlock &&
        lastBlock.root &&
        String(lastBlock.value).startsWith(key)
      ) {
        return; // silent skip
      }

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
