//Libraries, dependencies
import useAxiosPrivate from "../../hooks/useAxiosPrivate"

//Hooks
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Fontawesome
import { faCircleXmark, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FollowNotification() {
  return (
    <div className="bell-container">
      <FontAwesomeIcon
        className="faBell-follow-request"
        icon={faBell} />
      <span className="notification-dot"></span>
    </div>
  )
}