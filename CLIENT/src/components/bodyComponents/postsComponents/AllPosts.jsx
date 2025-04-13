import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

//Hooks
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

//Styling
import '../../../css/Posts.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import Error from "../Error";
import FilterUsername from "../socialComponents/FilterUsername";

//Util functions
import { fetchPosts, fetchMyPosts } from "./util_functions/FetchPosts";
import fetchUsers from "../socialComponents/util_functions/FetchUsers";
import { formatDate } from "./util_functions/formatDate";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const profilePictureExists = async (userId) => {
  const imageUrl = `${BACKEND}/media/profile_pictures/${userId}/profilePicture.jpg`;
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error("Error checking image existence:", error);
    return false;
  }
};

export default function AllPosts({ isNavOpen }) {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([])
  const [filterUsername, setFilterUsername] = useState("");
  const inputRef = useRef(null);
  const loggedInUser = auth.userId;
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [imageExistsMap, setImageExistsMap] = useState({});
  const [showLargePicture, setShowLargePicture] = useState(null);
  const [page, setPage] = useState(1); // Track the current page
  const [hasMorePosts, setHasMorePosts] = useState(true); // To track if more posts exist


  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, [filterUsername]);

  useEffect(() => {
    fetchPosts(filters, setPosts, setIsLoading, setError, filterUsername, loggedInUser, page);
  }, [axiosPrivate, filters, filterUsername, page]);

  const loadMorePosts = () => {
    setPage(prevPage => prevPage + 1);
  };


  useEffect(() => {
    // Reset error when filters change
    setError(null);
  }, [filters, filterUsername]);

  useEffect(() => {
    fetchUsers(filters, setUsers, setIsLoading, setError, filterUsername)
  }, [axiosPrivate, filters, filterUsername]);


  useEffect(() => {
    const checkImages = async () => {
      const result = {};
      for (const user of users) {
        result[user.user_id] = await profilePictureExists(user.user_id);
      }
      setImageExistsMap(result);
    };

    if (users.length > 0) {
      checkImages();
    }
  }, [users]);

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

  const getUsernameById = (userId) => {
    const user = users.find(user => user.user_id === userId);

    return user ? user.username : "Unknown User";
  };

  const handleImageClick = (userId) => {
    setShowLargePicture(userId);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error isNavOpen={isNavOpen} error={error} />;
  }

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="admin-posts">
        <h2>Posts</h2>

        <FilterUsername
          filterUsername={filterUsername}
          setFilterUsername={setFilterUsername}
          inputRef={inputRef}
        />

        {posts.length === 0 ? (
          <p>No posts available</p>
        ) : (
          <div className="posts-container">
            {posts.map((post) => (
              <div className="post-row" key={post.id}>
                <div className="post-info">
                  <div className="post-header">
                    <div className="post-header-photo">
                      {imageExistsMap[post.sender] ? (
                        <img
                          className="user-row-social-small-img"
                          style={{ marginRight: "0px" }}
                          src={`${BACKEND}/media/profile_pictures/${post.sender}/profilePicture.jpg`}
                          alt="User"
                          onClick={() => handleImageClick(post.sender)}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faUser}
                          size="3x"
                          onClick={() => handleImageClick(post.sender)}
                        />
                      )}



                    </div>
                    <div className="post-header-sender-and-date">
                      <p className="post-header-sender"><strong>{getUsernameById(post.sender)}</strong></p>
                      {/* <p>{new Date(post.date).toLocaleString()}</p> */}
                      <p className="post-header-date">{formatDate(post.date)}</p>
                    </div>
                  </div>

                  <p>{post.content}</p>

                  {loggedInUser === post.sender && (
                    <div className="post-actions">
                      {postIdToDelete === post.id && (
                        <div className="confirm-delete-chat">
                          <p
                            className="button-red"
                            onClick={() => {
                              handlePostDelete(post.id);
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

                      {postIdToDelete !== post.id && (
                        <button
                          onClick={() => setPostIdToDelete(post.id)} // Show confirmation modal for this post
                          title="Delete Post"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showLargePicture && (
        <div
          className={`${isNavOpen ? 'large-picture-squeezed' : 'large-picture'}`}
          onClick={() => setShowLargePicture(null)}
        >
          <img
            className="users-all-picture-large"
            src={`${BACKEND}/media/profile_pictures/${showLargePicture}/profilePicture.jpg`}
            alt="Profile"
            onError={(e) => {
              // Fallback image handling
              e.target.onerror = null;
              e.target.src = `${BACKEND}/media/profile_pictures/user.png`;
            }}
          />
        </div>
      )}

      {hasMorePosts && !isLoading && (
        <button onClick={loadMorePosts}>Load More</button>
      )}

    </div>
  );
}