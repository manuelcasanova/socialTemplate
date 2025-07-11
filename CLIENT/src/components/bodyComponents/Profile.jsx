import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from "../../api/axios";
import imageCompression from 'browser-image-compression';
import { useTranslation } from 'react-i18next';


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
import ProfileLanguageSelector from "./ProfileLanguageSelector";
import LoadingSpinner from '../loadingSpinner/LoadingSpinner';
import Error from "./Error";


const BACKEND = process.env.REACT_APP_BACKEND_URL;

const MAX_FILE_SIZE_MB = 0.1; // 100KB target
const MAX_DIMENSION = 1024;   // Resize down to this if larger

const validateInput = (t, editMode, value, confirmPwd = "") => {
  let regex, errorMessage;


  if (editMode === "username") {
    regex = /^[A-z][A-z0-9-_ ]{3,23}$/
    errorMessage = t('profile.validation.username');
  } else if (editMode === "email") {
    regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    errorMessage = t('profile.validation.email');
  } else if (editMode === "matchEmail") {
    if (value !== confirmPwd) {
      errorMessage = t('profile.validation.emailsMustMatch');
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
  const isTestSuperAdmin = auth.userId === 2;
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
  const { userData, refetchUserData } = useUserApi(auth.userId || t('profile.guest'));
  const isSuperAdmin = auth.roles.includes('SuperAdmin');
  const [successMessage, setSuccessMessage] = useState('');
  const logout = useLogout();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate('/');
  }

  const inputRef = useRef(null);

  useEffect(() => {
    // Reset inputs whenever editMode changes
    setInputValue("");
    setConfirmPwd("");
    setConfirmEmail("");
    setIsInputValid(false);
    setError("");
  }, [editMode]);

  useEffect(() => {
    // Focus the input when the editMode changes
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editMode]);

  // console.log("userData", userData)

  const userId = auth.userId || t('profile.guest');



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
      setError(t('profile.unsupportedFileFormat'));
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

      selectedFile = compressedFile;
      setFileName(selectedFile.name || t('profile.noFileChosen'));

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
        setProfilePictureKey(Date.now());
      } else {
        console.error(t('profile.errorUploadingProfilePicture'), response?.data?.message);
      }
    } catch (error) {
      console.error(t('profile.criticalErrorUploadFailed'), error);
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
    setIsLoading(true);

    try {
      // Make the DELETE request to the server
      const response = await axiosPrivate.put(`/users/softdelete/${userId}`, {
      });

      if (response?.data?.success) {
        setSuccessMessage(t('profile.accountDeletedSuccess'));

        // Wait for 2 seconds and then navigate to /signin
        setTimeout(() => {
          signOut()
        }, 2000);
      } else {
        setError(response?.data?.message || t('profile.accountDeletionFailed'));
      }
    } catch (error) {
      console.error(t('profile.criticalErrorDeletionFailed'), error);
      setCriticalError(true);

    } finally {
      setIsLoading(false); // Hide the loading spinner
    }
  };

  const placeholderText = {
    username: t('profile.enterNewUsername'),
    email: t('profile.enterNewEmail'),
  }[editMode];

  const handleInputChange = (e) => {
    let value = e.target.value;

    // Force first letter of username to be capitalized
    if (editMode === "username") {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }

    setInputValue(value);

    if (editMode === "email") {
      const emailValidation = validateInput(t, "email", value);
      const matchEmailValidation = validateInput(t, "matchEmail", value, confirmEmail);

      setIsInputValid(emailValidation.valid && matchEmailValidation.valid);
      setError(emailValidation.valid ? matchEmailValidation.message : emailValidation.message);
    }

    else if (editMode) {
      const validation = validateInput(t, editMode, value);
      setIsInputValid(validation.valid);
      setError(validation.valid ? "" : validation.message);
    }
  };

  const handleConfirmEmailChange = (e) => {
    const value = e.target.value;
    setConfirmEmail(value);

    const matchEmailValidation = validateInput(t, "matchEmail", inputValue, value);
    setIsInputValid(matchEmailValidation.valid);
    setError(matchEmailValidation.message);
  };

  const handleUpdate = async () => {
    const validation = validateInput(t, editMode, inputValue, confirmPwd);

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
        setError(error.response.data.message || t('profile.validationError'));
      } else {
        console.error(t('profile.criticalErrorUpdateFailed'), error);
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

  if (criticalError) return <Error isNavOpen={isNavOpen} error={t('profile.serverError')} />;


  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      {!successMessage &&
        <div className="profile-container">
          <h2>{userData?.username || t('profile.guest')}</h2>
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



                <img
                  src={`${BACKEND}/media/profile_pictures/${userId}/profilePicture.jpg?v=${profilePictureKey}`}
                  alt="Profile"
                  style={{
                    cursor:
                      (superAdminSettings.allowModifyProfilePicture &&
                        adminSettings.allowModifyProfilePicture) ||
                        isSuperAdmin
                        ? 'pointer'
                        : 'default',
                  }}
                  onError={(e) => {
                    e.target.onerror = null; // prevent infinite loop
                    e.target.src = '/images/profilePicture.jpg'; // fallback image
                  }}
                />



              </div>
            }


            {
              ((superAdminSettings.allowModifyProfilePicture && adminSettings.allowModifyProfilePicture) || isSuperAdmin) &&

              isPictureModalVisible && !isTestSuperAdmin && (
                <div className="picture-modal">
                  <h3> {t('profile.changeProfilePicture')}</h3>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    id="profile-picture-input"
                    onChange={handleFileChange}
                  />

                  {/* Text for chosen file */}
                  <span className="file-name">{fileName || t('profile.noFileChosen')}</span>

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
                    <p> {t('profile.dragDropInstruction')}</p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" style={{ cursor: 'pointer', color: '#007bff' }}>
                      {t('profile.clickToChoose')}
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

          {isTestSuperAdmin && (<div>{t('profile.testPurposesCannotModifyAccount')}</div>)}

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
                  {t('profile.editUsername')}
                </button>
              }
              {
                ((superAdminSettings.allowEditEmail && adminSettings.allowEditEmail) || isSuperAdmin) &&
                <button
                  className="profile-actions-button button-white"
                  onClick={() => handleEditButtonClick("email")}
                >
                  {t('profile.editEmail')}
                </button>
              }

              {
                ((superAdminSettings.allowEditPassword && adminSettings.allowEditPassword) || isSuperAdmin) &&
                <button
                  className="profile-actions-button button-white"
                  onClick={() => navigate(`/resetpassword`)}
                >
                  {t('profile.editPassword')}
                </button>
              }

     

  <ProfileLanguageSelector userId={userId} setError={setError}/>


       

              {
                !showConfirmDelete &&
                ((superAdminSettings.allowDeleteMyUser && adminSettings.allowDeleteMyUser) || isSuperAdmin) &&
                <button
                  className="profile-actions-button button-red"
                  onClick={handleDeleteClick}
                >
                  {t('profile.deleteAccount')}
                </button>
              }
              {showConfirmDelete &&
                <div className="delete-confirmation">
                  <p> {t('profile.deleteConfirmationMessage')}</p>
                  <button
                    className="button-white"
                    onClick={() => setShowConfirmDelete(false)}
                  >
                    {t('profile.keepAccount')}
                  </button>
                  <button
                    className="button-red"
                    onClick={handleConfirmDelete}
                  >
                    {t('profile.deleteAccount')}
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
                    <p>{userData?.email || t('profile.guest')}</p>
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
                        placeholder={t('profile.confirmNewEmail')}
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
                      {t('profile.update')}
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
