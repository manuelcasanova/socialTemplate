const Hamburger = ({ isNavOpen, toggleNav }) => {
  return (
    <button
      className={`hamburger ${isNavOpen ? 'open' : 'closed'}`}
      onClick={toggleNav} // Only toggle nav on click
    >
      ☰
    </button>
  );
};

export default Hamburger;
