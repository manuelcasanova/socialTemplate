import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

//Util functions
import { fetchPostById } from "./util_functions/FetchPosts";
import { useEffect } from "react";
import { formatDate } from "./util_functions/formatDate";


//Styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faMagnifyingGlass, faLock, faEarth, faUserFriends } from "@fortawesome/free-solid-svg-icons";

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import Error from "../Error";

export default function PostComments({ isNavOpen }) {

  const navigate = useNavigate();
  const handleClose = () => navigate(-1);
  const { param } = useParams();
  const postId = Number(param);
  const [post, setPost] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("post", post)

  useEffect(() => {
    fetchPostById(postId, setPost, setIsLoading, setError)

  }, [postId])

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

  if (!post || !Array.isArray(post) || post.length === 0) {
    return <div>No post found.</div>;
  }
  
  const postSender = post[0].sender;
  const postDate = post[0].date;
  const postVisibility = post[0].visibility;
  const postContent = post[0].content;

  
  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="centered-container centered-container-post" style={{ minHeight: '400px' }}>
        <div className="centered-container-button-close">
          <button
            className="button-white"
            onClick={handleClose}
          >x</button>
        </div>


        <div className="post-info">
          <div className="post-header">
            <div className="post-header-photo">
              Photo
            </div>
            <div className="post-header-sender-and-date">
              <div className="post-header-sender-and-visibility">
                {postSender}
                <FontAwesomeIcon
                  icon={getVisibilityIcon(post.visibility)}
                  title={getVisibilityTooltip(post.visibility)}
                />
              </div>
              <p className="post-header-date">
                {formatDate(postDate)}
              </p>

            </div>


          </div>
          <p>{postContent}</p>

        </div>

      </div>
    </div>
  )
}