import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

//Util functions
import fetchUsernameById from "../socialComponents/util_functions/FetchUsernameById";


//Styling
import '../../../css/Chat.css'

export default function Chat({ isNavOpen }) {

  const { userId } = useParams();

  const navigate = useNavigate();
  const handleClose = () => navigate('/messages');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [users, setUsers] = useState([]);
  
  useEffect (() => {
    fetchUsernameById(filters, setUsers, setIsLoading, setError, userId)
  }, [])


  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>

<div className='chat-container'>
<button className="chat-close-button" onClick={handleClose}>✖</button>
<h2>Chat with {users.username}</h2>


</div>

 

    </div>
    
  )
}


