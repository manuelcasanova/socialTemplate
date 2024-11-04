import React from 'react';

const Hamburger = ({ isNavOpen, toggleNav }) => {
  return (
    <button className="hamburger" onMouseEnter={toggleNav} >
      {isNavOpen ? '' : '☰'}
    </button>
  );
};

export default Hamburger;
