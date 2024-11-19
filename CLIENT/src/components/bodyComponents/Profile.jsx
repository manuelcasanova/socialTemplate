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
    return response.ok;
  } catch (error) {
    console.error("Error checking image existence:", error);
    return false;
  }
};

const validateInput = (editMode, value, confirmPwd = "") => {
  let regex, errorMessage;

  if (editMode === "username") {
    regex = /^[a-zA-Z][a-zA-Z0-9_-]{3,23}$/;
    errorMessage = "4 to 24 characters. Must begin with a letter. Letters, numbers, underscores, hyphens allowed.";
  } else if (editMode === "email") {
    regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    errorMessage = "Must be a valid email address. Special characters allowed: . - _";
  } else if (editMode === "password") {
    regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,24}$/;
    errorMessage = "8 to 24 characters. Must include uppercase and lowercase letters, a number, and a special character. Allowed: !@#$%^&*.";
  } else if (editMode === "matchPwd") {
    if (value !== confirmPwd) {
      errorMessage = "Passwords must match.";
    } else {
      return { valid: true };
    }
  }

  if (regex && !regex.test(value)) {
    return { valid: false, message: errorMessage };
  }

  return { valid: true };
};

export default function Profile() {
  const { auth } = useAuth();
  const [isPictureModalVisible, setIsPictureModalVisible] = useState(false);
  const [imageExists, setImageExists] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
  };

  const placeholderText = {
    username: "Enter new username",
    email: "Enter new email",
    password: "Enter new password",
    matchPwd: "Confirm new password",
  }[editMode];

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setError(""); // Reset error message when input changes
  };

  const handleConfirmPwdChange = (e) => {
    setConfirmPwd(e.target.value);
  };

  const handleUpdate = async () => {
    const validation = validateInput(editMode, inputValue, confirmPwd);

    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setIsLoading(true);

    const payload = {
      userId,
      [editMode]: inputValue,
    };

    setTimeout(() => {
      const simulatedResponse = {
        success: true,
        message: 'Update successful',
      };

      if (simulatedResponse.success) {
        console.log('Update successful');
        setInputValue('');
        setConfirmPwd('');
        setEditMode(null);
      } else {
        console.error('Update failed:', simulatedResponse.message);
      }

      setIsLoading(false);
    }, 2000);
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
        {!isLoading && editMode && (
          <>
            <input 
              placeholder={placeholderText} 
              value={inputValue} 
              onChange={handleInputChange} 
            />
            {editMode === "password" || editMode === "matchPwd" ? (
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPwd}
                onChange={handleConfirmPwdChange}
              />
            ) : null}
            <button onClick={handleUpdate}>Update</button>
          </>
        )}
        {error && <div className="instructions">{error}</div>}
        {isLoading && <LoadingSpinner />}
      </div>
    </div>
  );
}
