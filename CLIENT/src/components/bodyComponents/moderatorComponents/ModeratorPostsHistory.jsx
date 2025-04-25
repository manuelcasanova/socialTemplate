import { axiosPrivate } from "../../../api/axios"
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import Error from "../Error";

export default function ModeratorPostsHistory({ isNavOpen }) {

  const auth = useAuth;
  const loggedInUser = auth.userId;
  const navigate = useNavigate()
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchReportHistory = async () => {
      try {
        const response = await axiosPrivate.get('/reports/post-report-history');
        const reportData = response.data;
        setReports(reportData);

        const userIds = [...new Set(reportData.map(report => report.changed_by))];

        const userResponses = await Promise.all(
          userIds.map(id => axiosPrivate.get(`/users/${id}`))
        );

        const usersMap = {};
        userResponses.forEach(res => {
          const user = res.data; // 🔥 Access the actual user data
          usersMap[user.user_id] = user.username;
        });

        setUsers(usersMap);
      } catch (err) {
        console.error(err);
  
        if (!err?.response) {
          setError('Server is unreachable. Please try again later.');
        } else if (err.response?.status === 404) {
          setError('No post report history found');
        } else if (err.response?.status === 403) {
          setError('Access denied. You do not have permission to view this history.');
        } else if (err.response?.status === 401) {
          setError('Unauthorized. Please log in and try again.');
        } else if (err.response?.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      }
    };

    fetchReportHistory();
  }, []);

      if (isLoading) {
        return (
          <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
            <LoadingSpinner />
          </div>
        )
      }
    
      if (error) {
        return <Error isNavOpen={isNavOpen} error={error}/>
      }
    
  

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-users">
        <h2>Post Moderation History</h2>
        {error && error !== "No post report history found" && (
          <p className="error-message">{error}</p>
        )}


        {reports.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>

                  <th>Post Id</th>
                  <th>Status</th>
                  <th>Note</th>
                  <th>Performed by</th>
                  <th>Performed at</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((log) => (
              
                  <tr key={log.id}>
                    <td
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/posts/${log.report_id}`)}
                    >{log.report_id}</td>
                    <td>{log.new_status}</td>
                    <td>{log.note}</td>
                    <td>
                      {users[log.changed_by]
                        ? `${users[log.changed_by]} (UserId: ${log.changed_by})`
                        : `UserId: ${log.changed_by}`}
                    </td>
                    <td>{new Date(log.changed_at).toLocaleString('en-GB')}</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No post report history found.</p>
        )}

      </div>
    </div>

  )
}