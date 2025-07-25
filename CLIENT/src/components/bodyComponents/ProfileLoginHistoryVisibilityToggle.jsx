import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { axiosPrivate } from "../../api/axios";

const ProfileLoginHistoryVisibilityToggle = ({ auth, setError }) => {
  const { t } = useTranslation();

  const [isVisible, setIsVisible] = useState(auth.loginHistoryVisibility ?? false);
  const userId = auth.userId;

  const [showInfo, setShowInfo] = useState(false)
  const handleShowInfo = () => {
    setShowInfo(prev => !prev)
  }

  const handleToggle = async () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    setShowInfo(false);

    try {
      const response = await axiosPrivate.put(`/users/${userId}/login-history-visibility`, {
        loginHistoryVisibility: newVisibility,
      });
    } catch (error) {
      console.error('Error updating admin visibility:', error);
      setError(t('error.failedToUpdateVisibility')); // 
    }
  };

  useEffect(() => {
    // Update isVisible with the latest value from auth object if it changes
    setIsVisible(auth.loginHistoryVisibility ?? false);  // Default to false if undefined
  }, [auth.loginHistoryVisibility]);

  return (
    <>
      <div
        className='profile-actions-button admin-setup-line format-like-white-button'
        style={{ justifyContent: 'center' }}
      >
        <div className="toggle-container">
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              id="loginHistoryVisibility"
              className="toggle-checkbox"
              checked={isVisible}
              onChange={handleToggle}
            />
            <label htmlFor="loginHistoryVisibility" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        <div className='admin-setup-line-text'>
          {isVisible
            ?
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {t('profile.loginHistoryVisibilityOn')}
              <button
                className='profile-info-button'
              onClick={handleShowInfo}
              >{t('socialMuted.infoButton')}</button>
            </div>
            :
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {t('profile.loginHistoryVisibilityOff')}
              <button
                className='profile-info-button'
              onClick={handleShowInfo}
              >{t('socialMuted.infoButton')}</button>
            </div>
          }
        </div>
      </div>
      {showInfo && <>   {t('profile.loginHistoryVisibilityInfo')}</>}
    </>
  );
};

export default ProfileLoginHistoryVisibilityToggle;
