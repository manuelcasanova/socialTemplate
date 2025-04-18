//Util functions
import { formatDate } from "./util_functions/formatDate"

export default function PostCommentsInteractions({ commentDate }) {
  return (
    <div className="post-comment-interactions">
      <div className="post-comment-date">{formatDate(commentDate)}</div>
      <div className="post-comment-react">React</div>
      <div className="post-comment-reactions">Reactions</div>
    </div>
  )
}