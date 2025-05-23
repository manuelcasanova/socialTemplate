import React from 'react';
import { useState, useEffect } from 'react';
import axios from '../../api/axios';

import { useNavigate } from 'react-router-dom';

//Context

import { useGlobalAdminSettings } from '../../context/AdminSettingsProvider';
import { useGlobalSuperAdminSettings } from '../../context/SuperAdminSettingsProvider';

//Hooks
import useAuth from '../../hooks/useAuth';

//Styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faLock, faNewspaper, faEnvelope, faEllipsisH, faSignOutAlt, faSignInAlt, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";

//Components
import BottomSheet from './BottomSheet';
import LoadingSpinner from '../loadingSpinner/LoadingSpinner';

//Util functions
import useLogout from '../../hooks/useLogout';

const NavBarBottom = ({ isNavOpen, toggleNav }) => {

  const BACKEND = process.env.REACT_APP_BACKEND_URL;
  const { auth } = useAuth();
  // console.log('auth', auth)
  const isSuperAdmin = auth?.roles?.includes('SuperAdmin');
  const isAdminNotSuperAdmin = auth?.roles?.includes('Admin') && !auth.roles.includes('SuperAdmin');
  const isAdminAndSuperAdmin = auth?.roles?.includes('Admin') && auth.roles.includes('SuperAdmin');
  const isModerator = auth?.roles?.includes('Moderator');

  const { adminSettings, isLoading } = useGlobalAdminSettings();
  const { superAdminSettings } = useGlobalSuperAdminSettings();

  const navigate = useNavigate();
  const [activeSheet, setActiveSheet] = useState(null);
  const [customRoles, setCustomRoles] = useState();
  const [subSection, setSubSection] = useState(null);
  const logout = useLogout();

  // Navigate to a specific path
  const handleNavigate = (path) => {
    navigate(path);

    if (isNavOpen && window.innerWidth <= 580) {
      toggleNav();
    }

    setActiveSheet(null)
  };

  const fetchCustomRoles = async () => {
    try {
      const response = await axios.get('/custom-roles-public');
      setCustomRoles(response.data);
    } catch (err) {
      console.error('Failed to fetch custom roles', err);
    }
  };

  useEffect(() => {
    fetchCustomRoles();
  }, []);

  const getSubItemsForSection = (section) => {
    switch (section) {
      case 'moderator':
        return [
          { label: 'Moderator', path: '/moderator' },
          { label: 'Moderate posts', path: '/moderator/posts' },
          { label: 'Moderate comments', path: '/moderator/comments' },
          { label: 'Hidden posts', path: '/moderator/hidden/posts' },
          { label: 'Hidden comments', path: '/moderator/hidden/comments' },
          { label: 'Post moderation history', path: '/moderator/posts/history' },
          { label: 'Comment moderation history', path: '/moderator/comments/history' },
        ];
      case 'users':
        const userItems = [];

        // Conditionally add following, followers, and pending requests based on adminSettings.allowFollow
        if (adminSettings.showSocialFeature) {
          userItems.push(
            { label: 'All users', path: '/social/allusers' }
          );
        }


        if (adminSettings.allowFollow) {
          userItems.push(
            { label: 'Following', path: '/social/following' },
            { label: 'Followers', path: '/social/followers' },
            { label: 'Pending requests', path: '/social/pending' }
          );
        }

        if (adminSettings.showSocialFeature) {
          userItems.push(
            { label: 'Muted', path: '/social/muted' }
          );
        }

        return userItems;
      case 'admin':
        const adminItems = [];

        if (isSuperAdmin) {
          adminItems.push({ label: 'Super Admin Settings', path: '/admin/superadmin/setup' });
        }

        if (isAdminNotSuperAdmin || isAdminAndSuperAdmin) {
          adminItems.push(
            { label: 'Admin Settings', path: '/admin/admin/setup' },
            { label: 'Admin Users', path: '/admin/users' },
            { label: 'Admin Roles', path: '/admin/roles' },
            { label: 'Role change log', path: '/admin/superadmin/rolechangelog' },
            { label: 'Login History', path: '/admin/superadmin/loginhistory' }
          );
        }

        return adminItems;

      default:
        return [];
    }
  };

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!auth) return null;


  return (
    <>
      <footer className='navbar-bottom'>
        <div className='navbar-bottom-container'>
          <div onClick={() => {
            handleNavigate('/')
            setActiveSheet(null)
          }}>
            <FontAwesomeIcon icon={faHome} /></div>

          <div onClick={() => {
            setActiveSheet(null)
            handleNavigate('/user')
          }}>   <FontAwesomeIcon icon={faUser} /></div>

          <div
            onClick={async () => {
              await fetchCustomRoles();
              setActiveSheet(null)
              setActiveSheet('roles');
            }}
          >  <FontAwesomeIcon icon={faLock} /></div>

          {adminSettings.showPostsFeature && <div onClick={() => {
            setActiveSheet(null)
            handleNavigate('/posts')
          }}>   <FontAwesomeIcon icon={faNewspaper} /></div>}

          {adminSettings.showMessagesFeature && <div onClick={() => {
            setActiveSheet(null)
            handleNavigate('/messages')
          }}>   <FontAwesomeIcon icon={faEnvelope} /></div>}

          {adminSettings.showSocialFeature && <div onClick={() => {
            setActiveSheet(null)
            setActiveSheet('users');
          }}> <FontAwesomeIcon icon={faUsers} /></div>}


          <div
            className='navbar-bottom-small-img-container'
            onClick={
              () => {
                setActiveSheet(null)
                handleNavigate('/profile/myaccount')
              }}>

            <img
              className="navbar-bottom-small-img"
              src={`${BACKEND}/media/profile_pictures/${auth?.userId}/profilePicture.jpg`}
              alt="Profile"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${BACKEND}/media/profile_pictures/profilePicture.jpg`;
              }}
              onClick={() => {
                setActiveSheet(null)
                handleNavigate('/profile/myaccount')
              }} />

          </div>

          <div
            onClick={() => {
              setActiveSheet(null)
              setActiveSheet('ellipsis');
            }}> <FontAwesomeIcon icon={faEllipsisH} /></div>
        </div>
      </footer >

      {/* Bottom sheet for roles */}
      <BottomSheet isOpen={activeSheet === 'roles'} onClose={() => setActiveSheet(null)}>
        <h4>Select a Role</h4>
        <ul>
          {customRoles?.map((role, index) => (
            <li
              key={role.role_id}
              style={{ padding: '10px 0', borderBottom: '1px solid #eee', cursor: 'pointer' }}
              onClick={() => handleNavigate(`/protected-routes/${role.role_name.toLowerCase()}`)}
            >
              {role.role_name}
            </li>
          ))}
        </ul>
      </BottomSheet>

      {/* Bottom sheet for social options */}
      <BottomSheet isOpen={activeSheet === 'users'} onClose={() => setActiveSheet(null)}>
        <h4>Users</h4>
        <ul>
          {getSubItemsForSection('users').map((item, idx) => (
            <li
              key={idx}
              style={{ padding: '10px 0', borderBottom: '1px solid #eee', cursor: 'pointer' }}
              onClick={() => {
                handleNavigate(item.path);
                setActiveSheet(null);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </BottomSheet>


      {/* Bottom sheet for Everything else */}
      <BottomSheet isOpen={activeSheet === 'ellipsis'} onClose={() => setActiveSheet(null)}>
        {!subSection && (
          <ul>
            {(() => {
              const ellipsisItems = [];

              if (superAdminSettings?.showSubscriberFeature) {
                ellipsisItems.push({ label: 'Subscriber', icon: null });
              }

              if (isModerator && adminSettings?.showPostsFeature) {
                ellipsisItems.push({ label: 'Moderator', icon: null });
              }

              if (isAdminNotSuperAdmin || isAdminAndSuperAdmin || isSuperAdmin) {
                ellipsisItems.push({ label: 'Admin', icon: null });
              }

              if (auth && Object.keys(auth).length > 0) {
                ellipsisItems.push({ label: 'Logout', icon: faSignOutAlt });
              } else {
                ellipsisItems.push({ label: 'Sign In', icon: faSignInAlt });
              }


              return ellipsisItems.map((item, index) => (
          
                <li
                  key={index}
                  style={{
                    padding: '10px 0',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onClick={() => {
                    const label = item.label;

                    if (['Moderator', 'Users', 'Admin'].includes(label)) {
                      setSubSection(label.toLowerCase());
                    } else if (label === 'Logout') {
                      logout();
                      setActiveSheet(null);
                      handleNavigate('/');
                    } else if (label === 'Sign In') {
                      setActiveSheet(null);
                      handleNavigate('/signin');
                    } else {
                      handleNavigate(`/${label.toLowerCase()}`);
                      setActiveSheet(null);
                    }
                  }}
                >
                  {item.icon && <FontAwesomeIcon icon={item.icon} />}
                  <span>{item.label}</span>
                </li>
              ));
            })()}
          </ul>
        )}

        {subSection && (
          <div>
            <button onClick={() => setSubSection(null)} className='back-button button-white button-smaller'>
              ← Back
            </button>
            <h4 style={{ textTransform: 'capitalize' }}>{subSection}</h4>
            <ul>
              {getSubItemsForSection(subSection).map((item, idx) => (
                <li
                  key={idx}
                  style={{ padding: '10px 0', borderBottom: '1px solid #eee', cursor: 'pointer' }}
                  onClick={() => {
                    handleNavigate(item.path);
                    setActiveSheet(null);
                    setSubSection(null);
                  }}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </BottomSheet>




    </>
  );
};

export default NavBarBottom;
