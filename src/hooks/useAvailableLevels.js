import { useEffect, useState } from "react";
import { getCompletedLevels } from "../utils/userProgress";
import { shuffle } from "../utils/gameHelpers";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function useAvailableLevels(levelsByDifficulty, difficulties) {
  const [user, setUser] = useState(null);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [availableLevelsByDiff, setAvailableLevelsByDiff] = useState({});
  const [currentLevelIdxByDiff, setCurrentLevelIdxByDiff] = useState({});

  // Listen for auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  // Fetch completed levels when user changes
  useEffect(() => {
    if (user) {
      getCompletedLevels().then((completed) => {
        setCompletedLevels(completed);
      });
    } else {
      setCompletedLevels([]);
    }
  }, [user]);

  // Set up available levels ONLY after completedLevels is loaded and only ONCE per session/user
  useEffect(() => {
    // Only run if completedLevels is loaded (not null or undefined)
    if (
      completedLevels &&
      Object.keys(availableLevelsByDiff).length === 0
    ) {
      const newAvailable = {};
      const newIdx = {};
      for (const diff of difficulties) {
        const allLevels = levelsByDifficulty[diff];
        const filtered = shuffle(allLevels.filter(level => !completedLevels.includes(level.id)));
        newAvailable[diff] = filtered;
        newIdx[diff] = 0;
      }
      setAvailableLevelsByDiff(newAvailable);
      setCurrentLevelIdxByDiff(newIdx);
    }
    // eslint-disable-next-line
  }, [completedLevels, levelsByDifficulty, difficulties]);

  return {
    user,
    completedLevels,
    availableLevelsByDiff,
    currentLevelIdxByDiff,
    setCurrentLevelIdxByDiff,
    setAvailableLevelsByDiff,
    setCompletedLevels,
  };
}