import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { auth, provider } from '../config/firebase';
import { signInWithPopup, signOut } from "firebase/auth";
import ByRialGlitch from '../design/byrial.jsx';

// Import CSS normally
import '../css/App.css';
import '../css-mob/appMob.css';


// Lazy load all components except CSS and utils
const HTP = lazy(() => import('./howToPlay'));
const Account = lazy(() => import('./account.jsx'));
const Game = lazy(() => import('./game.jsx'));
const TutorialMode = lazy(() => import('./tutorialMode.jsx'));

function App() {
  const [user, setUser] = React.useState(null);
  const [tutorialCompleted, setTutorialCompleted] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    
    const isTutorialDone = localStorage.getItem('tutorialCompleted') === 'true';
    setTutorialCompleted(isTutorialDone);
    
    const unsub = auth.onAuthStateChanged(setUser);
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch {
      alert("Login failed");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handlePlay = () => {
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
            <button type="button" id='logOutBtn' className="btn btn-outline-dark" onClick={handleLogout}>
              Log Out
            </button>
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

      {/* Suspense needed for lazy-loaded component */}
      <Suspense fallback={null}>
        <ByRialGlitch />
      </Suspense>
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
          <Route path="/Account" element={<Account />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default AppWrapper;
