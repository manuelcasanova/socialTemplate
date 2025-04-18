//Util functions
import { formatDate } from "./util_functions/formatDate"
import { fetchPostCommentsReactionsCount } from "./util_functions/FetchPostCommentsReactions"
import { useEffect, useState } from "react"

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner"

//Styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faThumbsUp, faThumbsDown, faSmile, faLaugh, faSadTear, faBan } from "@fortawesome/free-solid-svg-icons";


export default function PostCommentsInteractions({ commentId, commentDate, loggedInUserId }) {

  const [reactionsCount, setReactionsCount] = useState()
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPostCommentsReactionsCount({ commentId, setReactionsCount, setError, setIsLoading, loggedInUserId })
  }, [])



  return (
    <div className="post-comment-interactions">
      <div className="post-comment-date">{formatDate(commentDate)}</div>
      <div className="post-comment-react">React</div>
      {/* <div className="post-comment-reactions"> */}


      <div className='post-interactions-top-left-reaction'
        // onClick={() => navigate(`/posts/reactions/${postId}`)}
        >
   
        <div className='post-interactions-text'>
          {isLoading ? <LoadingSpinner /> : error ? "Error" : `${reactionsCount ?? 0}`}
        </div>
        <FontAwesomeIcon icon={faSmile} />
      </div>





    </div>
  )
}