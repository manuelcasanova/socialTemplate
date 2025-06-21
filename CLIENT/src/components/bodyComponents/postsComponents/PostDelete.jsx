import { useState } from "react";
import { axiosPrivate } from "../../../api/axios";

//Styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import Error from "../Error";

//Translation
import { useTranslation } from 'react-i18next';



export default function PostDelete({ setPosts, postId, postSender, loggedInUser, isNavOpen, setError }) {

  const { t } = useTranslation();

  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  const handlePostDelete = (postId) => {
    // Function to delete a post (soft delete)
    const deletePost = async () => {
      try {
        await axiosPrivate.put(`/posts/delete/${postId}`, { loggedInUser });
        // Remove deleted post from the UI
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        setPostIdToDelete(null); // Reset the deletion confirmation state
      } catch (err) {
        console.error(t('postDelete.erroFailed'), err);
        setError(t('postDelete.errorFailed'));
      }
    };

    deletePost();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
              {t('postDelete.confirmDelete')}
            </p>
            <p
              className="button-white"
              style={{ color: "black" }}
              onClick={() => setPostIdToDelete(null)} // Close confirmation modal
            >
              {t('postDelete.cancel')}
            </p>
          </div>
        )}

        {postIdToDelete !== postId && (
          <button
            onClick={() => setPostIdToDelete(postId)} // Show confirmation modal for this post
            title={t('postDelete.title')}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        )}

      </div>

    )}
    </>

  )
}