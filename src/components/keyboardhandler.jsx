// src/utils/keyboardHandler.js
import { ACTIONS, keyMap } from '../utils/constants';

export function setupKeyboardShortcuts(dispatch, ACTIONS, blocksRef, isSuccess, handleNext) {
  const threshold = 1000; // ms timeframe for buffering multi-key sequences
  let pendingSequence = "";    // accumulate digit sequence
  let pendingTimer = null;
  let lastKeyPressed = null;
  let lastKeyCycleIndices = {}; // Track cycle index per key or sequence
  let lastKeyPressTime = 0;

  function clearPending() {
    if (pendingTimer) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
    }
    pendingSequence = "";
  }

  /**
   * Handles selecting/cycling for a single-digit key.
   * Returns true if handled (selected/cycled or error/silent skip), false if should buffer (merged-prefix exists).
   */
  function processSingleDigit(key) {
    const blocks = blocksRef.current;
    const now = Date.now();

    // 1. Exact-equal matches: blocks whose value exactly equals this single digit
    const exactIndices = blocks
      .map((blk, idx) => (String(blk.value) === key ? idx : -1))
      .filter(idx => idx !== -1);

    if (exactIndices.length > 0) {
      // Cycle among exact-equal blocks unconditionally (ignore threshold for cycling duplicates)
      if (exactIndices.length > 1) {
        if (lastKeyPressed === key) {
          lastKeyCycleIndices[key] = ((lastKeyCycleIndices[key] || 0) + 1) % exactIndices.length;
        } else {
          lastKeyCycleIndices[key] = 0;
        }
      } else {
        lastKeyCycleIndices[key] = 0;
      }
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

    // 2. No exact-equal single-digit: check merged-prefix -> if exists, buffer
    const hasMergedPrefix = blocks.some(
      blk =>
        blk.root &&
        String(blk.value).startsWith(key) &&
        String(blk.value).length > 1
    );
    if (hasMergedPrefix) {
      // Indicate to caller: should buffer waiting for multi-digit
      return false;
    }

    // 3. StartsWith fallback: select/cycle blocks where value startsWith this digit
    const matchingIndices = blocks
      .map((blk, idx) => (String(blk.value).startsWith(key) ? idx : -1))
      .filter(idx => idx !== -1);

    if (matchingIndices.length > 0) {
      // Cycle within threshold
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

    // If a non-digit arrives while pendingSequence exists: clear buffer and process its first digit
    if (!/^[0-9]$/.test(key) && pendingSequence) {
      const firstDigit = pendingSequence.charAt(0);
      clearPending();
      processSingleDigit(firstDigit);
    }

    // Prevent default for keys we handle
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
    // Backspace: undo last merged
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
      // 1. If pendingSequence exists and still within threshold, try multi-digit extension
      if (pendingSequence && now - lastKeyPressTime <= threshold) {
        const newSequence = pendingSequence + key;

        // 1a. Exact-match for multi-digit duplicates:
        // Find all blocks whose value exactly equals newSequence
        const exactMultiIndices = blocks
          .map((blk, idx) => (String(blk.value) === newSequence ? idx : -1))
          .filter(idx => idx !== -1);

        if (exactMultiIndices.length > 0) {
          // Cycle among duplicate multi-digit blocks unconditionally
          // Use the sequence string as key for cycling index
          const seqKey = newSequence;
          if (exactMultiIndices.length > 1) {
            if (lastKeyPressed === seqKey) {
              lastKeyCycleIndices[seqKey] = ((lastKeyCycleIndices[seqKey] || 0) + 1) % exactMultiIndices.length;
            } else {
              lastKeyCycleIndices[seqKey] = 0;
            }
          } else {
            lastKeyCycleIndices[seqKey] = 0;
          }
          // Update lastKeyPressed/time to sequence
          lastKeyPressed = newSequence;
          lastKeyPressTime = now;

          clearPending();
          dispatch({ type: ACTIONS.CLEAR_SELECTION, payload: { type: 'numbers' } });
          setTimeout(() => {
            dispatch({
              type: ACTIONS.PICK_NUMBER,
              payload: exactMultiIndices[lastKeyCycleIndices[seqKey]],
            });
          }, 0);
          return;
        }

        // 1b. Check prefix for longer merged-blocks: any blk.root with value.startsWith(newSequence) and longer?
        const hasLongerPrefix = blocks.some(
          blk =>
            blk.root &&
            String(blk.value).startsWith(newSequence) &&
            String(blk.value).length > newSequence.length
        );
        if (hasLongerPrefix) {
          // Buffer newSequence
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

        // 1c. No multi-digit exact match or prefix: fallback
        // First process the first digit of pendingSequence:
        const prevSeq = pendingSequence;
        clearPending();
        processSingleDigit(prevSeq.charAt(0));
        // Then process current key fresh:
        const handled = processSingleDigit(key);
        if (handled) {
          return;
        }
        // If not handled (i.e. buffer needed), start new buffer:
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

      // 2. No pendingSequence or expired: first digit press
      // Try single-digit handling (exact-equal or startsWith or buffer)
      const handledSingle = processSingleDigit(key);
      if (handledSingle) {
        clearPending();
        return;
      }
      // If not handledSingle (i.e., merged-prefix exists), buffer:
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
  }

  window.addEventListener('keydown', handleKeyDown);

  // Cleanup
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    clearPending();
  };
}
