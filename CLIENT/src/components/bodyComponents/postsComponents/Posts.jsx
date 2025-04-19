import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

//Hooks
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

//Styling
import '../../../css/Posts.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faMagnifyingGlass, faLock, faEarth, faUserFriends } from "@fortawesome/free-solid-svg-icons";

//Components
import LoadingSpinner from "../../loadingSpinner/LoadingSpinner";
import Error from "../Error";
import FilterUsername from "../socialComponents/FilterUsername";
import WritePost from "./WritePost";
import PostInteractions from "./PostInteractions";

//Util functions
import { fetchPosts } from "./util_functions/FetchPosts";
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

export default function Posts({ isNavOpen }) {
  const { auth } = useAuth();
  const loggedInUser = auth.userId;
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([])
  const [showMyPosts, setShowMyPosts] = useState(false);

  const filteredPosts = posts.filter(post => {
    if (showMyPosts) {
      return post.sender === loggedInUser;
    }
    return users.some(user => user.user_id === post.sender);
  });
  const [filterUsername, setFilterUsername] = useState("");
  const inputRef = useRef(null);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [imageExistsMap, setImageExistsMap] = useState({});
  const [showLargePicture, setShowLargePicture] = useState(null);
  const [page, setPage] = useState(1); // Track the current page
  const limit = 10 //How many posts to fetch per load
  const [hasMorePosts, setHasMorePosts] = useState(true); // To track if more posts exist
  const [searchQuery, setSearchQuery] = useState("");
  const firstNewPostRef = useRef(null);
  const topPostRef = useRef(null);
  const [loadMore, setLoadMore] = useState(false)
  const [newPostSubmitted, setNewPostSubmitted] = useState(false);

  useEffect(() => {
    // If `loadMore` is true, scroll to the new batch of posts
    if (loadMore && firstNewPostRef.current) {
      firstNewPostRef.current.scrollIntoView({ behavior: 'smooth' });

    } else {
      // Scroll to top of the page when posts are first rendered or after reset
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [loadMore, posts]);


  useEffect(() => {
    fetchPosts(filters, setPosts, setIsLoading, setError, filterUsername, loggedInUser, page, limit);
  }, [page]);

  const loadMorePosts = () => {
    setPage(prevPage => prevPage + 1);
    setLoadMore(true)
  };


  useEffect(() => {
    // Reset error when filters change
    setError(null);
  }, [filters]);

  useEffect(() => {
    fetchUsers(filters, setUsers, setIsLoading, setError, filterUsername)
    fetchPosts(filters, setPosts, setIsLoading, setError, filterUsername, loggedInUser, page, limit);
  }, [axiosPrivate, filters, searchQuery, showMyPosts]);

  useEffect(() => {
    if (filterUsername === "") {
      setSearchQuery(""); // Clear search query to fetch all
      setPage(1); // Reset pagination
      fetchUsers(filters, setUsers, setIsLoading, setError, "", loggedInUser);
      fetchPosts(filters, setPosts, setIsLoading, setError, "", loggedInUser, 1, limit);
    }
  }, [filterUsername]);

  useEffect(() => {
    if (newPostSubmitted) {
      fetchPosts(filters, setPosts, setIsLoading, setError, filterUsername, loggedInUser, 1, limit);
      setNewPostSubmitted(false); // Reset the trigger after fetching the posts
    }
  }, [newPostSubmitted, filters, filterUsername, loggedInUser, page]);

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

  useEffect(() => {
  }, [posts]);

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case "public":
        return faEarth;
      case "private":
        return faLock;
      case "followers":
        return faUserFriends;
      default:
        return faEarth;
    }
  };

  // Function to get the tooltip text for visibility
  const getVisibilityTooltip = (visibility) => {
    switch (visibility) {
      case "public":
        return "Public";
      case "private":
        return "Private";
      case "followers":
        return "Followers only";
      default:
        return "Public post";
    }
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

        <WritePost loggedInUser={loggedInUser} setNewPostSubmitted={setNewPostSubmitted} />

        <div className="write-post-container">



          <FilterUsername
            filterUsername={filterUsername}
            setFilterUsername={setFilterUsername}
            inputRef={inputRef}
          />

          <button
            className="button-white"
            onClick={() => {
              setSearchQuery(filterUsername); // Apply filter on click
              setPage(1); // Reset pagination
            }}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>



        </div>

        <div className="which-posts-container">
          <button
            className="button-white"
            onClick={() => {
              setShowMyPosts(false);
              setPage(1);
            }}
          >All posts</button>
          <button
            className="button-white"
            onClick={() => {
              setShowMyPosts(true); // Show only my posts
              setPage(1);
            }}
          >My posts</button>
        </div>


        {posts.length === 0 ? (
          <p>No posts available</p>
        ) : (
          <div className="posts-container">
            {filteredPosts.map((post, index) => (
              <div
                className="post-row"
                key={post.id}
                ref={(el) => {
                  if (index === 0) topPostRef.current = el;
                  if (index === posts.length - limit) firstNewPostRef.current = el;
                }}
              >
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
                        <img
                          className="user-row-social-small-img"
                          style={{ marginRight: "0px" }}
                          src={`${BACKEND}/media/profile_pictures/profilePicture.jpg`}
                          alt="User"
                          onClick={() => handleImageClick(post.sender)}
                        />
                      )}



                    </div>
                    <div className="post-header-sender-and-date">
                      <div className="post-header-sender-and-visibility">
                      <p
  className="post-header-sender"
  style={{ cursor: 'pointer' }}
  onClick={() => {
    if (post.sender === loggedInUser) {
      navigate("/profile/myaccount");
    } else {
      navigate(`/social/users/${post.sender}`);
    }
  }}
>
  <strong>{getUsernameById(post.sender)}</strong>
</p>
                        <FontAwesomeIcon
                          icon={getVisibilityIcon(post.visibility)}
                          title={getVisibilityTooltip(post.visibility)}
                        />
                      </div>
                      <p className="post-header-date">{formatDate(post.date)}</p>
                    </div>
                  </div>

                  <p>{post.content}</p>

                  <PostInteractions postId={post.id} isNavOpen={isNavOpen} postContent={post.content} postSender={post.sender}/>

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
              e.target.src = `${BACKEND}/media/profile_pictures/profilePicture.jpg`;
            }}
          />
        </div>
      )}

      {hasMorePosts && !isLoading && (
        <div className="load-more-buttons">
          <button
            className="button-white"
            style={{ marginTop: '0.5em', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
            onClick={loadMorePosts}
          >
            Load More
          </button>

          <button
            className="button-white"
            style={{ marginTop: '0.5em', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          // onClick={() => {
          //   if (topPostRef.current) {
          //     topPostRef.current.scrollIntoView({ behavior: 'smooth' });
          //   }
          // }}
          >
            Go to Top
          </button>
        </div>

      )}

    </div>
  );
}