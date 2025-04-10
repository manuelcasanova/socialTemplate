import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

// Hooks
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

// Util functions
import fetchUsernameById from "../socialComponents/util_functions/FetchUsernameById";
import fetchMessages from "./util_functions/FetchMessages";

// Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import Error from "../Error";

// Styling
import '../../../css/Chat.css'
import { faUser, faRefresh, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const profilePictureExists = async (userId) => {
  const imageUrl = `${BACKEND}/media/profile_pictures/${userId}/profilePicture.jpg`;
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error("Error checking image existence:", error);
    return false;
  }
};

export default function Chat({ isNavOpen, setHasNewMessages }) {
  const { userId } = useParams();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const loggedInUser = auth.userId;
  const navigate = useNavigate();
  const handleClose = () => navigate('/messages');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("")
  const [imageExists, setImageExists] = useState(false);
  const [showLargePicture, setShowLargePicture] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, []);


  // Fetch user data and messages
  useEffect(() => {
    fetchUsernameById(filters, setUsers, setIsLoading, setError, userId);
    fetchMessages(filters, setMessages, setIsLoading, setError, loggedInUser, userId);
    setHasNewMessages(false);
  }, [filters, loggedInUser, userId]);

  // Check if profile picture exists for the user
  useEffect(() => {
    const checkImage = async () => {
      const result = await profilePictureExists(userId);
      setImageExists(result);
    };

    if (userId) {
      checkImage();
    }
  }, [userId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  //Logic to send messages

  const sendMessage = async (loggedInUser, userId) => {
    // e.preventDefault();
    try {
      setIsLoading(true)
      await axiosPrivate.post(`${BACKEND}/messages/send`, {
        newMessage,
        loggedInUser,
        userId
      });
      setError(null)

      //Update messages after send
      fetchMessages(filters, setMessages, setIsLoading, setError, loggedInUser, userId);

      // Focus back on the input field
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    } catch (err) {
      console.log("error", err);
      setError(err.response.data.message || "An error occurred. Try again later.");
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage) {
      alert('Please fill out the message field.');
      return;
    }
    sendMessage(loggedInUser, userId)
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  };

  const handleShowConfirmDelete = (messageId) => {
    setMessageToDelete(prev => (prev === messageId ? null : messageId));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error isNavOpen={isNavOpen} error={error} />
  }

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className='chat-container'>
        <button className="chat-close-button" onClick={handleClose}>✖</button>

        {/* Displaying the Profile Picture or Default Icon */}
        <div className="chat-one-user-info">
          {imageExists ? (
            <img
              className="user-row-chat-small-img"
              src={`${BACKEND}/media/profile_pictures/${userId}/profilePicture.jpg`}
              alt="Profile"
              onClick={() => setShowLargePicture(true)}
            />
          ) : (
            <FontAwesomeIcon
              icon={faUser}
              size="3x"
              onClick={() => setShowLargePicture(true)}
            />
          )}

          {/* Displaying Large Picture when clicked */}
          {showLargePicture && (
            // <div className={`${isNavOpen ? 'large-picture-squeezed' : 'large-picture'}`} onClick={() => setShowLargePicture(false)}>
            <div className={`${isNavOpen ? 'large-picture-squeezed' : 'large-picture'}`}
              onClick={() => setShowLargePicture(false)}>


              <img

                className="users-all-picture-large"
                src={`${BACKEND}/media/profile_pictures/${userId}/profilePicture.jpg`}
                alt="Large Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${BACKEND}/media/profile_pictures/user.png`; // Default fallback image
                }}
              />
            </div>
          )}

          <h2>Chat with {users.username}</h2>


          <div className="users-messaging-send">
            <input
              placeholder="Aa"
              ref={inputRef}

              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue.length < 255) {
                  setNewMessage(inputValue);
                }
              }}

              onKeyDown={handleKeyDown}
              value={newMessage}
              required></input>
            <button
              disabled={!newMessage}
              onClick={handleSubmit}
              className="button-white"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
            {error && <p>{error}</p>}
          </div>

          <div className="messages-container">
            <FontAwesomeIcon
              icon={faRefresh}
              style={{ marginBottom: '5px' }}
              title="Refresh messages"
              className="refresh-messages"
              onClick={() => fetchMessages(filters, setMessages, setIsLoading, setError, loggedInUser, userId, messages)}
            />

            {messages.length > 0 ? (
              messages.map((message) => {
                const isSender = message.sender === loggedInUser;
                const isConfirmingDelete = messageToDelete === message.id;

                return (
                  <div
                    key={message.id}
                    className={isSender ? "message-left" : "message-right"}
                  >
                    <div
                      className={`${isSender ? "message-content-left" : "message-content-right"}${isConfirmingDelete ? " confirm" : ""}`}
                    >
                      {!isConfirmingDelete ? (
                        <>
                          <p>{message.content}</p>
                          <FontAwesomeIcon
                            className="delete-chat-messsage"
                            icon={faTrash}
                            onClick={() => handleShowConfirmDelete(message.id)}
                          />
                        </>
                      ) : (
                        <div className="confirm-delete-chat">
                          <p
                            className="button-red"
                            onClick={() => {
                              console.log("Yes");
                              // Call your actual delete function here
                              setMessageToDelete(null);
                            }}
                          >
                            Confirm delete
                          </p>
                          <p
                            className="button-white"
                            style={{ color: "black" }}
                            onClick={() => setMessageToDelete(null)}
                          >
                            Cancel
                          </p>

                        </div>
                      )}
                    </div>

                    <div className="message-footer">
                      <span className="message-date">{formatDate(message.date)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No messages yet.</p>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
