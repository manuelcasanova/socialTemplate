
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
// import filterUsers
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import MuteUserButton from "./socialButtons/MuteUserButton";
import Error from "../Error";
import FilterUsername from "./FilterUsername";

//Util functions
import fetchUsers from "./util_functions/FetchUsers";
import fetchMutedUsers from "./util_functions/FetchMutedUsers";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

export default function SocialMuted({ isNavOpen, profilePictureKey }) {
  const { superAdminSettings } = useGlobalSuperAdminSettings();
  const { adminSettings } = useGlobalAdminSettings();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { screenSize } = useContext(ScreenSizeContext);
  const { isSmartphone, isTablet, isDesktop, width } = screenSize;
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

  const [showLargePicture, setShowLargePicture] = useState(null)

  const [filterUsername, setFilterUsername] = useState("");
  const [submittedFilterUsername, setSubmittedFilterUsername] = useState('');

  const inputRef = useRef(null);

  // Reset the error message whenever filters change
  useEffect(() => {
    setError(null); // Clear error when filters change
  }, [filters, filterUsername]);

  useEffect(() => {
    fetchUsers(filters, setUsers, setIsLoading, setError, submittedFilterUsername)
    {
      // superAdminSettings.allowMute && adminSettings.allowMute && (Comment in if you prefer to not show the list of muted users if allowMute is false. Comment in as well the dependency array)
      fetchMutedUsers(filters, setMutedUsers, setIsLoading, setError, loggedInUser)
    }
  }, [axiosPrivate, filters, hasMutedChanges, submittedFilterUsername
    //, superAdminSettings, adminSettings
  ]);


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

        <FilterUsername filterUsername={filterUsername} setFilterUsername={setFilterUsername} inputRef={inputRef} onSearch={() => setSubmittedFilterUsername(filterUsername)} />

        <div className="users-container">
          {mutedUsersWithName.length > 0 ? (


            mutedUsersWithName.map((user) =>

              <div className="user-row-social" key={user.user_id} style={{ flexDirection: 'row' }}>
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