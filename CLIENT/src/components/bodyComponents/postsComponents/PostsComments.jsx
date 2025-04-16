import { useEffect, useState } from 'react';

// Styling

import '../../../css/PostsComments.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faThumbsUp, faThumbsDown, faSmile, faLaugh, faSadTear, faFaceAngry, faPlus } from "@fortawesome/free-solid-svg-icons";

// Components

          // Component to see comments
          // Component to write comments (Inside:   // Function to comment)

// Util functions

          // fetchPostComments

import { fetchPostReactionsCount } from './util_functions/FetchPostReactions';
import { fetchPostCommentsCount } from './util_functions/FetchPostComments';


export default function PostsComments({postId}) {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [reactionsCount, setReactionsCount] = useState();
  const [commentsCount, setCommentsCount] = useState();

  // Function to react to posts


// console.log("PostsComments.jsx postId", postId)
// console.log("reactionsCount in PostsComments.jsx", reactionsCount)

useEffect (() => {
fetchPostReactionsCount({postId, setIsLoading, setError, setReactionsCount})
fetchPostCommentsCount({postId, setIsLoading, setError, setCommentsCount})
}, [])



  return (
    <div className="post-comments">


      <div className="post-comments-top">

        <div className='post-comments-top-left-reaction'>
          <FontAwesomeIcon icon={faSmile} />
          <div className='post-comments-text'>
            {reactionsCount}
          </div>
        </div>

        <div className='post-comments-top-right-comments'>
          <div className='post-comments-text'>
            {commentsCount}
          </div>
          <FontAwesomeIcon icon={faComment} />
        </div>
      </div>

      <div className="post-comments-bottom">

        <div className='post-comments-bottom-left-reaction'>
          <FontAwesomeIcon icon={faSmile} />
          <div className='post-comments-text'>
            React
          </div>
        </div>

        <div className='post-comments-bottom-right-comments'>
          <FontAwesomeIcon icon={faComment} />
          <div className='post-comments-text'>
            Comment
          </div>
        </div>

      </div>


    </div>
  )
}