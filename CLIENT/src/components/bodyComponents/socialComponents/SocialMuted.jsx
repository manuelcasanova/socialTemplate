
import { useState, useEffect, useRef } from "react";

//Hooks

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

//Context
import { useGlobalSuperAdminSettings } from "../../../context/SuperAdminSettingsProvider";
import { useGlobalAdminSettings } from "../../../context/AdminSettingsProvider";

//Styling

import '../../../css/AdminUsers.css';

//Components
// import filterUsers
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import MuteUserButton from "./socialButtons/MuteUserButton";
import Error from "../Error";
import FilterUsername from "./FilterUsername";

//Util functions
import fetchUsers from "./util_functions/FetchUsers";
import fetchMutedUsers from "./util_functions/FetchMutedUsers";

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

export default function SocialMuted({ isNavOpen }) {
  const { superAdminSettings } = useGlobalSuperAdminSettings();
  const { adminSettings } = useGlobalAdminSettings();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const loggedInUser = auth.userId
  const [users, setUsers] = useState([]);
  const [mutedUsers, setMutedUsers] = useState([]);
  const [showInfo, setShowInfo] = useState(false)

  const mutedUsersWithName = users.filter(user => {
    return mutedUsers.some(mute => mute.mute && mute.muter === loggedInUser && mute.mutee === user.user_id);
  }).map(user => ({
    user_id: user.user_id,
    username: user.username
  }));


  const [hasMutedChanges, setHasMutedChanges] = useState(false);
  const [imageExistsMap, setImageExistsMap] = useState({});
  const [showLargePicture, setShowLargePicture] = useState(null)

  const [filterUsername, setFilterUsername] = useState("");

  const inputRef = useRef(null);

  // Reset the error message whenever filters change
  useEffect(() => {
    setError(null); // Clear error when filters change
  }, [filters, filterUsername]);

  useEffect(() => {
    fetchUsers(filters, setUsers, setIsLoading, setError, filterUsername)
    {
      // superAdminSettings.allowMute && adminSettings.allowMute && (Comment in if you prefer to not show the list of muted users if allowMute is false. Comment in as well the dependency array)
      fetchMutedUsers(filters, setMutedUsers, setIsLoading, setError, loggedInUser)
    }
  }, [axiosPrivate, filters, hasMutedChanges, filterUsername
    //, superAdminSettings, adminSettings
  ]);

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

  const handleShowInfo = () => {
    setShowInfo(prev => !prev)
  }

  if (!superAdminSettings || !adminSettings) {
    return <LoadingSpinner />;
  }

  if (isLoading) {
    <LoadingSpinner />
  }

  if (error) {
    return <Error isNavOpen={isNavOpen} error={error} />
  }


  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-users">
        <div className="muted-users-title">
          <h2>Muted Users
            <button
              className='info-button'
              onClick={handleShowInfo}
            >i</button>

          </h2>



        </div>

        {showInfo && (
          <div className='info-message'>You cannot interact with users you've muted, and they will not be able to interact with you either.</div>

        )}

        <FilterUsername filterUsername={filterUsername} setFilterUsername={setFilterUsername} inputRef={inputRef} />

        <div className="users-container">
          {mutedUsersWithName.length > 0 ? (


            mutedUsersWithName.map((user) =>

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

                    <img
                      className="user-row-social-small-img "
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
                          if (e.target.src !== `${BACKEND}/media/profile_pictures/s/profilePicture.jpg`) {
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

                <MuteUserButton
                  userId={user.user_id}
                  userLoggedin={loggedInUser}
                  isMuted={mutedUsers.some(mute =>
                    (mute.muter === user.user_id && mute.mutee === loggedInUser) ||
                    (mute.muter === loggedInUser && mute.mutee === user.user_id)
                  )}
                  setMutedUsers={setMutedUsers}
                  onMutedChange={handleMutedChanges}
                />


              </div>

            )
          ) : (
            <p>No users found</p>
          )}
        </div>



      </div>
    </div>
  )
}