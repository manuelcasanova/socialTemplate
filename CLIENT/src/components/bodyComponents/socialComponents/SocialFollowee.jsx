import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

//Hooks

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

//Context 
import { useGlobalSuperAdminSettings } from "../../../context/SuperAdminSettingsProvider";
import { useGlobalAdminSettings } from "../../../context/AdminSettingsProvider";
import ScreenSizeContext from "../../../context/ScreenSizeContext";

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
import fetchFollowee from "./util_functions/FetchFollowee";
import fetchFollowersAndFollowee from "./util_functions/FetchFollowersAndFollowee";

//Translation
import { useTranslation } from 'react-i18next';

const BACKEND = process.env.REACT_APP_BACKEND_URL;


export default function SocialFollowee({ isNavOpen, profilePictureKey }) {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const isSuperAdmin = auth.roles.includes('SuperAdmin');
  const axiosPrivate = useAxiosPrivate();
  const { superAdminSettings } = useGlobalSuperAdminSettings();
  // console.log(superAdminSettings)
  const { adminSettings } = useGlobalAdminSettings();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { screenSize } = useContext(ScreenSizeContext);
  const { isSmartphone, isTablet, isDesktop, width } = screenSize;
  const [filters, setFilters] = useState({});
  const loggedInUser = auth.userId;
  const [users, setUsers] = useState([]);
  const [followee, setFollowee] = useState([]);
  const [followersAndFollowee, setFollowersAndFollowee] = useState([])
  const [mutedUsers, setMutedUsers] = useState([]);
  const userIDsExceptMe = followee.map(user => user.user_id);
  const allUsersMutedOrMe = userIDsExceptMe.every(userId =>
    mutedUsers.some(mute => (mute.muter === userId || mute.mutee === userId) && mute.mute)
  );

  const [hasMutedChanges, setHasMutedChanges] = useState(false);
  const [showLargePicture, setShowLargePicture] = useState(null);
  const [filterUsername, setFilterUsername] = useState("");
  const [submittedFilterUsername, setSubmittedFilterUsername] = useState('');

  const inputRef = useRef(null);

  // Reset the error message whenever filters change
  useEffect(() => {
    setError(null); // Clear error when filters change
  }, [filters, filterUsername]);

  useEffect(() => {
    if (superAdminSettings.showSocialFeature && adminSettings.showSocialFeature) {
      fetchUsers(filters, setUsers, setIsLoading, setError, submittedFilterUsername);
    }
    if (superAdminSettings.allowMute && adminSettings.allowMute) {
      fetchMutedUsers(filters, setMutedUsers, setIsLoading, setError, loggedInUser);
    }
    if (superAdminSettings.allowFollow && adminSettings.allowFollow) {
      fetchFollowee(filters, setFollowee, setIsLoading, setError, loggedInUser);
    }
    if (superAdminSettings.allowFollow && adminSettings.allowFollow) {
      fetchFollowersAndFollowee(filters, setFollowersAndFollowee, setIsLoading, setError, loggedInUser)
    }
  }, [axiosPrivate, filters, hasMutedChanges, submittedFilterUsername, adminSettings, superAdminSettings]);

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

  // Filter the followee list to remove muted users
  const filteredFollowee = followee.filter(follow => {
    const user = users.find(u => u.user_id === follow.followee_id);
    return !mutedUsers.some(mute => (mute.muter === loggedInUser && mute.mutee === follow.followee_id && mute.mute));
  });

  const visibleFollowee = filteredFollowee.filter(follow => {
    const isFolloweeSuperAdmin = follow.roles.includes("SuperAdmin");
    return !(isFolloweeSuperAdmin && !(isSuperAdmin || superAdminSettings.showSuperAdminInSocial));
  });

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-users">
        <h2>{t('socialFollowee.title')}</h2>

        <FilterUsername filterUsername={filterUsername} setFilterUsername={setFilterUsername} inputRef={inputRef} onSearch={() => setSubmittedFilterUsername(filterUsername)} />

        {visibleFollowee.length === 0 ? (
          <p>{t('socialFollowee.noUsers')}</p>
        ) : (
          <div className="users-container">

            {visibleFollowee.map((follow) => {

              // Find the user details for the followee
              const user = users.find((u) => u.user_id === follow.followee_id);

              if (user) {
                return (
                  <div className="user-row-social" key={follow.followee_id}>
                    <div className="user-info">
                      <img
                        className="user-row-social-small-img"
                        onClick={() => setShowLargePicture(user.user_id)}
                        src={`${BACKEND}/media/profile_pictures/${user.user_id}/profilePicture.jpg?v=${profilePictureKey}`}
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
                            src={`${BACKEND}/media/profile_pictures/${user.user_id}/profilePicture.jpg?v=${profilePictureKey}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/profilePicture.jpg';
                            }}
                            alt="Large Profile"
                          />
                        </div>
                      )}

                      <p>
                        {user.username.startsWith('inactive') ? t('socialFollowee.inactiveUser') : user.username}
                      </p>
                    </div>

                    {loggedInUser !== user.user_id &&

                      <>

                        <div className="user-info-buttons">
                          {
                            followersAndFollowee.some(f =>
                              f.follower_id === user.user_id && f.status === "accepted"
                            ) &&
                            followersAndFollowee.some(f =>
                              f.followee_id === user.user_id && f.status === "accepted"
                            ) &&
                            superAdminSettings.showMessagesFeature &&
                            adminSettings.showMessagesFeature && (
                              <button onClick={() => navigate(`/messages/${user.user_id}`)}>
                                <FontAwesomeIcon
                                  icon={faEnvelope}
                                  style={{ cursor: "pointer" }}
                                  title={t('socialFollowee.messagesButtonTitle')}
                                />
                              </button>
                            )
                          }





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
                        </div>
                      </>}
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