import { useState, useEffect } from "react";

//Hooks

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

//Styling

import '../../../css/AdminUsers.css';
import { faBellSlash, faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import MuteUserButton from "./socialButtons/MuteUserButton";
import FollowUserButton from "./socialButtons/FollowUserButton";

//Util functions
import fetchUsers from "./util_functions/FetchUsers";
import fetchMutedUsers from "./util_functions/FetchMutedUsers";
import fetchPending from "./util_functions/FetchPending";
import fetchFollowersAndFollowee from "./util_functions/FetchFollowersAndFollowee";

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

export default function SocialPendingRequests({ isNavOpen, isFollowingNotification, setIsFollowNotification }) {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const loggedInUser = auth.userId;
  const [users, setUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [followersAndFollowee, setFollowersAndFollowee] = useState([])
  const [mutedUsers, setMutedUsers] = useState([]);
  const userIDsExceptMe = pendingRequests.map(user => user.user_id);
  const allUsersMutedOrMe = userIDsExceptMe.every(userId =>
    mutedUsers.some(mute => (mute.muter === userId || mute.mutee === userId) && mute.mute)
  );

  const [hasMutedChanges, setHasMutedChanges] = useState(false);
  const [imageExistsMap, setImageExistsMap] = useState({});
  const [showLargePicture, setShowLargePicture] = useState(null);


  useEffect(() => {
    setIsFollowNotification(false);
  }, [setIsFollowNotification]);

  // Reset the error message whenever filters change
  useEffect(() => {
    setError(null); // Clear error when filters change
  }, [filters]);

  useEffect(() => {
    fetchUsers(filters, setUsers, setIsLoading, setError);
    fetchMutedUsers(filters, setMutedUsers, setIsLoading, setError, loggedInUser);
    fetchPending(filters, setPendingRequests, setIsLoading, setError, loggedInUser);
    fetchFollowersAndFollowee(filters, setFollowersAndFollowee, setIsLoading, setError, loggedInUser)
  }, [axiosPrivate, filters, hasMutedChanges]);

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

  const handleMutedChanges = () => {
    setHasMutedChanges(prevState => !prevState);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Filter the pendingRequests list to remove muted users
  const filteredPending = pendingRequests.filter(pending => {
    const user = users.find(u => u.user_id === pending.follower_id);
    return !mutedUsers.some(mute => (mute.muter === loggedInUser && mute.mutee === pending.follower_id && mute.mute));
  });

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-users">
        <h2>Social - Pending Requests</h2>

        {filteredPending.length === 0 ? (
          <p>No users available or all users are muted.</p>
        ) : (
          <div className="users-container">
            {filteredPending.map((pending) => {
              // Find the user details for the pendingRequests
              const user = users.find((u) => u.user_id === pending.follower_id);

              if (user) {
                return (
                  <div className="user-row-social" key={pending.follower_id}>
                    <div className="user-info">
                      {imageExistsMap[user.user_id] ? (
                        <img
                          className="user-row-social-small-img"
                          onClick={() => setShowLargePicture(user.user_id)}
                          src={`${BACKEND}/media/profile_pictures/${user.user_id}/profilePicture.jpg`}
                          alt="Profile"
                        />
                      ) : (
                        <FontAwesomeIcon
                          onClick={() => setShowLargePicture(user.user_id)}
                          icon={faUser}
                          size="3x"
                          style={{ marginRight: '20px' }}
                        />
                      )}

                      {showLargePicture === user.user_id && (
                        <div
                          className="large-picture"
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
                        </div>
                      )}

                      <p>
                        {user.username.startsWith('inactive') ? 'Inactive User' : user.username}
                      </p>
                    </div>

                    {loggedInUser !== user.user_id &&
                      <>
                        <FollowUserButton

                          followeeId={user.user_id}
                          followerId={loggedInUser}
                          followersAndFollowee={followersAndFollowee}
                          setFollowersAndFollowee={setFollowersAndFollowee}
                          userLoggedInObject={auth}
                        />






                        <MuteUserButton
                          userId={user.user_id}
                          userLoggedin={loggedInUser}
                          setMutedUsers={setMutedUsers}
                          onMutedChange={handleMutedChanges}
                        />
                      </>
                    }
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}