import { axiosPrivate } from "../../../api/axios"
import { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";

//Util functions




export default function ModeratorPostsHistory({ isNavOpen }) {

  const auth = useAuth;
  const loggedInUser = auth.userId;
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
        setError('No post report history found');
        console.error(err);
      }
    };
  
    fetchReportHistory();
  }, []);
  




  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-users">
        <h2>Post report history</h2>
        {error && error !== "No post report history found" && (
          <p className="error-message">{error}</p>
        )}


        {reports.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>

                  <th>Post Id</th>
                  <th>Performed by</th>
                  <th>Performed at</th>
                  <th>Status</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((log) => (
                  <tr key={log.id}>
                    <td>{log.report_id}</td>
                    <td>
                      {users[log.changed_by]
                        ? `${users[log.changed_by]} (UserId: ${log.changed_by})`
                        : `UserId: ${log.changed_by}`}
                    </td>
                    <td>{new Date(log.changed_at).toLocaleString('en-GB')}</td>
                    <td>{log.new_status}</td>
                    <td>{log.note}</td>
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