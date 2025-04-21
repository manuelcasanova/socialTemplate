import { axiosPrivate } from "../../../api/axios"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

// Styling

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faBan } from "@fortawesome/free-solid-svg-icons";

//Components

import ModeratorHideReportedPost from "./ModeratorHideReportedPost";
import ModeratorOkReportedPost from "./ModeratorOkReportedPost";

export default function ModeratorPosts({ isNavOpen }) {

  const { auth } = useAuth();
  const loggedInUser = auth.userId;
  const navigate = useNavigate()
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([])


  const fetchHiddenPosts = async () => {
    try {
      const response = await axiosPrivate.get('/reports/hidden-posts');
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
      setError('No post report history found');
      console.error(err);
    }
  };


  useEffect(() => {
    fetchHiddenPosts();
  }, []);

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-users">
        <h2>Reports Hiden (Assessed as Inappropriate)</h2>
        {error && error !== "No post report history found" && (
          <p className="error-message">{error}</p>
        )}

        {reports.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Post Id</th>
                  <th>Post Content</th>
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
                    >{log.post_id}</td>
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
                    <ModeratorOkReportedPost postId={log.post_id} refreshData={fetchHiddenPosts} setReports={setReports} />

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