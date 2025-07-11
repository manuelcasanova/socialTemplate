import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Hooks
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

//Util functions
import { fetchPostById } from "./util_functions/FetchPosts";
import { formatDate } from "./util_functions/formatDate";
import fetchSenderNameById from "./util_functions/FetchSenderNameById";
import { fetchPostCommentsReactionsData } from "./util_functions/FetchPostCommentsReactions";

//Styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown, faSmile, faLaugh, faSadTear, faFaceAngry } from "@fortawesome/free-solid-svg-icons";

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import Error from "../Error";

//Translation
import { useTranslation } from 'react-i18next';



const BACKEND = process.env.REACT_APP_BACKEND_URL;



export default function PostCommentReactions({ isNavOpen, profilePictureKey }) {

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const handleClose = () => navigate(-1);
  const { param } = useParams();
  const { auth } = useAuth();
  const loggedInUserId = auth.userId;
  const axiosPrivate = useAxiosPrivate();
  const loggedInUser = auth.userId;
  const commentId = Number(param);
  const [post, setPost] = useState();
  const [senderInfo, setSenderInfo] = useState(null);
  const [postCommentReactions, setPostCommentReactions] = useState([]);
  // console.log("posts Reactions", postCommentReactions)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageExistsMap, setImageExistsMap] = useState({});
  const [showLargePicture, setShowLargePicture] = useState(null);


  const [errMsg, setErrMsg] = useState('');

  const inputRef = useRef(null);
  const errRef = useRef();

  const postReactor = post?.[0]?.sender;

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
    const checkAllReactorImages = async () => {
      const newMap = {};
      for (const reaction of postCommentReactions) {
        const userId = reaction.user_id;
        if (!(userId in imageExistsMap)) {
          const exists = await profilePictureExists(userId);
          newMap[userId] = exists;
        }
      }
      setImageExistsMap((prev) => ({ ...prev, ...newMap }));
    };

    if (postCommentReactions.length > 0) {
      checkAllReactorImages();
    }
  }, [postCommentReactions]);



  useEffect(() => {
    fetchPostById(commentId, setPost, setIsLoading, setError);
    fetchPostCommentsReactionsData({ commentId, setPostCommentReactions, setError, setIsLoading, loggedInUserId })
  }, [commentId]);

  useEffect(() => {
    if (postReactor) {
      fetchSenderNameById(postReactor, setIsLoading, setError, setSenderInfo);
    }
  }, [postReactor]);

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


          {showLargePicture && (
            <div
              className={`${isNavOpen ? 'large-picture-squeezed' : 'large-picture'}`}
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

          <div className="centered-container centered-container-reaction">
            {postCommentReactions.length === 0 ? (
              <p style={{ textAlign: "center", fontStyle: "italic", color: "#666" }}>
               {t("postReactions.commentNoReactions")}
              </p>
            ) : (

              postCommentReactions.map((reaction) => (
                <div key={reaction.id}>
                  <div className="row-reaction">
                    {imageExistsMap[reaction.user_id] ? (
                      <img
                        className="user-row-social-small-img"
                        style={{ marginRight: "0px" }}
                        src={`${BACKEND}/media/profile_pictures/${reaction.user_id}/profilePicture.jpg?v=${profilePictureKey}`}
                        alt="User"
                        onClick={() => handleImageClick(reaction.user_id)}
                      />
                    ) : (
                      <img
                        className="user-row-social-small-img"
                        style={{ marginRight: "0px" }}
                        src={`${BACKEND}/media/profile_pictures/profilePicture.jpg`}
                        alt="User"
                        onClick={() => handleImageClick(reaction.user_id)}
                      />
                    )}

                    <div>
                      {reaction.reaction_type === "like" && <FontAwesomeIcon icon={faThumbsUp} />}
                      {reaction.reaction_type === "dislike" && <FontAwesomeIcon icon={faThumbsDown} />}
                      {reaction.reaction_type === "smile" && <FontAwesomeIcon icon={faSmile} />}
                      {reaction.reaction_type === "laugh" && <FontAwesomeIcon icon={faLaugh} />}
                      {reaction.reaction_type === "cry" && <FontAwesomeIcon icon={faSadTear} />}
                      {reaction.reaction_type === "angry" && <FontAwesomeIcon icon={faFaceAngry} />}
                    </div>

                    <div style={{ fontWeight: 'bold' }}
                      onClick={() => {
                        if (reaction.user_id === loggedInUser) {
                          navigate("/profile/myaccount");
                        } else {
                          navigate(`/social/users/${reaction.user_id}`);
                        }
                      }}
                    >{reaction.username}</div>


                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
