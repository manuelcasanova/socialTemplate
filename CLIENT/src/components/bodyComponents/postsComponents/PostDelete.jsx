import { useState } from "react";
import { axiosPrivate } from "../../../api/axios";

//Styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";


export default function PostDelete({setPosts, postId, postSender, loggedInUser}) {

    const [postIdToDelete, setPostIdToDelete] = useState(null);
    const [error, setError] = useState()

  const handlePostDelete = (postId) => {
    // Function to delete a post (soft delete)
    const deletePost = async () => {
      try {
        await axiosPrivate.put(`/posts/delete/${postId}`, { loggedInUser });
        // Remove deleted post from the UI
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        setPostIdToDelete(null); // Reset the deletion confirmation state
      } catch (err) {
        console.error("Error deleting post:", err);
        setError("Failed to delete post.");
      }
    };

    deletePost();
  };


  return (
    <>    {loggedInUser === postSender && (
      <div className="post-actions">
        {postIdToDelete === postId && (
          <div className="confirm-delete-chat">
            <p
              className="button-red"
              onClick={() => {
                handlePostDelete(postId);
              }}
            >
              Confirm delete
            </p>
            <p
              className="button-white"
              style={{ color: "black" }}
              onClick={() => setPostIdToDelete(null)} // Close confirmation modal
            >
              Cancel
            </p>
          </div>
        )}

        {postIdToDelete !== postId && (
          <button
            onClick={() => setPostIdToDelete(postId)} // Show confirmation modal for this post
            title="Delete Post"
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        )}

      </div>

    )}
    </>

  )
}