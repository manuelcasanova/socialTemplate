//Fontawesome
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SmallFollowNotification() {
  return (
    <div className="bell-container">
      <FontAwesomeIcon
        className="faBell-follow-request"
        icon={faUsers} />
      <span className="notification-dot"></span>
    </div>
  )
}