import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";

//Context
import { useGlobalSuperAdminSettings } from "../../../context/SuperAdminSettingsProvider";
import { useGlobalAdminSettings } from "../../../context/AdminSettingsProvider";
import ScreenSizeContext from "../../../context/ScreenSizeContext";

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
import { faRefresh, faTrashAlt, faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Translation
import { useTranslation } from 'react-i18next';


const BACKEND = process.env.REACT_APP_BACKEND_URL;


export default function Chat({ isNavOpen, setHasNewMessages, profilePictureKey }) {
  const { t, i18n } = useTranslation();
  const { userId } = useParams();
  const { auth } = useAuth();
  const { superAdminSettings } = useGlobalSuperAdminSettings();
  const { adminSettings } = useGlobalAdminSettings();
  // console.log('adminSettings in Chat', adminSettings)
  const axiosPrivate = useAxiosPrivate();
  const loggedInUser = auth.userId;
  const navigate = useNavigate();
  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/messages');
    }
  };
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { screenSize } = useContext(ScreenSizeContext);
  const { isSmartphone, isTablet, isDesktop, width } = screenSize;

  const [filters, setFilters] = useState({});
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("")
  const [showLargePicture, setShowLargePicture] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const inputRef = useRef(null);
  const MAX_CHAR_LIMIT = 5000;

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (inputRef.current) {
  //       inputRef.current.focus();
  //     }
  //   }, 100);
  // }, []);


  // Fetch user data and messages
  useEffect(() => {
    fetchUsernameById(filters, setUsers, setIsLoading, setError, userId);
    fetchMessages(filters, setMessages, setIsLoading, setError, loggedInUser, userId);
    setHasNewMessages(false);
  }, [filters, loggedInUser, userId]);


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
      setError(err?.response?.data?.message || err?.message || "An error occurred. Try again later.");

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

  const markMessageAsDeleted = async (messageId) => {
    try {
      setIsLoading(true);

      // Make the PUT request to mark the message as deleted
      await axiosPrivate.put(`${BACKEND}/messages/${messageId}`, {
        loggedInUser: loggedInUser, // Send the loggedInUser data
      });


      setError(null);

      // Refresh the messages list after the "soft delete"
      fetchMessages(filters, setMessages, setIsLoading, setError, loggedInUser, userId);
    } catch (err) {
      console.log("Error", err);
      setError(err.response?.data?.message || "An error occurred while marking the message as deleted.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= MAX_CHAR_LIMIT) {
      setNewMessage(inputValue);
    }
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
          <img
            className="user-row-chat-small-img"
            src={`${BACKEND}/media/profile_pictures/${userId}/profilePicture.jpg?v=${profilePictureKey}`}
            alt="Profile"
            onClick={() => setShowLargePicture(true)}
            onError={(e) => {
              e.target.onerror = null; // prevent infinite loop
              e.target.src = '/images/profilePicture.jpg';
            }}
          />


          {/* Displaying Large Picture when clicked */}
          {showLargePicture && (
            // <div className={`${isNavOpen ? 'large-picture-squeezed' : 'large-picture'}`} onClick={() => setShowLargePicture(false)}>
            <div className={`${isNavOpen && isTablet ? 'large-picture-squeezed' : 'large-picture'}`}
              onClick={() => setShowLargePicture(false)}>


              <img
                className="users-all-picture-large"
                src={`${BACKEND}/media/profile_pictures/${userId}/profilePicture.jpg?v=${profilePictureKey}`}
                alt="Large Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/profilePicture.jpg'; // Default fallback image
                }}
              />
            </div>
          )}
          <h2>
            {users?.username?.includes("Deleted User")
              ? t('chat.chatWithDeleted')
              : users?.username?.includes("inactive")
                ? t('chat.chatWithInactive', { username: users.username.split('-').pop() })
                : t('chat.chatWith', { username: users?.username || t('chat.chatWith', { username: 'Unknown User' }) })}
          </h2>


          {superAdminSettings.allowSendMessages && adminSettings.allowSendMessages &&
            <div className="users-messaging-send">
              <input
                placeholder={t('chat.placeholder')}
                ref={inputRef}

                onChange={(e) => {
                  const inputValue = e.target.value;

                  setNewMessage(inputValue);

                }}

                onKeyDown={handleKeyDown}
                value={newMessage}
                required></input>
              <button
                disabled={!newMessage || newMessage.length > MAX_CHAR_LIMIT}
                onClick={handleSubmit}
                className="button-white"
              >
                {isLoading ? t('chat.sending') : t('chat.send')}
              </button>

              {newMessage.length > MAX_CHAR_LIMIT && (
                <div className="char-count">
                     {t('chat.charCount', {
                  count: newMessage.length,
                  limit: MAX_CHAR_LIMIT
                })}
                </div>
              )}


              {error && <p>{error}</p>}
            </div>
          }

          <div className="messages-container">
            <FontAwesomeIcon
              icon={faRefresh}
              style={{ marginBottom: '5px' }}
              title={t('chat.refreshMessages')}
              className="refresh-messages"
              onClick={() => fetchMessages(filters, setMessages, setIsLoading, setError, loggedInUser, userId, messages)}
            />

            {messages.length > 0 ? (
              messages.map((message) => {
                const isSender = message.sender === loggedInUser;  // Check if logged-in user is the sender
                const isConfirmingDelete = messageToDelete === message.id;  // Ensure using message.id here

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
                          {/* Check if message is deleted */}
                          <p className={message.is_deleted ? "deleted-message" : ""}>
                            {message.is_deleted && (
                              <FontAwesomeIcon icon={faBan}
                                style={{
                                  marginRight: "8px"
                                  // , marginBottom: "0px"
                                }}
                              />
                            )}
                            {message.is_deleted ? t('chat.deletedMessage') : message.content}
                          </p>
                          {/* Display delete icon only if the logged-in user is the sender and the message is not deleted */}
                          {!message.is_deleted && isSender &&
                            superAdminSettings.allowDeleteMessages && adminSettings.allowDeleteMessages &&
                            (
                              <FontAwesomeIcon
                                className="delete-chat-messsage"
                                icon={faTrashAlt}
                                onClick={() => handleShowConfirmDelete(message.id)} // Pass message.id here
                              />
                            )}
                        </>
                      ) : (
                        <div className="confirm-delete-chat">
                          <p
                            className="button-red"
                            onClick={() => {
                              if (messageToDelete) {
                                markMessageAsDeleted(messageToDelete); // Pass the messageId directly
                              }
                              setMessageToDelete(null);
                            }}
                          >
                            {t('chat.confirmDelete')}
                          </p>
                          <p
                            className="button-white"
                            style={{ color: "black" }}
                            onClick={() => setMessageToDelete(null)}
                          >
                                 {t('chat.cancel')}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="message-footer">
                      <span className="message-date">

                        {formatDate(message.date, i18n.language || 'en-US', t)}


                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>{t('chat.noMessages')}</p>
            )}





          </div>

        </div>

      </div>
    </div>
  );
}
