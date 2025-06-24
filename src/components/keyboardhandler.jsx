// src/utils/keyboardHandler.js
import { ACTIONS, keyMap } from '../utils/constants';

export function setupKeyboardShortcuts(dispatch, ACTIONS, blocksRef, isSuccess, handleNext) {
  const threshold = 1000; // ms timeframe for multi-key buffering
  let pendingSequence = "";    // accumulate digit sequence
  let pendingTimer = null;
  let lastKeyPressed = null;
  let lastKeyCycleIndices = {}; // Track cycle index per digit
  let lastKeyPressTime = 0;

  function clearPending() {
    if (pendingTimer) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
    }
    pendingSequence = "";
  }

  /**
   * Handles single-digit selection/cycling:
   * 1. Exact-equal: blocks whose value exactly equals `key`. If multiple, cycles unconditionally.
   * 2. If none exact-equal, and no merged-prefix (waiting for multi-digit), then:
   *    a. StartsWith: blocks whose value startsWith key, cycle within threshold.
   *    b. If none, show error or silent skip.
   *
   * Returns true if a selection or error was handled here, false if caller should buffer (merged-prefix).
   */
  function processSingleDigit(key) {
    const blocks = blocksRef.current;
    const now = Date.now();

    // 1. Exact-equal matches
    const exactIndices = blocks
      .map((blk, idx) => (String(blk.value) === key ? idx : -1))
      .filter(idx => idx !== -1);

    if (exactIndices.length > 0) {
      // If multiple exact-equal blocks, cycle among them unconditionally
      if (exactIndices.length > 1) {
        if (lastKeyPressed === key) {
          // advance cycle index even if beyond threshold
          lastKeyCycleIndices[key] = ((lastKeyCycleIndices[key] || 0) + 1) % exactIndices.length;
        } else {
          lastKeyCycleIndices[key] = 0;
        }
      } else {
        // Only one exact-equal block
        lastKeyCycleIndices[key] = 0;
      }
      // Update lastKeyPressed/time so next press cycles
      lastKeyPressed = key;
      lastKeyPressTime = now;

      dispatch({ type: ACTIONS.CLEAR_SELECTION, payload: { type: 'numbers' } });
      setTimeout(() => {
        dispatch({
          type: ACTIONS.PICK_NUMBER,
          payload: exactIndices[lastKeyCycleIndices[key]],
        });
      }, 0);
      return true;
    }

    // 2. No exact-equal: check merged-prefix: if any merged-block startsWith this digit, buffer instead of selecting now
    const hasMergedPrefix = blocks.some(
      blk =>
        blk.root &&
        String(blk.value).startsWith(key) &&
        String(blk.value).length > 1
    );
    if (hasMergedPrefix) {
      // Indicate caller to buffer
      return false;
    }

    // 3. StartsWith fallback: blocks whose value startsWith this digit
    const matchingIndices = blocks
      .map((blk, idx) => (String(blk.value).startsWith(key) ? idx : -1))
      .filter(idx => idx !== -1);

    if (matchingIndices.length > 0) {
      // Cycle among them within threshold
      if (lastKeyPressed === key && now - lastKeyPressTime <= threshold) {
        lastKeyCycleIndices[key] = ((lastKeyCycleIndices[key] || 0) + 1) % matchingIndices.length;
      } else {
        lastKeyCycleIndices[key] = 0;
      }
      lastKeyPressed = key;
      lastKeyPressTime = now;

      dispatch({ type: ACTIONS.CLEAR_SELECTION, payload: { type: 'numbers' } });
      setTimeout(() => {
        dispatch({
          type: ACTIONS.PICK_NUMBER,
          payload: matchingIndices[lastKeyCycleIndices[key]],
        });
      }, 0);
      return true;
    }

    // 4. No match: error or silent skip
    const lastSelectedIndex = blocksRef.lastSelectedIndex ?? -1;
    const lastBlock = blocks[lastSelectedIndex];
    if (lastBlock && lastBlock.root && String(lastBlock.value).startsWith(key)) {
      // Silent skip
      return true;
    }
    dispatch({ type: ACTIONS.SET_ERROR, payload: 'Please select a number available' });
    return true;
  }

  function handleKeyDown(event) {
    if (event.ctrlKey || event.altKey) {
      return;
    }
    const key = event.key;
    const blocks = blocksRef.current;
    const now = Date.now();

    // If a non-digit arrives while a digit sequence is pending: clear pendingSequence and process its first digit
    if (!/^[0-9]$/.test(key) && pendingSequence) {
      const firstDigit = pendingSequence.charAt(0);
      clearPending();
      processSingleDigit(firstDigit);
    }

    // Prevent default for handled keys
    if (
      (keyMap[key] ||
        key === 'Escape' ||
        key === 'Backspace' ||
        /^[0-9]$/.test(key)) &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.shiftKey
    ) {
      event.preventDefault();
    }

    // Escape: reset
    if (key === 'Escape') {
      dispatch({ type: ACTIONS.RESET });
      clearPending();
      lastKeyPressed = null;
      lastKeyPressTime = 0;
      return;
    }
    // Enter: next if success
    if (key === 'Enter' && isSuccess && typeof handleNext === 'function') {
      event.preventDefault();
      handleNext();
      clearPending();
      lastKeyPressed = null;
      lastKeyPressTime = 0;
      return;
    }
    // Backspace: undo
    if (key === 'Backspace') {
      const maxMergedTime = Math.max(...blocks.map(blk => blk.meta?.mergedTime || 0));
      const lastMergedIdx = [...blocks].findIndex(b => b.meta?.mergedTime === maxMergedTime);
      if (lastMergedIdx >= 0) {
        dispatch({ type: ACTIONS.UNDO, payload: lastMergedIdx });
      } else {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'No merged block to undo.' });
      }
      clearPending();
      lastKeyPressed = null;
      lastKeyPressTime = 0;
      return;
    }
    // Operation shortcuts
    if (keyMap[key]) {
      dispatch({ type: ACTIONS.PICK_OPERATION, payload: keyMap[key] });
      clearPending();
      lastKeyPressed = null;
      lastKeyPressTime = 0;
      return;
    }

    // Digit logic
    if (/^[0-9]$/.test(key)) {
      // 1. If we have a pendingSequence and still within threshold, attempt to build multi-digit
      if (pendingSequence && now - lastKeyPressTime <= threshold) {
        const newSequence = pendingSequence + key;
        // 1a. Check exact match for multi-digit
        const exactMultiIdx = blocks.findIndex(
          blk => String(blk.value) === newSequence
        );
        if (exactMultiIdx !== -1) {
          // Found exact multi-digit block: select it
          clearPending();
          dispatch({ type: ACTIONS.CLEAR_SELECTION, payload: { type: 'numbers' } });
          setTimeout(() => {
            dispatch({ type: ACTIONS.PICK_NUMBER, payload: exactMultiIdx });
          }, 0);
          lastKeyPressed = null;
          lastKeyPressTime = 0;
          return;
        }
        // 1b. Check prefix for longer blocks: any merged-block startsWith newSequence?
        const hasLongerPrefix = blocks.some(
          blk =>
            blk.root &&
            String(blk.value).startsWith(newSequence) &&
            String(blk.value).length > newSequence.length
        );
        if (hasLongerPrefix) {
          // Buffer more digits
          pendingSequence = newSequence;
          lastKeyPressTime = now;
          if (pendingTimer) clearTimeout(pendingTimer);
          pendingTimer = setTimeout(() => {
            // Timeout: no full match arrived. Process only first digit:
            const firstDigit = pendingSequence.charAt(0);
            pendingSequence = "";
            pendingTimer = null;
            processSingleDigit(firstDigit);
          }, threshold);
          return;
        }
        // 1c. No multi-digit match or prefix: fallback: first process the pendingSequence's first digit, then current key fresh
        const prevSeq = pendingSequence;
        clearPending();
        processSingleDigit(prevSeq.charAt(0));
        // Now process current key as fresh:
        // First, attempt single-digit exact/cycling or buffer if needed
        // Check exact-equal or merged-prefix etc.
        // Attempt processSingleDigit(key):
        const handled = processSingleDigit(key);
        if (handled) {
          return;
        }
        // If not handled (i.e., buffer needed because merged-prefix exists)
        // Buffer current key:
        pendingSequence = key;
        lastKeyPressTime = now;
        if (pendingTimer) clearTimeout(pendingTimer);
        pendingTimer = setTimeout(() => {
          const firstDigit = pendingSequence.charAt(0);
          pendingSequence = "";
          pendingTimer = null;
          processSingleDigit(firstDigit);
        }, threshold);
        return;
      }

      // 2. No pendingSequence or expired: this is first digit press
      // First try single-digit exact/cycling or detect buffer
      const handledSingle = processSingleDigit(key);
      if (handledSingle) {
        // either selected/cycled or error/silent skip
        clearPending();
        return;
      }
      // processSingleDigit returned false => merged-prefix exists, so buffer
      pendingSequence = key;
      lastKeyPressTime = now;
      if (pendingTimer) clearTimeout(pendingTimer);
      pendingTimer = setTimeout(() => {
        // Timeout: no further digit. Process single-digit now.
        const firstDigit = pendingSequence.charAt(0);
        pendingSequence = "";
        pendingTimer = null;
        processSingleDigit(firstDigit);
      }, threshold);
      return;
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  // Cleanup
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    clearPending();
  };
}
