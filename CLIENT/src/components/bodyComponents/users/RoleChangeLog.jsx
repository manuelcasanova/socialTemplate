import Footer from "../../mainComponents/footer";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import { fetchUsersAndRoles } from "../../../util/fetchUsersAndRoles";
import { fetchRoleChangeLogs } from "../../../util/fetchRoleModificationLogs";
import FilterRoleChangeLog from "./FilterRoleChangeLog";
import React from "react";


// Styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import '../../../css/RoleChangeLog.css'

//Translation
import { useTranslation } from 'react-i18next';


export default function RoleChangeLog({ isNavOpen }) {
  const { t } = useTranslation();
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);
  const { auth } = useAuth();

  const [infoRowId, setInfoRowId] = useState(null);
  const handleShowInfo = (id) => {
    setInfoRowId(prevId => (prevId === id ? null : id)); // toggle for the same row
  };

  useEffect(() => {
    const loadUsersAndRoles = async () => {
      try {
        const { users, roles } = await fetchUsersAndRoles(axiosPrivate);
        setUsers(users);
        setRoles(roles);
      } catch (err) {
        setError(err.message);
      }
    };
    loadUsersAndRoles();
  }, []);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const logsData = await fetchRoleChangeLogs(axiosPrivate, filters);
        if (logsData && Array.isArray(logsData)) {
          if (logsData.length === 0) {
            setError('No role change logs found');
          }
          setLogs(logsData);
        } else {
          setLogs([]);
          setError('No role change logs found');
        }
      } catch (err) {
        setError(err.message);
      }
    };
    loadLogs();
  }, [filters]);



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
                {/* {logs.map((log) => (
                  <tr key={log.id}>
                    <td> {getUserNameById(log.modifier_id).startsWith('inactive')
                      ? 'Inactive User '
                      : `${getUserNameById(log.modifier_id)} `}
                      (Id: {log.modifier_id})</td>



                    <td>
                      {log.action_type === 'transferred' ? (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>{log.action_type}</span>
                            <button
                              onClick={() => handleShowInfo(log.id)}
                              className="info-button"
                            >
                              <FontAwesomeIcon icon={faInfoCircle} />
                            </button>
                          </div>
                          {infoRowId === log.id && (
                            <div >
                              <p>
                                This role was reassigned because the original user who granted it no longer has SuperAdmin access. Role management authority has been transferred to the SuperAdmin who removed their access.
                              </p>

                            </div>
                          )}
                        </>
                      ) : (
                        log.action_type
                      )}
                    </td>






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
                ))} */}
                {logs.map((log) => (
  <React.Fragment key={log.id}>
    <tr>
      <td>
        {getUserNameById(log.modifier_id).startsWith('inactive')
          ? 'Inactive User '
          : `${getUserNameById(log.modifier_id)} `}
        (Id: {log.modifier_id})
      </td>
      <td>
        {log.action_type === 'transferred' ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>{log.action_type}</span>
            <button
              onClick={() => handleShowInfo(log.id)}
              className="info-button"
              style={{margin: '0px', marginLeft: '10px'}}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
            </button>
          </div>
        ) : (
          log.action_type
        )}
      </td>
      <td>{log.role}</td>
      <td>{getUserNameById(log.recipient_id)} (Id: {log.recipient_id})</td>
      <td>{new Date(log.timestamp).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })}</td>
    </tr>

    {/* ✅ Full-width info row */}
    {infoRowId === log.id && (
      <tr>
        <td colSpan={5} className="info-row">
          <p>
            This role was reassigned because the original user who granted it no longer has SuperAdmin access.
            Role management authority has been transferred to the SuperAdmin who removed their access.
          </p>
        </td>
      </tr>
    )}
  </React.Fragment>
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








