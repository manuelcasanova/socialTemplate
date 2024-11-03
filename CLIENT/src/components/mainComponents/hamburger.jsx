import React from 'react';

const Hamburger = ({ isNavOpen, toggleNav }) => {
  return (
    <button className="hamburger" onClick={toggleNav}>
      {isNavOpen ? '✖' : '☰'}
    </button>
  );
};

export default Hamburger;
