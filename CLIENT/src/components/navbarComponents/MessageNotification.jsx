//Libraries, dependencies
import useAxiosPrivate from "../../hooks/useAxiosPrivate"

//Hooks
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Fontawesome
import { faCircleXmark, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MessageNotification({userId, setUsersWithNewMessages}) {
  
  const navigate = useNavigate()

  return (
    <div className="bell-container" 
    onClick={() => {
      setUsersWithNewMessages([]); 
      navigate(`/messages/${userId}`); 
    }}
    >
      <FontAwesomeIcon
        className="faBell-follow-request"
        icon={faEnvelope} />
      <span className="notification-dot"></span>
    </div>
  )
}