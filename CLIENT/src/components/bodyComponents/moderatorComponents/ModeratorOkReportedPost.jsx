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


export default function ModeratorOkReportedPost({ postId, refreshData, setReports, isNavOpen, setError }) {
const axiosPrivate = useAxiosPrivate();

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
      setError('Server is unreachable. Please try again later.');
    } else if (err.response?.status === 404) {
      setError('No post report found');
    } else if (err.response?.status === 403) {
      setError('Access denied. You might not have permission to view this.');
    } else if (err.response?.status === 401) {
      setError('Unauthorized. Please log in and try again.');
    } else if (err.response?.status === 500) {
      setError('Server error. Please try again later.');
    } else {
      setError('Something went wrong. Please try again.');
    }
    errRef.current?.focus();
  }
  finally {
    setIsLoading(false);
  }
};

    if (isLoading) {
      return (
        <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
          <LoadingSpinner />
        </div>
      )
    }
  

  return (

      <td><FontAwesomeIcon 
      title='Approve Comment' 
      style={{ color: 'green', cursor: 'pointer' }} 
      icon={faCircleCheck} 
      onClick={handleApproveClick}
      /></td>

  )
}