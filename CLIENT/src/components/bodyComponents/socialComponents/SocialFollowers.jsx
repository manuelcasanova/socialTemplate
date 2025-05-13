import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

//Hooks

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

//Context

import { useGlobal } from "../../../context/GlobalProvider";

//Styling

import '../../../css/AdminUsers.css';
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import MuteUserButton from "./socialButtons/MuteUserButton";
import FollowUserButton from "./socialButtons/FollowUserButton";
import Error from "../Error";
import FilterUsername from "./FilterUsername";

//Util functions
import fetchUsers from "./util_functions/FetchUsers";
import fetchMutedUsers from "./util_functions/FetchMutedUsers";
import fetchFollowers from "./util_functions/FetchFollowers";
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

export default function SocialFollowers({ isNavOpen }) {
  const { auth } = useAuth();
  const isSuperAdmin = auth.roles.includes('SuperAdmin');
  const axiosPrivate = useAxiosPrivate();
  const { postFeatures } = useGlobal();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const loggedInUser = auth.userId;
  const [users, setUsers] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followersAndFollowee, setFollowersAndFollowee] = useState([])
  const [mutedUsers, setMutedUsers] = useState([]);
  const userIDsExceptMe = followers.map(user => user.user_id);
  const allUsersMutedOrMe = userIDsExceptMe.every(userId =>
    mutedUsers.some(mute => (mute.muter === userId || mute.mutee === userId) && mute.mute)
  );

  const [hasMutedChanges, setHasMutedChanges] = useState(false);
  const [imageExistsMap, setImageExistsMap] = useState({});
  const [showLargePicture, setShowLargePicture] = useState(null);

  const [filterUsername, setFilterUsername] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input field after the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  // Reset the error message whenever filters change
  useEffect(() => {
    setError(null); // Clear error when filters change
  }, [filters, filterUsername]);

  useEffect(() => {
    postFeatures.showSocialFeature &&
      fetchUsers(filters, setUsers, setIsLoading, setError, filterUsername);
    postFeatures.allowMute &&
      fetchMutedUsers(filters, setMutedUsers, setIsLoading, setError, loggedInUser);
    postFeatures.allowFollow &&
      fetchFollowers(filters, setFollowers, setIsLoading, setError, loggedInUser);
    postFeatures.allowFollow &&
      fetchFollowersAndFollowee(filters, setFollowersAndFollowee, setIsLoading, setError, loggedInUser)
  }, [axiosPrivate, filters, hasMutedChanges, filterUsername]);

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
    return <Error isNavOpen={isNavOpen} error={error} />
  }

  // Filter the followers list to remove muted users
  const filteredFollowee = followers.filter(follow => {
    const user = users.find(u => u.user_id === follow.follower_id);
    return !mutedUsers.some(mute => (mute.muter === loggedInUser && mute.mutee === follow.follower_id && mute.mute));
  });

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-users">
        <h2>Social - Followers</h2>

        <FilterUsername filterUsername={filterUsername} setFilterUsername={setFilterUsername} inputRef={inputRef} />

        {filteredFollowee.length === 0 ? (
          <p>No users available or all users are muted.</p>
        ) : (
          <div className="users-container">
            {filteredFollowee.map((follow) => {
              // Find the user details for the followers
              const user = users.find((u) => u.user_id === follow.follower_id);

              if (user) {
                return (
                  <div className="user-row-social" key={follow.follower_id}>
                    <div className="user-info">
                      {imageExistsMap[user.user_id] ? (
                        <img
                          className="user-row-social-small-img"
                          onClick={() => setShowLargePicture(user.user_id)}
                          src={`${BACKEND}/media/profile_pictures/${user.user_id}/profilePicture.jpg`}
                          alt="Profile"
                        />
                      ) : (
                        <img
                          className="user-row-social-small-img"
                          onClick={() => setShowLargePicture(user.user_id)}
                          src={`${BACKEND}/media/profile_pictures/profilePicture.jpg`}
                          alt="Profile"
                        />
                      )}

                      {showLargePicture === user.user_id && (
                        <div
                          className={`${isNavOpen ? 'large-picture-squeezed' : 'large-picture'}`}
                          onClick={() => setShowLargePicture(null)}
                        >
                          <img
                            className='users-all-picture-large'
                            onClick={() => setShowLargePicture(null)}
                            src={imageExistsMap[user.user_id]
                              ? `${BACKEND}/media/profile_pictures/${user.user_id}/profilePicture.jpg`
                              : `${BACKEND}/media/profile_pictures/profilePicture.jpg`}
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

                        <div className="user-info-buttons">
                          {
                            followersAndFollowee.some(f =>
                              f.follower_id === user.user_id ||
                              f.followee_id === user.user_id &&
                              f.status === "accepted"
                            ) && postFeatures.showMessagesFeature && (
                              <button
                                onClick={() => navigate(`/messages/${user.user_id}`)}
                              >

                                <FontAwesomeIcon
                                  icon={faEnvelope}
                                  style={{ cursor: "pointer" }}
                                  title="This user follows you"
                                />
                              </button>
                            )
                          }
                        </div>

                        <FollowUserButton

                          followeeId={user.user_id}
                          followerId={loggedInUser}
                          followersAndFollowee={followersAndFollowee}
                          setFollowersAndFollowee={setFollowersAndFollowee}
                          userLoggedInObject={auth}
                          isSuperAdmin={isSuperAdmin}
                          setError={setError}
                        />

                        <MuteUserButton
                          userId={user.user_id}
                          userLoggedin={loggedInUser}
                          setMutedUsers={setMutedUsers}
                          onMutedChange={handleMutedChanges}
                          isSuperAdmin={isSuperAdmin}
                          setError={setError}
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