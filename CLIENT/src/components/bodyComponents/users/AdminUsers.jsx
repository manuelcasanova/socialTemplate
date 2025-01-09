import Footer from "../../mainComponents/footer";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import '../../../css/AdminUsers.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import useAuth from "../../../hooks/useAuth";
import FilterAdminUsers from "./FilterAdminUsers";



export default function AdminUsers({ isNavOpen }) {
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [expandedUserId, setExpandedUserId] = useState(null);
  const { auth } = useAuth();
  const loggedInUser = auth.userId

  // Reset the error message whenever filters change
  useEffect(() => {
    setError(null); // Clear error when filters change
  }, [filters]);

  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      try {
        // Fetch users and roles
        const [usersResponse, rolesResponse] = await Promise.all([
          axiosPrivate.get(`/users/`, { params: filters }),
          axiosPrivate.get(`/roles/`) // Fetch roles via the server route
        ]);

        setUsers(usersResponse.data); // Set user data
        setRoles(rolesResponse.data); // Set roles from the server

      } catch (err) {
        setError(`Failed to fetch data: ${err.response.data.error}`);
        console.error(err);
      }
    };

    fetchUsersAndRoles();
  }, [axiosPrivate, filters]);

  const handleViewMore = (userId) => {
    setExpandedUserId((prevId) => (prevId === userId ? null : userId));
  };

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
      setError(`${error.response.data.error}`);
    }
  };

  return (
    <div className={`body-footer ${isNavOpen ? "body-footer-squeezed" : ""}`}>
      <div className="body admin-users">
        <h2>Admin Users</h2>
        {error && <p className="error-message">{error}</p>}
        <FilterAdminUsers
          roles={roles}
          setFilters={setFilters}
          setExpandedUserId={setExpandedUserId}
        />
        <div className="users-container">
          {users.length > 0 ? (
            users.map((user) =>
              expandedUserId === null || expandedUserId === user.user_id ? (
                <div className="user-row" key={user.user_id}>
                  <div className="user-info">
                    {expandedUserId !== user.user_id && <p>{`${user.username} `}</p>}
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
                          src={`http://localhost:3500/media/profile_pictures/${user.user_id}/profilePicture.jpg`}
                          alt={`${user.username}'s profile image`}
                          className="admin-profile-image"
                          onError={(e) => {
                            e.target.style.display = "none";  // Hide broken image
                            // You could also show the fallback icon in the next line if needed
                            e.target.nextSibling.style.display = "inline-block";  // Show icon
                          }}
                        />
                        {/* Display FontAwesome icon if image is not found */}
                        <FontAwesomeIcon
                          icon={faUser}
                          className="admin-profile-image"
                          style={{ display: 'none' }}  // Initially hidden
                        />
                      </div>
                      <p><strong>Username:</strong> {user.username}</p>
                      <p><strong>E-mail:</strong> {user.email}</p>
                      <p><strong>Active:</strong> {user.is_active ? "Yes" : "No"}</p>
                      <p><strong>Verified:</strong> {user.is_verified ? "Yes" : "No"}</p>
                      <p><strong>Location:</strong> {user.location}</p>
                      <h4>Roles</h4>
                      <ul>
                        {roles.map((role, index) => (
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

                    </div>
                  )}
                </div>
              ) : null
            )
          ) : (
            <p>No users found</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
