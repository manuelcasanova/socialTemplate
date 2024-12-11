import Footer from "../../mainComponents/footer";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

export default function RoleChangeLog({ isNavOpen }) {

  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]); // All roles from the database
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const loggedInUser = auth.userId

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

      } catch (err) {
        setError(`Failed to fetch data: ${err.response.data.message}`);
        console.error(err);
      }
    };

    fetchUsersAndRoles();
  }, [axiosPrivate]);

  return (
    <div className={`body-footer ${isNavOpen ? "body-footer-squeezed" : ""}`}>
      <div className="body admin-users">
        <h2>User role change log</h2>
        {error && <p className="error-message">{error}</p>}

      </div>
      <Footer />
    </div>
  )
}








