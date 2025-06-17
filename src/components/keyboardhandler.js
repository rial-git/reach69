import { ACTIONS, keyMap } from '../utils/constants';

// src/utils/keyboardHandler.js
export function setupKeyboardShortcuts(dispatch, ACTIONS, blocksRef, isSuccess, handleNext) {
  let lastKeyPressTime = 0;
  let lastKeyPressed = null;
  let lastKeyCycleIndices = {}; // Track cycling index for each key

  function handleKeyDown(event) {

  if (event.ctrlKey || event.altKey) {
  return;
  }


    const key = event.key;
    const blocks = blocksRef.current;
    const currentTime = Date.now();

    // Prevent browser default for keys you want to capture
    if (
       (
      keyMap[key] ||
      key === 'Escape' ||
      key === 'Backspace' ||
      /^[0-9]$/.test(key) 
    ) && !event.ctrlKey && !event.altKey && !event.shiftKey 
    ) {
      event.preventDefault();
    }

    // for escape key to reset the state
    if (key === 'Escape') {
      dispatch({ type: ACTIONS.RESET });
      return;
    }

    // for enter key to trigger next action if success
    if (event.key === 'Enter' && isSuccess && typeof handleNext === 'function') {
      event.preventDefault();
      handleNext();
      return;
    }

    // for backspace key to undo the last merged block
    if (key === 'Backspace') {
      const maxMergedTime = Math.max(...blocks.map(blk => blk.meta?.mergedTime || 0));
      const lastMergedIdx = [...blocks].findIndex(b => b.meta?.mergedTime === maxMergedTime);
      if (lastMergedIdx >= 0) {
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
      // 1. Try cycling through exact matches
      const matchingIndices = blocks
        .map((blk, idx) => (String(blk.value).includes(key) ? idx : -1))
        .filter(idx => idx !== -1);

      if (matchingIndices.length > 0) {
        // Cycle through matches if key is pressed repeatedly within 1 second
        if (key === lastKeyPressed && currentTime - lastKeyPressTime <= 1000) {
          lastKeyCycleIndices[key] = (lastKeyCycleIndices[key] + 1) % matchingIndices.length;
        } else {
          lastKeyCycleIndices[key] = 0;
        }

        lastKeyPressTime = currentTime;
        lastKeyPressed = key;

        const idx = matchingIndices[lastKeyCycleIndices[key]];

        dispatch({ type: ACTIONS.CLEAR_SELECTION, payload: { type: 'numbers' } });
        setTimeout(() => {
          dispatch({ type: ACTIONS.PICK_NUMBER, payload: idx });
        }, 0);
        return;
      }

      // 2. Fallback to your previous flexible search logic
      let idx = blocks.findIndex(blk => String(blk.value).includes(key));
      if (idx === -1) {
        idx = blocks.findIndex(blk => !blk.root && String(blk.value).startsWith(key));
      }
      if (idx === -1) {
        idx = blocks.findIndex(blk => blk.root && String(blk.value).startsWith(key));
      }

      if (idx !== -1) {
        dispatch({ type: ACTIONS.CLEAR_SELECTION, payload: { type: 'numbers' } });
        setTimeout(() => {
          dispatch({ type: ACTIONS.PICK_NUMBER, payload: idx });
        }, 0);
        return;
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