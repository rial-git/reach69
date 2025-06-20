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
  [7, 1, 2, 0, 2],
  [6, 5, 7, 5, 0],
  [2, 6, 3, 6, 0]
];


export const initialNumsMedium =
[
  [7, 9, 1, 7, 4],  // 5
  [2, 1, 2, 1, 6],  // 5
  [9, 9, 3, 8, 8],  // 6
  [3, 8, 9, 9, 0],  // 6
  [5, 1, 8, 9, 1],  // 5
  [2, 7, 5, 2, 5],  // 6
  [5, 8, 1, 5, 7],  // 5
  [3, 9, 9, 2, 5],  // 5
  [2, 7, 6, 5, 1],  // 5
  [9, 8, 7, 8, 9],  // 5
  [1, 6, 3, 3, 1],  // 5
  [4, 5, 7, 6, 6],  // 5
  [5, 5, 9, 7, 8],  // 5
  [4, 1, 0, 3, 0],  // 5
  [6, 4, 8, 5, 8],  // 5
  [8, 7, 6, 4, 5]   // 5
];

export const initialNumsHard =
[
  [8, 2, 3, 0, 9],  // 7
  [4, 3, 1, 4, 7],  // 8
  [2, 7, 5, 0, 9],  // 8
  [9, 9, 4, 3, 5],   // 8
  [9, 0, 1, 4, 9]
];

export const initialNumsImpossible = 
[
[9, 0, 1, 4, 9]


]



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