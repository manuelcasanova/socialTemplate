import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';


const Navbar = ({ isNavOpen, toggleNav }) => {


  const navigate = useNavigate();
const [showAdmin, setShowAdmin] = useState(false)


  //Toggle navbar
  const handleLinkClick = () => {
    if (isNavOpen) {
      toggleNav();
    }
  }



  return (
<header 
  className={`navbar ${isNavOpen ? 'open' : ''}`} 
  onMouseLeave={handleLinkClick}  
>


<div className='nav-item' onClick={() => handleLinkClick()}>LINK</div>
<div className='nav-item' onClick={() => handleLinkClick()}>LINK</div>
<div className='nav-item' onClick={() => handleLinkClick()}>LINK</div>
<div className='nav-item' onClick={() => handleLinkClick()}>LINK</div>
<div className='nav-item' onClick={() => setShowAdmin(prev => !prev)}>ADMIN</div>
{showAdmin && (<>
  <div className='nav-item'>SUBADMIN</div>
<div className='nav-item'>SUBADMIN</div>
<div className='nav-item'>SUBADMIN</div>
<div className='nav-item'>SUBADMIN</div>
<div className='nav-item'>SUBADMIN</div>
<div className='nav-item'>SUBADMIN</div>
<div className='nav-item'>SUBADMIN</div>
<div className='nav-item'>SUBADMIN</div>
</>
)}
<div className='nav-item' onClick={() => handleLinkClick()}>LINK</div>
<div className='nav-item' onClick={() => handleLinkClick()}>LINK</div>

    </header>
  );
};

export default Navbar;
