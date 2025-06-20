import { db, auth } from '../config/firebase';
import { doc, setDoc, getDoc } from "../config/firebase";

/**
 * Mark a level as completed for the current user.
 * @param {string|number} levelId - Unique identifier for the level.
 */
export async function markLevelComplete(levelId) {
  if (!auth.currentUser) return;
  const userRef = doc(db, "users", auth.currentUser.uid);
  const userDoc = await getDoc(userRef);
  let completed = [];
  if (userDoc.exists()) {
    completed = userDoc.data().completedLevels || [];
  }
  if (!completed.includes(levelId)) {
    completed.push(levelId);
    await setDoc(userRef, { completedLevels: completed }, { merge: true });
  }
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
 * Get the array of completed level IDs for the current user.
 * @returns {Promise<Array>} - Array of completed level IDs.
 */
export async function getCompletedLevels() {
  if (!auth.currentUser) return [];
  const userRef = doc(db, "users", auth.currentUser.uid);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data().completedLevels || [] : [];
}