import Footer from "../../mainComponents/footer";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import { fetchLoginHistory } from "../../../util/fetchLoginHistory";
import FilterLoginHistory from "./FilterLoginHistory";
import { useGlobalSuperAdminSettings } from "../../../context/SuperAdminSettingsProvider"

import '../../../css/RoleChangeLog.css'

//Translation
import { useTranslation } from 'react-i18next';


export default function LoginHistory({ isNavOpen }) {
  const { t } = useTranslation();
  const axiosPrivate = useAxiosPrivate();
  const [loginHistory, setLoginHistory] = useState([]);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const { superAdminSettings } = useGlobalSuperAdminSettings(); 
  const loggedInUser = auth.userId;
  const isSuperAdmin = auth.roles.includes('SuperAdmin');

  useEffect(() => {
    setError(null);  // Reset the error message

    const loadData = async () => {
      try {
        const loginData = await fetchLoginHistory(axiosPrivate, filters);

        if (loginData && Array.isArray(loginData)) {
          if (loginData.length === 0) {
            setError('No login history found');
          }
          setLoginHistory(loginData);
        } else {
          setLoginHistory([]);
          setError('No login history found');
        }
      } catch (err) {
        setError(err.message); // Catch and show error from utility function
        console.error(err);
      }
    };

    loadData();
  }, [axiosPrivate, filters]);

 const visibleLoginHistory = loginHistory.filter(login => {
    const isLoginUserSuperAdmin = login.roles?.includes("SuperAdmin");
    return !isLoginUserSuperAdmin || isSuperAdmin || superAdminSettings.showSuperAdminInLoginHistory;
  });

  return (
    <div className={`body ${isNavOpen ? "body-squeezed" : ""}`}>
      <div className="admin-users">
        <h2>{t('loginHistory.title')}</h2>
        {error && (
          <p className="error-message">{error}</p>
        )}


        <FilterLoginHistory setFilters={setFilters} />

        {/* {console.log(loginHistory)} */}

        {visibleLoginHistory.length > 0 ? (

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>

                  <th>{t('loginHistory.userId')}</th>
                  <th>{t('loginHistory.username')}</th>
                  <th>{t('loginHistory.email')}</th>
                  <th>{t('loginHistory.loginTime')}</th>
                </tr>
              </thead>
              <tbody>
                {/* {console.log(loginHistory)} */}
                {visibleLoginHistory.map((login) => (

                  <tr key={`${login.login_time}-${login.user_id}`}>
                    <td>{login.user_id}</td>
                    <td>     {login.username.startsWith('inactive') ? t('loginHistory.inactiveUser') : login.username}</td>
                    <td>{login.email}</td>

                    <td>{new Date(login.login_time).toLocaleString('en-GB', {
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
          <p>{t('loginHistory.noHistory')}</p>
        )}
      </div>

    </div>
  )
}








