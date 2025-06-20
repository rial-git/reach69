import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { auth, provider } from '../config/firebase';
import { signInWithPopup, signOut } from "firebase/auth";
import '../css/App.css';
import '../css-mob/appMob.css';
import Game from './game';
import HTP from './howToPlay';
import Account from './account.jsx';
import { preloadImages } from '../utils/preLoadImages';
import ByRialGlitch from "../design/byrial.jsx";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    preloadImages();
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

  return (
    <>
      <img src="/r69logo.svg" alt="Logo" className="logo" />
      <h1>Reach69.xyz</h1>
      <h2>Reach 69 by creating equations with the given digits</h2>

      <div className='btnRow'>
        <div>
          {user ? (
            <>
              <button type="button" className="btn btn-outline-dark" onClick={handleLogout}>
                Log Out ({user.displayName || user.email})
              </button>
            </>
          ) : (
            <button type="button" id='logInBtn' className="btn btn-outline-dark" onClick={handleLogin}>
              Log In
            </button>
          )}
          <div className="coming-soon">{user ? "" : "."}</div>
        </div>
        <div>
          <button type="button" id='playBtn' className="btn btn-dark" onClick={() => navigate('/Game')}>Play</button>
          <div className="coming-soon">.</div>
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
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Game" element={<Game />} />
        <Route path="/howToPlay" element={<HTP />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;
