import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { axiosPrivate } from "../../api/axios";

const ProfileAdminVisibilityToggle = ({ auth, setError }) => {
  const { t } = useTranslation();

  const [isVisible, setIsVisible] = useState(auth.adminVisibility ?? false);
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
      const response = await axiosPrivate.put(`/users/${userId}/admin-visibility`, {
        adminVisibility: newVisibility,
      });
    } catch (error) {
      console.error('Error updating admin visibility:', error);
      setError(t('error.failedToUpdateVisibility')); // 
    }
  };

  useEffect(() => {
    // Update isVisible with the latest value from auth object if it changes
    setIsVisible(auth.adminVisibility ?? false);  // Default to false if undefined
  }, [auth.adminVisibility]);

  return (
    <>
      <div className='format-like-white-button'>
        <div>
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              id="adminVisibility"
              className="toggle-checkbox"
              checked={isVisible}
              onChange={handleToggle}
            />
            <label htmlFor="adminVisibility" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>
        <div className='admin-setup-line-text'>
          {isVisible
            ?
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {t('profile.adminVisibilityOn')}
              <button
                className='profile-info-button'
              onClick={handleShowInfo}
              >{t('socialMuted.infoButton')}</button>
            </div>
            :
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {t('profile.adminVisibilityOff')}
              <button
                className='profile-info-button'
              onClick={handleShowInfo}
              >{t('socialMuted.infoButton')}</button>
            </div>
          }
        </div>
      </div>
      {showInfo && <>   {t('profile.adminVisibilityInfo')}</>}
    </>
  );
};

export default ProfileAdminVisibilityToggle;
