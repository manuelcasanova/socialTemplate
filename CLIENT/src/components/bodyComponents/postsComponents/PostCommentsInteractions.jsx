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
import { faComment, faThumbsUp, faThumbsDown, faSmile, faLaugh, faSadTear, faFaceAngry, faBan, faEllipsisH, faXmark } from "@fortawesome/free-solid-svg-icons";

//Translation
import { useTranslation } from 'react-i18next';


const BACKEND = process.env.REACT_APP_BACKEND_URL;

export default function PostCommentsInteractions({ commentId, commentDate, commentCommenter, loggedInUserId, hideFlag, setError, setPostComments }) {

  const { t, i18n } = useTranslation();
  const { auth } = useAuth()
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
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

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
        setError(t("postsInteractions.noServerResponse"));
      } else if (err.response?.status === 403) {
        setError(t("postsInteractions.forbidden"));
      } else if (err.response?.status === 401) {
        setError(t("postsInteractions.unauthorized"));
      } else if (err.response?.status === 400) {
        setError(t("postsInteractions.badRequest"));
      } else {
        setError(t("postsInteractions.attemptFailed"));
      }
      errRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const canDelete = adminSettings.allowDeleteComments && loggedInUserId === commentCommenter;
  const canFlag = adminSettings.allowFlagComments && loggedInUserId !== commentCommenter;
  const shouldShowEllipsis = (canDelete || canFlag) && (!hideFlag || loggedInUserId === commentCommenter);



  return (
    <div
      className="post-comment-interactions"
      style={!showConfirmDelete ? { gap: "3em" } : {}}
    >
      {!showConfirmDelete &&
        <div className="post-comment-date">
          {formatDate(commentDate, i18n.language || 'en-US', t)}
        </div>
      }

      {((superAdminSettings.allowCommentReactions && adminSettings.allowCommentReactions && !showConfirmDelete) || isSuperAdmin) && <>
        <div className="post-comment-react"
          onClick={handleShowReactOptions}>
          {!reactOption && !showConfirmDelete && (
            <>

              <div className='post-interactions-text'>
                {t("postsInteractions.react")}
              </div>
            </>
          )}

          {reactOption && (
            <div className="reaction-options-small">
              <div onClick={() => handleReactionSelect('remove-reaction')} title={t("postsInteractions.removeReaction")}>
                <FontAwesomeIcon icon={faBan} />
              </div>
              <div onClick={() => handleReactionSelect('like')} title={t("postsInteractions.like")}>
                <FontAwesomeIcon icon={faThumbsUp} />
              </div>
              <div onClick={() => handleReactionSelect('dislike')} title={t("postsInteractions.dislike")}>
                <FontAwesomeIcon icon={faThumbsDown} />
              </div>
              <div onClick={() => handleReactionSelect('laugh')} title={t("postsInteractions.laugh")}>
                <FontAwesomeIcon icon={faLaugh} />
              </div>
              <div onClick={() => handleReactionSelect('smile')} title={t("postsInteractions.smile")}>
                <FontAwesomeIcon icon={faSmile} />
              </div>
              <div onClick={() => handleReactionSelect('cry')} title={t("postsInteractions.cry")}>
                <FontAwesomeIcon icon={faSadTear} />
              </div>
              <div onClick={() => handleReactionSelect('angry')} title={t("postsInteractions.angry")}>
                <FontAwesomeIcon icon={faFaceAngry} />
              </div>

            </div>

          )}

        </div>

        {!showConfirmDelete &&
          <div className='post-interactions-top-left-reaction'
            onClick={() => navigate(`/posts/comments/reactions/${commentId}`)}
          >
            <div className='post-interactions-text'>
              {isLoading ? <LoadingSpinner /> : `${reactionsCount ?? 0}`}
            </div>
            <FontAwesomeIcon icon={faSmile} />
          </div>
        }
      </>}




      {(adminSettings.allowDeleteComments || adminSettings.allowFlagComments || isSuperAdmin) && (
        <>
          {!showEllipsisMenu && (
            <FontAwesomeIcon
              icon={faEllipsisH}
              onClick={() => setShowEllipsisMenu(prev => !prev)}
              style={{ display: shouldShowEllipsis ? 'inline' : 'none' }}

            />
          )}

          {showEllipsisMenu && (
            <div className="post-menu-dropdown">
              {/* Delete option (show if delete is allowed and it's the user's own comment) */}
              {((superAdminSettings.allowDeleteComments && adminSettings.allowDeleteComments) || isSuperAdmin) &&
                loggedInUserId === commentCommenter &&
                <CommentDelete
                  commentId={commentId}
                  loggedInUserId={loggedInUserId}
                  commentCommenter={commentCommenter}
                  setError={setError}
                  setPostComments={setPostComments}
                  setShowConfirmDelete={setShowConfirmDelete}
                />
              }

              {/* Flag option (show if flag is allowed and the commenter is not the logged-in user) */}
              {((superAdminSettings.allowFlagComments && adminSettings.allowFlagComments) || isSuperAdmin) &&
                loggedInUserId !== commentCommenter &&
                <FlagComment
                  commentId={commentId}
                  loggedInUserId={loggedInUserId}
                  hideFlag={hideFlag}
                  setError={setError}
                />
              }
              {!showConfirmDelete &&
                <FontAwesomeIcon icon={faXmark}
                  onClick={() => setShowEllipsisMenu(prev => !prev)}
                />
              }
            </div>
          )}
        </>
      )}









    </div>

  )
}