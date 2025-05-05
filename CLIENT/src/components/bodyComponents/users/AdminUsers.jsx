
import { useState, useEffect } from "react";

//Context
import { useGlobal } from "../../../context/GlobalProvider";

//Hooks
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

//Util functions

import { fetchCustomRoles } from "../../bodyComponents/rolesComponents/fetchRoles";

//Styling
import '../../../css/AdminUsers.css';

//Components

import FilterAdminUsers from "./FilterAdminUsers";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";



export default function AdminUsers({ isNavOpen }) {
  const axiosPrivate = useAxiosPrivate();
  const { postFeatures } = useGlobal();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [customRoles, setCustomRoles] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useAuth();
  const isSuperAdmin = auth.roles.includes('SuperAdmin');

  const loggedInUser = auth.userId
  const BACKEND = process.env.REACT_APP_BACKEND_URL;

  // Reset the error message whenever filters change
  useEffect(() => {
    setError(null); // Clear error when filters change
  }, [filters]);

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const response = await fetchCustomRoles();
        setCustomRoles(response);
      } catch (err) {
        console.error("Error fetching roles:", err);

        let errorMsg = "Failed to fetch roles.";
        if (err.response?.data?.error) {
          errorMsg += ` ${err.response.data.error}`;
        } else if (err.message) {
          errorMsg += ` ${err.message}`;
        }

        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);


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

      } catch (err) {
        console.error("Error fetching users:", err);

        let errorMsg = "Failed to fetch users.";
        if (err.response?.data?.error) {
          errorMsg += ` ${err.response.data.error}`;
        } else if (err.message) {
          errorMsg += ` ${err.message}`;
        }

        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersAndRoles();
  }, [axiosPrivate, filters]);

  const handleViewMore = (userId) => {
    setExpandedUserId((prevId) => (prevId === userId ? null : userId));
  };

  const handleShowDelete = () => {
    setShowConfirmDelete(prev => !prev)
  }

  const handleRoleChange = async (user, role, checked) => {
    try {
      await axiosPrivate.put(`/users/${user.user_id}/roles`, {
        roles: checked ? [...user.roles, role] : user.roles.filter((r) => r !== role),
        loggedInUser
      });

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.user_id === user.user_id
            ? { ...u, roles: checked ? [...u.roles, role] : u.roles.filter((r) => r !== role) }
            : u
        )
      );

    } catch (error) {
      console.error("Error updating roles", error);
      const errorMsg = error?.response?.data?.error || error?.message || "Failed to update roles.";
      setError(errorMsg);
    }

  };

  // const handleDeleteUser = async (userId, loggedInUser) => {
  //   try {

  //     console.log('User ID:', userId);
  //     console.log('Logged In User:', loggedInUser);

  //   } catch (error) {
  //     console.error("Error deleting user", error);
  //     setError(`${error.response?.data?.error || 'An error occurred'}`);
  //   }
  // };

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
      <div className="admin-users">
        <h2>Admin Users</h2>
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
              users.map((user) =>
                expandedUserId === null || expandedUserId === user.user_id ? (
                  <div className="user-row" key={user.user_id}>
                    <div className="user-info">
                      {expandedUserId !== user.user_id && <p>
                        {user.username.startsWith('inactive') ? 'Inactive User' : user.username}
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
                            src={`${BACKEND}/media/profile_pictures/${user.user_id}/profilePicture.jpg`}
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
                          <strong>Username:</strong> {user.username.startsWith('inactive') ? 'Inactive User' : user.username}
                        </p>
                        <p><strong>E-mail:</strong> {user.email}</p>
                        <p><strong>Verified:</strong> {user.is_verified ? "Yes" : "No"}</p>
                        <p><strong>Active:</strong> {user.is_active ? "Yes" : "No"}</p>
                        {(postFeatures.allowManageRoles || isSuperAdmin) &&
                          <>
                            <h4>Roles</h4>
                            <ul>
                              {/* {console.log('Filtered roles:', roles.filter(role => postFeatures.showSubscriberFeature || role !== "User_subscribed"))} */}
                              {roles
                                .filter(role => postFeatures.showSubscriberFeature || role !== "User_subscribed")
                                .map((role, index) => (
                                  <li key={index}>
                                    <input
                                      type="checkbox"
                                      className="checkbox"
                                      checked={user.roles.includes(role)}
                                      onChange={(e) => {
                                        setError("");  // Clear any previous error when the checkbox is clicked
                                        handleRoleChange(user, role, e.target.checked); // Pass the full user object here
                                      }}
                                    />
                                    {role}
                                  </li>
                                ))}
                            </ul>

                          </>
                        }
                        <h4>Last login</h4>
                        {user.login_history.length > 0 ? (
                          <ul>
                            <li>
                              {(() => {
                                const lastLogin = new Date(user.login_history[user.login_history.length - 1]);
                                return lastLogin.toLocaleString('en-US', {
                                  weekday: 'long',  // Full name of the weekday (e.g., "Monday")
                                  month: 'long',    // Full name of the month (e.g., "December")
                                  day: 'numeric',   // Day of the month (e.g., "9")
                                  year: 'numeric',  // Full year (e.g., "2024")
                                  hour: '2-digit',  // Hour in 12-hour format (e.g., "5")
                                  minute: '2-digit',// Minutes (e.g., "42")
                                  hour12: true      // Use 12-hour clock with AM/PM
                                });
                              })()}
                            </li>

                          </ul>
                        ) : (
                          <p>No login history available</p>
                        )}


                        {(postFeatures.allowDeleteUsers || isSuperAdmin) &&
                          <>
                            {
                              !showConfirmDelete && !user.email.startsWith('deleted-') && (
                                <div className="delete-user">
                                  <button
                                    className="button-red"
                                    onClick={handleShowDelete}
                                  >Delete user</button>
                                </div>
                              )
                            }

                            {
                              showConfirmDelete && !user.email.startsWith('deleted-') && (
                                <div className="delete-confirmation">
                                  <p>Are you sure you want to delete this user? This action is permanent and cannot be undone.</p>
                                  <button className="button-white" onClick={handleShowDelete}>x</button>
                                  <button
                                    className="button-red"
                                    disabled={isLoading}
                                    onClick={() => handleDeleteUser(user.user_id, loggedInUser)}
                                  >{isLoading ? <LoadingSpinner /> : 'Confirm delete'}</button>

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
              <p>No users found</p>
            )}
          </div>
        }


      </div>
    </div>
  );
}
