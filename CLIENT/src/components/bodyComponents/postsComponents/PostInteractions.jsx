import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

//hooks
import { axiosPrivate } from '../../../api/axios';

// Styling

import '../../../css/PostsComments.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faThumbsUp, faThumbsDown, faSmile, faLaugh, faSadTear, faBan, faEllipsisH, faFlag, faXmark } from "@fortawesome/free-solid-svg-icons";

// Components

import PostComments from './PostComments';
import PostDelete from './PostDelete';
import FlagPost from './FlagPost';


import { fetchPostReactionsCount } from './util_functions/FetchPostReactions';
import { fetchPostCommentsCount } from './util_functions/FetchPostComments';

const BACKEND = process.env.REACT_APP_BACKEND_URL;

export default function PostInteractions({ postId, isNavOpen, postContent, postSender, loggedInUser, setPosts }) {

  const { auth } = useAuth();
  const loggedInUserId = auth.userId
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [reactionsCount, setReactionsCount] = useState();
  const [commentsCount, setCommentsCount] = useState();
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
    fetchPostReactionsCount({ postId, setIsLoading, setError, setReactionsCount, loggedInUserId })
    fetchPostCommentsCount({ postId, setIsLoading, setError, setCommentsCount, loggedInUserId })
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

      fetchPostReactionsCount({ postId, setIsLoading, setError, setReactionsCount });


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
    <>

      <div className="post-interactions">

        <div className="post-interactions-top">

          <div className='post-interactions-top-left-reaction'
            onClick={() => navigate(`/posts/reactions/${postId}`)}>
            <FontAwesomeIcon icon={faSmile} />
            <div className='post-interactions-text'>
              {reactionsCount}
            </div>
          </div>

          <div className='post-interactions-top-right-comments'
            onClick={() => navigate(`/posts/${postId}`)}>
            <div className='post-interactions-text'
            >
              {commentsCount}
            </div>
            <FontAwesomeIcon icon={faComment} />
          </div>
        </div>

        <div className="post-interactions-bottom">


          <div className='post-interactions-bottom-left-reaction'
            onClick={handleShowReactOptions}>


            {!reactOption && (
              <>
                <FontAwesomeIcon icon={faSmile} />
                <div className='post-interactions-text'>
                  React
                </div>
              </>
            )}


            {reactOption && (
              <div className="reaction-options">
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

          <div className='post-interactions-bottom-left-reaction'>
            {!showEllipsisMenu && (
              <FontAwesomeIcon icon={faEllipsisH}
                onClick={() => setShowEllipsisMenu(prev => !prev)}
              />
            )}
            {showEllipsisMenu && (
              <div className="post-menu-dropdown">
                <PostDelete setPosts={setPosts} postId={postId} postSender={postSender} loggedInUser={loggedInUser} />
                <FlagPost />
                <FontAwesomeIcon icon={faXmark}
                  onClick={() => setShowEllipsisMenu(prev => !prev)}
                />
              </div>
            )}

          </div>



        </div>
      </div>
    </>
  )
}