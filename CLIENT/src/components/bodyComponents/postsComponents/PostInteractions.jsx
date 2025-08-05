import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

//Context
import { useGlobalSuperAdminSettings } from '../../../context/SuperAdminSettingsProvider';
import { useGlobalAdminSettings } from '../../../context/AdminSettingsProvider';

//hooks
import useAuth from '../../../hooks/useAuth';
import { axiosPrivate } from '../../../api/axios';

// Styling

import '../../../css/PostsComments.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faThumbsUp, faThumbsDown, faSmile, faLaugh, faSadTear, faBan, faEllipsisH, faFlag, faXmark, faFaceAngry } from "@fortawesome/free-solid-svg-icons";

// Components

import PostComments from './PostComments';
import PostDelete from './PostDelete';
import FlagPost from './FlagPost';
import LoadingSpinner from '../../loadingSpinner/LoadingSpinner';
import Error from '../Error';


import { fetchPostReactionsCount } from './util_functions/FetchPostReactions';
import { fetchPostCommentsCount } from './util_functions/FetchPostComments';

//Translation
import { useTranslation } from 'react-i18next';


const BACKEND = process.env.REACT_APP_BACKEND_URL;

export default function PostInteractions({ postId, isNavOpen, postContent, postSender, loggedInUser, setPosts, hideFlag, setError }) {

  const { t } = useTranslation();
  const { auth } = useAuth();
  const isSuperAdmin = auth.roles.includes('SuperAdmin');
  const { superAdminSettings } = useGlobalSuperAdminSettings();
  const { adminSettings } = useGlobalAdminSettings();
  //   console.log("superadmin allow comments", superAdminSettings.allowComments, 'admim', adminSettings.allowComments)
  // console.log("superadmin posts feature", superAdminSettings.showPostsFeature, 'admim', adminSettings.showPostsFeature)
  const loggedInUserId = auth.userId
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [reactionsCount, setReactionsCount] = useState();
  const [commentsCount, setCommentsCount] = useState();
  const [reactOption, setReactOption] = useState(false)
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [showEllipsisMenu, setShowEllipsisMenu] = useState(false);
  const errRef = useRef();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const canDelete = adminSettings.allowDeletePosts && loggedInUserId === postSender && postId > 7;
  const canFlag = adminSettings.allowFlagPosts && loggedInUserId !== postSender;
  const shouldShowEllipsis = (canDelete || canFlag) && (!hideFlag || loggedInUserId === postSender);



  const handleShowReactOptions = () => {
    setReactOption(prevState => !prevState);
  };

  const handleReactionSelect = (reaction) => {
    setSelectedReaction(reaction);
    setReactOption(false);
    sendReactionToBackend(reaction);
  };

  useEffect(() => {
    if (superAdminSettings.allowPostReactions && adminSettings.allowPostReactions || isSuperAdmin) {
      fetchPostReactionsCount({ postId, setIsLoading, setError, setReactionsCount, loggedInUserId })
    }

    if (superAdminSettings.allowComments && adminSettings.allowComments || isSuperAdmin) {
      fetchPostCommentsCount({ postId, setIsLoading, setError, setCommentsCount, loggedInUserId })
    }

  }, [])

  const sendReactionToBackend = async (reactionType) => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.post(`${BACKEND}/posts/reactions/send`, {
        loggedInUserId,
        postId,
        reactionType,
      });

      setSelectedReaction(reactionType);

      handleShowReactOptions();

      if (superAdminSettings.allowPostReactions || isSuperAdmin) {
        fetchPostReactionsCount({ postId, setIsLoading, setError, setReactionsCount });
      }


    } catch (err) {
      console.log(err);
      let message = '';
      if (!err?.response) {
        message = t("postsInteractions.noServerResponse");
      } else if (err.response?.status === 403) {
        message = t("postsInteractions.forbidden");
      } else if (err.response?.status === 401) {
        message = t("postsInteractions.unauthorized");
      } else if (err.response?.status === 400) {
        message = t("postsInteractions.badRequest");
      } else {
        message = t("postsInteractions.attemptFailed");
      }
      setErrMsg(message);
      setError(message);
      errRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading) {
    return <LoadingSpinner />;
  }


  return (
    <>

      <div className="post-interactions">

        <div className="post-interactions-top">

          {
            ((superAdminSettings.allowPostReactions && adminSettings.allowPostReactions) || isSuperAdmin) &&
            <div className='post-interactions-top-left-reaction'
              onClick={() => navigate(`/posts/reactions/${postId}`)}>
              <FontAwesomeIcon icon={faSmile} />

              <div className='post-interactions-text'>
                {reactionsCount}
              </div>
            </div>
          }
          {((superAdminSettings.allowComments && adminSettings.allowComments) || isSuperAdmin) &&
            <div className='post-interactions-top-right-comments'
              onClick={() => navigate(`/posts/${postId}`)}>

              <div className='post-interactions-text'
              >
                {commentsCount}
              </div>
              <FontAwesomeIcon icon={faComment} />
            </div>
          }


        </div>

<div className={showConfirmDelete ? 'post-interactions-center' : 'post-interactions-bottom'}>

          {
            ((superAdminSettings.allowPostReactions && adminSettings.allowPostReactions) || isSuperAdmin) &&
            <div className='post-interactions-bottom-left-reaction'
              onClick={handleShowReactOptions}>


              {!reactOption && (
                <>

                  {!showConfirmDelete &&
                    <FontAwesomeIcon icon={faSmile} />
                  }

                  {!showConfirmDelete &&
                    <div className='post-interactions-text'>
                      {t("postsInteractions.react")}
                    </div>
                  }

                </>
              )}



              {reactOption && (
                <div className="reaction-options">
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
          }

          {(
            adminSettings.allowDeletePosts || adminSettings.allowFlagPosts || isSuperAdmin
          ) && (
              <>

                <div className='post-interactions-bottom-left-reaction'>
                  {!showEllipsisMenu && (
                    <FontAwesomeIcon
                      icon={faEllipsisH}
                      onClick={() => setShowEllipsisMenu(prev => !prev)}
                      style={{ display: shouldShowEllipsis ? 'inline' : 'none' }}

                    />
                  )}

                  {showEllipsisMenu && (
                    <div className="post-menu-dropdown">
                      {/* Delete option (show if delete is allowed and it's the user's own post) */}
                      {((superAdminSettings.allowDeletePosts && adminSettings.allowDeletePosts) || isSuperAdmin) &&
                        loggedInUserId === postSender &&
                        <PostDelete
                          setPosts={setPosts}
                          postId={postId}
                          postSender={postSender}
                          loggedInUser={loggedInUser}
                          setError={setError}
                          setShowConfirmDelete={setShowConfirmDelete}
                        />
                      }

                      {/* Flag option (show if flag is allowed and the post is not the user's own post) */}
                      {((superAdminSettings.allowFlagPosts && adminSettings.allowFlagPosts) || isSuperAdmin) &&
                        loggedInUserId !== postSender &&
                        <FlagPost
                          postId={postId}
                          loggedInUserId={loggedInUserId}
                          hideFlag={hideFlag}
                          setError={setError}
                        />
                      }
                      {!showConfirmDelete &&
                        <FontAwesomeIcon
                          icon={faXmark}
                          onClick={() => setShowEllipsisMenu(prev => !prev)}
                        />
                      }
                    </div>
                  )}
                </div>
              </>
            )}



        </div>
      </div>
    </>
  )
}