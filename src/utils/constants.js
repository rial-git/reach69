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

export const initialNumsEasy = [
  { id: "easy-1", nums: [6, 5, 7, 5, 0] },
  { id: "easy-2", nums: [] },
  { id: "easy-3", nums: [2, 6, 3, 6, 0] }
];

export const initialNumsMedium = [

{ id: "med-0", nums: [] },
{ id: "med-1", nums: [7, 9, 1, 7, 4] },
{ id: "med-2", nums: [] },
{ id: "med-3", nums: [9, 9, 3, 8, 8] },
{ id: "med-4", nums: [] },
{ id: "med-5", nums: [3, 8, 9, 9, 0] },
{ id: "med-6", nums: [] },
{ id: "med-7", nums: [5, 1, 8, 9, 1] },
{ id: "med-8", nums: [] },
{ id: "med-9", nums: [2, 7, 5, 2, 5] },
{ id: "med-10", nums: [] },
{ id: "med-11", nums: [5, 8, 1, 5, 7] },
{ id: "med-12", nums: [] },
{ id: "med-13", nums: [3, 9, 9, 2, 5] },
{ id: "med-14", nums: [] },
{ id: "med-15", nums: [2, 7, 6, 5, 1] },
{ id: "med-16", nums: [] },
{ id: "med-17", nums: [9, 8, 7, 8, 9] },
{ id: "med-18", nums: [] },
{ id: "med-19", nums: [1, 6, 3, 3, 1] },
{ id: "med-20", nums: [] },
{ id: "med-21", nums: [4, 5, 7, 6, 6] },
{ id: "med-22", nums: [] },
{ id: "med-23", nums: [5, 5, 9, 7, 8] },
{ id: "med-24", nums: [] },
{ id: "med-25", nums: [4, 1, 0, 3, 0] },
{ id: "med-26", nums: [] },
{ id: "med-27", nums: [6, 4, 8, 5, 8] },
{ id: "med-28", nums: [] },
{ id: "med-29", nums: [8, 7, 6, 4, 5] },
{ id: "med-30", nums: [] },
{ id: "med-31", nums: [2, 1, 2, 1, 6] },
{ id: "med-32", nums: [] }

];

export const initialNumsHard = [

{ id: "hard-1", nums: [8, 2, 3, 0, 9] },
{ id: "hard-2", nums: [] },
{ id: "hard-3", nums: [4, 3, 1, 4, 7] },
{ id: "hard-4", nums: [] },
{ id: "hard-5", nums: [2, 7, 5, 0, 9] },
{ id: "hard-6", nums: [] },
{ id: "hard-7", nums: [9, 9, 4, 3, 5] },
{ id: "hard-8", nums: [] },
{ id: "hard-9", nums: [9, 0, 1, 4, 9] },
{ id: "hard-10", nums: [] },


];

export const initialNumsImpossible = [
  { id: "impossible-0", nums: [9, 0, 1, 4, 9] }
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
