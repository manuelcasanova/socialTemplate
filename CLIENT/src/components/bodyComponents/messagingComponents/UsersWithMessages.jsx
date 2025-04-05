import { useState, useEffect } from "react";

//Hooks

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

//Styling

import '../../../css/AdminUsers.css';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";

//Util functions
import fetchMutedUsers from "../socialComponents/util_functions/FetchMutedUsers";
import fetchUsersWithMessages from "../socialComponents/util_functions/FetchUsersWithMessages";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

// Function to check if profile picture exists for each user
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
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [mutedUsers, setMutedUsers] = useState([]);
  const [filters, setFilters] = useState({});
  const loggedInUser = auth.userId;
  const [imageExistsMap, setImageExistsMap] = useState({});
  const [showLargePicture, setShowLargePicture] = useState(null)

  useEffect(() => {
    fetchUsersWithMessages(loggedInUser, setUsers, setIsLoading, setError);
    // Fetch muted users (optional depending on your app's structure)
    fetchMutedUsers(filters, setMutedUsers, setIsLoading, setError, loggedInUser)
  }, [loggedInUser]);

  // Reset the error message whenever filters change
  useEffect(() => {
    setError(null); // Clear error when filters change
  }, [filters]);

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
    return <div>Error: {error}</div>;
  }

  // Exclude muted users
  const usersToDisplay = users.filter(user => !mutedUsers.includes(user.user_id));

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-users"> 
        <h2>Chats</h2>

        <div className="users-container">
          {usersToDisplay.length > 0 ? (
            usersToDisplay.map((user) => (
              <div className="user-row-social" key={user.user_id}>
                <div className="user-info">

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




                  <p className="cursor-pointer">{processUsername(user.username)}</p>
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
