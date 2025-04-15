// Styling

import '../../../css/PostsComments.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faThumbsUp, faThumbsDown, faSmile, faLaugh, faSadTear, faFaceAngry, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function PostsComments() {
  return (
    <div className="post-comments">


      <div className="post-comments-top">

        <div className='post-comments-top-left-reaction'>
          <FontAwesomeIcon icon={faSmile} />
          <div className='post-comments-text'>
            Reactions count
          </div>
        </div>

        <div className='post-comments-top-right-comments'>
          <div className='post-comments-text'>
            Number
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