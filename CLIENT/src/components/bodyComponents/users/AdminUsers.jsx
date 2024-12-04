import Footer from "../../mainComponents/footer";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import '../../../css/AdminUsers.css'

export default function AdminUsers({ isNavOpen }) {
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosPrivate.get("/users/");
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
        console.error(err);
      }
    };

    fetchUsers();
  }, [axiosPrivate]);

  const handleViewMore = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.user_id === userId
          ? { ...user, isExpanded: !user.isExpanded }
          : user
      )
    );
  };

  return (
    <div className={`body-footer ${isNavOpen ? "body-footer-squeezed" : ""}`}>
      <div className="body admin-users">
        <h2>Admin Users</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="users-container">
          {users.length > 0 ? (
            users.map((user) => (
              <div className="user-row" key={user.user_id}>
                <div className="user-info">
                  <p>{user.username} - {user.email}</p>
                  <button onClick={() => handleViewMore(user.user_id)}>
                    {user.isExpanded ? "Show Less" : "View More"}
                  </button>
                </div>

                {user.isExpanded && (
                  <div className="user-details">
                    <p><strong>Active:</strong> {user.is_active ? "Yes" : "No"}</p>
                    <p><strong>Verified:</strong> {user.is_verified ? "Yes" : "No"}</p>
                    <p><strong>Location:</strong> {user.location}</p>
                    <h4>Roles</h4>
                    <ul>
                      {user.roles.map((role, index) => (
                        <li key={index}>{role}</li>
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
            ))
          ) : (
            <p>No users found</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
