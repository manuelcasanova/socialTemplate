
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

//Context
import { useGlobal } from "../../../context/GlobalProvider";
import { useGlobalAdminSettings } from "../../../context/AdminSettingsProvider";

//Hooks

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

//Styling

import '../../../css/AdminUsers.css';
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Components
// import filterUsers
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import FollowUserButton from "./socialButtons/FollowUserButton";
import MuteUserButton from "./socialButtons/MuteUserButton";
import Error from "../Error";
import FilterUsername from "./FilterUsername";

//Util functions
import fetchUsers from "./util_functions/FetchUsers";
import fetchMutedUsers from "./util_functions/FetchMutedUsers";
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

export default function SocialAllUsers({ isNavOpen }) {
  const { auth } = useAuth();
  const isSuperAdmin = auth.roles.includes('SuperAdmin');
  const axiosPrivate = useAxiosPrivate();
  const { postFeatures } = useGlobal();
  const { adminSettings } = useGlobalAdminSettings();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const loggedInUser = auth.userId
  const [users, setUsers] = useState([]);
  const [followersAndFollowee, setFollowersAndFollowee] = useState([])
  const [mutedUsers, setMutedUsers] = useState([]);
  const [filterUsername, setFilterUsername] = useState("");
  const inputRef = useRef(null);
  const usersExceptMe = users.filter(user => {
    // Filter out muted users
    const isMuted = mutedUsers.some(mute =>
      (mute.muter === loggedInUser && mute.mutee === user.user_id && mute.mute) ||
      (mute.muter === user.user_id && mute.mutee === loggedInUser && mute.mute)
    );
    return user.user_id !== loggedInUser && user.is_active && !isMuted;
  });

  const userIDsExceptMe = usersExceptMe.map(user => user.user_id);
  const allUsersMutedOrMe = userIDsExceptMe.every(userId =>
    mutedUsers.some(mute => (mute.muter === userId || mute.mutee === userId) && mute.mute)
  );

  const [hasMutedChanges, setHasMutedChanges] = useState(false);
  const [imageExistsMap, setImageExistsMap] = useState({});
  const [showLargePicture, setShowLargePicture] = useState(null)

  useEffect(() => {
    // Focus the input field after the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  // Reset the error message whenever filters change
  useEffect(() => {
    setError(null); // Clear error when filters change
  }, [filters]);

  useEffect(() => {

    if (!postFeatures || !adminSettings) return;

    if (postFeatures.showSocialFeature && adminSettings.showSocialFeature) {
      fetchUsers(filters, setUsers, setIsLoading, setError, filterUsername)
    }

    if (postFeatures.allowMute && adminSettings.allowMute) {
      fetchMutedUsers(filters, setMutedUsers, setIsLoading, setError, loggedInUser)
    }

    if (postFeatures.allowFollow && adminSettings.allowFollow) {
      fetchFollowersAndFollowee(filters, setFollowersAndFollowee, setIsLoading, setError, loggedInUser)
    }

  }, [axiosPrivate, filters, hasMutedChanges, filterUsername, postFeatures, adminSettings]);

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

  if (!postFeatures || !adminSettings) {
    return <LoadingSpinner />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error isNavOpen={isNavOpen} error={error} />
  }


  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-users">
        <h2>Social - All Users</h2>

        <FilterUsername filterUsername={filterUsername} setFilterUsername={setFilterUsername} inputRef={inputRef} />

        {allUsersMutedOrMe ? (
          <p>No users available or all users are muted.</p>
        ) : (
          <div className="users-container">
            {usersExceptMe.length > 0 ? (


              usersExceptMe.map((user) =>

                <div className="user-row-social" key={user.user_id}>
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
                            if (e.target.src !== `${BACKEND}/media/profile_pictures/${user.user_id}/profilePicture.jpg`) {
                              // Fall back to the default user image if the profile picture fails
                              e.target.src = `${BACKEND}/media/profile_pictures/profilePicture.jpg`;
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
                          ) && postFeatures.showMessagesFeature && adminSettings.showMessagesFeature && (

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
                        setError={setError}
                        isSuperAdmin={isSuperAdmin}
                      />

                      <MuteUserButton
                        userId={user.user_id}
                        userLoggedin={loggedInUser}
                        // isMuted={isMuted} 
                        setMutedUsers={setMutedUsers}
                        onMutedChange={handleMutedChanges}
                        setError={setError}
                        isSuperAdmin={isSuperAdmin}
                      />
                    </>
                  }

                </div>

              )
            ) : (
              <p>No users found</p>
            )}
          </div>

        )}

      </div>
    </div>
  )
}