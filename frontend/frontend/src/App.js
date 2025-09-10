import logo from './logo.svg';
import { useState } from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the App</h1>
        <form>
          <input type="text" placeholder="Enter something..." />
          <button type="submit">Submit</button> 
        </form>
      </header>
    </div>
  );
}

export default App;
