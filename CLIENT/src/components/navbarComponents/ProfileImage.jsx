import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState, useEffect } from "react";
import AuthContext from '../../context/AuthProvider';
const BACKEND = process.env.REACT_APP_BACKEND_URL;

export default function ProfileImage({ profilePictureKey, setProfilePictureKey }) {
  const { auth } = useContext(AuthContext);
  const userId = auth.userId;


  // Construct the URL for the profile picture
 const profilePictureUrl = `${BACKEND}/media/profile_pictures/${userId}/profilePicture.jpg?v=${profilePictureKey}`;

  return (
    <div className="profile-image-container">
      {userId ? (
        <img
          className="profile-image"
          src={profilePictureUrl}
          alt="Profile"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = '/images/profilePicture.jpg'; // Fallback image
          }}
        />
      ) : (
        <FontAwesomeIcon className="profile-image-default" icon={faUser} />
      )}
    </div>
  );
}
