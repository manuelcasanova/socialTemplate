import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

// Styling

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";


export default function ModeratorOkReportedPost({ postId, refreshData, setReports }) {
const axiosPrivate = useAxiosPrivate();

const { auth } = useAuth();
// console.log("postId", postId)

const handleApproveClick = async () => {
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
    console.error("Error approving report:", err);
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