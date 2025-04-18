import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

//Components
import Profile from '../navbarComponents/Profile';
import Logo from '../navbarComponents/Logo';
import FollowNotification from '../navbarComponents/FollowNotification';

import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useLogout from '../../hooks/useLogout';
import useAuth from '../../hooks/useAuth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ isNavOpen, toggleNav, profilePictureKey, setProfilePictureKey, isFollowNotification, setIsFollowNotification, hasNewMessages }) => {

  const { auth } = useAuth();
  const loggedInUser = auth.userId
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const logout = useLogout();
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const signOut = async () => {
    setIsFollowNotification(false)
    await logout();
    navigate('/');
  }

  const [showSections, setShowSections] = useState({
    admin: false,
    profile: false,
    social: false
  });

  // Fetch follow notifications when the component mounts
  useEffect(() => {
    if (!auth) {
      console.error("auth is not available");
      return;
    }
    const fetchFollowNotifications = async () => {
      try {
        const response = await axiosPrivate.get(`/social/users/follownotifications`, { params: { userId: loggedInUser } })
        if (response.data.length > 0) {
          setIsFollowNotification(true);
        } else {
          setIsFollowNotification(false);
        }
      } catch (error) {
        console.error('Error fetching follow notifications:', error);
        setIsFollowNotification(false);
      }
    };

    if (loggedInUser) {
      fetchFollowNotifications();
    }
  }, [loggedInUser, axiosPrivate]);

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
      posts: section === 'posts' ? !prevState.posts : false,
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

   
        <div className='nav-item' onClick={() => handleNavigate('/posts')}>Posts</div>
 

      {auth.roles && auth.roles.includes('Moderator') &&
        <div className='nav-item' onClick={() => handleNavigate('/moderator')}>Moderator</div>
      }
      <div className='nav-item' onClick={() => handleNavigate('/subscriber')}>Subscriber</div>

      {auth.roles && <div className='nav-item-with-dropdown'>
        {/* <div className='nav-item' onClick={() => toggleSection('social')}>Users */}

        <div className='nav-item' onClick={() => toggleSection('social')}>

          {isFollowNotification ? <div className='with-notification-text'>Users</div> :
            <div>Users</div>}

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

            <div className="subitem" onClick={() => {
              setIsFollowNotification(false);
              handleNavigate('/social/pending')
            }}
            >
              {isFollowNotification ? <div className='with-notification-text'>Pending requests</div> :
                <div>Pending requests</div>}
              {isFollowNotification && <FollowNotification />}
            </div>

            <div className="subitem" onClick={() => handleNavigate('/social/muted')}>
              Muted
            </div>

          </>
        )}
      </div>
      }

      {auth.roles && (auth.roles.includes('SuperAdmin') || auth.roles.includes('Admin')) &&
        <div className='nav-item-with-dropdown'>
          <div className='nav-item' onClick={() => toggleSection('admin')}>Admin
            {showSections.admin ? '▲' : '▼'
            }
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

      {auth.roles && !hasNewMessages &&
        < div className="nav-item" onClick={() => handleNavigate('/messages')}>
          <FontAwesomeIcon icon={faEnvelope} />
        </div>
      }

      {auth.roles && hasNewMessages &&
        <div className='nav-item'
          onClick={() => {
            navigate(`/messages/`);
          }}
        >
          <div className="new-message-bell-container"
            onClick={() => {
              navigate(`/messages/`);
            }}
          >

            <FontAwesomeIcon
              className="faBell-new-message"
              icon={faEnvelope} />
            <span className="new-message-notification-dot"></span>
          </div>
        </div>
      }

      {
        !isLargeScreen && Object.keys(auth).length > 0 && (
          <div className="nav-item" onClick={signOut}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </div>
        )
      }


      {
        isLargeScreen && (
          <Profile toggleSection={toggleSection} showSections={showSections} handleNavigate={handleNavigate} profilePictureKey={profilePictureKey} setProfilePictureKey={setProfilePictureKey} />
        )
      }





    </div >
  );
};

export default Navbar;
