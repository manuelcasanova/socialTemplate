import { useState, useRef } from "react";

//Hooks

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

// Styling

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import Error from "../Error";

//Translation
import { useTranslation } from 'react-i18next';

export default function ModeratorOkReportedPost({ postId, refreshData, setReports, isNavOpen, setError }) {
const axiosPrivate = useAxiosPrivate();

const { t } = useTranslation();
const { auth } = useAuth();
// console.log("postId", postId)
const [isLoading, setIsLoading] = useState(false);
  const errRef = useRef();

const handleApproveClick = async () => {
  setIsLoading(true);
  try {
    // Step 1: Update the post_reports status
    await axiosPrivate.put(`/reports/post/ok/${postId}`, {
      status: "Ok",
    });

    // Step 2: Insert into post_report_history
    await axiosPrivate.post(`/reports/post/ok/history`, {
      postId: postId,
      changedBy: auth.userId,
      newStatus: "Ok",
      note: "Marked as appropriate by moderator",
    });

    setReports(prev => prev.filter(r => r.post_id !== postId));

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

      <td><FontAwesomeIcon 
      title={t('moderator.approvePost')}
      style={{ color: 'green', cursor: 'pointer' }} 
      icon={faCircleCheck} 
      onClick={handleApproveClick}
      /></td>

  )
}