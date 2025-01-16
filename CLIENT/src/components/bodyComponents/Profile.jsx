import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import useAuth from "../../../src/hooks/useAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../../css/Profile.css';
import LoadingSpinner from '../loadingSpinner/LoadingSpinner';
import Footer from "../mainComponents/footer";

import useUserApi from "../../util/userApi";
import { axiosPrivate } from "../../api/axios";
import useLogout from "../../hooks/useLogout"


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
    if (!value || !confirmPwd) {
      errorMessage = "Both password fields must be filled.";
      return { valid: false, message: errorMessage };
    }
    if (value !== confirmPwd) {
      errorMessage = "Passwords must match.";
      return { valid: false, message: errorMessage };
    }
    const regexValidation = validateInput("password", value);
    if (!regexValidation.valid) {
      return { valid: false, message: regexValidation.message };
    }
    return { valid: true };
  }


  if (regex && !regex.test(value)) {
    return { valid: false, message: errorMessage };
  }

  return { valid: true };
};

export default function Profile({ isNavOpen, profilePictureKey, setProfilePictureKey }) {
  const { auth } = useAuth();
  const isTestSuperAdmin = auth.userId === 1;
  const [isPictureModalVisible, setIsPictureModalVisible] = useState(false);
  const [imageExists, setImageExists] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isInputValid, setIsInputValid] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const { userData, refetchUserData } = useUserApi(auth.userId || "Guest");
  const [successMessage, setSuccessMessage] = useState('');
  const logout = useLogout();

  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate('/');
  }

  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input when the editMode changes
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editMode]);

  // console.log("userData", userData)

  const userId = auth.userId || "Guest";

  useEffect(() => {
    const checkImage = async () => {
      const exists = await profilePictureExists(userId);
      setImageExists(exists);
    };
    checkImage();
  }, [userId]);


  const profilePictureUrl = `http://localhost:3500/media/profile_pictures/${userId}/profilePicture.jpg`;

  const handlePictureClick = () => {
    if (!isTestSuperAdmin) {
    setError(""); // Hide any error message
    setInputValue("");
    setConfirmPwd("");
    setIsPictureModalVisible(true);
    setFileName("");  // Clear filename if user clicks to update
    setFile(null);     // Reset file if the modal is opened
    }
  };

  const handleDeleteClick = () => {
    setError(""); // Hide any error message
    if (showConfirmDelete) {
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
    }
  };

  // Handle file selection and trigger upload automatically
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name || "No file chosen");

      // Automatically upload the file
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);

      try {
        const response = await axiosPrivate.post(`/users/upload-profile-picture/${userId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response?.data?.success) {
          setIsPictureModalVisible(false);
          setImageExists(true); // Assume the picture upload was successful
          setProfilePictureKey((prevKey) => prevKey + 1);
        } else {
          console.error("Error uploading profile picture:", response?.data?.message);
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  // Handle the modal close button
  const handleCloseModal = () => {
    setIsPictureModalVisible(false);
    setFileName("");  // Reset filename if modal is closed without uploading
    setFile(null);     // Reset file if modal is closed
  };



  const handleConfirmDelete = async () => {
    setIsLoading(true); // Show the loading spinner

    try {
      // Make the DELETE request to the server
      const response = await axiosPrivate.put(`/users/delete/${userId}`, {
      });

      if (response?.data?.success) {
        setSuccessMessage('Account deleted successfully. Redirecting to home page...');

        // Wait for 2 seconds and then navigate to /signin
        setTimeout(() => {
          signOut()
        }, 2000);
      } else {
        setError(response?.data?.message || 'Account deletion failed. Please try again.');
      }
    } catch (err) {
      console.log("err", err)
      console.error('Error deleting account:', err);
      setError('An error occurred while deleting the account. Please try again later.');
    } finally {
      setIsLoading(false); // Hide the loading spinner
    }
  };


  const placeholderText = {
    username: "Enter new username",
    email: "Enter new email",
    password: "Enter new password",
    matchPwd: "Confirm new password",
  }[editMode];

  const handleInputChange = (e) => {
    let value = e.target.value;

    // Force first letter of username to be capitalized
    if (editMode === "username") {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }


    setInputValue(value);

    if (editMode === "password") {
      const regexValidation = validateInput("password", value);
      const matchValidation = validateInput("matchPwd", value, confirmPwd);

      setIsInputValid(regexValidation.valid && matchValidation.valid);
      setError(regexValidation.valid ? matchValidation.message : regexValidation.message);
    } else if (editMode) {
      const validation = validateInput(editMode, value);
      setIsInputValid(validation.valid);
      setError(validation.valid ? "" : validation.message);
    }
  };

  const handleConfirmPwdChange = (e) => {
    const value = e.target.value;
    setConfirmPwd(value);

    if (editMode === "password") {
      const matchValidation = validateInput("matchPwd", inputValue, value);
      setIsInputValid(matchValidation.valid);
      setError(matchValidation.valid ? "" : matchValidation.message);
    }
  };

  const handleUpdate = async () => {
    const validation = validateInput(editMode, inputValue, confirmPwd);

    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setIsLoading(true);

    const payload = {
      userId, // The logged-in user's ID
      [editMode]: inputValue, // The field being updated (username, email, or password)
    };

    try {
      const response = await axiosPrivate.put('/users/update', payload);
      if (response?.data?.success) {
        setInputValue('');
        setConfirmPwd('');
        setEditMode(null);
        setError(''); // Reset error if the update is successful

        // Refresh the user data after a successful update
        refetchUserData();  // This should trigger a rerender if the userData changes

      } else {
        setError(response?.data?.message || 'Update failed. Please try again.');
      }
    } catch (err) {
      console.error('Error updating profile:', err.response.data.error);
      setError(`Error updating profile: ${err.response.data.error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleUpdate(); // Trigger handleUpdate when Enter is pressed
    }
  };





  const handleEditButtonClick = (type) => {
    setError("");
    setInputValue("");
    setConfirmPwd("");
    if (editMode === type) {
      setEditMode(null);
    } else {
      setShowConfirmDelete(false);
      setEditMode(type);
    }
  };

  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };


  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      {!successMessage &&
        <div className="profile-container">
          <h2>{userData?.username || "Guest"}</h2>
          <div className="profile-details">
            {!isPictureModalVisible &&
              <div className="profile-picture" onClick={handlePictureClick}>
                {imageExists ? (
                  <img
                    src={`${profilePictureUrl}?key=${profilePictureKey}`}
                    alt="Profile"
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} size="6x" />
                )}
              </div>
            }
            
            {isPictureModalVisible && !isTestSuperAdmin && (
              <div className="picture-modal">
                <h3>Change your profile picture</h3>

                {/* Hidden file input */}
                <input
                  type="file"
                  id="profile-picture-input"
                  onChange={handleFileChange}
                />

                {/* Custom label for file input */}
                <label className="button-white" htmlFor="profile-picture-input">
                  Choose File
                </label>

                {/* Text for chosen file */}
                <span className="file-name">{fileName || "No file chosen"}</span>

                <button className="button-red" onClick={handleCloseModal}>x</button>


              </div>

            )}

          </div>

          {isTestSuperAdmin && (<div>For test purposes, this account cannot be modified or deleted</div>)}

          {!isTestSuperAdmin && (

          <div className="profile-actions">
            <button
              className="profile-actions-button button-white"
              onClick={() => handleEditButtonClick("username")}
            // disabled={editMode === "username" && !isInputValid} // Disable if regex fails
            >
              Edit Username
            </button>
            <button
              className="profile-actions-button button-white"
              onClick={() => handleEditButtonClick("email")}
            // disabled={editMode === "email" && !isInputValid} // Disable if regex fails
            >
              Edit Email
            </button>
            <button
              className="profile-actions-button button-white"
              onClick={() => handleEditButtonClick("password")}
            >
              Edit Password
            </button>

            <button
              className="profile-actions-button button-red"
              onClick={handleDeleteClick}
            >
              Delete Account
            </button>
            {showConfirmDelete &&
              <div className="delete-confirmation">
                <p>Are you sure you want to delete your account? This action is permanent and cannot be undone.</p>
                <button
                  className="button-white"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  Keep account
                </button>
                <button
                  className="button-red"
                  onClick={handleConfirmDelete}
                >
                  Delete account
                </button>
              </div>
            }
          </div>
          )}
          {!isTestSuperAdmin && (
          <div className="update-input">
            {!isLoading && editMode && !showConfirmDelete && (
              <>
                {(editMode === "email") && <div className="profile-info">
                  <p>{userData?.email || "Guest"}</p>
                </div>}

                {/* For editing username or email */}
                {(editMode === "username" || editMode === "email") && (
                  <div className="edit-input-container">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder={placeholderText} // Dynamic placeholder
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                )}

                {/* For password edit mode */}
                {editMode === "password" && (
                  <>
                    {/* Enter new password field with visibility toggle */}
                    <div className="password-container">
                      <input
                        ref={inputRef}
                        type={isNewPasswordVisible ? "text" : "password"}
                        placeholder={placeholderText}
                        value={inputValue}
                        onChange={handleInputChange}
                      />
                      <FontAwesomeIcon
                        icon={isNewPasswordVisible ? faEyeSlash : faEye}
                        onClick={toggleNewPasswordVisibility}
                        className="toggle-password-icon"
                      />
                    </div>

                    {/* Confirm new password field with visibility toggle */}
                    <div className="password-container">
                      <input
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPwd}
                        onChange={handleConfirmPwdChange}
                      />
                      <FontAwesomeIcon
                        icon={isConfirmPasswordVisible ? faEyeSlash : faEye}
                        onClick={toggleConfirmPasswordVisibility}
                        className="toggle-password-icon"
                      />
                    </div>
                  </>
                )}

                {/* Error message */}
                {error && <div className="profile-input-instructions">{error}</div>}

                {/* Update button */}
                <button
                  onClick={handleUpdate}
                  className="button-white"
                  disabled={!isInputValid || inputValue.trim() === ""}
                >
                  Update
                </button>


              </>
            )}

            {isLoading && <LoadingSpinner />}

          </div>
          )}




        </div>
      }
      {successMessage && <div className="profile-delete-success-message">{successMessage}</div>}


    </div>
  );
}
