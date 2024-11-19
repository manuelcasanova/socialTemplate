import { useState, useEffect } from "react";
import useAuth from "../../../src/hooks/useAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import '../../css/Profile.css';
import LoadingSpinner from '../loadingSpinner/LoadingSpinner';

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
  const [imageExists, setImageExists] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [editMode, setEditMode] = useState(null); // Tracks what the user is editing

  const userId = auth.userId || "Guest";
  const userEmail = auth.email || "example@example.com";

  useEffect(() => {
    const checkImage = async () => {
      const exists = await profilePictureExists(userId);
      setImageExists(exists);
    };
    checkImage();
  }, [userId]);

  const profilePictureUrl = `http://localhost:3500/media/profile_pictures/${userId}/profilePicture.jpg`;

  const handlePictureClick = () => {
    setIsPictureModalVisible(true);
  };

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    console.log("Account deleted");
    // Here, you can call your API to handle account deletion
  };

  const placeholderText = {
    username: "Enter new username",
    email: "Enter new email",
    password: "Enter new password",
  }[editMode]; // No default, so input will be hidden if null

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
        <button 
          className="profile-actions-button" 
          onClick={() => setEditMode("username")}
        >
          Edit Username
        </button>
        <button 
          className="profile-actions-button" 
          onClick={() => setEditMode("email")}
        >
          Edit Email
        </button>
        <button 
          className="profile-actions-button" 
          onClick={() => setEditMode("password")}
        >
          Edit Password
        </button>
        {!showConfirmDelete ? (
          <button 
            className="profile-actions-button button-delete-account" 
            onClick={handleDeleteClick}
          >
            Delete Account
          </button>
        ) : (
          <div className="delete-confirmation">
            <button 
              className="button-cancel-delete" 
              onClick={() => setShowConfirmDelete(false)}
            >
              Cancel
            </button>
            <button 
              className="button-confirm-delete" 
              onClick={handleConfirmDelete}
            >
              Confirm Delete
            </button>
          </div>
        )}
      </div>
      <div className="update-input">
        {editMode && ( // Conditionally render the input and button
          <>
            <input placeholder={placeholderText}></input>
            <button>Update</button>
          </>
        )}
        {/* <LoadingSpinner /> */}
      </div>
    </div>
  );
}
