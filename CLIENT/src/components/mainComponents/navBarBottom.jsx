import React from 'react';
import { useState, useEffect } from 'react';
import axios from '../../api/axios';

import { useNavigate } from 'react-router-dom';

//Styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faLock, faNewspaper, faEnvelope, faUser, faEllipsisH } from "@fortawesome/free-solid-svg-icons";

//Components
import BottomSheet from './BottomSheet';

//Util functions
// HERE

const NavBarBottom = ({ isNavOpen, toggleNav }) => {

  const navigate = useNavigate();
  const [activeSheet, setActiveSheet] = useState(null);
  const [customRoles, setCustomRoles] = useState();

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

  return (
    <>
      <footer className='navbar-bottom'>
        <div className='navbar-bottom-container'>
          <div onClick={() => handleNavigate('/')}>   <FontAwesomeIcon icon={faHome} /></div>
          <div
            onClick={async () => {
              await fetchCustomRoles(); 
              setActiveSheet('roles');
            }}
          >  <FontAwesomeIcon icon={faLock} /></div>
          <div onClick={() => handleNavigate('/posts')}>   <FontAwesomeIcon icon={faNewspaper} /></div>
          <div onClick={() => handleNavigate('/messages')}>   <FontAwesomeIcon icon={faEnvelope} /></div>
          <div onClick={() => handleNavigate('/profile/myaccount')}>   <FontAwesomeIcon icon={faUser} /></div>
          <div onClick={toggleNav}>   <FontAwesomeIcon icon={faEllipsisH} /></div>
        </div>
      </footer>

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
    </>
  );
};

export default NavBarBottom;
