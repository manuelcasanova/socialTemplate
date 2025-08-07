import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Hooks
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

//Context
import { useGlobalSuperAdminSettings } from "../../../context/SuperAdminSettingsProvider";
import { useGlobalAdminSettings } from "../../../context/AdminSettingsProvider";
import ScreenSizeContext from "../../../context/ScreenSizeContext";

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

//Translation
import { useTranslation } from 'react-i18next';


const BACKEND = process.env.REACT_APP_BACKEND_URL;

export default function PostComments({ isNavOpen, profilePictureKey }) {

  const { t, i18n } = useTranslation();
  const { superAdminSettings } = useGlobalSuperAdminSettings();
  const { adminSettings } = useGlobalAdminSettings();
  const navigate = useNavigate();
  const handleClose = () => navigate(-1);
  const { param } = useParams();
  const { auth } = useAuth();
  const isSuperAdmin = auth.roles.includes('SuperAdmin');
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
  const { screenSize } = useContext(ScreenSizeContext);
  const { isSmartphone, isTablet, isDesktop, width } = screenSize;
  const [imageExistsMap, setImageExistsMap] = useState({});
  const [showLargePicture, setShowLargePicture] = useState(null);
  const [newMessage, setNewMessage] = useState("")
  const MAX_CHAR_LIMIT = 1000;
  const [errMsg, setErrMsg] = useState('');
  const [flaggedComments, setFlaggedComments] = useState(new Set());
  const [inappropriateComments, setInappropriateComments] = useState(new Set());
  const [checksDone, setChecksDone] = useState(false);
  const [commentChecksDone, setCommentChecksDone] = useState(false);

  // console.log("post", post)
  // console.log("postId", postId)
  // console.log("postComments", postComments)


  const postSender = post?.[0]?.sender;
  // console.log('postSender', postSender)
  const postDate = post?.[0]?.date;
  const postVisibility = post?.[0]?.visibility;

  //Real App
  // const postContent = post?.[0]?.content;
  //En Real App

  //Test App
  const postContent = post?.[0]?.id <= 7
    ? t(`postsSeeds.post${post[0].id}`)
    : post?.[0]?.content;
  //End Test App



  const userId = postSender;
  const inputRef = useRef(null);
  const errRef = useRef();

  useEffect(() => {
    const checkPostFlags = async () => {
      setChecksDone(false);
      try {
        const [reportRes, hiddenRes] = await Promise.all([
          axiosPrivate.get("/reports/has-reported", {
            params: { post_id: postId, user_id: loggedInUserId },
          }),
          axiosPrivate.get("/reports/has-hidden", {
            params: { post_id: postId, user_id: loggedInUserId },
          }),
        ]);

        setIsFlagged(reportRes.data?.hasReported || false);
        setIsInappropriate(hiddenRes.data?.hasHidden || false);
      } catch (err) {
        console.error("Error checking post report/hidden status:", err);
      } finally {
        setChecksDone(true);
      }
    };

    if (postId && loggedInUserId) {
      checkPostFlags();
    }
  }, [postId, loggedInUserId, axiosPrivate]);

  useEffect(() => {
    const checkCommentFlags = async () => {
      setCommentChecksDone(false);
      try {
        const flagged = new Set();
        const hidden = new Set();

        await Promise.all(postComments.map(async (comment) => {
          const [reportRes, hiddenRes] = await Promise.all([
            axiosPrivate.get("/reports-comments/has-reported", {
              params: { comment_id: comment.id, user_id: loggedInUserId },
            }),
            axiosPrivate.get("/reports-comments/has-hidden", {
              params: { comment_id: comment.id, user_id: loggedInUserId },
            }),
          ]);

          if (reportRes.data?.hasReported) {
            flagged.add(comment.id);
          }
          if (hiddenRes.data?.hasHidden) {
            hidden.add(comment.id);
          }
        }));

        setFlaggedComments(flagged);
        setInappropriateComments(hidden);
      } catch (err) {
        console.error("Error checking comment flags:", err);
      } finally {
        setCommentChecksDone(true);
      }
    };

    if (postComments.length > 0 && loggedInUserId) {
      checkCommentFlags();
    } else {
      setCommentChecksDone(true);
    }
  }, [postComments, loggedInUserId, axiosPrivate]);





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

  useEffect(() => {
    fetchPostById(postId, setPost, setIsLoading, setError);
    {
      (superAdminSettings.allowComments && adminSettings.allowComments || isSuperAdmin) &&
        fetchPostComments({ postId, setPostComments, setError, setIsLoading, loggedInUserId })
    }
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

  if (isLoading || !checksDone || !commentChecksDone) {
    return <LoadingSpinner />;
  }

  if (error) {
    // console.log("error if error", error)
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

                {post && postSender ? (
                  <img
                    className="user-row-social-small-img"
                    onClick={() => setShowLargePicture(postSender)}
                    src={`${BACKEND}/media/profile_pictures/${postSender}/profilePicture.jpg?v=${profilePictureKey}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/profilePicture.jpg';
                    }}
                    alt="Profile"
                  />
                ) : (
                  <img
                    className="user-row-social-small-img"
                    src="/images/profilePicture.jpg"
                    alt="Profile"
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


                  {formatDate(postDate, i18n.language || 'en-US', t)}
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
                    <p style={{ color: 'black' }}>
                      {postContent}
                    </p>
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
            ) : post?.[0]?.is_deleted ? (
              <>
                <p>*** DELETED POST ***</p>
                <p style={{ textDecoration: 'line-through' }}>{postContent}</p>
              </>
            ) : (
              <p>
                {postContent}
              </p>
            )}


          </div>

          {showLargePicture && (
            <div
              className={`${isNavOpen && isTablet ? 'large-picture-squeezed' : 'large-picture'}`}
              onClick={() => setShowLargePicture(null)}
            >
              <img
                className="users-all-picture-large"
                src={`${BACKEND}/media/profile_pictures/${showLargePicture}/profilePicture.jpg?v=${profilePictureKey}`}
                alt="Profile"
                onError={(e) => {
                  // Fallback image handling
                  e.target.onerror = null;
                  e.target.src = '/images/profilePicture.jpg';
                }}
              />
            </div>
          )}
          {(superAdminSettings.allowComments && adminSettings.allowComments || isSuperAdmin) &&
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
          }


          {(superAdminSettings.allowComments || isSuperAdmin) &&
            <div className="centered-container centered-container-post">
              {postComments.map((comment) => (
                < div key={comment.id}>
                  <div className="post-comment-container" key={comment.id}>
                    <div className="post-comment-image">
                      <img
                        className="user-row-social-small-img"
                        onClick={() => setShowLargePicture(comment.commenter)}
                        src={`${BACKEND}/media/profile_pictures/${comment.commenter}/profilePicture.jpg?v=${profilePictureKey}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/profilePicture.jpg';
                        }}
                        alt="Profile"
                      />
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

                  <PostCommentsInteractions commentId={comment.id} commentDate={comment.date} commentCommenter={comment.commenter} loggedInUserId={loggedInUserId} hideFlag={inappropriateComments.has(comment.id)} setError={setError} setPostComments={setPostComments} />


                </div>
              ))

              }




            </div>
          }
        </div>
      </div>


    </div>
  )
}