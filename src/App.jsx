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

    <div className='btns'>
      <button type="button" class="btn btn-outline-dark">Log In</button>
      <button type="button" class="btn btn-outline-dark">Log In</button>
      <button type="button" class="btn btn-outline-dark">Log In</button>
     </div>
     
    </>
  )
}

export default App
