//Hooks

import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

//Context

import { useGlobal } from "../../../../context/GlobalProvider";

//Styling

import { faBellSlash, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MuteUserButton = ({ userId, userLoggedin, isMuted, setMutedUsers, onMutedChange, handleRefresh }) => {
  const BACKEND = process.env.REACT_APP_BACKEND_URL;
  const { postFeatures } = useGlobal();
  const axiosPrivate = useAxiosPrivate()
  const muteUser = () => {
    axiosPrivate.post(`${BACKEND}/social/users/mute`, { userLoggedin, userId })
      .then(response => {
        setMutedUsers(prevMutedUsers => [...prevMutedUsers, userId]);
        onMutedChange();
      })
      .catch(error => {
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
        console.error('Error unmuting user:', error);
      });
  };

  return (

    postFeatures.allowMute &&
    <div className="user-info-buttons">
      {isMuted ? (
        <button title="Unmute user" onClick={unmuteUser}><FontAwesomeIcon icon={faBell}></FontAwesomeIcon></button>
      ) : (
        <button title="Mute user" onClick={muteUser}> <FontAwesomeIcon icon={faBellSlash} /></button>
      )}
    </div>

  );
};

export default MuteUserButton;
