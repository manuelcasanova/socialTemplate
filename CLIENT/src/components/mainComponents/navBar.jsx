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


  // Navigate to a specific path
  const handleNavigate = (path) => {
    navigate(path);

    // Only toggle the navbar (close it) if the screen width is <= 580px
    if (isNavOpen && window.innerWidth <= 580) {
      toggleNav(); // Close the navbar when a link is clicked in mobile view
    }

        // Close dropdowns whenever navigating
        setShowSections({ admin: false, profile: false });
    
  };

  // Toggle individual dropdown sections and close others
  const toggleSection = (section) => {
    setShowSections((prevState) => ({
      // Close all other sections, only toggle the clicked one
      admin: section === 'admin' ? !prevState.admin : false,
      profile: section === 'profile' ? !prevState.profile : false,
    }));
  };




  return (
    <header className={`navbar ${isNavOpen ? 'open' : ''}`}
    onMouseLeave={toggleSection}
    >


      <div className='nav-item' onClick={() => handleNavigate('/')}>HOME</div>
      <div className='nav-item' onClick={() => handleNavigate('/about')}>ABOUT</div>
      <div className='nav-item' onClick={() => handleNavigate('/moderator')}>MODERATOR</div>
      <div className='nav-item' onClick={() => handleNavigate('/subscriber')}>SUBSCRIBER</div>

      <div className='nav-item-with-dropdown'>
        <div className='nav-item' onClick={() => toggleSection('admin')}>ADMIN
          {showSections.admin ? '▲' : '▼'}
        </div>
        {showSections.admin && (
          <>
            <div className='subitem' onClick={() => handleNavigate('/admin/users')}>Admin users</div>
          </>
        )}
      </div>

      <div className='nav-item' onClick={() => handleNavigate('/about')}>LINK</div>


      <div className='nav-item-with-dropdown'>
      <div className='nav-item' onClick={() => toggleSection('profile')}>PROFILE
        {showSections.profile ? '▲' : '▼'}
      </div>
      {showSections.profile && (
          <>
          <div className='subitem' onClick={() => handleNavigate('/profile/myaccount')}>My account</div>
          <div className='subitem'>Logout</div>
        </>
      )}
        </div>

    </header>
  );
};

export default Navbar;
