//Context
import { useGlobalSuperAdminSettings } from '../../../context/SuperAdminSettingsProvider';
import { useGlobalAdminSettings } from '../../../context/AdminSettingsProvider';

//Util functions
import { formatDate } from "./util_functions/formatDate"
import { fetchPostCommentsReactionsCount } from "./util_functions/FetchPostCommentsReactions"
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"

//hooks
import { axiosPrivate } from '../../../api/axios';
import useAuth from '../../../hooks/useAuth';

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner"
import FlagComment from "./FlagComment";
import CommentDelete from "./CommentDelete";

//Styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faThumbsUp, faThumbsDown, faSmile, faLaugh, faSadTear, faBan, faEllipsisH, faXmark } from "@fortawesome/free-solid-svg-icons";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

export default function PostCommentsInteractions({ commentId, commentDate, commentCommenter, loggedInUserId, hideFlag, setError, setPostComments }) {

  const {auth} = useAuth()
  const isSuperAdmin = auth.roles.includes('SuperAdmin');

  const { superAdminSettings } = useGlobalSuperAdminSettings();
  const { adminSettings } = useGlobalAdminSettings();
  const navigate = useNavigate();
  const [reactionsCount, setReactionsCount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  // const [errMsg, setErrMsg] = useState("");
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
    if (superAdminSettings.allowCommentReactions && adminSettings.allowCommentReactions) {
      fetchPostCommentsReactionsCount({ commentId, setReactionsCount, setError, setIsLoading, loggedInUserId })
    }
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
        setError('No Server Response');
      } else if (err.response?.status === 403) {
        setError('Forbidden: You are not allowed to react');
      } else if (err.response?.status === 401) {
        setError('Unauthorized: Please log in');
      } else if (err.response?.status === 400) {
        setError('Bad Request: Please try again');
      } else {
        setError('Attempt Failed');
      }
      errRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="post-comment-interactions">
      <div className="post-comment-date">{formatDate(commentDate)}</div>

      {((superAdminSettings.allowCommentReactions && adminSettings.allowCommentReactions) || isSuperAdmin) && <>
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
      </>} 

      {(superAdminSettings.allowDeleteComments || superAdminSettings.allowFlagComments || isSuperAdmin) && (
        <>

          {!showEllipsisMenu && (
            <FontAwesomeIcon icon={faEllipsisH}
              onClick={() => setShowEllipsisMenu(prev => !prev)}
            />
          )}
          {showEllipsisMenu && (
            <div className="post-menu-dropdown">
              {((superAdminSettings.allowDeleteComments && adminSettings.allowDeleteComments) || isSuperAdmin) &&
                <CommentDelete commentId={commentId} loggedInUserId={loggedInUserId} commentCommenter={commentCommenter} setError={setError} setPostComments={setPostComments} />
              }
              {((superAdminSettings.allowFlagComments && adminSettings.allowFlagComments)|| isSuperAdmin) &&
                <FlagComment commentId={commentId} loggedInUserId={loggedInUserId} hideFlag={hideFlag} setError={setError} />
              }
              <FontAwesomeIcon icon={faXmark}
                onClick={() => setShowEllipsisMenu(prev => !prev)}
              />
            </div>
          )}

        </>)}





    </div>

  )
}