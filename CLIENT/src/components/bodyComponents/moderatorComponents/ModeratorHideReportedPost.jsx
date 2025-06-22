import { useState, useRef } from "react";

//Hooks
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";  // Import custom hook for making requests
import useAuth from "../../../hooks/useAuth"; // Import authentication hook

//Styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import Error from "../Error";

//Translation
import { useTranslation } from 'react-i18next';

export default function ModeratorHideReportedPost({ postId, refreshData, setReports, isNavOpen, setError }) {
  const axiosPrivate = useAxiosPrivate();
  const { t } = useTranslation();
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const errRef = useRef();

  const handleHideClick = async () => {
    setIsLoading(true);
    try {
      // Step 1: Update the post_reports status to 'Inappropriate'
      await axiosPrivate.put(`/reports/post/inappropriate/${postId}`, {
        status: "Inappropriate",
      });

      // Step 2: Insert into post_report_history to log this action
      await axiosPrivate.post(`/reports/post/inappropriate/history`, {
        postId: postId,
        changedBy: auth.userId,
        newStatus: "Inappropriate",
        note: "Marked as inappropriate by moderator",
      });

      // Remove the post from the reports list
      setReports(prev => prev.filter(r => r.post_id !== postId));

      // Optionally, refresh data to ensure the UI is up to date
      if (refreshData) refreshData();
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
  finally {
    setIsLoading(false);
  }
};

if (isLoading) {
  return (
    <td colSpan={1}>
      <LoadingSpinner />
    </td>
  );
}
  
  return (
    <td>
      <FontAwesomeIcon
        title={t('moderator.hide')}
        style={{ color: 'red', cursor: 'pointer' }}
        icon={faBan}
        onClick={handleHideClick} 
      />
    </td>
  );
}
