import { axiosPrivate } from "../../../api/axios"
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

//Components

import ModeratorHideReportedPost from "./ModeratorHideReportedPost";
import ModeratorOkReportedPost from "./ModeratorOkReportedPost";
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import Error from "../Error";

//Translation
import { useTranslation } from 'react-i18next';

export default function ModeratorPosts({ isNavOpen, setHasPostReports }) {

  const { t } = useTranslation();
  const { auth } = useAuth();
  const loggedInUser = auth.userId;
  const navigate = useNavigate()
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([])
  const errRef = useRef();


  const fetchReports = async () => {
    try {
      const response = await axiosPrivate.get('/reports/post-report');
      const reportData = response.data;
      // console.log("reportData", reportData)
      setReports(reportData);

      // if (reportData = []) {
      //   setHasPostReports(false)
      // }

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
        <h2>{t('moderator.reportsAwaitingAssessment')}</h2>
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
                    >{log.post_id}</td>
                    <td>



                             {/* REAL APP */}
                      {/* {log.content} */}
                      {/* REAL APP END */}

                      {/* SAMPLE */}
                      {log.post_id <= 7
                        ? t(`postsSeeds.post${log.post_id}`)
                        : log.content}
                      {/* SAMPLE END */}




                    </td>
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
                    <ModeratorOkReportedPost postId={log.post_id} refreshData={fetchReports} setReports={setReports} isNavOpen={isNavOpen} setError={setError}/>
                    <ModeratorHideReportedPost postId={log.post_id} refreshData={fetchReports} setReports={setReports} isNavOpen={isNavOpen} setError={setError}/>
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