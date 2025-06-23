import { axiosPrivate } from "../../../api/axios"
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import Error from "../Error";

//Translation
import { useTranslation } from 'react-i18next';

export default function ModeratorCommentsHistory({ isNavOpen }) {

  const { t } = useTranslation();
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
        const response = await axiosPrivate.get('/reports-comments/comment-report-history');
        const reportData = response.data;
        setReports(reportData);

        const userIds = [...new Set(reportData.map(report => report.changed_by))];

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
        <h2>{t('moderator.commentModerationHistory')}</h2>
        {error && error !== "No comment report history found" && (
          <p className="error-message">{error}</p>
        )}


        {reports.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>

                  <th>{t('moderator.postIdAndCommentId')}</th>
                  <th>{t('moderator.commentContent')}</th>
                  <th>{t('moderator.status')}</th>
                  <th>{t('moderator.note')}</th>
                  <th>{t('moderator.performedBy')}</th>
                  <th>{t('moderator.performedAt')}</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((log) => (
     
                  <tr key={log.id}>
                    <td
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/posts/${log.post_id}`)}
                    >{`${log.post_id}/${log.report_id}`}</td>
                    <td>{log.content}</td>
                    <td>{log.new_status}</td>
                    <td>{log.note}</td>
                    <td>
                      {users[log.changed_by]
                        ? `${users[log.changed_by]} (${t('moderator.userId')} ${log.changed_by})`
                        : `${t('moderator.userId')} ${log.changed_by}`}
                    </td>
                    <td>{new Date(log.changed_at).toLocaleString('en-GB')}</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>{t('moderator.noHistory')}</p>
        )}

      </div>
    </div>

  )
}