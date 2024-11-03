import './css/App.css';
import React, { useState } from 'react';

function App() {


  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="app">
      <button className="hamburger" onClick={toggleNav}>
      {isNavOpen ? '✖' : '☰'}
      </button>
      <header className={`navbar ${isNavOpen ? 'open' : ''}`}>
        <nav className={isNavOpen ? 'nav-open' : ''}>
NAVIGATION BAR
        </nav>
      </header>
      <main className={`body ${isNavOpen ? 'squeezed' : ''}`}>
BODY
      </main>
      <footer className={`footer ${isNavOpen ? 'squeezed' : ''}`}>
FOOTER
      </footer>
    </div>
  );
}




export default App;
