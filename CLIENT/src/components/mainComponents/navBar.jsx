import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';


const Navbar = ({ isNavOpen, toggleNav }) => {


  const navigate = useNavigate();



const [showSections, setShowSections] = useState({
  admin: false,
  profile: false,
});

  // Reset dropdowns when navbar closes
  useEffect(() => {
    if (!isNavOpen) {
      setShowSections({ admin: false, profile: false }); // Close all dropdowns
    }
  }, [isNavOpen]); // This effect runs every time `isNavOpen` changes

  //Toggle navbar
  const handleLinkClick = () => {
    if (isNavOpen) {
      toggleNav();
    }
  }


 // Toggle individual dropdown sections and close others
 const toggleSection = (section) => {
  setShowSections((prevState) => ({
    // Close all other sections, only toggle the clicked one
    admin: section === 'admin' ? !prevState.admin : false,
    profile: section === 'profile' ? !prevState.profile : false,
  }));
};


  return (
<header 
  className={`navbar ${isNavOpen ? 'open' : ''}`} 
  onMouseLeave={handleLinkClick}  
>

<div className='nav-item' onClick={() => handleLinkClick()}>LINK</div>
<div className='nav-item' onClick={() => handleLinkClick()}>LINK</div>
<div className='nav-item' onClick={() => handleLinkClick()}>LINK</div>
<div className='nav-item' onClick={() => handleLinkClick()}>LINK</div>

<div className='nav-item' onClick={() => toggleSection('admin')}>ADMIN
{showSections.admin ? '▲' : '▼'} 
</div>
      {showSections.admin && (
        <div className='dropdown'>
          <div className='subitem'>SUBADMIN</div>
          <div className='subitem'>SUBADMIN</div>
          <div className='subitem'>SUBADMIN</div>
          <div className='subitem'>SUBADMIN</div>
        </div>
      )}
<div className='nav-item' onClick={() => handleLinkClick()}>LINK</div>
<div className='nav-item' onClick={() => toggleSection('profile')}>PROFILE
{showSections.profile ? '▲' : '▼'} 
</div>
      {showSections.profile && (
        <>
          <div className='subitem'>SUBPROFILE</div>
          <div className='subitem'>SUBPROFILE</div>
          <div className='subitem'>SUBPROFILE</div>
          <div className='subitem'>SUBPROFILE</div>
        </>
      )}

    </header>
  );
};

export default Navbar;
