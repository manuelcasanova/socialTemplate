import { useState, useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import { fetchRoleAdminHistory } from "../../../util/fetchRoleAdminHistory";

import '../../../css/RoleChangeLog.css'

//Translation
import { useTranslation } from 'react-i18next';


export default function RoleAdminHistory({ isNavOpen }) {
  const { t } = useTranslation();
  const axiosPrivate = useAxiosPrivate();
  const [rolesAdminHistory, setRolesAdminHistory] = useState([]);
  console.log('rolesAdminHistory', rolesAdminHistory)
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const loggedInUser = auth.userId

  // console.log('rolesAdminHistory', rolesAdminHistory)

  useEffect(() => {
    setError(null);  // Reset the error message

    const loadData = async () => {
      try {
        const data = await fetchRoleAdminHistory(axiosPrivate);

        if (data && Array.isArray(data)) {
          if (data.length === 0) {
            setError('No role admin history found');
          }
          setRolesAdminHistory(data);
        } else {
          setRolesAdminHistory([]);
          setError('No role admin history found');
        }
      } catch (err) {
        setError(err.message); // Catch and show error from utility function
        console.error(err);
      }
    };

    loadData();
  }, [axiosPrivate]);

  return (
    <div className={`body ${isNavOpen ? "body-squeezed" : ""}`}>
      <div className="admin-users">
        <h2>{t('rolesAdminHistory.title')}</h2>
        {error && (
          <p className="error-message">{error}</p>
        )}

        {rolesAdminHistory.length > 0 ? (

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>

                  <th>{t('rolesAdminHistory.roleId')}</th>
                  <th>{t('rolesAdminHistory.oldRoleId')}</th>
                  <th>{t('rolesAdminHistory.oldRoleName')}</th>
                  <th>{t('rolesAdminHistory.newRoleName')}</th>
                  <th>{t('rolesAdminHistory.action')}</th>
                  <th>{t('rolesAdminHistory.performedBy')}</th>
                  <th>{t('rolesAdminHistory.performedAt')}</th>
                </tr>
              </thead>
              <tbody>

                {rolesAdminHistory.map((history) => (



                  <tr key={`${history.timestamp}-${history.role_id || 'noRoleId'}`}>


                    <td>{history.role_id != null ? history.role_id : t('rolesAdminHistory.roleDeleted')}</td>

                    <td>
                      {Number.isInteger(history.role_id)
                        ? ''
                        : history.old_role_id || ''}
                    </td>

                    <td>{history.old_role_name}</td>

                    <td>{history.new_role_name}</td>

                    <td>{history.action_type}</td>

                    <td>{history.performed_by_username} (User ID: {history.performed_by})</td>

                    <td>{new Date(history.timestamp).toLocaleString('en-GB', {
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
          <p>{t('rolesAdminHistory.noHistory')}</p>
        )}
      </div>

    </div>
  )
}








