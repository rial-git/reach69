import { useState } from 'react';
import Level1 from './Level1';
import './App.css';

function App() {
  const [page, setPage] = useState('home');

  return (
    <>
      {page === 'home' && (
        <div>
          <h1>Reach69.IO</h1>
          <h2>Reach 69 by creating equations with the given digits</h2>
          <div className="btnRow">
            <button onClick={() => setPage('login')} className="btn btn-outline-dark">Log In</button>
            <button onClick={() => setPage('play')} className="btn btn-dark">Play</button>
            <button onClick={() => setPage('modes')} className="btn btn-outline-dark">Modes</button>
          </div>
        </div>
      )}

      {page === 'play' && <Level1 />}
    </>
  );
}

export default App;
