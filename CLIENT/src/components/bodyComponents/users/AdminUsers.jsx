
import { useState, useEffect, useCallback, useRef } from "react";

//Context
import { useGlobalSuperAdminSettings } from "../../../context/SuperAdminSettingsProvider";

//Hooks
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

//Styling
import '../../../css/AdminUsers.css';

//Components

import FilterAdminUsers from "./FilterAdminUsers";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";

//Util functions
import { formatDate } from '../../bodyComponents/postsComponents/util_functions/formatDate'

//Translation
import { useTranslation } from 'react-i18next';


export default function AdminUsers({ isNavOpen, customRoles, setCustomRoles, profilePictureKey }) {
  const { t, i18n } = useTranslation();
  const axiosPrivate = useAxiosPrivate();
  const { superAdminSettings } = useGlobalSuperAdminSettings();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [error, setError] = useState('');
  const prevError = useRef(null);
  const [filters, setFilters] = useState({ is_active: true });

  const [expandedUserId, setExpandedUserId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useAuth();
  const isSuperAdmin = auth.roles.includes('SuperAdmin');
  const loggedInUser = auth.userId
  const BACKEND = process.env.REACT_APP_BACKEND_URL;

  // console.log("Current error state:", error);
  // console.log("Users:", users);

  // Reset the error message whenever filters change
  useEffect(() => {
    setError(null);
  }, [filters]);

  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      setIsLoading(true)
      try {
        // Fetch users and roles
        const [usersResponse, rolesResponse] = await Promise.all([
          axiosPrivate.get(`/users/`, { params: filters }),
          axiosPrivate.get(`/roles/`) // Fetch roles via the server route
        ]);

        // console.log("usersResponse.data", usersResponse.data)

        setUsers(usersResponse.data); // Set user data
        setRoles(rolesResponse.data); // Set roles from the server
        prevError.current = null; // Clear previous error tracking
      } catch (err) {
        console.error("Error fetching users:", err);

        let errorMsg = t('adminUsers.errorFetching');
        if (err.response?.data?.error) {
          errorMsg += ` ${err.response.data.error}`;
        } else if (err.message) {
          errorMsg += ` ${err.message}`;
        }

        // Prevent redundant setState
        if (errorMsg !== prevError.current) {
          prevError.current = errorMsg;
          setError(errorMsg);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersAndRoles();
  }, [
    filters
  ]);

  const handleViewMore = (userId) => {
    setExpandedUserId((prevId) => (prevId === userId ? null : userId));
    setError('')
    setShowConfirmDelete(false);
  };

  const handleShowDelete = () => {
    setShowConfirmDelete(prev => !prev)
  }

  const handleRoleChange = useCallback(async (user, role, checked) => {

    try {
      await axiosPrivate.put(`/users/${user.user_id}/roles`, {
        roles: checked ? [...user.roles, role] : user.roles.filter((r) => r !== role),
        loggedInUser
      });

      // Update state only if needed
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.user_id === user.user_id
            ? { ...u, roles: checked ? [...u.roles, role] : u.roles.filter((r) => r !== role) }
            : u
        )
      );
      prevError.current = null;
    } catch (error) {
      // console.log("Caught error status:", error?.response?.status);
      console.error("Error updating roles", error);
      const errorMsg = error?.response?.data?.error || error?.message || "Failed to update roles.";
      // console.log('errorMsg', errorMsg)
      // if (errorMsg !== prevError.current) {
      //   prevError.current = errorMsg; // Store the error in the ref
      //   setError(errorMsg);  // Update the state to show the error message
      // }
      setError(errorMsg);
      prevError.current = errorMsg;
    }
  }, [isSuperAdmin]);


  const handleDeleteUser = async (userId, loggedInUser) => {
    setIsLoading(true)
    try {


      setTimeout(async () => {
        try {


          setError(null)
          const response = await axiosPrivate.delete(`/users/harddelete/${userId}`, {
            data: { loggedInUser },
          });

          // Forget any expanded user details and re-render the list normally." This resolves the issue where the list would remain empty after deleting a user. UI doesn't look for the expanded details of a non-existing user. 
          setExpandedUserId(null)

          setShowConfirmDelete(false)

          setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== userId));

        } catch (error) {
          console.error("Error updating roles", error);
          const errorMsg = error?.response?.data?.error || error?.message || "Failed to update roles.";
          setError(errorMsg);


        } finally {
          setIsLoading(false);
        }
      }, 1000);
    } catch (error) {
      console.error("Error initiating delete action", error);
      setIsLoading(false); // Stop loading if something goes wrong before timeout
    }
  };


  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-users" style={{ minHeight: '500px' }}>
        <h2>{t('adminUsers.title')}</h2>
        {error && <p className="error-message">{error}</p>}
        <FilterAdminUsers
          roles={roles}
          setFilters={setFilters}
          setExpandedUserId={setExpandedUserId}
        />
        {isLoading ? (
          <LoadingSpinner />
        ) :
          <div className="users-container">

            {users.length > 0 ? (

              users

                .filter(user => {
                  const isUserSuperAdmin = user.roles.includes('SuperAdmin');
                  if (isUserSuperAdmin && !superAdminSettings.showSuperAdminInUsersAdmin && !isSuperAdmin) {
                    return false;
                  }
                  if (!user.admin_visibility && user.user_id !== loggedInUser) {
                    return false;
                  }
                  return true;
                })

                .map((user) =>

                  expandedUserId === null || expandedUserId === user.user_id ? (
                    <div className="user-row" key={user.user_id}>
                      <div className="user-info">
                        {expandedUserId !== user.user_id && <p>
                          {user.username.startsWith('inactive') ? t('adminUsers.inactiveUser') : user.username}
                        </p>}
                        <button onClick={() => handleViewMore(user.user_id)}
                          className={expandedUserId === user.user_id ? "user-info-expanded" : ""}
                        >
                          {expandedUserId === user.user_id ? "-" : "+"}
                        </button>
                      </div>

                      {expandedUserId === user.user_id && (

                        <div className="user-details">
                          <div className="admin-profile-image-container">
                            <img
                              src={`${BACKEND}/media/profile_pictures/${user.user_id}/profilePicture.jpg?v=${profilePictureKey}`}
                              alt={user.username.startsWith('inactive') ? 'Inactive User profile image' : `${user.username}'s profile image`}

                              className="admin-profile-image"
                              onError={(e) => {
                                e.target.style.display = "none";  // Hide broken image
                                // You could also show the fallback icon in the next line if needed
                                e.target.nextSibling.style.display = "inline-block";  // Show icon
                              }}
                            />
                            {/* Display FontAwesome icon if image is not found */}

                            <img
                              className="user-row-social-small-img"
                              src={`${BACKEND}/media/profile_pictures/profilePicture.jpg`}
                              alt="Profile"
                              style={{ display: 'none' }}  // Initially hidden
                            />
                          </div>
                          <p>
                            <strong>{t('adminUsers.usernameLabel')}</strong> {user.username.startsWith('inactive') ? 'Inactive User' : user.username}
                          </p>
                          <p><strong>{t('adminUsers.emailLabel')}</strong> {user.email}</p>
                          <p><strong>{t('adminUsers.verifiedLabel')}</strong> {user.is_verified ? t('adminUsers.yes') : t('adminUsers.no')}</p>
                          <p><strong>{t('adminUsers.activeLabel')}</strong> {user.is_active ? t('adminUsers.yes') : t('adminUsers.no')}</p>
                          {
                            (superAdminSettings.allowManageRoles || isSuperAdmin) &&
                            <>
                              <h4>{t('adminUsers.rolesHeading')}</h4>
                              <ul>

                                {[...new Set([
                                  ...roles.filter(role => isSuperAdmin || role !== 'SuperAdmin'),
                                  ...(customRoles?.map(r => r.role_name) || []),
                                  ...(isSuperAdmin ? ['SuperAdmin'] : []),  // Only include SuperAdmin if the user is a SuperAdmin
                                ])].map((role, index) => (
                                  <li key={index} className={role === 'SuperAdmin' || role === 'Admin' || role === 'User_registered' ? 'disabled-role' : ''}>
                                    <input
                                      type="checkbox"
                                      className="checkbox"
                                      checked={user.roles.includes(role)}
                                      disabled={
                                        role === 'User_registered' ||
                                        !(isSuperAdmin || role !== 'SuperAdmin' && role !== 'Admin'
                                        )}
                                      onChange={(e) => {
                                        if (isSuperAdmin || (role !== 'SuperAdmin' && role !== 'Admin')) {
                                          setError("");  // Clear any previous error when the checkbox is clicked
                                          handleRoleChange(user, role, e.target.checked); // Handle the role change
                                        }
                                      }}
                                    />
                                    <span className={role === 'SuperAdmin' || role === 'Admin' ? 'disabled-role-text' : ''}>
                                      {role}
                                    </span>
                                  </li>
                                ))}



                              </ul>

                            </>
                          }


                          <h4>{t('adminUsers.lastLoginHeading')}</h4>
                          {user.login_history.length > 0 ? (
                            <ul>
                              <li>
                                {(() => {
                                  const lastLogin = new Date(
                                    user.login_history[user.login_history.length - 1]
                                  );
                                  // Build an Intl.DateTimeFormat with the current locale:
                                  return new Intl.DateTimeFormat(i18n.language, {
                                    weekday: 'long',     // e.g. “Monday” / “lunes”
                                    month: 'long',     // e.g. “December” / “diciembre”
                                    day: 'numeric',  // e.g. “9”
                                    year: 'numeric',  // e.g. “2024”
                                    hour: '2-digit',  // e.g. “05”
                                    minute: '2-digit',  // e.g. “42”
                                    hour12: !i18n.language.startsWith('es')
                                  }).format(lastLogin);
                                })()}
                              </li>
                            </ul>
                          ) : (
                            <p>{t('adminUsers.noLoginHistory')}</p>
                          )}


                          {
                            (superAdminSettings.allowDeleteUsers || isSuperAdmin) &&
                            <>
                              {
                                !showConfirmDelete && !user.email.startsWith('deleted-') && (
                                  <div className="delete-user">
                                    <button
                                      className="button-red"
                                      onClick={handleShowDelete}
                                    >{t('adminUsers.deleteUser')}</button>
                                  </div>
                                )
                              }

                              {
                                showConfirmDelete && !user.email.startsWith('deleted-') && (
                                  <div className="delete-confirmation">
                                    <p>{t('adminUsers.deleteConfirmation')}</p>
                                    <button className="button-white" onClick={handleShowDelete}>x</button>
                                    <button
                                      className="button-red"
                                      disabled={isLoading}
                                      onClick={() => handleDeleteUser(user.user_id, loggedInUser)}
                                    >{isLoading ? <LoadingSpinner /> : t('adminUsers.confirmDelete')}</button>

                                  </div>
                                )
                              }
                            </>}


                        </div>
                      )}
                    </div>
                  ) : null
                )



            ) : (
              <p>{t('adminUsers.noUsersFound')}</p>
            )}
          </div>
        }


      </div>
    </div>
  );
}
