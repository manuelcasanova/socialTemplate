import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isNavOpen, toggleNav }) => {
  return (
    <header className={`navbar ${isNavOpen ? 'open' : ''}`}>
      <nav className={isNavOpen ? 'nav-open' : ''}>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/about">About</Link>
      </nav>
    </header>
  );
};

export default Navbar;
