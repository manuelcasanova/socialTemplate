import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";

export default function FlagPost() {
  return (
    <div className="post-actions">
      <button
        title="Report as inappropiate"
      >
        <FontAwesomeIcon icon={faFlag} />
      </button>
    </div>
  )
}