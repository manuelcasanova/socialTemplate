import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

//Context
import { useGlobalSuperAdminSettings } from "../../../context/SuperAdminSettingsProvider";
import { useGlobalAdminSettings } from "../../../context/AdminSettingsProvider";
import ScreenSizeContext from "../../../context/ScreenSizeContext";

//Hooks
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

//Styling
import '../../../css/Posts.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faLock, faEarth, faUserFriends } from "@fortawesome/free-solid-svg-icons";

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

//Translation
import { useTranslation } from 'react-i18next';

const BACKEND = process.env.REACT_APP_BACKEND_URL;


export default function Posts({ isNavOpen, profilePictureKey }) {
  const { t, i18n } = useTranslation();
  const { auth } = useAuth();
  const isAdmin = auth.roles.includes('Admin');
  const { superAdminSettings } = useGlobalSuperAdminSettings();
  const { adminSettings } = useGlobalAdminSettings();
  const loggedInUser = auth.userId;
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { screenSize } = useContext(ScreenSizeContext);
  const { isSmartphone, isTablet, isDesktop, width } = screenSize;
  const [filters, setFilters] = useState({});
  const [posts, setPosts] = useState([]);
  const [flaggedPosts, setFlaggedPosts] = useState(new Set());
  const [inappropriatePosts, setInappropriatePosts] = useState(new Set());
  const [users, setUsers] = useState([])
  const [showMyPosts, setShowMyPosts] = useState(false);

  const filteredPosts = posts.filter(post => {
    if (showMyPosts) {
      return post.sender === loggedInUser;
    }
    return users.some(user => user.user_id === post.sender);
  });
  const [filterUsername, setFilterUsername] = useState("");
  const [submittedFilterUsername, setSubmittedFilterUsername] = useState('');
  const inputRef = useRef(null);

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
    const checkReports = async () => {
      try {
        const reportedPosts = new Set();

        for (const post of posts) {
          const res = await axiosPrivate.get("/reports/has-reported", {
            params: {
              post_id: post.id,
              user_id: loggedInUser,
            },
          });

          if (res.data?.hasReported) {
            reportedPosts.add(post.id);
          }
        }

        setFlaggedPosts(reportedPosts);
      } catch (err) {
        console.error("Error checking report status:", err);
      }
    };

    checkReports();
  }, [posts, loggedInUser]);

  useEffect(() => {
    const checkInappropriate = async () => {
      try {
        const hiddenPosts = new Set();

        for (const post of posts) {
          const res = await axiosPrivate.get("/reports/has-hidden", {
            params: {
              post_id: post.id,
              user_id: loggedInUser,
            },
          });

          if (res.data?.hasHidden) {
            hiddenPosts.add(post.id);
          }
        }

        setInappropriatePosts(hiddenPosts);
      } catch (err) {
        console.error("Error checking inappropriate status:", err);
      }
    };

    checkInappropriate();
  }, [posts, loggedInUser]);


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



  const getUsernameById = (userId) => {
    const user = users.find(user => user.user_id === userId);

    return user ? user.username : t('posts.unknownUser');
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
        return t('posts.public');
      case "private":
        return t('posts.private');
      case "followers":
        return t('posts.followersOnly');
      default:
        return t('posts.publicPost');
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

        {(isAdmin && superAdminSettings.allowAdminPost) ||
          (!isAdmin && superAdminSettings.allowUserPost && adminSettings.allowUserPost) ? (

          <WritePost
            loggedInUser={loggedInUser}
            setNewPostSubmitted={setNewPostSubmitted}
            setError={setError}
          />

        ) : null}

        <div className="write-post-container">

          <FilterUsername
            filterUsername={filterUsername}
            setFilterUsername={setFilterUsername}
            inputRef={inputRef}
            onSearch={() => {
              setSearchQuery(filterUsername); // Apply filter on click or Enter key
              setPage(1); // Reset pagination
            }}
          />

        </div>

        <div className="which-posts-container">
          <button
            className="button-white"
            onClick={() => {
              setShowMyPosts(false);
              setPage(1);
            }}
          >{t('posts.allPosts')}</button>
          <button
            className="button-white"
            onClick={() => {
              setShowMyPosts(true); // Show only my posts
              setPage(1);
            }}
          >{t('posts.myPosts')}</button>
        </div>


        {posts.length === 0 ? (
          <p>{t('posts.noPosts')}</p>
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
                      <img
                        className="user-row-social-small-img"
                        onClick={() => setShowLargePicture(post.sender)}
                        src={`${BACKEND}/media/profile_pictures/${post.sender}/profilePicture.jpg?v=${profilePictureKey}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/profilePicture.jpg';
                        }}
                        alt={t('posts.profilePictureAlt')}
                      />


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
                      <p className="post-header-date"> {formatDate(post.date, i18n.language || 'en-US', t)}</p>
                    </div>
                  </div>

                  {inappropriatePosts.has(post.id) ? (
                    <div>
                      <p style={{ fontStyle: 'italic', color: 'darkred' }}>
                       {t('posts.hiddenByModerator')}
                      </p>

                      {auth?.roles?.includes("Moderator") && (
                        <div style={{ backgroundColor: "#fbe9e9", padding: "10px", borderRadius: "5px", marginTop: "0.5em" }}>
                          <p style={{ fontStyle: 'italic', color: 'darkslategray' }}><strong>{t('posts.originalForModerators')}</strong></p>
                          <p style={{ color: 'black' }}>{post.content}</p>
                        </div>
                      )}
                    </div>
                  ) : flaggedPosts.has(post.id) ? (
                    <div>
                      <p style={{ fontStyle: 'italic' }}>
                     {t('posts.reportedPendingReview')}
                      </p>
                      <button
                        className="button-white white button-smaller"
                        onClick={() => {
                          const updatedFlaggedPosts = new Set(flaggedPosts);
                          updatedFlaggedPosts.delete(post.id);
                          setFlaggedPosts(updatedFlaggedPosts);
                        }}>
                        {t('posts.clickToView')}
                      </button>
                    </div>
                  ) : (
                    <p>{post.content}</p>
                  )}

                  {
                    // HERE superAdminSettings.allowPostInteractions &&
                    <PostInteractions setPosts={setPosts} postId={post.id} isNavOpen={isNavOpen} postContent={post.content} postSender={post.sender} loggedInUser={loggedInUser} hideFlag={inappropriatePosts.has(post.id)} setError={setError} />
                  }

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showLargePicture && (
        <div
          className={`${isNavOpen && isTablet ? 'large-picture-squeezed' : 'large-picture'}`}
          onClick={() => setShowLargePicture(null)}
        >
          <img
            className="users-all-picture-large"
            src={`${BACKEND}/media/profile_pictures/${showLargePicture}/profilePicture.jpg?v=${profilePictureKey}`}
            alt="Profile"
            onError={(e) => {
              // Fallback image handling
              e.target.onerror = null;
              e.target.src = '/images/profilePicture.jpg';
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
            {t('posts.loadMore')}
          </button>

          <button
            className="button-white"
            style={{ marginTop: '0.5em', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {t('posts.goToTop')}
          </button>
        </div>

      )}



    </div>


  );


}