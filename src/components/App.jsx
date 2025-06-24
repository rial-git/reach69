import { useState, useEffect } from 'react';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { auth, provider } from '../config/firebase';
import { signInWithPopup, signOut } from "firebase/auth";
import '../css/App.css';
import '../css-mob/appMob.css';

 // Import the new tutorial component
import HTP from './howToPlay';
import Account from './account.jsx';
import { preloadImages } from '../utils/preLoadImages';
import ByRialGlitch from "../design/byrial.jsx";


//lazyyyyyyyyyy
const Game = lazy(() => import('./game.jsx'));
const TutorialMode = lazy(() => import('./tutorialMode.jsx'));

function App() {
  const [user, setUser] = useState(null);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    preloadImages();
    
    // Check if tutorial is already completed
    const isTutorialDone = localStorage.getItem('tutorialCompleted') === 'true';
    setTutorialCompleted(isTutorialDone);
    
    // Listen for auth state changes
    const unsub = auth.onAuthStateChanged(setUser);
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      alert("Login failed");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handlePlay = () => {
    // Navigate to tutorial if not completed, otherwise to game
    navigate(tutorialCompleted ? '/Game' : '/Tutorial');
  };

  return (
    <>
      <img src="/r69logo.svg" alt="Logo" className="logo" />
      <h1>Reach69.xyz</h1>
      <h2>Reach 69 by creating equations with the given digits</h2>

      <div className='btnRow'>
        <div>
          {user ? (
            <>
              <button type="button" id='logOutBtn' className="btn btn-outline-dark" onClick={handleLogout}>
                Log Out 
              </button>
              
            </>
          
          ) : (
            <button type="button" id='logInBtn' className="btn btn-outline-dark" onClick={handleLogin}>
              Log In
            </button>
          )}
          <div className="coming-soon">{user ? "" : " "}</div>
        </div>
        <div>
          <button 
            type="button" 
            id='playBtn' 
            className="btn btn-dark" 
            onClick={handlePlay}
          >
            Play
          </button>
          <div className="coming-soon"> </div>
        </div>
        <div>
          <button type="button" id='modesBtn' className="btn btn-outline-dark" >Modes</button>
          <div className="coming-soon">Coming soon!</div>
        </div>
      </div>
      <ByRialGlitch />
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/Tutorial" element={<TutorialMode />} />
          <Route path="/Game" element={<Game />} />
          <Route path="/howToPlay" element={<HTP />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default AppWrapper;