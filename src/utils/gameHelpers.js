/**
 * Fisher–Yates shuffle to randomize an array.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} The shuffled array.
 */
export function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}