import { useState, useEffect } from "react";
import { axiosPrivate } from "../../../api/axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import Error from "../Error";

export default function FlagComment({commentId, loggedInUserId, hideFlag, isNavOpen, setError}) {

  // console.log("commentId in FlagPost", commentId)

  const [flagged, setFlagged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkIfReported = async () => {
      try {
        const res = await axiosPrivate.get("/reports-comments/has-reported", {
          params: {
            comment_id: commentId,
            user_id: loggedInUserId
          }
        });

        if (res.data?.hasReported) {
          setFlagged(true);
        }
      } catch (err) {
        console.error("Error checking report status:", err);
      }
    };

    checkIfReported();
  }, [commentId, loggedInUserId]);

  const handleFlag = async () => {
    try {
      await axiosPrivate.post("/reports-comments/reportcomment", {
        comment_id: commentId,
        reason: "Inappropriate content",
        reported_by: loggedInUserId
      });
      setFlagged(true);
    } catch (err) {
      console.error("Error reporting comment:", err);
      const errorMessage =
        err.response?.data?.error || "An unexpected error occurred.";
      setError(errorMessage);
    }
  };

    if (isLoading) {
      return <LoadingSpinner />;
    }
  

  return (
    <div className="post-actions">
       {!hideFlag && (
      <button
        title="Report as inappropriate"
        onClick={handleFlag}
        disabled={flagged}
        style={{ color: flagged ? "red" : "inherit" }}
      >
        <FontAwesomeIcon icon={faFlag} />
        {flagged && <span style={{ marginLeft: "5px", cursor: 'default' }}>Reported. Pending review</span>}
      </button>
          )}
    </div>
  )
}