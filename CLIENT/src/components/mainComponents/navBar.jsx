import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

//Styling
import '../../css/NavbarDropdown.css'

const Navbar = ({ isNavOpen, toggleNav }) => {


  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState({
    users: false
  });

  //Toggle navbar
  const handleLinkClick = () => {
    if (isNavOpen) {
      toggleNav();
    }
  }

  //Show navbar dropdown menu
  const handleMouseEnter = (category) => {
    setShowOptions({ ...showOptions, [category]: true });
    // Hide other dropdowns
    Object.keys(showOptions).forEach((key) => {
      if (key !== category) {
        setShowOptions((prev) => ({ ...prev, [key]: false }));
      }
    });
  };

  //Select from dropdown menu
  const handleSelectOption = (route, category) => {
    navigate(route);
    setShowOptions({ ...showOptions, [category]: false });
  };

  //Hide navbar dropdown menu
  const handleMouseLeave = (category) => {
    setShowOptions({ ...showOptions, [category]: false });
  };



  return (
    <header className={`navbar ${isNavOpen ? 'open' : ''}`}>
      <nav id="main-nav" className={isNavOpen ? 'nav-open' : ''}
        onMouseLeave={() => isNavOpen && toggleNav()}
      >
 <div className="nav-item">
  <Link to="/" onClick={handleLinkClick}>HOME</Link>
</div>
<div className="nav-item">
  <Link to="/about" onClick={handleLinkClick}>ABOUT</Link>
</div>
<div className="nav-item">
  <Link to="/moderator" onClick={handleLinkClick}>MODERATOR</Link>
</div>
<div className="nav-item">
  <Link to="/subscriber" onClick={handleLinkClick}>SUBSCRIBER</Link>
</div>

{/* Admin Dropdown */}
<div
  className="nav-item dropdown-wrapper"
  onMouseEnter={() => handleMouseEnter("admin")}
  onMouseLeave={() => handleMouseLeave("admin")}
>
  <div className="dropdown-title">
    <span>ADMIN</span>
    <span>▼</span>
  </div>
  {showOptions.admin && (
    <div className="dropdown-menu">
      <button onClick={() => handleSelectOption("/admin/users", "admin")}>Admin users long name</button>
    </div>
  )}
</div>

<div className="nav-item">
  <Link to="/signin" onClick={handleLinkClick}>SIGN IN</Link>
</div>
<div className="nav-item">
  <Link to="/signup" onClick={handleLinkClick}>SIGN UP</Link>
</div>
<div className="nav-item">
  <Link to="/profile" onClick={handleLinkClick}>PROFILE</Link>
</div>


        
        
        
      </nav>
    </header>
  );
};

export default Navbar;
