// userProgress.jsx
import { db, auth } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

/**
 * Mark a level as completed (only if not already done).
 * @param {string} levelId
 */
export async function markLevelComplete(levelId) {
  if (!auth.currentUser) return;
  const userRef = doc(db, 'users', auth.currentUser.uid);
  const userDoc = await getDoc(userRef);
  const data = userDoc.exists() ? userDoc.data() : {};
  const completedLevels = Array.isArray(data.completedLevels) ? data.completedLevels : [];

  if (!completedLevels.includes(levelId)) {
    await setDoc(userRef, {
      completedLevels: [...completedLevels, levelId],
    }, { merge: true });
  }
}

function getDifficultyFromId(levelId) {
  if (levelId.startsWith('easy-')) return 'easy';
  if (levelId.startsWith('med-')) return 'med';
  if (levelId.startsWith('hard-')) return 'hard';
  if (levelId.startsWith('impossible-')) return 'impossible';
  return null;
}

export async function getCompletedLevelsFlat() {
  if (!auth.currentUser) return [];
  const userRef = doc(db, 'users', auth.currentUser.uid);
  const userDoc = await getDoc(userRef);
  const data = userDoc.exists() ? userDoc.data() : {};
  return Array.isArray(data.completedLevels) ? data.completedLevels : [];
}

export async function getCompletedLevelsByDifficulty() {
  const flat = await getCompletedLevelsFlat();
  return {
    easy: flat.filter(id => id.startsWith('easy-')),
    med: flat.filter(id => id.startsWith('med-')),
    hard: flat.filter(id => id.startsWith('hard-')),
    impossible: flat.filter(id => id.startsWith('impossible-')),
  };
}

export async function getCurrentLevel() {
  if (!auth.currentUser) return null;
  const userRef = doc(db, 'users', auth.currentUser.uid);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data().currentLevel || null : null;
}

/**
 * Mark tutorial as completed for the current user.
 */
export async function markTutorialComplete(user) {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, { tutorialCompleted: true }, { merge: true });
}


/**
 * Check if tutorial is completed for the current user.
 * @returns {Promise<boolean>}
 */
export async function isTutorialCompleted() {
  if (!auth.currentUser) return false;
  const userRef = doc(db, "users", auth.currentUser.uid);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? !!userDoc.data().tutorialCompleted : false;
}

export async function isTutorialDoneFromDB() {
  if (!auth.currentUser) return false;
  const userRef = doc(db, "users", auth.currentUser.uid);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data()?.tutorialCompleted === true : false;
}