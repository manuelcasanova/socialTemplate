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

//Util functions
import fetchUsers from "./util_functions/FetchUsers";
import fetchMutedUsers from "./util_functions/FetchMutedUsers";
import fetchFollowee from "./util_functions/FetchFollowee";

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

export default function SocialFollowee({ isNavOpen }) {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const loggedInUser = auth.userId;
  const [users, setUsers] = useState([]);
  const [followee, setFollowee] = useState([]); // Replaced followersAndFollowee with followee
  const [mutedUsers, setMutedUsers] = useState([]);
  const userIDsExceptMe = followee.map(user => user.user_id);
  const allUsersMutedOrMe = userIDsExceptMe.every(userId =>
    mutedUsers.some(mute => (mute.muter === userId || mute.mutee === userId) && mute.mute)
  );

  console.log("followee", followee)
  console.log("loggedinuser", loggedInUser)

  const [hasMutedChanges, setHasMutedChanges] = useState(false);
  const [imageExistsMap, setImageExistsMap] = useState({});
  const [showLargePicture, setShowLargePicture] = useState(null);

  // Reset the error message whenever filters change
  useEffect(() => {
    setError(null); // Clear error when filters change
  }, [filters]);

  useEffect(() => {
    fetchUsers(filters, setUsers, setIsLoading, setError);
    fetchMutedUsers(filters, setMutedUsers, setIsLoading, setError, loggedInUser);
    fetchFollowee(filters, setFollowee, setIsLoading, setError, loggedInUser); // Replaced fetchFollowersAndFollowee
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

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-users">
        <h2>Social - Following</h2>

        {allUsersMutedOrMe ? (
          <p>No users available or all users are muted.</p>
        ) : (
          <div className="users-container">
           {followee.length > 0 ? (
  followee.map((follow) => {
    // Find the user in the 'users' array based on followee_id (or follower_id)
    const user = users.find((u) => u.user_id === follow.followee_id); // or follow.follower_id based on your requirement

    if (user) {
      return (
        <div className="user-row-social" key={follow.followee_id}>
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
                  className="users-all-picture-large"
                  onClick={() => setShowLargePicture(null)}
                  src={`${BACKEND}/media/profile_pictures/${user.user_id}/profilePicture.jpg`}
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop in case of repeated error
                    e.target.src = `${BACKEND}/media/profile_pictures/user.png`;
                  }}
                />
              </div>
            )}

            <p>
              {user.username.startsWith('inactive') ? 'Inactive User' : user.username}
            </p>
          </div>

          <MuteUserButton
            userId={user.user_id}
            userLoggedin={loggedInUser}
            setMutedUsers={setMutedUsers}
            onMutedChange={handleMutedChanges}
          />
        </div>
      );
    }

    return null;
  })
) : (
  <p>No users found</p>
)}
          </div>
        )}
      </div>
    </div>
  );
}
