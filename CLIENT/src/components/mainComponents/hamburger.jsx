import React from 'react';

const Hamburger = ({ isNavOpen, toggleNav }) => {
  return (
    <button
      className={`hamburger ${isNavOpen ? 'open' : 'closed'}`} // Dynamically apply the 'open' or 'closed' class
      onMouseEnter={toggleNav} // Trigger toggleNav on click
    >
      ☰
    </button>
  );
};

export default Hamburger;
