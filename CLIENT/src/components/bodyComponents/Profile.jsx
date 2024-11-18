import { useState, useEffect } from "react";
import useAuth from "../../../src/hooks/useAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import '../../css/Profile.css'


const profilePictureExists = async (userId) => {
  const imageUrl = `http://localhost:3500/media/profile_pictures/${userId}/profilePicture.jpg`;

  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok; // If status code is 200, the image exists
  } catch (error) {
    console.error("Error checking image existence:", error);
    return false; // Return false if there's an error (e.g., network error)
  }
};

export default function Profile() {
  const { auth } = useAuth();
  const [isPictureModalVisible, setIsPictureModalVisible] = useState(false);
  const [imageExists, setImageExists] = useState(true); // Default to true, check if image exists on load
  
  const userId = auth.userId || "Guest";
  const userEmail = auth.email || "example@example.com"; // Fake email for demonstration

  useEffect(() => {
    const checkImage = async () => {
      const exists = await profilePictureExists(userId);
      setImageExists(exists); // Update the state based on the result
    };
    
    checkImage();
  }, [userId]);

  // Profile picture URL dynamically based on userId
  const profilePictureUrl = `http://localhost:3500/media/profile_pictures/${userId}/profilePicture.jpg`;

  const handlePictureClick = () => {
    setIsPictureModalVisible(true);
  };

  return (
    <div className="profile-container">
      <h2>{userId}</h2>
      <div className="profile-details">
        <div className="profile-picture" onClick={handlePictureClick}>
          {imageExists ? (
            <img src={profilePictureUrl} alt="Profile" />
          ) : (
            <FontAwesomeIcon icon={faUser} size="6x" />
          )}
          <span>Change Picture</span>
        </div>
        {isPictureModalVisible && (
          <div className="picture-modal">
            <h3>Change your profile picture</h3>
            <input type="file" />
            <button onClick={() => setIsPictureModalVisible(false)}>Close</button>
          </div>
        )}
        <div className="profile-info">
          <p><strong>Email:</strong> {userEmail}</p>
        </div>
      </div>
      <div className="profile-actions">
        <button>Edit Username</button>
        <button>Edit Password</button>
        <button>Delete Account</button>
      </div>
    </div>
  );
}
