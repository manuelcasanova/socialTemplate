import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

//Context
import { useGlobalSuperAdminSettings } from "../../../context/SuperAdminSettingsProvider";
import { useGlobalAdminSettings } from "../../../context/AdminSettingsProvider";

//Hooks
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

//Styling
import '../../../css/AdminUsers.css';
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import FollowUserButton from "./socialButtons/FollowUserButton";
import MuteUserButton from "./socialButtons/MuteUserButton"
import Error from "../Error";


//Util functions
import fetchUsers from "./util_functions/FetchUsers";
import fetchFollowersAndFollowee from "./util_functions/FetchFollowersAndFollowee";
import fetchMutedUsers from "./util_functions/FetchMutedUsers";

//Translation
import { useTranslation } from 'react-i18next';

const BACKEND = process.env.REACT_APP_BACKEND_URL;

// Function to check if profile picture exists for the user
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

export default function SocialOneUser({ isNavOpen, profilePictureKey }) {

  const { t } = useTranslation();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { superAdminSettings } = useGlobalSuperAdminSettings();
  const { adminSettings } = useGlobalAdminSettings();
  const { userId } = useParams(); // Get the userId from the URL parameter
  const userIdNumber = Number(userId);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const loggedInUser = auth.userId;
  const [user, setUser] = useState(null); // Store the specific user
  const [mutedUsers, setMutedUsers] = useState([]);
  const [hasMutedChanges, setHasMutedChanges] = useState(false)
  const [followersAndFollowee, setFollowersAndFollowee] = useState([]);
  const [filterUsername, setFilterUsername] = useState("");
  const inputRef = useRef(null);
  const [imageExistsMap, setImageExistsMap] = useState({});
  const [showLargePicture, setShowLargePicture] = useState(null);

  useEffect(() => {
    if (hasMutedChanges) {
      navigate(-1); // Navigate back to previous page
    }
  }, [hasMutedChanges, navigate]);

  const handleMutedChanges = () => {
    setHasMutedChanges(prevState => !prevState);
  };

  useEffect(() => {
    // Focus the input field after the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Reset the error message whenever filters change
  useEffect(() => {
    setError(null); // Clear error when filters change
  }, [filters]);

  // Fetch specific user based on userId from the URL
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await axiosPrivate.get(`${BACKEND}/users/${userId}`);

        setUser(response.data);
        setIsLoading(false);
      } catch (error) {
        setError("User not found.");
        setIsLoading(false);
      }
    };

    fetchUser();
    fetchFollowersAndFollowee(filters, setFollowersAndFollowee, setIsLoading, setError, loggedInUser);
  }, [axiosPrivate, filters, userIdNumber]);


  useEffect(() => {
    if (!superAdminSettings.allowMute || !adminSettings.allowMute) {
      return;
    }

    fetchMutedUsers(filters, (rawMutedUsers) => {
      const cleaned = rawMutedUsers.map(record => ({
        user_id: record.muter,
        muted_user_id: record.mutee,
      }));
      setMutedUsers(cleaned);
    }, setIsLoading, setError, loggedInUser);

  }, [
    filters,
    loggedInUser,
    superAdminSettings.allowMute,
    adminSettings.allowMute,
    setMutedUsers,
    setIsLoading,
    setError
  ]);




  // Check if profile picture exists for the user
  useEffect(() => {
    const checkImages = async () => {
      if (user) {
        const result = {};
        result[user.user_id] = await profilePictureExists(user.user_id);
        setImageExistsMap(result);
      }
    };

    if (user) {
      checkImages();
    }
  }, [user]);

  // Check if the logged-in user is muted or mutee
  const isMutedOrMutee = user && mutedUsers.some(mutedUser =>
    (mutedUser.user_id === loggedInUser && mutedUser.muted_user_id === user.user_id) || // you muted them
    (mutedUser.user_id === user.user_id && mutedUser.muted_user_id === loggedInUser)    // they muted you
  );

  // Display loading spinner while waiting for data
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Display error message if an error occurs
  if (error) {
    return <Error isNavOpen={isNavOpen} error={error} />;
  }

  // Display "No user found" if no user data is available
  if (!user) {
    return <p>No user found</p>;
  }

  // Check if the user is the logged-in user, or muted/mutee
  const shouldDisplayInfo = user && loggedInUser !== user.user_id && !isMutedOrMutee;

  // console.log("user loaded?", !!user);
  // console.log("user ID:", user?.user_id);
  // console.log("isMutedOrMutee:", isMutedOrMutee);

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-users">
        {shouldDisplayInfo ? (
          <div className="user-row-social">
            <div className="user-info">
              {imageExistsMap[user.user_id] ? (
                <img
                  className="user-row-social-small-img"
                  onClick={() => setShowLargePicture(user.user_id)}
                  src={`${BACKEND}/media/profile_pictures/${user.user_id}/profilePicture.jpg?v=${profilePictureKey}`}
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
                <div className={`${isNavOpen ? 'large-picture-squeezed' : 'large-picture'}`} onClick={() => setShowLargePicture(null)}>
                  <img
                    className="users-all-picture-large"
                    src={`${BACKEND}/media/profile_pictures/${user.user_id}/profilePicture.jpg?v=${profilePictureKey}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/profilePicture.jpg';
                    }}
                    alt="Profile"
                  />
                </div>
              )}

              <p>{user.username.startsWith('inactive') ? 'Inactive User' : user.username}</p>
            </div>

            {loggedInUser !== user.user_id && (
              <div className="user-info-buttons">
                {followersAndFollowee.some(f => f.follower_id === user.user_id && f.status === "accepted") &&
                  followersAndFollowee.some(f => f.followee_id === user.user_id && f.status === "accepted") &&
                  superAdminSettings.showMessagesFeature &&
                  adminSettings.showMessagesFeature && (
                    <button onClick={() => navigate(`/messages/${user.user_id}`)}>
                      <FontAwesomeIcon icon={faEnvelope} style={{ cursor: "pointer" }} />
                    </button>
                  )}

                {superAdminSettings.showSocialFeature && adminSettings.showSocialFeature &&
                  <FollowUserButton
                    followeeId={user.user_id}
                    followerId={loggedInUser}
                    followersAndFollowee={followersAndFollowee}
                    setFollowersAndFollowee={setFollowersAndFollowee}
                    userLoggedInObject={auth}
                    setError={setError}
                  />
                }


                {superAdminSettings.showSocialFeature && adminSettings.showSocialFeature &&
                  superAdminSettings.allowMute && adminSettings.allowMute &&
                  <MuteUserButton
                    userId={user.user_id}
                    userLoggedin={loggedInUser}
                    onMutedChange={handleMutedChanges}
                    setMutedUsers={setMutedUsers}
                    setError={setError}
                    isMuted={mutedUsers.some(mute =>
                      (mute.muter === user.user_id && mute.mutee === loggedInUser) ||
                      (mute.muter === loggedInUser && mute.mutee === user.user_id)
                    )}
                  />
                }


              </div>
            )}
          </div>
        ) : (
          <p>{t('socialOneUser.noInfoAvailable')}</p>
        )}
      </div>
    </div>
  );
}
