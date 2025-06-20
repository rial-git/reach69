import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import '../css/App.css';
import '../css-mob/appMob.css';
import Game from './game';
import HTP from './howToPlay';
import { preloadImages } from '../utils/preLoadImages';
import ByRialGlitch from "./byrial";

function App() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate(); // Hook for programmatic navigation

  useEffect(() => {
    preloadImages();
  }, []);

  return (
    <>
      <img src="/r69logo.svg" alt="Logo" className="logo" />
      <h1>Reach69.xyz</h1>
      <h2>Reach 69 by creating equations with the given digits</h2>

      <div className='btnRow'>
        <div> 
        <button type="button" id='logInBtn' className="btn btn-outline-dark">Log In</button>
        <div className="coming-soon">Coming soon!</div> 
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

      </Routes>
    </Router>
  );
}

export default AppWrapper;
