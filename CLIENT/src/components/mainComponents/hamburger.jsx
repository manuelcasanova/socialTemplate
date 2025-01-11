const Hamburger = ({ isNavOpen, toggleNav }) => {
  return (
    <div className="hamburger-container">
      <button className={`hamburger ${isNavOpen ? 'hamburger-open' : ''}`} onClick={toggleNav}>
        ☰
      </button>
      </div>
  );
};

export default Hamburger;
