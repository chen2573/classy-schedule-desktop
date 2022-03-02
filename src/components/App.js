import React from 'react'

import './App.css';

function App() {
  return (
    <div>
      <p>This is the main component of the app, App.js. It is rendered by index.js.</p>
      <p>Index.js is called by main.js.</p>
      <p>main.js is electron. Index.js and all components are ran in react.</p>
    </div>
  )
}

export default App;