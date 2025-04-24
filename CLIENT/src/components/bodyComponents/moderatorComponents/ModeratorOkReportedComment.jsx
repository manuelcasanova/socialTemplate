import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

// Styling

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";


export default function ModeratorOkReportedComment({ commentId, refreshData, setReports }) {
const axiosPrivate = useAxiosPrivate();

const { auth } = useAuth();


const handleApproveClick = async () => {
  try {
    // console.log("util function hit, commendId", commentId)
    // Step 1: Update the post_reports status
    await axiosPrivate.put(`/reports-comments/comment/ok/${commentId}`, {
      status: "Ok",
    });

    // Step 2: Insert into post_report_history
    await axiosPrivate.post(`/reports-comments/comment/ok/history`, {
      commentId: commentId,
      changedBy: auth.userId,
      newStatus: "Ok",
      note: "Marked as appropriate by moderator",
    });

    setReports(prev => prev.filter(r => r.comment_id !== commentId));

    if (refreshData) refreshData(); 

  } catch (err) {
    console.error("Error approving comment:", err);
  }
};


  return (

      <td><FontAwesomeIcon 
      title='Approve Comment' 
      style={{ color: 'green', cursor: 'pointer' }} 
      icon={faCircleCheck} 
      onClick={handleApproveClick}
      /></td>

  )
}