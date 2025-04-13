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

const BACKEND = process.env.REACT_APP_BACKEND_URL;

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

  useEffect(() => {
    // Reset error when filters change
    setError(null);
  }, [filters, filterUsername]);

  useEffect(() => {
    fetchPosts(filters, setPosts, setIsLoading, setError, filterUsername, loggedInUser);
     fetchUsers(filters, setUsers, setIsLoading, setError, filterUsername)
  }, [axiosPrivate, filters, filterUsername]);

  const handlePostDelete = (postId) => {
    // Function to delete a post (soft delete)
    const deletePost = async () => {
      try {
        await axiosPrivate.put(`/posts/delete/${postId}`, { loggedInUser });
        // Remove deleted post from the UI
        setPosts((prevPosts) => prevPosts.filter(post => post.id !== postId));
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
                    <p><strong>{getUsernameById(post.sender)}</strong></p>
                    <p>{new Date(post.date).toLocaleString()}</p>
                  </div>

                  <p>{post.content}</p>

                  {loggedInUser === post.sender && (
                    <div className="post-actions">
                      <button
                        onClick={() => handlePostDelete(post.id)}
                        title="Delete Post"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
