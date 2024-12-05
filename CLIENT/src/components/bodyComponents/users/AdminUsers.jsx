import Footer from "../../mainComponents/footer";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import '../../../css/AdminUsers.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Add any other icons you need



export default function AdminUsers({ isNavOpen }) {
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]); // All roles from the database
  const [error, setError] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);


  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      try {
        // Fetch users and roles
        const [usersResponse, rolesResponse] = await Promise.all([
          axiosPrivate.get(`/users/`),
          axiosPrivate.get(`/roles/`) // Fetch roles via the server route
        ]);

        setUsers(usersResponse.data); // Set user data
        setRoles(rolesResponse.data); // Set roles from the server
        console.log(roles, users)
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      }
    };

    fetchUsersAndRoles();
  }, [axiosPrivate]);

  const handleViewMore = (userId) => {
    setExpandedUserId((prevId) => (prevId === userId ? null : userId));
  };

  return (
    <div className={`body-footer ${isNavOpen ? "body-footer-squeezed" : ""}`}>
      <div className="body admin-users">
        <h2>Admin Users</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="users-container">
          {users.length > 0 ? (
            users.map((user) =>
              expandedUserId === null || expandedUserId === user.user_id ? (
                <div className="user-row" key={user.user_id}>
                  <div className="user-info">
                    <p>{`${user.username} - ${user.email}`}</p>
                    <button onClick={() => handleViewMore(user.user_id)}>
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
                              defaultChecked={user.roles.includes(role)}
                              disabled
                            />
                            {role}
                          </li>
                        ))}
                      </ul>
                      <h4>Login History</h4>
                      {user.login_history.length > 0 ? (
                        <ul>
                          {user.login_history.map((entry, index) => (
                            <li key={index}>{entry}</li>
                          ))}
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
