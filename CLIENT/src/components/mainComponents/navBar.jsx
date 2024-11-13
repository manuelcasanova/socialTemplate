import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

//Components
import Profile from '../navbarComponents/Profile';
import Logo from '../navbarComponents/Logo';

import useLogout from '../../hooks/useLogout';
import useAuth from '../../hooks/useAuth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; 


const Navbar = ({ isNavOpen, toggleNav }) => {
  
  const {auth} = useAuth();

  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate('/');
  }

  const navigate = useNavigate();
  const [showSections, setShowSections] = useState({
    admin: false,
    profile: false,
  });

  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Effect to detect window size
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1025);
    };

    // Check screen size on mount
    handleResize();

    // Add event listener to detect resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
       data-testid="navbar"
    >

      {isLargeScreen && (
        <Logo handleNavigate={handleNavigate}/>
      )}

      {!isLargeScreen && (
        <Profile toggleSection={toggleSection} showSections={showSections} handleNavigate={handleNavigate} />
      )}

      <div className='nav-item' onClick={() => handleNavigate('/')}>Home</div>
      <div className='nav-item' onClick={() => handleNavigate('/about')}>About</div>
      <div className='nav-item' onClick={() => handleNavigate('/moderator')}>Moderator</div>
      <div className='nav-item' onClick={() => handleNavigate('/subscriber')}>Subscriber</div>

      <div className='nav-item-with-dropdown'>
        <div className='nav-item' onClick={() => toggleSection('admin')}>Admin
          {showSections.admin ? '▲' : '▼'}
        </div>
        {showSections.admin && (
          <>
            <div className='subitem' onClick={() => handleNavigate('/admin/users')}>Admin users</div>
          </>
        )}
      </div>

      {!isLargeScreen && auth.isAuthenticated && (
              <div className="nav-item" onClick={signOut}>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </div>
      )}


      {isLargeScreen && (
        <Profile toggleSection={toggleSection} showSections={showSections} handleNavigate={handleNavigate} />
      )}




    </header>
  );
};

export default Navbar;
