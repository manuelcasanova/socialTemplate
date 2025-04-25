import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Hooks
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

//Util functions
import { fetchPostById } from "./util_functions/FetchPosts";
import { formatDate } from "./util_functions/formatDate";
import fetchSenderNameById from "./util_functions/FetchSenderNameById";
import { fetchPostComments } from "./util_functions/FetchPostComments";

//Styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faMagnifyingGlass, faLock, faEarth, faUserFriends, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import Error from "../Error";
import PostCommentsInteractions from "./PostCommentsInteractions";

const BACKEND = process.env.REACT_APP_BACKEND_URL;



export default function PostComments({ isNavOpen }) {

  const navigate = useNavigate();
  const handleClose = () => navigate(-1);
  const { param } = useParams();
  const { auth } = useAuth();
  const loggedInUserId = auth.userId
  const axiosPrivate = useAxiosPrivate();
  const loggedInUser = auth.userId;
  const postId = Number(param);
  const [post, setPost] = useState();
  const [senderInfo, setSenderInfo] = useState(null);
  const [postComments, setPostComments] = useState([]);
  const [isFlagged, setIsFlagged] = useState(false);
  const [isInappropriate, setIsInappropriate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageExistsMap, setImageExistsMap] = useState({});
  const [showLargePicture, setShowLargePicture] = useState(null);
  const [newMessage, setNewMessage] = useState("")
  const MAX_CHAR_LIMIT = 1000;
  const [errMsg, setErrMsg] = useState('');
  const [flaggedComments, setFlaggedComments] = useState(new Set());
const [inappropriateComments, setInappropriateComments] = useState(new Set());

  // console.log("post", post)
  // console.log("postId", postId)
  // console.log("postComments", postComments)


  const postSender = post?.[0]?.sender;
  const postDate = post?.[0]?.date;
  const postVisibility = post?.[0]?.visibility;
  const postContent = post?.[0]?.content;
  const userId = postSender;
  const inputRef = useRef(null);
  const errRef = useRef();

  useEffect(() => {
    const checkFlaggedComments = async () => {
      try {
        const flagged = new Set();
  
        for (const comment of postComments) {
          const res = await axiosPrivate.get("/reports-comments/has-reported", {
            params: {
              comment_id: comment.id,
              user_id: loggedInUserId,
            },
          });
  
          if (res.data?.hasReported) {
            flagged.add(comment.id);
          }
        }
  
        setFlaggedComments(flagged);
      } catch (err) {
        console.error("Error checking flagged comments:", err);
      }
    };
  
    if (postComments.length > 0 && loggedInUserId) {
      checkFlaggedComments();
    }
  }, [postComments, loggedInUserId]);
  

  useEffect(() => {
    const checkHiddenComments = async () => {
      try {
        const hidden = new Set();
  
        for (const comment of postComments) {
          const res = await axiosPrivate.get("/reports-comments/has-hidden", {
            params: {
              comment_id: comment.id,
              user_id: loggedInUserId,
            },
          });
  
          if (res.data?.hasHidden) {
            hidden.add(comment.id);
          }
        }
  
        setInappropriateComments(hidden);
      } catch (err) {
        console.error("Error checking inappropriate comments:", err);
      }
    };
  
    if (postComments.length > 0 && loggedInUserId) {
      checkHiddenComments();
    }
  }, [postComments, loggedInUserId]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)

    try {

      setIsLoading(true)
      await axiosPrivate.post(`${BACKEND}/posts/comments/send`, {
        newMessage,
        loggedInUser,
        postId
      });
      setError(null)

      fetchPostComments({ postId, setPostComments, setError, setIsLoading, loggedInUserId })

      setNewMessage("")

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    } catch (err) {
      console.log(err)
      if (!err?.response) {
        setError('Server is unreachable. Please try again later.');
        setErrMsg('No Server Response');
      } else if (err.response?.status === 403) {
        setErrMsg('This email was not found in our database');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Attempt Failed');
      }
      errRef.current?.focus();
    } finally {
      setIsLoading(false); // Set loading to false once request completes
    }
  }


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  };

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

  useEffect(() => {
    const checkSenderImage = async () => {
      if (postSender) {
        const exists = await profilePictureExists(postSender);
        setImageExistsMap((prev) => ({ ...prev, [postSender]: exists }));
      }
    };

    checkSenderImage();
  }, [postSender]);



  // console.log("postSenderId", postSender)


  useEffect(() => {
    fetchPostById(postId, setPost, setIsLoading, setError);
    fetchPostComments({ postId, setPostComments, setError, setIsLoading, loggedInUserId })
  }, [postId]);

  useEffect(() => {
    if (postSender) {
      fetchSenderNameById(postSender, setIsLoading, setError, setSenderInfo);
    }
  }, [postSender]);

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, []);

  const handleImageClick = (userId) => {
    setShowLargePicture(userId);
  };

  useEffect(() => {
    const checkIfPostIsFlagged = async () => {
      try {
        const res = await axiosPrivate.get("/reports/has-reported", {
          params: {
            post_id: postId,
            user_id: loggedInUserId,
          },
        });

        if (res.data?.hasReported) {
          setIsFlagged(true);
        }
      } catch (err) {
        console.error("Error checking report status:", err);
      }
    };

    if (postId && loggedInUserId) {
      checkIfPostIsFlagged();
    }
  }, [postId, loggedInUserId, axiosPrivate]);

  useEffect(() => {
    const checkIfPostIsInappropriate = async () => {
      try {
        const res = await axiosPrivate.get("/reports/has-hidden", {
          params: {
            post_id: postId,
            user_id: loggedInUserId,
          },
        });
  
        if (res.data?.hasHidden) {
          setIsInappropriate(true);
        }
      } catch (err) {
        console.error("Error checking hidden status:", err);
      }
    };
  
    if (postId && loggedInUserId) {
      checkIfPostIsInappropriate();
    }
  }, [postId, loggedInUserId]);
  

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case "public":
        return faEarth;
      case "private":
        return faLock;
      case "followers":
        return faUserFriends;
      default:
        return faEarth;
    }
  };

  // Function to get the tooltip text for visibility
  const getVisibilityTooltip = (visibility) => {
    switch (visibility) {
      case "public":
        return "Public";
      case "private":
        return "Private";
      case "followers":
        return "Followers only";
      default:
        return "Public post";
    }
  };

  useEffect(() => {
    const checkCommenterImages = async () => {
      const newMap = { ...imageExistsMap };

      for (const comment of postComments) {
        const commenterId = comment.commenter;
        if (newMap[commenterId] === undefined) {
          const exists = await profilePictureExists(commenterId);
          newMap[commenterId] = exists;
        }
      }

      setImageExistsMap(newMap);
    };

    if (postComments.length > 0) {
      checkCommenterImages();
    }
  }, [postComments]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error isNavOpen={isNavOpen} error={error} />;
  }


  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-posts">
        <div className="centered-container centered-container-post"
        // style={{ minHeight: '400px' }}
        >
          <div className="centered-container-button-close">
            <button
              className="button-white white button-smaller"
              onClick={handleClose}
            >x</button>
          </div>


          <div className="post-info post-info-modal">
            <div className="post-header">
              <div className="post-header-photo">
                {imageExistsMap[postSender] ? (
                  <img
                    className="user-row-social-small-img"
                    style={{ marginRight: "0px" }}
                    src={`${BACKEND}/media/profile_pictures/${postSender}/profilePicture.jpg`}
                    alt="User"
                    onClick={() => handleImageClick(postSender)}
                  />
                ) : (
                  <img
                    className="user-row-social-small-img"
                    style={{ marginRight: "0px" }}
                    src={`${BACKEND}/media/profile_pictures/profilePicture.jpg`}
                    alt="User"
                    onClick={() => handleImageClick(postSender)}
                  />
                )}



              </div>
              <div className="post-header-sender-and-date">
                <div className="post-header-sender-and-visibility"
                  onClick={() => {
                    if (postSender === loggedInUser) {
                      navigate("/profile/myaccount");
                    } else {
                      navigate(`/social/users/${postSender}`);
                    }
                  }}
                >
                  {/* {postSender} */}
                  {senderInfo ? senderInfo : <LoadingSpinner />}
                  <FontAwesomeIcon
                    icon={getVisibilityIcon(postVisibility)}
                    title={getVisibilityTooltip(postVisibility)}
                  />
                </div>
                <p className="post-header-date">
                  {formatDate(postDate)}
                </p>

              </div>


            </div>
            {isInappropriate ? (
  <div>
    <p style={{ fontStyle: 'italic', color: 'darkred' }}>
      This post has been reviewed by a moderator and deemed inappropriate. It has been hidden.
    </p>
    {auth?.roles?.includes("Moderator") && (
      <div style={{ backgroundColor: "#fbe9e9", padding: "10px", borderRadius: "5px", marginTop: "0.5em" }}>
        <p style={{ fontStyle: 'italic', color: 'darkslategray' }}><strong>Original message visible for moderators:</strong></p>
        <p style={{ color: 'black' }}>{postContent}</p>
      </div>
    )}
  </div>
) : isFlagged ? (
  <div>
    <p style={{ fontStyle: 'italic' }}>
      This post has been reported as inappropriate and is pending review by a moderator.
      You can still see it by clicking below, but discretion is advised.
    </p>
    <button
      className="button-white white button-smaller"
      onClick={() => setIsFlagged(false)}
    >
      Click to view
    </button>
  </div>
) : (
  <p>{postContent}</p>
)}



          </div>

          {showLargePicture && (
            <div
              className={`${isNavOpen ? 'large-picture-squeezed' : 'large-picture'}`}
              onClick={() => setShowLargePicture(null)}
            >
              <img
                className="users-all-picture-large"
                src={`${BACKEND}/media/profile_pictures/${showLargePicture}/profilePicture.jpg`}
                alt="Profile"
                onError={(e) => {
                  // Fallback image handling
                  e.target.onerror = null;
                  e.target.src = `${BACKEND}/media/profile_pictures/profilePicture.jpg`;
                }}
              />
            </div>
          )}
          <div className="centered-container centered-container-post flex-row">
            <input
              placeholder="Aa"
              ref={inputRef}
              onChange={(e) => {
                const inputValue = e.target.value;
                setNewMessage(inputValue);
              }}
              onKeyDown={handleKeyDown}
              value={newMessage}
              required></input>
            <button
              onClick={handleSubmit}
              className="button-white white"
              style={{ width: '100px', margin: 'auto' }}
              disabled={!newMessage || newMessage.length > MAX_CHAR_LIMIT}
            >
              <FontAwesomeIcon
                icon={faPaperPlane}
                title='Send'
              />
            </button>
          </div>


          <div className="centered-container centered-container-post">
            {postComments.map((comment) => (
              < div key={comment.id}>
                <div className="post-comment-container" key={comment.id}>
                  <div className="post-comment-image">
                    {imageExistsMap[comment.commenter] ? (
                      <img
                        className="user-row-social-small-img"
                        style={{ marginRight: "0px" }}
                        src={`${BACKEND}/media/profile_pictures/${comment.commenter}/profilePicture.jpg`}
                        alt="User"
                        onClick={() => handleImageClick(comment.commenter)}
                      />

                    ) : (
                      <img
                        className="user-row-social-small-img"
                        style={{ marginRight: "0px" }}
                        src={`${BACKEND}/media/profile_pictures/profilePicture.jpg`}
                        alt="User"
                        onClick={() => handleImageClick(comment.commenter)}
                      />
                    )}
                  </div>
                  <div className="post-comment-name-content">
                    <div
                      style={{ fontWeight: 'bold' }}
                      onClick={() => {
                        if (comment.commenter === loggedInUser) {
                          navigate("/profile/myaccount");
                        } else {
                          navigate(`/social/users/${comment.commenter}`);
                        }
                      }}
                    >{comment.username}</div>
{inappropriateComments.has(comment.id) ? (
  <div>
    <p style={{ fontStyle: 'italic', color: 'darkred' }}>
      This comment has been reviewed and hidden for being inappropriate.
    </p>
    {auth?.roles?.includes("Moderator") && (
      <div style={{ backgroundColor: "#fbe9e9", padding: "10px", borderRadius: "5px", marginTop: "0.5em" }}>
        <p style={{ fontStyle: 'italic', color: 'darkslategray' }}><strong>Original message visible for moderators:</strong></p>
        <p style={{ color: 'black' }}>{comment.content}</p>
      </div>
    )}
  </div>
) : flaggedComments.has(comment.id) ? (
  <div>
    <p style={{ fontStyle: 'italic' }}>
      This comment has been reported and is pending moderator review.
    </p>
    <button
      className="button-white white button-smaller"
      onClick={() => {
        const updated = new Set(flaggedComments);
        updated.delete(comment.id);
        setFlaggedComments(updated);
      }}
    >
      Click to view
    </button>
  </div>
) : (
  <div>{comment.content}</div>
)}

                  </div>
                </div>

                <PostCommentsInteractions commentId={comment.id} commentDate={comment.date} loggedInUserId={loggedInUserId} hideFlag={inappropriateComments.has(comment.id)} setError={setError}/>


              </div>
            ))

            }




          </div>
        </div>
      </div>


    </div>
  )
}