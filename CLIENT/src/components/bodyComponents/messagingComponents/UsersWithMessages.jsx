import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

//Hooks

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

//Styling

import '../../../css/AdminUsers.css';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import MessageNotification from "../../navbarComponents/MessageNotification";
import Error from "../Error";

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
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersWithNewMessages, setUsersWithNewMessages] = useState([]);
  const [mutedUsers, setMutedUsers] = useState([]);
  const [filterUsername, setFilterUsername] = useState("");
  const [filters, setFilters] = useState("")
  const [hideMuted, setHideMuted] = useState(true);
  const loggedInUser = auth.userId;
  const [imageExistsMap, setImageExistsMap] = useState({});
  const [showLargePicture, setShowLargePicture] = useState(null)
  const inputRef = useRef(null);
  // console.log("users with new messages", usersWithNewMessages)

  useEffect(() => {
    // Focus the input field after the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  useEffect(() => {
    fetchNewMessagesNotification(loggedInUser, setUsersWithNewMessages, setIsLoading, setError)
  }, [])

  useEffect(() => {
    fetchUsersWithMessages(loggedInUser, setUsers, setIsLoading, setError, filterUsername, hideMuted);
    // Fetch muted users (optional depending on your app's structure)
    fetchMutedUsers(filters, setMutedUsers, setIsLoading, setError, loggedInUser)
  }, [loggedInUser, filterUsername, hideMuted]);

  // Reset the error message whenever filters change
  useEffect(() => {
    setError(null); // Clear error when filters change
  }, [filterUsername]);

  // Check if profile picture exists for each user and store the result
  useEffect(() => {
    const checkImages = async () => {
      const result = {};
      for (const user of users) {
        result[user.user_id] = await profilePictureExists(user.user_id);
      }
      setImageExistsMap(result);
    };

    if (users.length > 0) {
      checkImages();
    }
  }, [users]);

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

        <div className="filter-container chats-filter">
          <div className="filter-wrapper">
            <input
              type="text"
              className="filter-container-input-username"
              placeholder="Username"
              value={filterUsername}
              onChange={(e) => setFilterUsername(e.target.value)}
              pattern="[a-zA-Z0-9-_^\s]+" // Optional, prevents invalid submission
              ref={inputRef}
              title="Only letters, numbers, hyphens, underscores, carets, and spaces are allowed."
            />
          </div>
        </div>


        <div className="container-toggle-hide-chat-muted-users">
          <div className="details-toggle-hide-chat-muted-users">
            <div className="toggle-hide-chat-muted-users-text">
              {hideMuted ? 'Show muted' : 'Hide muted'}
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

                  {imageExistsMap[user.user_id] ? (
                    <img
                      className="user-row-social-small-img "
                      onClick={() => setShowLargePicture(user.user_id)}
                      src={`${BACKEND}/media/profile_pictures/${user.user_id}/profilePicture.jpg`}
                      alt="Profile"
                    />

                  ) : (

                    <FontAwesomeIcon onClick={() => setShowLargePicture(user.user_id)} icon={faUser} size="3x" style={{ marginRight: '20px' }} />

                  )}



                  {showLargePicture === user.user_id && <div
                    className='large-picture'
                    onClick={() => setShowLargePicture(null)}
                  >
                    <img
                      className='users-all-picture-large'
                      onClick={() => setShowLargePicture(null)}
                      src={`${BACKEND}/media/profile_pictures/${user.user_id}/profilePicture.jpg`}
                      onError={(e) => {
                        // Prevent infinite loop in case of repeated errors
                        e.target.onerror = null;

                        // Check if the fallback image has already been set to avoid infinite loop
                        if (e.target.src !== `${BACKEND}/media/profile_pictures/user.png`) {
                          // Fall back to the default user image if the profile picture fails
                          e.target.src = `${BACKEND}/media/profile_pictures/user.png`;
                        }
                      }}
                    />

                  </div>}
                  {/* 
{console.log("user user id", user.user_id)}
{console.log("usersWithNewMessages", usersWithNewMessages)} */}


                  <p
                    className="cursor-pointer"
                    onClick={() => navigate(`/messages/${user.user_id}`)}>
                    {processUsername(user.username)}</p>

                  {/* <MessageNotification userId={user.user_id}/> */}
                  {usersWithNewMessages.includes(user.user_id) && <MessageNotification userId={user.user_id} setUsersWithNewMessages={setUsersWithNewMessages} />}


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
