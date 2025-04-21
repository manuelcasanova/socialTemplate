import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";  // Import custom hook for making requests
import useAuth from "../../../hooks/useAuth"; // Import authentication hook

export default function ModeratorHideReportedPost({ postId, refreshData, setReports }) {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const handleHideClick = async () => {
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
      console.error("Error hiding report:", err);
    }
  };

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
