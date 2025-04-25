//Util functions
import { formatDate } from "./util_functions/formatDate"
import { fetchPostCommentsReactionsCount } from "./util_functions/FetchPostCommentsReactions"
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"

//hooks
import { axiosPrivate } from '../../../api/axios';

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner"
import FlagComment from "./FlagComment";

//Styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faThumbsUp, faThumbsDown, faSmile, faLaugh, faSadTear, faBan, faEllipsisH, faXmark } from "@fortawesome/free-solid-svg-icons";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

export default function PostCommentsInteractions({ commentId, commentDate, loggedInUserId, hideFlag, setError }) {

  const navigate = useNavigate();
  const [reactionsCount, setReactionsCount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [reactOption, setReactOption] = useState(false)
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [showEllipsisMenu, setShowEllipsisMenu] = useState(false);
  const errRef = useRef();

  const handleShowReactOptions = () => {
    setReactOption(prevState => !prevState);
  };

  const handleReactionSelect = (reaction) => {
    setSelectedReaction(reaction);
    setReactOption(false);
    sendReactionToBackend(reaction);
  };

  useEffect(() => {
    fetchPostCommentsReactionsCount({ commentId, setReactionsCount, setError, setIsLoading, loggedInUserId })
  }, [])

  const sendReactionToBackend = async (reactionType) => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.post(`${BACKEND}/posts/comments/reactions/send`, {
        loggedInUserId,
        commentId,
        reactionType,
      });

      setSelectedReaction(reactionType);

      handleShowReactOptions();

      fetchPostCommentsReactionsCount({ commentId, setReactionsCount, setError, setIsLoading, loggedInUserId })


    } catch (err) {
      console.log(err);
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 403) {
        setErrMsg('Forbidden: You are not allowed to react');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized: Please log in');
      } else if (err.response?.status === 400) {
        setErrMsg('Bad Request: Please try again');
      } else {
        setErrMsg('Attempt Failed');
      }
      errRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="post-comment-interactions">
      <div className="post-comment-date">{formatDate(commentDate)}</div>
      <div className="post-comment-react"
        onClick={handleShowReactOptions}>
        {!reactOption && (
          <>
            <div className='post-interactions-text'>
              React
            </div>
          </>
        )}

        {reactOption && (
          <div className="reaction-options-small">
            <div onClick={() => handleReactionSelect('remove-reaction')} title="Remove">
              <FontAwesomeIcon icon={faBan} />
            </div>
            <div onClick={() => handleReactionSelect('like')} title="Like">
              <FontAwesomeIcon icon={faThumbsUp} />
            </div>
            <div onClick={() => handleReactionSelect('dislike')} title="Dislike">
              <FontAwesomeIcon icon={faThumbsDown} />
            </div>
            <div onClick={() => handleReactionSelect('laugh')} title="Laugh">
              <FontAwesomeIcon icon={faLaugh} />
            </div>
            <div onClick={() => handleReactionSelect('cry')} title="Cry">
              <FontAwesomeIcon icon={faSadTear} />
            </div>
            <div onClick={() => handleReactionSelect('smile')} title="Smile">
              <FontAwesomeIcon icon={faSmile} />
            </div>
          </div>

        )}

      </div>



      <div className='post-interactions-top-left-reaction'
        onClick={() => navigate(`/posts/comments/reactions/${commentId}`)}
      >


        <div className='post-interactions-text'>
          {isLoading ? <LoadingSpinner /> : `${reactionsCount ?? 0}`}
        </div>
        <FontAwesomeIcon icon={faSmile} />
      </div>


      {!showEllipsisMenu && (
        <FontAwesomeIcon icon={faEllipsisH}
          onClick={() => setShowEllipsisMenu(prev => !prev)}
        />
      )}
      {showEllipsisMenu && (
        <div className="post-menu-dropdown">
          {/* <PostDelete setPosts={setPosts} postId={postId} postSender={postSender} loggedInUser={loggedInUser} />
          */}
          <FlagComment commentId={commentId} loggedInUserId={loggedInUserId} hideFlag={hideFlag} setError={setError} />
          <FontAwesomeIcon icon={faXmark}
            onClick={() => setShowEllipsisMenu(prev => !prev)}
          />
        </div>
      )}





    </div>
  )
}