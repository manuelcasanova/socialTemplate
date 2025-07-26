import { useState } from "react";
import { axiosPrivate } from "../../../api/axios";

//Styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import Error from "../Error";


export default function CommentDelete({ commentId, loggedInUserId, commentCommenter, setError, setPostComments, setShowConfirmDelete }) {

  const [commentIdToDelete, setCommentIdToDelete] = useState(null);

  const handleCommentDelete = (postId) => {
    // Function to delete a post (soft delete)
    const deleteComment = async () => {
      try {
        await axiosPrivate.put(`/posts/comments/delete/${commentId}`, { loggedInUserId, commentCommenter });

        setPostComments(prevComments =>
          prevComments.filter(comment => comment.id !== commentId)
        );

        setCommentIdToDelete(null);
      } catch (err) {
        console.error("Error deleting comment:", err);
        setError("Failed to delete comment.");
      }
    };

    deleteComment();
  };

  return (
    <>

      {loggedInUserId === commentCommenter && (

        <div className="post-actions">
          {commentIdToDelete === commentId && (
            <div className="confirm-delete-chat">
              <p
                className="button-red"
                onClick={() => {
                  handleCommentDelete(commentId);
                }}
              >
                Confirm delete
              </p>
              <p
                className="button-white"
                style={{ color: "black" }}
                onClick={() => {
                  setCommentIdToDelete(null)
                  setShowConfirmDelete(false)
                }
                }
              >
                Cancel
              </p>
            </div>
          )}

          {commentIdToDelete !== commentId && (
            <button
              onClick={
                () => {
                  setCommentIdToDelete(commentId)
                  setShowConfirmDelete(true)
                }
              }
              title="Delete Comment"
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          )}

        </div >

      )
      }


    </>
  )
}