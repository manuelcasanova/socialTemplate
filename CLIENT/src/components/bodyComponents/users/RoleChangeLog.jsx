import Footer from "../../mainComponents/footer";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import { fetchUsersAndRoles } from "../../../util/fetchUsersAndRoles";
import { fetchRoleChangeLogs } from "../../../util/fetchRoleModificationLogs";

import '../../../css/RoleChangeLog.css'

export default function RoleChangeLog({ isNavOpen }) {
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const loggedInUser = auth.userId

  useEffect(() => {
    const loadData = async () => {
      try {
        const { users, roles } = await fetchUsersAndRoles(axiosPrivate);
        setUsers(users);
        setRoles(roles);

        const logsData = await fetchRoleChangeLogs(axiosPrivate);
        setLogs(logsData);

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


        {logs.length > 0 ? (
          <table>
            <thead>
              <tr>

                <th>Modifier</th>
                <th>Action performed</th>
                <th>Role</th>
                <th>Recipient</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.user_that_modified}</td>
                  <td>{log.action_type}</td>
                  <td>{log.role}</td>
                  <td>{log.user_modified}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No role change logs found.</p>
        )}

      </div>
      <Footer />
    </div>
  )
}








