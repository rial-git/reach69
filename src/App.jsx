import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div className='logo'>

     </div>
     <h1>Reach69.IO</h1>
     <h2>Reach 69 by creating equations with the given digits</h2>

    <div className='btnRow'>
      <button type="button" id='logInBtn' class="btn btn-outline-dark">Log In</button>

      {/* idk onclick and this window location href work avulu ig, coz button class */}
      <button type="button" id='playBtn' class="btn btn-dark" onClick={() => window.location.href = "level1.jsx"}>Play</button>
      <button type="button" id='modesBtn' class="btn btn-outline-dark">Modes</button>
     </div>
     
    </>
  )
}

export default App
