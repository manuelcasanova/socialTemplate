import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from "../../api/axios";
import imageCompression from 'browser-image-compression';

//Context
import { useGlobalSuperAdminSettings } from "../../context/SuperAdminSettingsProvider";
import { useGlobalAdminSettings } from "../../context/AdminSettingsProvider"

//Hooks
import useAuth from "../../../src/hooks/useAuth";
import useLogout from "../../hooks/useLogout"
import useUserApi from "../../util/userApi";

//Styling
import '../../css/Profile.css';


//Components
import LoadingSpinner from '../loadingSpinner/LoadingSpinner';
import Error from "./Error";


const BACKEND = process.env.REACT_APP_BACKEND_URL;

const MAX_FILE_SIZE_MB = 0.1; // 100KB target
const MAX_DIMENSION = 1024;   // Resize down to this if larger

const profilePictureExists = async (userId) => {

  const imageUrl = `${BACKEND}/media/profile_pictures/${userId}/profilePicture.jpg`;

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
    regex = /^[A-z][A-z0-9-_ ]{3,23}$/
    errorMessage = "4 to 24 characters. Must begin with a letter. Letters, numbers, underscores, hyphens allowed.";
  } else if (editMode === "email") {
    regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    errorMessage = "Must be a valid email address. Special characters allowed: . - _";
  } else if (editMode === "matchEmail") {
    if (value !== confirmPwd) {
      errorMessage = "Emails must match.";
      return { valid: false, message: errorMessage };
    }
    const regexValidation = validateInput("email", value);
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

export default function Profile({ isNavOpen, profilePictureKey, setProfilePictureKey, isLargeScreen }) {
  const { auth } = useAuth();
  const { superAdminSettings } = useGlobalSuperAdminSettings();
  const { adminSettings } = useGlobalAdminSettings();
  const isTestSuperAdmin = auth.userId === 1;
  const [isPictureModalVisible, setIsPictureModalVisible] = useState(false);
  const [imageExists, setImageExists] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [criticalError, setCriticalError] = useState(false);
  const [isInputValid, setIsInputValid] = useState(false);
  const [fileName, setFileName] = useState("");
  const { userData, refetchUserData } = useUserApi(auth.userId || "Guest");
  const isSuperAdmin = auth.roles.includes('SuperAdmin');
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


  const profilePictureUrl = `${BACKEND}/media/profile_pictures/${userId}/profilePicture.jpg`;

  const handlePictureClick = () => {
    if (!isTestSuperAdmin) {
      setError(""); // Hide any error message
      setInputValue("");
      setConfirmPwd("");
      setConfirmEmail("");
      setIsPictureModalVisible(true);
      setFileName("");  // Clear filename if user clicks to update
           // Reset file if the modal is opened
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
  let selectedFile = e.target.files[0];

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type)) {
    setError("Unsupported file format. Please upload a JPG, PNG or WEBP image.");
    return;
  }

  try {
    // Compress the file before upload
    const options = {
      maxSizeMB: MAX_FILE_SIZE_MB,
      maxWidthOrHeight: MAX_DIMENSION,
      useWebWorker: true,
      fileType: 'image/webp', // Optional: smaller than PNG/JPEG
    };

    const compressedFile = await imageCompression(selectedFile, options);
    // console.log(`Original size: ${(selectedFile.size / 1024).toFixed(2)} KB`);
    // console.log(`Compressed size: ${(compressedFile.size / 1024).toFixed(2)} KB`);

    selectedFile = compressedFile;
    setFileName(selectedFile.name || "No file chosen");

    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    const response = await axiosPrivate.post(
      `/users/upload-profile-picture/${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response?.data?.success) {
      setIsPictureModalVisible(false);
      setImageExists(true);
      setProfilePictureKey((prevKey) => prevKey + 1);
    } else {
      console.error("Error uploading profile picture:", response?.data?.message);
    }
  } catch (error) {
    console.error("Critical Error: Upload failed:", error);
    setCriticalError(true);
  }
};


  // Handle the modal close button
  const handleCloseModal = () => {
    setIsPictureModalVisible(false);
    setFileName("");  // Reset filename if modal is closed without uploading
         // Reset file if modal is closed
  };



  const handleConfirmDelete = async () => {
    setIsLoading(true); // Show the loading spinner

    try {
      // Make the DELETE request to the server
      const response = await axiosPrivate.put(`/users/softdelete/${userId}`, {
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
    } catch (error) {
      console.error("Critical Error: Deletion failed:", error);
      setCriticalError(true);

    } finally {
      setIsLoading(false); // Hide the loading spinner
    }
  };


  const placeholderText = {
    username: "Enter new username",
    email: "Enter new email",
  }[editMode];

  const handleInputChange = (e) => {
    let value = e.target.value;

    // Force first letter of username to be capitalized
    if (editMode === "username") {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }


    setInputValue(value);

    if (editMode === "email") {
      const emailValidation = validateInput("email", value);
      const matchEmailValidation = validateInput("matchEmail", value, confirmEmail);

      setIsInputValid(emailValidation.valid && matchEmailValidation.valid);
      setError(emailValidation.valid ? matchEmailValidation.message : emailValidation.message);
    }

    else if (editMode) {
      const validation = validateInput(editMode, value);
      setIsInputValid(validation.valid);
      setError(validation.valid ? "" : validation.message);
    }
  };

  const handleConfirmEmailChange = (e) => {
    const value = e.target.value;
    setConfirmEmail(value);

    const matchEmailValidation = validateInput("matchEmail", inputValue, value);
    setIsInputValid(matchEmailValidation.valid);
    setError(matchEmailValidation.message);
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
      editMode,
      [editMode]: inputValue, // The field being updated (username, email)
    };

    try {
      const response = await axiosPrivate.put('/users/update', payload);
      if (response?.data?.success) {
        setInputValue('');
        setConfirmPwd('');
        setConfirmEmail('');
        setEditMode(null);
        setError(''); // Reset error if the update is successful

        // Refresh the user data after a successful update
        refetchUserData();  // This should trigger a rerender if the userData changes

      } else {
        setError(response?.data?.message || 'Update failed. Please try again.');
      }
    } catch (error) {
      // Check if the error is a validation error from the backend (username or email already exists)
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message || 'Validation error. Please check your input.');
      } else {
        console.error("Critical Error: Update failed:", error);
        setCriticalError(true); // Only set critical error for actual server issues
      }
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

  if (criticalError) return <Error isNavOpen={isNavOpen} error="A server error occurred. Please try again later." />;


  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      {!successMessage &&
        <div className="profile-container">
          <h2>{userData?.username || "Guest"}</h2>
          <div className="profile-details">
            {!isPictureModalVisible &&
              <div className="profile-picture"
                onClick={
                  ((superAdminSettings.allowModifyProfilePicture && adminSettings.allowModifyProfilePicture) || isSuperAdmin) ?
                    handlePictureClick
                    : undefined
                }
                style={{ cursor: ((superAdminSettings.allowModifyProfilePicture && adminSettings.allowModifyProfilePicture) || isSuperAdmin) ? 'pointer' : 'default' }}
              >
                {imageExists ? (
                  <img
                    src={`${profilePictureUrl}?key=${profilePictureKey}`}
                    alt="Profile"
                    style={{ cursor: ((superAdminSettings.allowModifyProfilePicture && adminSettings.allowModifyProfilePicture) || isSuperAdmin) ? 'pointer' : 'default' }}
                  />
                ) : (
                  <img
                    className="user-row-social-small-img"
                    src={`${BACKEND}/media/profile_pictures/profilePicture.jpg`}
                    alt="Profile"
                    style={{ cursor: ((superAdminSettings.allowModifyProfilePicture && adminSettings.allowModifyProfilePicture) || isSuperAdmin) ? 'pointer' : 'default' }}
                  />

                )}
              </div>
            }


            {
              ((superAdminSettings.allowModifyProfilePicture && adminSettings.allowModifyProfilePicture) || isSuperAdmin) &&

              isPictureModalVisible && !isTestSuperAdmin && (
                <div className="picture-modal">
                  <h3>Change your profile picture</h3>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    id="profile-picture-input"
                    onChange={handleFileChange}
                  />

                  {/* Custom label for file input */}
                  {/* <label className="button-white" htmlFor="profile-picture-input">
                    Choose File
                  </label> */}

                  {/* Text for chosen file */}
                  <span className="file-name">{fileName || "No file chosen"}</span>

                  <div
  onDrop={(e) => {
    e.preventDefault();
    handleFileChange({ target: { files: e.dataTransfer.files } });
  }}
  onDragOver={(e) => e.preventDefault()}
  style={{
    border: '2px dashed #ccc',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    marginBottom: '1rem',
    backgroundColor: '#fafafa',
  }}
>
  <p>Drag & drop an image here, or</p>
  <input
    type="file"
    accept="image/jpeg,image/png,image/webp"
    onChange={handleFileChange}
    style={{ display: 'none' }}
    id="file-upload"
  />
  <label htmlFor="file-upload" style={{ cursor: 'pointer', color: '#007bff' }}>
    click to choose one
  </label>
</div>


                  {error && (
                    <div className="profile-input-instructions">
                      {error}
                    </div>
                  )}
                  <button className="button-red" onClick={handleCloseModal}>x</button>
                </div>
              )}


          </div>

          {isTestSuperAdmin && (<div>For test purposes, this account cannot be modified or deleted</div>)}

          {!isTestSuperAdmin && (

            ((superAdminSettings.showProfileFeature && adminSettings.showProfileFeature) || isSuperAdmin) &&
            <div className="profile-actions">
              {
                ((superAdminSettings.allowEditUsername && adminSettings.allowEditUsername) || isSuperAdmin) &&
                <button
                  className="profile-actions-button button-white"
                  onClick={() => handleEditButtonClick("username")}
                // disabled={editMode === "username" && !isInputValid} // Disable if regex fails
                >
                  Edit Username
                </button>
              }
              {
                ((superAdminSettings.allowEditEmail && adminSettings.allowEditEmail) || isSuperAdmin) &&
                <button
                  className="profile-actions-button button-white"
                  onClick={() => handleEditButtonClick("email")}
                >
                  Edit Email
                </button>
              }

              {
                ((superAdminSettings.allowEditPassword && adminSettings.allowEditPassword) || isSuperAdmin) &&
                <button
                  className="profile-actions-button button-white"
                  onClick={() => navigate(`/resetpassword`)}
                >
                  Edit Password
                </button>
              }
              {
                ((superAdminSettings.allowDeleteMyUser && adminSettings.allowDeleteMyUser) || isSuperAdmin) &&
                <button
                  className="profile-actions-button button-red"
                  onClick={handleDeleteClick}
                >
                  Delete Account
                </button>
              }
              {showConfirmDelete &&
                <div className="delete-confirmation">
                  <p>Are you sure you want to delete your account?</p>
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

                  {/* For editing username */}
                  {(editMode === "username") && (
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

                  {editMode === "email" && (
                    <>
                      <input
                        ref={inputRef}
                        type="email"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder={placeholderText}
                      />
                      <input
                        type="email"
                        value={confirmEmail}
                        onChange={handleConfirmEmailChange}
                        placeholder="Confirm new email"
                      />
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
