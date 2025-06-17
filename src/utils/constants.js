// components/constants.js
export const ACTIONS = {
  PICK_NUMBER: 'PICK_NUMBER',
  PICK_OPERATION: 'PICK_OPERATION',
  UNDO: 'UNDO',
  RESET: 'RESET',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

export const basicOps = ['+', '-', 'merge', '*', '/'];
export const advancedTwoDigitOps = ['%', '^'];
export const advancedSingleDigitOps = ['√', '!'];

export const initialNumsEasy = 
[ 
[6,9],
[6,9,0],
[6,9,0,0]
];

export const initialNumsMedium =
[
  [6, 9, 0],
  [6, 9, 0, 0],
  [6, 9, 0, 0, 0]
];

export const initialNumsHard =
[
  [6, 9, 0, 0],
  [6, 9, 0, 0, 0],
  [6, 9, 0, 0, 0, 0]
];



export const keyMap = {
  '+': '+', 
  '-': '-',
  '*': '*',
  '/': '/',
  '%': '%',
  '^': '^',
  '.': 'merge',
  '!': '!',
  'r': '√',
};

export const opShortcuts = Object.fromEntries(
  Object.entries(keyMap).map(([key, op]) => [op, key])
  
);