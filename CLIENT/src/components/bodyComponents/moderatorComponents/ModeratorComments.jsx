import { axiosPrivate } from "../../../api/axios"
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

//Components

import LoadingSpinner from "../../loadingSpinner/LoadingSpinner"
import Error from "../Error"
import ModeratorOkReportedComment from "./ModeratorOkReportedComment";
import ModeratorHideReportedComment from "./ModeratorHideReportedComment";

//Translation
import { useTranslation } from 'react-i18next';

export default function ModeratorComments({ isNavOpen }) {

  const { t } = useTranslation();
  const { auth } = useAuth();
  const loggedInUser = auth.userId;
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([])
  const errRef = useRef();

  // console.log("reports", reports)

  const fetchReports = async () => {
    try {
      const response = await axiosPrivate.get('/reports-comments/comment-report');
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
    fetchReports();
  }, []);

  if (isLoading) {
    return (
      <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}><LoadingSpinner /></div>)
  }

  if (error) { return <Error isNavOpen={isNavOpen} error={error} /> }

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-users">
        <h2>{t('moderator.commentsAwaitingAssessment')}</h2>
        {error && error !== t('moderator.noCommentsFound') && (
          <p className="error-message">{error}</p>
        )}

        {reports.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{t('moderator.commentAndPostId')}</th>
                  <th>{t('moderator.comment')}</th>
                  <th>{t('moderator.status')}</th>
                  <th>{t('moderator.note')}</th>
                  <th>{t('moderator.reportedBy')}</th>
                  <th>{t('moderator.reportedAt')}</th>
                  <th>{t('moderator.unhide')}</th>
                  <th>{t('moderator.hide')}</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((log) => (
                  <tr key={`${log.report_id}-${log.reported_by}`}>
                    <td
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/posts/${log.post_id}`)}
                    >{`${log.comment_id} / ${log.post_id}`}</td>
                    <td>{log.comment_content}</td>
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
                    <ModeratorOkReportedComment commentId={log.comment_id} refreshData={fetchReports} setReports={setReports} setError={setError} />
                    <ModeratorHideReportedComment commentId={log.comment_id} refreshData={fetchReports} setReports={setReports} setError={setError} />
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