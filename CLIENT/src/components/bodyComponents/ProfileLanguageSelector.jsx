import React, { useState } from 'react';
import i18next from "i18next";
import { axiosPrivate } from '../../api/axios';
import { useTranslation } from 'react-i18next';

const LanguageSelector = ({ userId, setError }) => {

  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18next.language);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
  ];

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle language change and update the button text
  const handleLanguageChange = async (language) => {
    try {
      // Change language in i18next
      i18next.changeLanguage(language);
      setSelectedLanguage(language);

      // Send the selected language to the backend
      const response = await axiosPrivate.put('/users/update-language', { language, userId });

          setIsDropdownOpen(false);

    } catch (error) {
      console.error('Error saving language:', error);
      setError(t('profile.errorSavingLanguage'));
    }
  };
  // Find the selected language name based on the code
  const selectedLanguageName = languages.find(lang => lang.code === selectedLanguage)?.name || 'Select Language';

      // console.log(t('profile.language'));

  return (
    <div className="language-selector">
      {/* Button showing 'Language: [selectedLanguage]' */}
      <button
        className="profile-actions-button button-white"
        onClick={toggleDropdown}
      >
      {`${t('profile.language')}: ${selectedLanguageName}`}




      </button>

      {/* Show dropdown when the button is clicked */}
      {isDropdownOpen && (
        <div className="dropdown-options" style={{

        }}>
          <ul style={{
            // listStyleType: 'none', padding: 0, margin: 0 
          }}>
            {languages.map(({ code, name }) => (
              <li
                key={code}
                style={{ padding: '8px', cursor: 'pointer' }}
                onClick={() => handleLanguageChange(code)}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
