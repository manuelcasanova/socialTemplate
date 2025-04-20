import { useState } from "react";
import { axiosPrivate } from "../../../api/axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";

export default function FlagPost({postId, loggedInUserId}) {

  // console.log("postId in FlagPost", postId)

  const [flagged, setFlagged] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div className="post-actions">
      <button
        title="Report as inappropiate"
        onClick={handleFlag}
        disabled={flagged}
        style={{ color: flagged ? "red" : "inherit" }}
      >
        <FontAwesomeIcon icon={faFlag} />
        {flagged && <span style={{ marginLeft: "5px" }}>Reported. Pending review</span>}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  )
}