import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';


const Navbar = ({ isNavOpen, toggleNav }) => {


  const navigate = useNavigate();


  //Toggle navbar
  const handleLinkClick = () => {
    if (isNavOpen) {
      toggleNav();
    }
  }



  return (
    <header className={`navbar ${isNavOpen ? 'open' : ''}`}>

<div className='nav-item'>LINK</div>
<div className='nav-item'>LINK</div>
<div className='nav-item'>LINK</div>
<div className='nav-item'>LINK</div>
<div className='nav-item'>LINK</div>
<div className='nav-item'>LINK</div>
<div className='nav-item'>LINK</div>

    </header>
  );
};

export default Navbar;
