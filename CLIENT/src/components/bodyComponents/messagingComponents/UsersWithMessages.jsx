import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from 'react-router-dom';

//Hooks

import useAuth from "../../../hooks/useAuth";

//Styling

import '../../../css/AdminUsers.css';

//Context
import ScreenSizeContext from "../../../context/ScreenSizeContext";


//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import MessageNotification from "../../navbarComponents/MessageNotification";
import Error from "../Error";
import FilterUsername from "../socialComponents/FilterUsername";
import MuteUserButton from "../socialComponents/socialButtons/MuteUserButton";

//Util functions
import fetchMutedUsers from "../socialComponents/util_functions/FetchMutedUsers";
import fetchUsersWithMessages from "../socialComponents/util_functions/FetchUsersWithMessages";
import { profilePictureExists } from "../../mainComponents/util_functions/ProfilePictureExists";
import fetchNewMessagesNotification from "./util_functions/FetchNewMessagesNotification";

const BACKEND = process.env.REACT_APP_BACKEND_URL;


function processUsername(username) {
  const regex = /^inactive-\d{13}-(.*)$/; // Regex to match 'inactive-' followed by 13 digits and then the name
  const match = username.match(regex);

  if (match) {
    // If it matches, return the name with the '(Deleted account)' suffix
    return match[1] + ' (Deleted account)';
  } else {
    // If it doesn't match, return the username as is
    return username;
  }
}

export default function UsersWithMessages({ isNavOpen }) {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { screenSize } = useContext(ScreenSizeContext);
  const { isSmartphone, isTablet, isDesktop, width } = screenSize;

  const [users, setUsers] = useState([]);
  const [usersWithNewMessages, setUsersWithNewMessages] = useState([]);
  const [mutedUsers, setMutedUsers] = useState([]);
  const [hasMutedChanges, setHasMutedChanges] = useState(false);
  const [filterUsername, setFilterUsername] = useState("");
    const [submittedFilterUsername, setSubmittedFilterUsername] = useState('');
  const [hideMuted, setHideMuted] = useState(true);
  const loggedInUser = auth.userId;

  const [showLargePicture, setShowLargePicture] = useState(null)
  const inputRef = useRef(null);
  // console.log("users with new messages", usersWithNewMessages)

  // useEffect(() => {
  //   // Focus the input field after the component mounts
  //   if (inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // });

  useEffect(() => {
    fetchNewMessagesNotification(loggedInUser, setUsersWithNewMessages, setIsLoading, setError)
  }, [loggedInUser])

  useEffect(() => {
    fetchUsersWithMessages(loggedInUser, setUsers, setIsLoading, setError, filterUsername, hideMuted);
    // Fetch muted users (optional depending on your app's structure)
    fetchMutedUsers("", setMutedUsers, setIsLoading, setError, loggedInUser)
  }, [loggedInUser, submittedFilterUsername, hideMuted, hasMutedChanges]);

  // Reset the error message whenever filters change
  useEffect(() => {
    setError(null); // Clear error when filters change
  }, [filterUsername]);

  const handleMutedChanges = () => {
    setHasMutedChanges(prevState => !prevState);
  };


  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error isNavOpen={isNavOpen} error={error} />
  }

  // Exclude muted users

  const usersToDisplay = hideMuted
    ? users.filter(user => !mutedUsers.includes(user.user_id))
    : users;

  const handleToggleMute = () => {
    setHideMuted(prevState => !prevState); // Toggle the hideMuted state
  };

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-users">
        <h2>Chats</h2>

        <FilterUsername filterUsername={filterUsername} setFilterUsername={setFilterUsername} inputRef={inputRef} onSearch={() => setSubmittedFilterUsername(filterUsername)}  />


        <div className="container-toggle-hide-chat-muted-users">
          <div className="details-toggle-hide-chat-muted-users">
            <div className="toggle-hide-chat-muted-users-text">
              Hide muted
            </div>

            <input
              type="checkbox"
              id="toggle-chat-muted-users"
              className="toggle-checkbox"
              checked={hideMuted}
              onChange={handleToggleMute}
            />
            <label htmlFor="toggle-chat-muted-users" className="toggle-label">
              <span className="toggle-circle"></span>
            </label>
          </div>
        </div>


        <div className="users-container">
          {usersToDisplay.length > 0 ? (
            usersToDisplay.map((user) => (
              <div className="user-row-social" key={user.user_id}>
                <div className="chat-user-info">

          <img
            className="user-with-messages-row-chat-small-img"
            src={`${BACKEND}/media/profile_pictures/${user.user_id}/profilePicture.jpg`}
            alt="Profile"
            onClick={() => setShowLargePicture(user.user_id)}
            onError={(e) => {
              e.target.onerror = null; // prevent infinite loop
              e.target.src = '/images/profilePicture.jpg';
            }}
          />

          



           {showLargePicture && (
            // <div className={`${isNavOpen ? 'large-picture-squeezed' : 'large-picture'}`} onClick={() => setShowLargePicture(false)}>
            <div className={`${isNavOpen && isTablet ? 'large-picture-squeezed' : 'large-picture'}`}
              onClick={() => setShowLargePicture(false)}>


              <img

                className="users-all-picture-large"
                src={`${BACKEND}/media/profile_pictures/${user.user_id}/profilePicture.jpg`}
                alt="Large Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/profilePicture.jpg'; // Default fallback image
                }}
              />
            </div>
          )}

                  {/* 
{console.log("user user id", user.user_id)}
{console.log("usersWithNewMessages", usersWithNewMessages)} */}


                  <p
                    className="cursor-pointer"
                    onClick={() => navigate(`/messages/${user.user_id}`)}>
                    {processUsername(user.username)}</p>

                  {/* <MessageNotification userId={user.user_id}/> */}
                  {usersWithNewMessages.includes(user.user_id) && <MessageNotification userId={user.user_id} setUsersWithNewMessages={setUsersWithNewMessages} />}

                  <MuteUserButton userId={user.user_id} userLoggedin={loggedInUser} onMutedChange={handleMutedChanges} setMutedUsers={setMutedUsers}
                    isMuted={mutedUsers.some(mute =>
                      (mute.muter === user.user_id && mute.mutee === loggedInUser) ||
                      (mute.muter === loggedInUser && mute.mutee === user.user_id)
                    )}
                  />

                </div>

              </div>
            ))
          ) : (
            <p>No users with messages found or users are muted.</p>
          )}
        </div>
      </div>
    </div>
  );
}
