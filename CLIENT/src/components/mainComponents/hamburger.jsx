const Hamburger = ({ isNavOpen, toggleNav }) => {
  return (
      <button className={`hamburger ${isNavOpen ? 'hamburger-open' : ''}`} onClick={toggleNav}>
        ☰
      </button>
  );
};

export default Hamburger;
