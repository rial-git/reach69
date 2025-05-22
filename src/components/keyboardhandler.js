// src/utils/keyboardHandler.js
export function setupKeyboardShortcuts(dispatch, ACTIONS) {
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
  };

  function handleKeyDown(event) {
    const key = event.key;
    if (keyMap[key]) {
      dispatch({ type: ACTIONS.PICK_OPERATION, payload: keyMap[key] });
    }}

  window.addEventListener('keydown', handleKeyDown);

  // Return a cleanup function
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}
