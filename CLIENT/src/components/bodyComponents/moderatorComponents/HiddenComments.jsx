import { axiosPrivate } from "../../../api/axios"
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

//Components
import ModeratorOkReportedComment from "./ModeratorOkReportedComment";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import Error from "../Error";

export default function HiddenComments({ isNavOpen }) {

  const { auth } = useAuth();
  const loggedInUser = auth.userId;
  const navigate = useNavigate()
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([])
  const errRef = useRef();

  // console.log("reports", reports)

  const fetchHiddenComments = async () => {
    try {
      const response = await axiosPrivate.get('/reports-comments/hidden-comments');
      const reportData = response.data;
      // console.log("reportData", reportData)
      setReports(reportData);

      const userIds = [...new Set(reportData.map(report => report.reported_by))];

      // console.log("userIds", userIds)
      const userResponses = await Promise.all(
        userIds.map(id => axiosPrivate.get(`/users/${id}`))
      );

      const usersMap = {};
      userResponses.forEach(res => {
        const user = res.data;
        usersMap[user.user_id] = user.username;
      });

      setUsers(usersMap);
    } catch (err) {
      console.error(err);
    
      if (!err?.response) {
        setError('Server is unreachable. Please try again later.');
      } else if (err.response?.status === 404) {
        setError('No hidden comments found');
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view this history.');
      } else if (err.response?.status === 401) {
        setError('Unauthorized. Please log in and try again.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    
      errRef.current?.focus();
    }
  };

  useEffect(() => {
    fetchHiddenComments();
  }, []);

  if (isLoading) {
    return (
      <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}><LoadingSpinner /></div>)
  }

  if (error) { return <Error isNavOpen={isNavOpen} error={error} /> }

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-users">
        <h2>Comments Hiden (Assessed as Inappropriate)</h2>
        {error && error !== "No hidden comments found" && (
          <p className="error-message">{error}</p>
        )}

        {reports.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Comment Id / Post Id</th>
                  <th>Comment Content</th>
                  <th>Status</th>
                  <th>Note</th>
                  <th>Hidden by</th>
                  <th>Hidden at</th>
                  <th>Ok</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((log) => (
                  <tr key={`${log.report_id}-${log.reported_by}`}>
                    <td
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/posts/${log.post_id}`)}
                    >{`${log.comment_id} / ${log.post_id}`}</td>
                    <td>{log.content}</td>
                    <td>{log.status}</td>
                    <td>{log.reason}</td>
                    <td
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        if (log.reported_by === loggedInUser) {
                          navigate("/profile/myaccount");
                        } else {
                          navigate(`/social/users/${log.reported_by}`);
                        }
                      }}
                    >
                      {users[log.reported_by]
                        ? `${users[log.reported_by]} (UserId: ${log.reported_by})`
                        : `UserId: ${log.reported_by}`}
                    </td>
                    <td>{new Date(log.reported_at).toLocaleString('en-GB')}</td>
                   <ModeratorOkReportedComment commentId={log.comment_id} refreshData={fetchHiddenComments} setReports={setReports} />

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No posts found.</p>
        )}

      </div>
    </div>
    
  )
}