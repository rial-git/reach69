import { db, auth } from '../config/firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * Mark a level as completed for the current user, in the correct difficulty array,
 * and update the currentLevel field.
 * @param {string} levelId - Unique identifier for the level (e.g., "easy-0").
 */
export async function markLevelComplete(levelId) {
  if (!auth.currentUser) return;
  const userRef = doc(db, "users", auth.currentUser.uid);
  const userDoc = await getDoc(userRef);

  // Determine difficulty
  let diffKey = null;
  let currentLevel = null;
  if (levelId.startsWith('easy-')) {
    diffKey = 'completedLevelsEasy';
    currentLevel = 'easy';
  } else if (levelId.startsWith('med-')) {
    diffKey = 'completedLevelsMed';
    currentLevel = 'med';
  } else if (levelId.startsWith('hard-')) {
    diffKey = 'completedLevelsHard';
    currentLevel = 'hard';
  } else if (levelId.startsWith('impossible-')) {
    diffKey = 'completedLevelsImpossible';
    currentLevel = 'impossible';
  }
  if (!diffKey) return;

  let completed = [];
  if (userDoc.exists()) {
    completed = userDoc.data()[diffKey] || [];
  }
  if (!completed.includes(levelId)) {
    completed.push(levelId);
    await setDoc(userRef, { [diffKey]: completed, currentLevel }, { merge: true });
  } else {
    // Even if already completed, update currentLevel for tracking
    await setDoc(userRef, { currentLevel }, { merge: true });
  }
}

/**
 * Get the array of completed level IDs for the current user, grouped by difficulty.
 * @returns {Promise<Object>} - { easy: [...], med: [...], hard: [...], impossible: [...] }
 */
export async function getCompletedLevelsByDifficulty() {
  if (!auth.currentUser) return {
    easy: [],
    med: [],
    hard: [],
    impossible: []
  };
  const userRef = doc(db, "users", auth.currentUser.uid);
  const userDoc = await getDoc(userRef);
  return userDoc.exists()
    ? {
        easy: userDoc.data().completedLevelsEasy || [],
        med: userDoc.data().completedLevelsMed || [],
        hard: userDoc.data().completedLevelsHard || [],
        impossible: userDoc.data().completedLevelsImpossible || []
      }
    : {
        easy: [],
        med: [],
        hard: [],
        impossible: []
      };
}

/**
 * Get the array of completed level IDs for the current user.
 * @returns {Promise<Array>} - Array of completed level IDs.
 */
export async function getCompletedLevels() {
  if (!auth.currentUser) return [];
  const userRef = doc(db, "users", auth.currentUser.uid);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data().completedLevels || [] : [];
}

/**
 * Get all available (not yet completed) levels for the current user.
 * @param {Array} levels - Array of all levels.
 * @returns {Promise<Array>} - Array of available levels.
 */
export async function getAvailableLevels(levels) {
  if (!auth.currentUser) return levels;
  const userRef = doc(db, "users", auth.currentUser.uid);
  const userDoc = await getDoc(userRef);
  const completed = userDoc.exists() ? userDoc.data().completedLevels || [] : [];
  // If your levels have unique IDs, use level.id; otherwise, use index
  return levels.filter((level, idx) => !completed.includes(level.id ?? idx));
}

/**
 * Fetch the currentLevel field for the current user.
 * @returns {Promise<string|null>} - The current level ("easy", "med", "hard", "impossible") or null if not set.
 */
export async function getCurrentLevel() {
  if (!auth.currentUser) return null;
  const userRef = doc(db, "users", auth.currentUser.uid);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    return userDoc.data().currentLevel || null;
  }
  return null;
}