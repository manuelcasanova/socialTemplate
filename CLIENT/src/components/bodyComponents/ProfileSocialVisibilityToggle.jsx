import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { axiosPrivate } from "../../api/axios";

const ProfileSocialVisibilityToggle = ({ auth, setError }) => {
  const { t } = useTranslation();
  
  const [isVisible, setIsVisible] = useState(auth.socialVisibility ?? false); 
  const userId = auth.userId;


  const handleToggle = async () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility); 

    try {
      const response = await axiosPrivate.put(`/users/${userId}/social-visibility`, {
        socialVisibility: newVisibility,
      });
    } catch (error) {
      console.error('Error updating social visibility:', error);
      setError(t('error.failedToUpdateVisibility')); // 
    }
  };

  useEffect(() => {
    // Update isVisible with the latest value from auth object if it changes
    setIsVisible(auth.socialVisibility ?? false);  // Default to false if undefined
  }, [auth.socialVisibility]);

  return (
    <div
      className='admin-setup-line format-like-white-button'
      style={{ justifyContent: 'center' }}
    >
      <div className="toggle-container">
        <div className="toggle-wrapper">
          <input
            type="checkbox"
            id="socialVisibility"
            className="toggle-checkbox"
            checked={isVisible}
            onChange={handleToggle}
          />
          <label htmlFor="socialVisibility" className="toggle-label">
            <span className="toggle-circle"></span>
          </label>
        </div>
      </div>
      <div className='admin-setup-line-text'>
        {isVisible
          ? t('profile.socialVisibilityOn')
          : t('profile.socialVisibilityOff')}
      </div>
    </div>
  );
};

export default ProfileSocialVisibilityToggle;
