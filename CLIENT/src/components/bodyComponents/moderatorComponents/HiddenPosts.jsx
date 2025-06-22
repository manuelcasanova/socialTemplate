import { axiosPrivate } from "../../../api/axios"
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

//Components

import ModeratorOkReportedPost from "./ModeratorOkReportedPost";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import Error from "../Error";

//Translation
import { useTranslation } from 'react-i18next';

export default function ModeratorPosts({ isNavOpen }) {

  const { t } = useTranslation();
  const { auth } = useAuth();
  const loggedInUser = auth.userId;
  const navigate = useNavigate()
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([])
  const errRef = useRef();

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
      console.error(err);
    
      if (!err?.response) {
      setError(t('moderator.error.serverUnreachable'));
    } else if (err.response?.status === 404) {
      setError(t('moderator.error.noReportFound'));
    } else if (err.response?.status === 403) {
      setError(t('moderator.error.accessDenied'));
    } else if (err.response?.status === 401) {
      setError(t('moderator.error.unauthorized'));
    } else if (err.response?.status === 500) {
      setError(t('moderator.error.serverError'));
    } else {
      setError(t('moderator.error.somethingWentWrong'));
    }
    
      errRef.current?.focus();
    }
  };


  useEffect(() => {
    fetchHiddenPosts();
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
        <h2>{t('moderator.postsHidden')}</h2>
        {error && error !== "No post report history found" && (
          <p className="error-message">{error}</p>
        )}

        {reports.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{t('moderator.postId')}</th>
                  <th>{t('moderator.postContent')}</th>
                  <th>{t('moderator.status')}</th>
                  <th>{t('moderator.note')}</th>
                  <th>{t('moderator.hiddenBy')}</th>
                  <th>{t('moderator.hiddenAt')}</th>
                  <th>{t('moderator.unhide')}</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((log) => (
                
                  <tr key={`${log.id}-${log.reported_by}`}>
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
                        ? `${users[log.reported_by]} (${t('moderator.userId')} ${log.reported_by})`
                        : `${t('moderator.userId')} ${log.reported_by}`}
                    </td>
                    <td>{new Date(log.reported_at).toLocaleString('en-GB')}</td>
                    <ModeratorOkReportedPost postId={log.post_id} refreshData={fetchHiddenPosts} setReports={setReports} setError={setError} />

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>{t('moderator.noPostsFound')}</p>
        )}

      </div>
    </div>

  )
}