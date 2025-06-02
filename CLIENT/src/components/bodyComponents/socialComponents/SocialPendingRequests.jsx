import { useState, useEffect, useRef, useContext } from "react";

//Hooks

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

//Context
import { useGlobalSuperAdminSettings } from "../../../context/SuperAdminSettingsProvider";
import { useGlobalAdminSettings } from "../../../context/AdminSettingsProvider";
import ScreenSizeContext from "../../../context/ScreenSizeContext";

//Styling

import '../../../css/AdminUsers.css';

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import MuteUserButton from "./socialButtons/MuteUserButton";
import FollowUserButton from "./socialButtons/FollowUserButton";
import Error from "../Error";
import FilterUsername from "./FilterUsername";

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

export default function SocialPendingRequests({ isNavOpen, isFollowingNotification, setIsFollowNotification, profilePictureKey }) {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { superAdminSettings } = useGlobalSuperAdminSettings();
  const { adminSettings } = useGlobalAdminSettings();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { screenSize } = useContext(ScreenSizeContext);
  const { isSmartphone, isTablet, isDesktop, width } = screenSize;

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
  const [showLargePicture, setShowLargePicture] = useState(null);

  const [filterUsername, setFilterUsername] = useState("");
    const [submittedFilterUsername, setSubmittedFilterUsername] = useState('');

  const inputRef = useRef(null);


  useEffect(() => {
    setIsFollowNotification(false);
  }, [setIsFollowNotification]);

  // Reset the error message whenever filters change
  useEffect(() => {
    setError(null); // Clear error when filters change
  }, [filters, filterUsername]);

  useEffect(() => {
    fetchUsers(filters, setUsers, setIsLoading, setError, submittedFilterUsername);
    if (superAdminSettings.allowMute && adminSettings.allowMute) {
      fetchMutedUsers(filters, setMutedUsers, setIsLoading, setError, loggedInUser);
    }
    if (superAdminSettings.allowFollow && adminSettings.allowFollow) {
      fetchPending(filters, setPendingRequests, setIsLoading, setError, loggedInUser);
    }
    if (superAdminSettings.allowFollow && adminSettings.allowFollow) {
      fetchFollowersAndFollowee(filters, setFollowersAndFollowee, setIsLoading, setError, loggedInUser)
    }
  }, [axiosPrivate, filters, hasMutedChanges, submittedFilterUsername, adminSettings, superAdminSettings]);

  // useEffect(() => {
  //   // Focus the input field after the component mounts
  //   if (inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // });

  const handleMutedChanges = () => {
    setHasMutedChanges(prevState => !prevState);
  };

  if (!superAdminSettings || !adminSettings) {
    return <LoadingSpinner />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error isNavOpen={isNavOpen} error={error} />
  }

  // console.log("pendingRequests", pendingRequests)

  // Filter the pendingRequests list to remove muted users
  const filteredPending = pendingRequests.filter(pending => {
    const user = users.find(u => u.user_id === pending.follower_id);

    // Check if the user exists and is active
    const isUserActive = user ? user.is_active : false;

    return isUserActive && !mutedUsers.some(mute => (mute.muter === loggedInUser && mute.mutee === pending.follower_id && mute.mute));
  });

  //   console.log("mutedUSers", mutedUsers)
  //   console.log("users", users)
  // console.log("filteredPending", filteredPending)

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-users">
        <h2>Social - Pending Requests</h2>


        <FilterUsername filterUsername={filterUsername} setFilterUsername={setFilterUsername} inputRef={inputRef} onSearch={() => setSubmittedFilterUsername(filterUsername)} />

        {(filteredPending.length === 0 || !superAdminSettings.allowFollow) ? (
          <p>No pending requests.</p>
        ) : (
          <div className="users-container">
            {filteredPending.map((pending) => {
              // Find the user details for the pendingRequests
              const user = users.find((u) => u.user_id === pending.follower_id);

              if (user) {
                return (
                  <div className="user-row-social" key={pending.follower_id}>
                    <div className="user-info">
                      <img
                        className="user-row-social-small-img"
                        onClick={() => setShowLargePicture(user.user_id)}
                        src={ `${BACKEND}/media/profile_pictures/${user.user_id}/profilePicture.jpg?v=${profilePictureKey}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/profilePicture.jpg';
                        }}
                        alt="Profile"
                      />

                      {showLargePicture === user.user_id && (
                        <div
                          className={`${isNavOpen && isTablet ? 'large-picture-squeezed' : 'large-picture'}`}
                          onClick={() => setShowLargePicture(null)}
                        >
                          <img
                            className="users-all-picture-large"
                            src={ `${BACKEND}/media/profile_pictures/${user.user_id}/profilePicture.jpg?v=${profilePictureKey}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/profilePicture.jpg';
                            }}
                            alt="Large Profile"
                          />
                        </div>
                      )}

                      <p>
                        {user.username.startsWith('inactive') ? 'Inactive User' : user.username}
                      </p>
                    </div>


                    {loggedInUser !== user.user_id &&

                      <div className="user-info-buttons">

                        <FollowUserButton

                          followeeId={user.user_id}
                          followerId={loggedInUser}
                          followersAndFollowee={followersAndFollowee}
                          setFollowersAndFollowee={setFollowersAndFollowee}
                          userLoggedInObject={auth}
                          setError={setError}
                        />






                        <MuteUserButton
                          userId={user.user_id}
                          userLoggedin={loggedInUser}
                          setMutedUsers={setMutedUsers}
                          onMutedChange={handleMutedChanges}
                        />

                      </div>

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