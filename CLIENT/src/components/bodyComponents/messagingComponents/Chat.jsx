import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

//Util functions
import fetchUserById from "../socialComponents/util_functions/FetchUserById";


//Styling
import '../../../css/Chat.css'

export default function Chat({ isNavOpen }) {

  const { userId } = useParams();
console.log("userId in Chat.jsx", userId)

  const navigate = useNavigate();
  const handleClose = () => navigate('/messages');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [users, setUsers] = useState([]);
  
  // useEffect (() => {
  //   fetchUserById(filters, setUsers, setIsLoading, setError, userId)
  // }, [])

  console.log("users in chat", users)


  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>

<div className='chat-container'>
<button className="chat-close-button" onClick={handleClose}>✖</button>
<h2>Chat with {userId}</h2>


</div>

 

    </div>
    
  )
}


