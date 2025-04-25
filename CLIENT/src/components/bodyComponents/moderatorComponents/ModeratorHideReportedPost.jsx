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


export default function ModeratorHideReportedPost({ postId, refreshData, setReports, isNavOpen }) {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(false)
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
  
    if (error) {
      return <Error isNavOpen={isNavOpen} error={error}/>
    }
  


  return (
    <td>
      <FontAwesomeIcon
        title='Hide Comment'
        style={{ color: 'red', cursor: 'pointer' }}
        icon={faBan}
        onClick={handleHideClick} // Trigger hide on click
      />
    </td>
  );
}
