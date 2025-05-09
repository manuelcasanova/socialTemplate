import Footer from "../../mainComponents/footer";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import { fetchUsersAndRoles } from "../../../util/fetchUsersAndRoles";
import { fetchRoleChangeLogs } from "../../../util/fetchRoleModificationLogs";
import FilterRoleChangeLog from "./FilterRoleChangeLog";

import '../../../css/RoleChangeLog.css'

export default function RoleChangeLog({ isNavOpen }) {
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const loggedInUser = auth.userId

  useEffect(() => {
    setError(null);  // Reset the error message

    const loadData = async () => {
      try {
        const { users, roles } = await fetchUsersAndRoles(axiosPrivate);
        setUsers(users);
        setRoles(roles);

        const logsData = await fetchRoleChangeLogs(axiosPrivate, filters);

        // Handle empty logs or error message
        if (logsData && Array.isArray(logsData)) {
          if (logsData.length === 0) {
            setError('No role change logs found');
          }
          setLogs(logsData); // Set the logs
        } else {
          setLogs([]); // Set empty logs if error or unexpected data
          setError('No role change logs found');
        }
      } catch (err) {
        setError(err.message); // Catch and show error from utility function
        console.error(err);
      }
    };

    loadData();
  }, [axiosPrivate, filters]);


  // Function to get the name of the modifier based on user ID
  const getUserNameById = (userId) => {
    const user = users.find((user) => user.user_id === userId);  // Find the user object with the given ID
    return user ? user.username : 'Unknown';  // Return the user's name or 'Unknown' if not found
  };

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-users">
        <h2>User role change log</h2>
        {error && error !== "No role change logs found" && (
          <p className="error-message">{error}</p>
        )}


        {/* Filter Component */}
        <FilterRoleChangeLog roles={roles} setFilters={setFilters} />

        {logs.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>

                  <th>Modifier</th>
                  <th>Action performed</th>
                  <th>Role</th>
                  <th>Recipient</th>
                  <th>Timestamp (DD/MM/YYYY)</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td> {getUserNameById(log.modifier_id).startsWith('inactive')
                      ? 'Inactive User '
                      : `${getUserNameById(log.modifier_id)} `}
                      (Id: {log.modifier_id})</td>
                    <td>{log.action_type}</td>
                    <td>{log.role}</td>
                    <td>{getUserNameById(log.recipient_id)} (Id: {log.recipient_id})</td>
                    <td>{new Date(log.timestamp).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,  // Optional: Use 24-hour format
                    })}</td>


                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No role change logs found.</p>
        )}

      </div>

    </div>
  )
}








