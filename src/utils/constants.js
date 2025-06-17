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
export const initialNums = 
[ 
[7,1,2,0,2],
[6,9,0],
[6,9,0,0],
[7,9,8,1,3],
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
  'o': '√',
};

export const opShortcuts = Object.fromEntries(
  Object.entries(keyMap).map(([key, op]) => [op, key])
  
);