
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import '../../../css/AdminUsers.css';
// import filterUsers
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";

import { faBellSlash, faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

export default function SocialAllUsers({ isNavOpen }) {
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Reset the error message whenever filters change
  useEffect(() => {
    setError(null); // Clear error when filters change
  }, [filters]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const [usersResponse] = await Promise.all([
          axiosPrivate.get(`/social/`, { params: filters })

        ]);

        setUsers(usersResponse.data); // Set user data
      } catch (err) {
        setError(`Failed to fetch data: ${err.response.data.error}`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [axiosPrivate, filters]);

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-users">
        <h2>Social - All Users</h2>
        {isLoading ? (
          <LoadingSpinner />
        ) :
          <div className="users-container">
            {users.length > 0 ? (
              users.map((user) =>

                <div className="user-row-social" key={user.user_id}>
                  <div className="user-info">
                    <img
                      src={`${BACKEND}/media/profile_pictures/${user.user_id}/profilePicture.jpg`}
                      alt="Profile"
                    />
                    <p>
                      {user.username.startsWith('inactive') ? 'Inactive User' : user.username}
                    </p>

                  </div>
                  <div className="user-info-buttons">
                    <button>Cancel Request
                      {/* Follow/Unfollow/Follow Back */}
                    </button>
                    <button>Approve request</button>
                    <button><FontAwesomeIcon icon={faBellSlash} /></button>
                  </div>

                </div>

              )
            ) : (
              <p>No users found</p>
            )}
          </div>
        }

      </div>
    </div>
  )
}