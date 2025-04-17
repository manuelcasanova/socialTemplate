import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

//Util functions
import { fetchPostById } from "./util_functions/FetchPosts";
import { formatDate } from "./util_functions/formatDate";
import fetchSenderNameById from "./util_functions/FetchSenderNameById";


//Styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faMagnifyingGlass, faLock, faEarth, faUserFriends } from "@fortawesome/free-solid-svg-icons";

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import Error from "../Error";

const BACKEND = process.env.REACT_APP_BACKEND_URL;



export default function PostComments({ isNavOpen }) {

  const navigate = useNavigate();
  const handleClose = () => navigate(-1);
  const { param } = useParams();
  const postId = Number(param);
  const [post, setPost] = useState();
  const [senderInfo, setSenderInfo] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageExistsMap, setImageExistsMap] = useState({});
  const [showLargePicture, setShowLargePicture] = useState(null);


  // console.log("post", post)
  // console.log("postId", postId)

  
  const postSender = post?.[0]?.sender;
  const postDate = post?.[0]?.date;
  const postVisibility = post?.[0]?.visibility;
  const postContent = post?.[0]?.content;
  const userId = postSender;

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
  }, [postId]);

  useEffect(() => {
    if (postSender) {
      fetchSenderNameById(postSender, setIsLoading, setError, setSenderInfo);
    }
  }, [postSender]);

  const handleImageClick = (userId) => {
    setShowLargePicture(userId);
  };
  
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error isNavOpen={isNavOpen} error={error} />;
  }

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="centered-container centered-container-post" style={{ minHeight: '400px' }}>
        <div className="centered-container-button-close">
          <button
            className="button-white white"
            onClick={handleClose}
          >x</button>
        </div>


        <div className="post-info">
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
                          onClick={() => handleImageClick(post.sender)}
                        />
                      )}



                    </div>
            <div className="post-header-sender-and-date">
              <div className="post-header-sender-and-visibility">
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
          <p>{postContent}</p>

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

      </div>
    </div>
  )
}