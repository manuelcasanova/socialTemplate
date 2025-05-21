const Hamburger = ({ isNavOpen, toggleNav }) => {
  return (
    <div className={`hamburger-container ${isNavOpen ? 'hamburger-container-open' : ''}`} >
      <button className={`hamburger ${isNavOpen ? 'hamburger-open' : ''}`} onClick={toggleNav}>
        ☰
      </button>
      </div>
  );
};

export default Hamburger;
