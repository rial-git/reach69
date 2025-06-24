import rightMouseClick from '../assets/rightMouseClick.png';
import leftMouseClick from '../assets/leftMouseClick.png';

export const rules = [
  "can use operations between any single number",
  "can use any operations in between, only one at a time",
  "result can also be used with any number on the list",
  "you can take two or three adjacent digits as a whole number, but not any others",
  "the merged whole number can be operated with any number on the list in any order"
];

export const mouseControls = [
  {
    image: leftMouseClick,
    text: "Use Left Mouse Click to select or deselect a number or operation."
  },
  {
    image: rightMouseClick,
    text: "Use Right Mouse Click to undo a number"
  }
];

// Replace icon JSX with simple text labels
export const keyboardControls = [
  {
    icon: "/",
    text: "Press / for division operation"
  },
  {
    icon: "*",
    text: "Press * for multiplication operation"
  },
  {
    icon: "-",
    text: "Press - for subtraction operation"
  },
  {
    icon: "+",
    text: "Press + for addition operation"
  },
  {
    icon: ".",
    text: "Press . for merge operation"
  },
  {
    icon: "⌫",
    text: "Press Backspace to undo the last merge"
  },
  {
    icon: "⏎",
    text: "Press Enter to go to the next level (after success)"
  },
  {
    icon: "Esc",
    text: "Press Esc to reset the current level"
  }
];
