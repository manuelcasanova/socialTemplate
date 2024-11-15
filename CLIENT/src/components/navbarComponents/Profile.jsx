import ProfileImage from "./ProfileImage"
import useLogout from "../../hooks/useLogout";
import { useNavigate } from 'react-router-dom'
import useAuth from "../../hooks/useAuth";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; 

export default function Profile ({toggleSection, showSections, handleNavigate}) {

  const {auth} = useAuth();

  const logout = useLogout();
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate('/');
  }
  
  return (
    
    <div className='nav-item-with-dropdown'>
    <div className='nav-item-logo' onClick={() => toggleSection('profile')}>
      <ProfileImage/>
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