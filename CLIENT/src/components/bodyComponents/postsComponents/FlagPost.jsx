import { useState, useEffect } from "react";
import { axiosPrivate } from "../../../api/axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import Error from "../Error";

export default function FlagPost({postId, loggedInUserId, hideFlag, isNavOpen, setError}) {

  // console.log("postId in FlagPost", postId)

  const [flagged, setFlagged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // console.log("flagged", flagged)
  // console.log("loggedInUserId in FlagPost", loggedInUserId)

  useEffect(() => {
    const checkIfReported = async () => {
      try {
        const res = await axiosPrivate.get("/reports/has-reported", {
          params: {
            post_id: postId,
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
  }, [postId, loggedInUserId]);

  const handleFlag = async () => {
    try {
      await axiosPrivate.post("/reports/reportpost", {
        post_id: postId,
        reason: "Inappropriate content",
        reported_by: loggedInUserId
      });
      setFlagged(true);
    } catch (err) {
      console.error("Error reporting post:", err);
      setError("Failed to report post.");
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