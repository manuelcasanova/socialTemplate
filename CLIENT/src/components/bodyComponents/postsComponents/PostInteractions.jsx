import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Styling

import '../../../css/PostsComments.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faThumbsUp, faThumbsDown, faSmile, faLaugh, faSadTear, faFaceAngry, faPlus } from "@fortawesome/free-solid-svg-icons";

// Components

import PostComments from './PostComments';
// Component to write comments (Inside:   // Function to comment)

// Util functions

// fetchPostComments

import { fetchPostReactionsCount } from './util_functions/FetchPostReactions';
import { fetchPostCommentsCount } from './util_functions/FetchPostComments';



export default function PostInteractions({ postId, isNavOpen, postContent, postSender }) {

  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [reactionsCount, setReactionsCount] = useState();
  const [commentsCount, setCommentsCount] = useState();

  // Function to react to posts


  // console.log("PostsComments.jsx postId", postId)
  // console.log("reactionsCount in PostsComments.jsx", reactionsCount)

  useEffect(() => {
    fetchPostReactionsCount({ postId, setIsLoading, setError, setReactionsCount })
    fetchPostCommentsCount({ postId, setIsLoading, setError, setCommentsCount })
  }, [])

  return (
    <>

      <div className="post-interactions">

        <div className="post-interactions-top">

          <div className='post-interactions-top-left-reaction'>
            <FontAwesomeIcon icon={faSmile} />
            <div className='post-interactions-text'>
              {reactionsCount}
            </div>
          </div>

          <div className='post-interactions-top-right-comments'
                 onClick={() => navigate(`/posts/${postId}`)}
          >
            <div className='post-interactions-text'
            >
              {commentsCount}
            </div>
            <FontAwesomeIcon icon={faComment} />
          </div>
        </div>

        <div className="post-interactions-bottom">

          <div className='post-interactions-bottom-left-reaction'>
            <FontAwesomeIcon icon={faSmile} />
            <div className='post-interactions-text'>
              React
            </div>
          </div>

          <div className='post-interactions-bottom-right-comments'
          >

          </div>

        </div>


      </div>


    </>
  )
}