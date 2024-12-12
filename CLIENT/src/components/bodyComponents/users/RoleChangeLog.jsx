import Footer from "../../mainComponents/footer";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import { fetchUsersAndRoles } from "../../../util/fetchUsersAndRoles";

export default function RoleChangeLog({ isNavOpen }) {
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]); // All roles from the database
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const loggedInUser = auth.userId

  console.log("users", users, "roles", roles)

  useEffect(() => {
    const loadData = async () => {
      try {
        const { users, roles } = await fetchUsersAndRoles(axiosPrivate); // Pass axiosPrivate here
        setUsers(users); // Set user data
        setRoles(roles); // Set roles from the server
      } catch (err) {
        setError(err.message); // Catch and show error from utility function
        console.error(err);
      }
    };

    loadData();
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








