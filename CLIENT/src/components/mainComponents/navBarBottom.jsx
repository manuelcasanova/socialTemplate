import React from 'react';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

//Styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faLock, faNewspaper, faEnvelope, faUser, faEllipsisH } from "@fortawesome/free-solid-svg-icons";

const NavBarBottom = ({ isNavOpen, toggleNav }) => {

  const navigate = useNavigate();
  const [showSections, setShowSections] = useState({
    admin: false,
    profile: false,
    social: false,
    moderator: false,
    protectedRoutes: false
  });

  // Navigate to a specific path
  const handleNavigate = (path) => {
    navigate(path);

    if (isNavOpen && window.innerWidth <= 580) {
      toggleNav();
    }
    setShowSections({ admin: false, profile: false, protectedRoutes: false });
  };


  return (

    <footer className='navbar-bottom'>
      <div className='navbar-bottom-container'>
        <div onClick={() => handleNavigate('/')}>   <FontAwesomeIcon icon={faHome} /></div>
        <div onClick={() => handleNavigate('/')}>   <FontAwesomeIcon icon={faLock} /></div>
        <div onClick={() => handleNavigate('/posts')}>   <FontAwesomeIcon icon={faNewspaper} /></div>
        <div onClick={() => handleNavigate('/messages')}>   <FontAwesomeIcon icon={faEnvelope} /></div>
        <div onClick={() => handleNavigate('/profile/myaccount')}>   <FontAwesomeIcon icon={faUser} /></div>
        <div onClick={toggleNav}>   <FontAwesomeIcon icon={faEllipsisH} /></div>
      </div>
    </footer>
  );
};

export default NavBarBottom;
