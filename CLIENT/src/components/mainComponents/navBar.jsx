import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

//Components
import Profile from '../navbarComponents/Profile';
import Logo from '../navbarComponents/Logo';
import FollowNotification from '../navbarComponents/FollowNotification';

import useLogout from '../../hooks/useLogout';
import useAuth from '../../hooks/useAuth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


const Navbar = ({ isNavOpen, toggleNav, profilePictureKey, setProfilePictureKey }) => {

  const { auth } = useAuth();

  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate('/');
  }

  const navigate = useNavigate();
  const [showSections, setShowSections] = useState({
    admin: false,
    profile: false,
    social: false
  });


  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const [isFollowNotification, setIsFollowNotification] = useState(true)

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
      social: section === 'social' ? !prevState.social : false,
    }));
  };


  return (


    <div className={`navbar ${isNavOpen ? 'navbar-open' : ''}`} data-testid="navbar">


      {isLargeScreen && (
        <Logo handleNavigate={handleNavigate} />
      )}

      {!isLargeScreen && (
        <Profile toggleSection={toggleSection} showSections={showSections} handleNavigate={handleNavigate} profilePictureKey={profilePictureKey} setProfilePictureKey={setProfilePictureKey} />
      )}

      <div className='nav-item' onClick={() => handleNavigate('/')}>Home</div>
      <div className='nav-item' onClick={() => handleNavigate('/user')}>User</div>
      {auth.roles && auth.roles.includes('Moderator') &&
        <div className='nav-item' onClick={() => handleNavigate('/moderator')}>Moderator</div>
      }
      <div className='nav-item' onClick={() => handleNavigate('/subscriber')}>Subscriber</div>
    
      <div className='nav-item-with-dropdown'>
          <div className='nav-item' onClick={() => toggleSection('social')}>Users
            {isFollowNotification ? 
          <FollowNotification />
        :
            showSections.social ? '▲' : '▼'
}
          </div>
          {showSections.social && (
            <>
              <div className='subitem' onClick={() => handleNavigate('/social/allusers')}>All users</div>

                <div className="subitem" onClick={() => handleNavigate('/social/following')}>
                  Following
                </div>
  

                <div className="subitem" onClick={() => handleNavigate('/social/followers')}>
                  Followers
                </div>

                <div className="subitem" onClick={() => handleNavigate('/social/pending')}>
                  Pending Requests
                  {isFollowNotification && <FollowNotification />}
                </div>

                <div className="subitem" onClick={() => handleNavigate('/social/muted')}>
                  Muted
                </div>

            </>
          )}

        </div>

      {auth.roles && (auth.roles.includes('SuperAdmin') || auth.roles.includes('Admin')) &&
        <div className='nav-item-with-dropdown'>
          <div className='nav-item' onClick={() => toggleSection('admin')}>Admin
            {showSections.admin ? '▲' : '▼'}
          </div>
          {showSections.admin && (
            <>
              <div className='subitem' onClick={() => handleNavigate('/admin/users')}>Admin users</div>
              {auth.roles && auth.roles.includes('SuperAdmin') && (
                <div className="subitem" onClick={() => handleNavigate('/admin/superadmin/rolechangelog')}>
                  Role change log
                </div>
              )}
              {auth.roles && auth.roles.includes('SuperAdmin') && (
                <div className="subitem" onClick={() => handleNavigate('/admin/superadmin/loginhistory')}>
                  Login history
                </div>
              )}
            </>
          )}

        </div>
      }

      {!isLargeScreen && Object.keys(auth).length > 0 && (
        <div className="nav-item" onClick={signOut}>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </div>
      )}


      {isLargeScreen && (
        <Profile toggleSection={toggleSection} showSections={showSections} handleNavigate={handleNavigate} profilePictureKey={profilePictureKey} setProfilePictureKey={setProfilePictureKey} />
      )}




    </div>
  );
};

export default Navbar;
