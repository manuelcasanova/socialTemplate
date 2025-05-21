import { useState, useEffect } from "react";
import ProfileImage from "./ProfileImage"
import useLogout from "../../hooks/useLogout";
import { useNavigate } from 'react-router-dom'
import useAuth from "../../hooks/useAuth";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; 

export default function Profile ({toggleSection, showSections, handleNavigate, profilePictureKey, setProfilePictureKey}) {

  const {auth} = useAuth();

  const logout = useLogout();
  const navigate = useNavigate();
  const [isLargeScreen, setIsLargeScreen] = useState();

  const signOut = async () => {
    await logout();
    navigate('/');
  }

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
  
  return (
    
    <div className='nav-item-with-dropdown'>
    <div className='nav-item-logo'   onClick={() => {
    if (!isLargeScreen) {
      handleNavigate('/profile/myaccount');
    } else {
      toggleSection('profile');
    }
  }}>
      <ProfileImage profilePictureKey={profilePictureKey} setProfilePictureKey={setProfilePictureKey}/>
      {/* {showSections.profile ? '▲' : '▼'} */}
    </div>
    {showSections.profile && (
      <>
        <div className='subitem' onClick={() => handleNavigate('/profile/myaccount')}>My account</div>
        {Object.keys(auth).length === 0 && 
        <>
        <div className='subitem' onClick={() => handleNavigate('/signin')}>Sign in</div>
        </>
}
        {Object.keys(auth).length > 0 && 
      <div className="subitem" onClick={signOut}>
      <FontAwesomeIcon icon={faSignOutAlt} />
    </div>
      }
      </>
    )}
  </div>
  )
}