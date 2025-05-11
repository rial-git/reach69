import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Level1 from './level1'; // Import your Level1 component
import Testmode from './testmode'

function App() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate(); // Hook for programmatic navigation

  return (
    <>
      <div className='logo'></div>
      <h1>Reach69.IO</h1>
      <h2>Reach 69 by creating equations with the given digits</h2>

      <div className='btnRow'>
        <button type="button" id='logInBtn' className="btn btn-outline-dark">Log In</button>
        <button type="button" id='playBtn' className="btn btn-dark" onClick={() => navigate('/level1')}>Play</button>
        <button type="button" id='modesBtn' className="btn btn-outline-dark" onClick={() => navigate('/testmode')}>Modes</button>
      </div>
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/level1" element={<Level1 />} />
        <Route path ="/testmode" element={<Testmode />} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;
