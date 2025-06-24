import { ACTIONS, keyMap } from '../utils/constants';

export function setupKeyboardShortcuts(dispatch, ACTIONS, blocksRef, isSuccess, handleNext) {
  const threshold = 1000; // ms timeframe for buffering multi-key sequences
  let pendingSequence = "";
  let pendingTimer = null;
  let lastKeyPressed = null;
  let lastKeyCycleIndices = {};
  let lastKeyPressTime = 0;

  function clearPending() {
    if (pendingTimer) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
    }
    pendingSequence = "";
  }

  function shouldBufferInsteadOfSelectImmediately(key, blocks) {
    const isExactSingleDigit = blocks.some(blk => String(blk.value) === key);
    const isPrefixOfLongerValue = blocks.some(
      blk => blk.root && String(blk.value).startsWith(key) && String(blk.value).length > 1
    );
    return isExactSingleDigit && isPrefixOfLongerValue;
  }

  function processSingleDigit(key) {
    const blocks = blocksRef.current;
    const now = Date.now();

    const exactIndices = blocks
      .map((blk, idx) => (String(blk.value) === key ? idx : -1))
      .filter(idx => idx !== -1);

    if (exactIndices.length > 0) {
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

    const hasMergedPrefix = blocks.some(
      blk =>
        blk.root &&
        String(blk.value).startsWith(key) &&
        String(blk.value).length > 1
    );
    if (hasMergedPrefix) {
      return false;
    }

    const matchingIndices = blocks
      .map((blk, idx) => (String(blk.value).startsWith(key) ? idx : -1))
      .filter(idx => idx !== -1);

    if (matchingIndices.length > 0) {
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

    const lastSelectedIndex = blocksRef.lastSelectedIndex ?? -1;
    const lastBlock = blocks[lastSelectedIndex];
    if (lastBlock && lastBlock.root && String(lastBlock.value).startsWith(key)) {
      return true;
    }
    dispatch({ type: ACTIONS.SET_ERROR, payload: 'Please select a number available' });
    return true;
  }

  function handleKeyDown(event) {
    if (event.ctrlKey || event.altKey) return;

    const key = event.key;
    const blocks = blocksRef.current;
    const now = Date.now();

    if (!/^[0-9]$/.test(key) && pendingSequence) {
      const firstDigit = pendingSequence.charAt(0);
      clearPending();
      processSingleDigit(firstDigit);
    }

    if (
      keyMap[key] ||
      key === 'Escape' ||
      key === 'Backspace' ||
      /^[0-9]$/.test(key)
    ) {
      event.preventDefault();
    }

    if (key === 'Escape') {
      dispatch({ type: ACTIONS.RESET });
      clearPending();
      lastKeyPressed = null;
      lastKeyPressTime = 0;
      return;
    }

    if (key === 'Enter' && isSuccess && typeof handleNext === 'function') {
      handleNext();
      clearPending();
      lastKeyPressed = null;
      lastKeyPressTime = 0;
      return;
    }

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

    if (keyMap[key]) {
      dispatch({ type: ACTIONS.PICK_OPERATION, payload: keyMap[key] });
      clearPending();
      lastKeyPressed = null;
      lastKeyPressTime = 0;
      return;
    }

    if (/^[0-9]$/.test(key)) {
      if (pendingSequence && now - lastKeyPressTime <= threshold) {
        const newSequence = pendingSequence + key;

        const exactMultiIndices = blocks
          .map((blk, idx) => (String(blk.value) === newSequence ? idx : -1))
          .filter(idx => idx !== -1);

        if (exactMultiIndices.length > 0) {
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

        const hasLongerPrefix = blocks.some(
          blk =>
            blk.root &&
            String(blk.value).startsWith(newSequence) &&
            String(blk.value).length > newSequence.length
        );
        if (hasLongerPrefix) {
          pendingSequence = newSequence;
          lastKeyPressTime = now;
          if (pendingTimer) clearTimeout(pendingTimer);
          pendingTimer = setTimeout(() => {
            const firstDigit = pendingSequence.charAt(0);
            clearPending();
            processSingleDigit(firstDigit);
          }, threshold);
          return;
        }

        const matchingIndices = blocks
          .map((blk, idx) => (String(blk.value).startsWith(newSequence) ? idx : -1))
          .filter(idx => idx !== -1);

        if (matchingIndices.length > 0) {
          dispatch({ type: ACTIONS.CLEAR_SELECTION, payload: { type: 'numbers' } });
          setTimeout(() => {
            dispatch({
              type: ACTIONS.PICK_NUMBER,
              payload: matchingIndices[0],
            });
          }, 0);
          clearPending();
          lastKeyPressed = newSequence;
          lastKeyPressTime = now;
          return;
        }

        const prevSeq = pendingSequence;
        clearPending();
        processSingleDigit(prevSeq.charAt(0));
        const handled = processSingleDigit(key);
        if (handled) {
          return;
        }

        pendingSequence = key;
        lastKeyPressTime = now;
        if (pendingTimer) clearTimeout(pendingTimer);
        pendingTimer = setTimeout(() => {
          const firstDigit = pendingSequence.charAt(0);
          clearPending();
          processSingleDigit(firstDigit);
        }, threshold);
        return;
      }

      if (shouldBufferInsteadOfSelectImmediately(key, blocks)) {
        pendingSequence = key;
        lastKeyPressTime = now;
        if (pendingTimer) clearTimeout(pendingTimer);
        pendingTimer = setTimeout(() => {
          const firstDigit = pendingSequence.charAt(0);
          clearPending();
          processSingleDigit(firstDigit);
        }, threshold);
        return;
      }

      const handledSingle = processSingleDigit(key);
      if (handledSingle) {
        clearPending();
        return;
      }

      pendingSequence = key;
      lastKeyPressTime = now;
      if (pendingTimer) clearTimeout(pendingTimer);
      pendingTimer = setTimeout(() => {
        const firstDigit = pendingSequence.charAt(0);
        clearPending();
        processSingleDigit(firstDigit);
      }, threshold);
      return;
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    clearPending();
  };
}
