import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

//Context
import { useGlobalSuperAdminSettings } from '../../context/SuperAdminSettingsProvider';
import { useGlobalAdminSettings } from '../../context/AdminSettingsProvider';

//Components
import Profile from '../navbarComponents/Profile';
import Logo from '../navbarComponents/Logo';
import FollowNotification from '../navbarComponents/FollowNotification';
import LoadingSpinner from '../loadingSpinner/LoadingSpinner';
import Error from '../bodyComponents/Error';

//Hooks
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useLogout from '../../hooks/useLogout';
import useAuth from '../../hooks/useAuth';

//Styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faEnvelope, faCog } from '@fortawesome/free-solid-svg-icons';


const Navbar = ({ isNavOpen, toggleNav, profilePictureKey, setProfilePictureKey, isFollowNotification, setIsFollowNotification, hasNewMessages, customRoles, hasPostReports, hasCommentsReports, setHasPostReports, setHasCommentsReports }) => {

  const { t } = useTranslation();

  const { superAdminSettings } = useGlobalSuperAdminSettings();
  const { adminSettings } = useGlobalAdminSettings();

  const { auth } = useAuth();
  const isSuperAdmin = auth?.roles?.includes('SuperAdmin');
  const isAdminNotSuperAdmin = auth?.roles?.includes('Admin') && !auth.roles.includes('SuperAdmin');
  const isAdminAndSuperAdmin = auth?.roles?.includes('Admin') && auth.roles.includes('SuperAdmin');

  const loggedInUser = auth?.userId
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const logout = useLogout();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const signOut = async () => {
    setIsFollowNotification(false)
    await logout();
    navigate('/');
  }

  const [showSections, setShowSections] = useState({
    admin: false,
    profile: false,
    social: false,
    moderator: false,
    protectedRoutes: false
  });

  const navbarRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isLargeScreen &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        setShowSections({
          admin: false,
          profile: false,
          social: false,
          moderator: false,
          protectedRoutes: false,
          posts: false,
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLargeScreen]);


  // Fetch follow notifications when the component mounts
  useEffect(() => {
    if (!auth) {
      console.error("auth is not available");
      return;
    }
    const fetchFollowNotifications = async () => {
      setIsLoading(true);
      setError(null);
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
        setError('Failed to fetch follow notifications.');
      } finally {
        setIsLoading(false);
      }
    };

    if (loggedInUser) {
      superAdminSettings.showSocialFeature && adminSettings.showSocialFeature && superAdminSettings.allowFollow && adminSettings.allowFollow &&
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


  const handleNavigateProtected = (roleName) => {
    navigate(`/protected-routes/${roleName.toLowerCase()}`);

    // Only toggle the navbar (close it) if the screen width is <= 580px
    if (isNavOpen && window.innerWidth <= 580) {
      toggleNav(); // Close the navbar when a link is clicked in mobile view
    }

    // Close dropdowns whenever navigating
    if (window.innerWidth > 1024) {
      setShowSections({ admin: false, profile: false, protectedRoutes: false });
    }

  };

  // Navigate to a specific path
  const handleNavigate = (path) => {
    navigate(path);

    // Only toggle the navbar (close it) if the screen width is <= 580px
    if (isNavOpen && window.innerWidth <= 580) {
      toggleNav(); // Close the navbar when a link is clicked in mobile view
    }

    // Close dropdowns whenever navigating
    if (window.innerWidth > 1024) {
      setShowSections({ admin: false, profile: false, protectedRoutes: false });
    }
  };

  // Toggle individual dropdown sections and close others
  const toggleSection = (section) => {
    setShowSections((prevState) => ({

      // Close all other sections, only toggle the clicked one
      admin: section === 'admin' ? !prevState.admin : false,
      profile: section === 'profile' ? !prevState.profile : false,
      social: section === 'social' ? !prevState.social : false,
      posts: section === 'posts' ? !prevState.posts : false,
      moderator: section === 'moderator' ? !prevState.moderator : false,
      protectedRoutes: section === 'protected_routes' ? !prevState.protectedRoutes : false,
    }));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error isNavOpen={isNavOpen} error={error} />
  }

  if (!auth) return null;


  return (
    <div ref={navbarRef} className={`navbar ${isNavOpen ? 'navbar-open' : ''}`} data-testid="navbar">

      {isLargeScreen && (
        <Logo handleNavigate={handleNavigate} />
      )}

      {(
        !isLargeScreen && <Profile toggleSection={toggleSection} showSections={showSections} handleNavigate={handleNavigate} profilePictureKey={profilePictureKey} setProfilePictureKey={setProfilePictureKey} />
      )}

      {<div className='nav-item' onClick={() => handleNavigate('/')}>{t('navbar.home')}</div>}


      {/* {customRoles && customRoles.length > 0 && */}
      <div className={`nav-item-with-dropdown ${showSections.protectedRoutes ? 'nav-item-with-dropdown-open' : ''}`}>
        <div className='nav-item' onClick={() => toggleSection('protected_routes')}>{t('navbar.protected')}
          {showSections.protectedRoutes ? '▲' : '▼'
          }
        </div>
        {showSections.protectedRoutes && (


          <>

            <ul
              onClick={() => handleNavigate('/user')}

              className='subitem'
            >{t('navbar.accessibleToAll')}</ul>


            {customRoles && customRoles.length > 0 && customRoles.map(role => (
              <div
                key={role.role_id}
                className="subitem"
                onClick={() => handleNavigateProtected(role.role_name)}
              >
                {role.role_name}
              </div>
            ))}


          </>
        )}
      </div>
      {/* } */}

      {
        superAdminSettings.showPostsFeature && adminSettings.showPostsFeature &&
        <div className='nav-item' onClick={() => handleNavigate('/posts')}>{t('navbar.posts')}</div>
      }

      {auth.roles && auth.roles.includes('Moderator') &&
        superAdminSettings.showPostsFeature && adminSettings.showPostsFeature &&
        <div className={`nav-item-with-dropdown ${showSections.moderator ? 'nav-item-with-dropdown-open' : ''}`}>
          <div className='nav-item' onClick={() => toggleSection('moderator')}>{t('navbar.moderator')}
            {(hasCommentsReports || hasPostReports) &&
              <div className='in-line-red-dot'></div>
            }
            {showSections.moderator ? '▲' : '▼'
            }
          </div>
          {showSections.moderator && (
            <>
              <div className='subitem' onClick={() => handleNavigate('/moderator/')}>{t('navbar.moderator')}</div>

              <div className="subitem" onClick={() => {
                handleNavigate('/moderator/posts')
                setHasPostReports(false)
              }

              }>
                {t('navbar.moderatePosts')}
                {(hasPostReports) &&
                  <div className='in-line-red-dot'></div>
                }
              </div>


              <div className="subitem" onClick={() => {
                handleNavigate('/moderator/comments')
                setHasCommentsReports(false)
              }
              }>

                {t('navbar.moderateComments')}
                {(hasCommentsReports) &&
                  <div className='in-line-red-dot'></div>
                }

              </div>

              <div className="subitem" onClick={() => handleNavigate('/moderator/hidden/posts')}>
                {t('navbar.hiddenPosts')}
              </div>

              <div className="subitem" onClick={() => handleNavigate('/moderator/hidden/comments')}>
                {t('navbar.hiddenComments')}
              </div>

              <div className="subitem" onClick={() => handleNavigate('/moderator/posts/history')}>
                {t('navbar.moderationHistoryPosts')}
              </div>

              <div className="subitem" onClick={() => handleNavigate('/moderator/comments/history')}>
                {t('navbar.moderationHistoryComments')}
              </div>

            </>
          )}
        </div>
      }

      {superAdminSettings.showSubscriberFeature &&
        <div className='nav-item' onClick={() => handleNavigate('/subscriber')}>{t('navbar.subscriber')}</div>
      }

      {
        ((superAdminSettings.showSocialFeature && adminSettings.showSocialFeature) || isSuperAdmin) &&
        <>
          {
            auth.roles && <div className={`nav-item-with-dropdown ${showSections.social ? 'nav-item-with-dropdown-open' : ''}`}>
              {/* <div className='nav-item' onClick={() => toggleSection('social')}>Users */}

              <div className='nav-item' onClick={() => toggleSection('social')}>

                {isFollowNotification ? <div className='with-notification-text'>Users</div> :
                  <div>{t('navbar.users')}</div>}

                {isFollowNotification ?
                  <FollowNotification />
                  :
                  showSections.social ? '▲' : '▼'

                }
              </div>
              {showSections.social && (
                <>
                  <div className='subitem' onClick={() => handleNavigate('/social/allusers')}>{t('navbar.allUsers')}</div>

                  {superAdminSettings.allowFollow && adminSettings.allowFollow &&
                    <>
                      <div className="subitem" onClick={() => handleNavigate('/social/following')}>
                        {t('navbar.following')}
                      </div>


                      <div className="subitem" onClick={() => handleNavigate('/social/followers')}>
                        {t('navbar.followers')}
                      </div>

                      <div className="subitem" onClick={() => {
                        setIsFollowNotification(false);
                        handleNavigate('/social/pending')
                      }}
                      >
                        {isFollowNotification ? <div className='with-notification-text'>{t('navbar.pendingRequests')}</div> :
                          <div>{t('navbar.pendingRequests')}</div>}
                        {isFollowNotification && <FollowNotification />}
                      </div>

                    </>}

                  <div className="subitem" onClick={() => handleNavigate('/social/muted')}>
                    {t('navbar.muted')}
                  </div>


                </>
              )}
            </div>
          }
        </>
      }

      {auth.roles && (auth.roles.includes('SuperAdmin') || auth.roles.includes('Admin')) &&
        <div className={`nav-item-with-dropdown ${showSections.admin ? 'nav-item-with-dropdown-open' : ''}`}>
          <div className='nav-item' onClick={() => toggleSection('admin')}>{t('navbar.admin')}
            {showSections.admin ? '▲' : '▼'
            }
          </div>
          {showSections.admin && (
            <>
              <div className='subitem' onClick={() => handleNavigate('/admin/admin')}>{t('navbar.admin')}</div>

              {isSuperAdmin && (
                <div className="subitem" onClick={() => handleNavigate('/admin/superadmin/setup')}>
                  <FontAwesomeIcon icon={faCog} style={{ marginRight: '10px' }} />{t('navbar.superAdminSettings')}
                </div>
              )}

              {isAdminNotSuperAdmin && (
                <div className="subitem" onClick={() => handleNavigate('/admin/admin/setup')}>
                  <FontAwesomeIcon icon={faCog} style={{ marginRight: '10px' }} /> {t('navbar.settings')}
                </div>
              )}

              {isAdminAndSuperAdmin && (
                <div className="subitem" onClick={() => handleNavigate('/admin/admin/setup')}>
                  <FontAwesomeIcon icon={faCog} style={{ marginRight: '10px' }} /> {t('navbar.adminSettings')}
                </div>
              )}

              <div className='subitem' onClick={() => handleNavigate('/admin/users')}>{t('navbar.adminUsers')}</div>


              <div className='subitem' onClick={() => handleNavigate('/admin/roles')}>{t('navbar.adminRoles')}</div>

              <div className="subitem" onClick={() => handleNavigate('/admin/superadmin/roleadminhistory')}>
                {t('navbar.adminRolesHistory')}
              </div>


              <div className="subitem" onClick={() => handleNavigate('/admin/superadmin/rolechangelog')}>
                {t('navbar.roleChangeLog')}
              </div>

              <div className="subitem" onClick={() => handleNavigate('/admin/superadmin/loginhistory')}>
                {t('navbar.loginHistory')}
              </div>

            </>
          )}

        </div>
      }
      {
        superAdminSettings.showMessagesFeature && adminSettings.showMessagesFeature &&
        <>
          {auth.roles && !hasNewMessages &&
            < div className="nav-item" onClick={() => handleNavigate('/messages')}>
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
          }

          {auth.roles && hasNewMessages &&
            <div className='nav-item'
              onClick={() => {
                handleNavigate(`/messages/`);
              }}
            >
              <div className="new-message-bell-container"
                onClick={() => {
                  handleNavigate(`/messages/`);
                }}
              >

                <FontAwesomeIcon
                  className="faBell-new-message"
                  icon={faEnvelope} />
                <span className="new-message-notification-dot"></span>
              </div>
            </div>
          }
        </>
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
