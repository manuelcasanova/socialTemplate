//Hooks

import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

//Context

import { useGlobalSuperAdminSettings } from "../../../../context/SuperAdminSettingsProvider";
import { useGlobalAdminSettings } from "../../../../context/AdminSettingsProvider";

//Styling

import { faBellSlash, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Translation
import { useTranslation } from 'react-i18next';

const MuteUserButton = ({ userId, userLoggedin, isMuted, setMutedUsers, onMutedChange, handleRefresh, setError, isSuperAdmin }) => {


  const { t } = useTranslation();

  const BACKEND = process.env.REACT_APP_BACKEND_URL;
  const { superAdminSettings } = useGlobalSuperAdminSettings();
  const { adminSettings } = useGlobalAdminSettings();
  const axiosPrivate = useAxiosPrivate()
  const muteUser = () => {
    axiosPrivate.post(`${BACKEND}/social/users/mute`, { userLoggedin, userId })
      .then(response => {
        setMutedUsers(prevMutedUsers => [...prevMutedUsers, userId]);
        onMutedChange();
      })
      .catch(error => {
        setError(error)
        console.error('Error muting user:', error);
      });
  };

  const unmuteUser = () => {
    axiosPrivate.post(`${BACKEND}/social/users/unmute`, { userLoggedin, userId })
      .then(response => {
        setMutedUsers(prevMutedUsers => prevMutedUsers.filter(id => id !== userId));
        onMutedChange();
      })
      .catch(error => {
        setError(error)
        console.error('Error unmuting user:', error);
      });
  };

  return (
    (superAdminSettings.allowMute && adminSettings.allowMute || isSuperAdmin) &&
    <div 
    className="user-info-buttons"
    >
      {isMuted ? (
        <button title="Unmute user" onClick={unmuteUser}><FontAwesomeIcon icon={faBell}></FontAwesomeIcon></button>
      ) : (
        <button title={t('socialMuted.muteUser')} onClick={muteUser}> <FontAwesomeIcon icon={faBellSlash} /></button>
      )}
    </div>

  );
};

export default MuteUserButton;
