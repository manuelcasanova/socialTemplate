import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isNavOpen, toggleNav }) => {


  const handleLinkClick = () => {
    if (isNavOpen) {
      toggleNav();
    }
  }

  return (
    <header className={`navbar ${isNavOpen ? 'open' : ''}`}>
      <nav id="main-nav" className={isNavOpen ? 'nav-open' : ''}
       onMouseLeave={() => isNavOpen && toggleNav()} 
      >
        <Link to="/" onClick={handleLinkClick}>HOME</Link>
        <Link to="/about" onClick={handleLinkClick}>ABOUT</Link>
        <Link to="/moderator" onClick={handleLinkClick}>MODERATOR</Link>
        <Link to="/subscriber" onClick={handleLinkClick}>SUBSCRIBER</Link>
        <Link to="/admin" onClick={handleLinkClick}>ADMIN</Link>
        <Link to="/signin" onClick={handleLinkClick}>SIGN IN</Link>
        <Link to="/signup" onClick={handleLinkClick}>SIGN UP</Link>
        <Link to="/profile" onClick={handleLinkClick}>PROFILE</Link>
      </nav>
    </header>
  );
};

export default Navbar;
