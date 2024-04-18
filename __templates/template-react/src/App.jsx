import { useState } from 'react'
import reactLogo from './assets/'
import './App.css'

function App() {


  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>React</h1>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      <p className="read-the-docs">
      </p>
    </>
  )
}

export default App
