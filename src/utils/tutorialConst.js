export const isMobile = () =>
  /Mobi|Android|iPhone|iPad|iPod|Tablet/i.test(navigator.userAgent) ||
  (navigator.userAgent.includes("Macintosh") && 'ontouchend' in document);


export const tutorialNums = [6, 9];
export const tutorialSteps = [
  "Welcome to Reach69.xyz! The Goal is to reach 69 by calculating with given numbers. First Click on the number 6",
  "Great! Now click on the number 9",
  "Perfect! Now click the 'merge' operation to combine them",
  "Congratulations! You have made your first 69. Press Continue to the next level"
];

export const level1Nums = [6, 9, 0];
export const level1Steps = [
  "Level 2: Now let's try with three numbers. Click on the number 6",
  "can you guess what number to click here? 🌚 also in game you can right click to undo btw",
  "Perfect! you got it. now Click the 'merge' operation to combine 6 and 9 into 69",
  "Now click on the 69 you just created",
  "Then click on the number 0, remember you can undo by right clicking in game",
  "Now choose either the '+' or '-' operation to add or subtract 0",
  "Well done! 69 + 0 or 69 - 0 both give 69. Press Continue to next level"
];

export const level2Nums = [7, 2, 3];
export const level2Steps = [
  "Level 3: Now let's try subtraction. Click on the number 7",
  "Great! Now click on the number 2",
  "Perfect! Click the 'merge' operation to combine 7 and 2 into 72",
  "Now click on the 72 you just created",
  "Then click on the number 3",
  "Now click the '-' operation to subtract 3 from 72",
  "Excellent! 72 - 3 = 69. Press Continue to next level, dont forget you can right click to undo",
];

export const level3Nums = [7, 1, 2, 0, 2];
export const level3Steps = [
  "Level 4: Final challenge! Click on the number 7",
  "Great! Now click on the number 1",
  "Perfect! Click the 'merge' operation to combine 7 and 1 into 71",
  "Now click on the 71 you just created",
  "Then click on the number 2",
  "Now subtract 2 from 71",
  "Excellent! 71 - 2 = 69. But we have more numbers to use",
  "Great, you did that by your own. Now click on the number 2",
  "Now click the '*' operation to multiply 0 and 2",
  "Good! 0 * 2 = 0. Now we need to combine this with our 69",
  "You are getting it, Then click on the 0, you can right click in game to undo btw, not here tho",
  "Now choose either add or subtract 0 to 69",
  "Congratulations! You can also play the entire game with just keybaord, let us know your thoughts, would apprectiate it! 💞",
];