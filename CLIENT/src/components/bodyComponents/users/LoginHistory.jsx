import Footer from "../../mainComponents/footer";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import { fetchLoginHistory } from "../../../util/fetchLoginHistory";
import FilterLoginHistory from "./FilterLoginHistory";

import '../../../css/RoleChangeLog.css'

export default function LoginHistory({ isNavOpen }) {
  const axiosPrivate = useAxiosPrivate();
  const [loginHistory, setLoginHistory] = useState([]);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const loggedInUser = auth.userId

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



  return (
    <div className={`body ${isNavOpen ? "body-squeezed" : ""}`}>
      <div className="admin-users">
        <h2>Login History</h2>
        {error && (
          <p className="error-message">{error}</p>
        )}


        <FilterLoginHistory setFilters={setFilters} />

        {loginHistory.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>

                  <th>User ID</th>
                  <th>Username</th>
                  <th>E-mail</th>
                  <th>Login Time</th>
                </tr>
              </thead>
              <tbody>
              {/* {console.log(loginHistory)} */}
                {loginHistory.map((login) => (
                  
                  <tr key={`${login.login_time}-${login.user_id}`}>
                    <td>{login.user_id}</td>
                    <td>     {login.username.startsWith('inactive') ? 'Inactive User' : login.username}</td>
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
          <p>No login history found.</p>
        )}
      </div>

    </div>
  )
}








