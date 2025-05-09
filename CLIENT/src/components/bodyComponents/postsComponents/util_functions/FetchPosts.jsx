import { axiosPrivate } from "../../../../api/axios";

const fetchPosts = async (filters, setPosts, setIsLoading, setError, filterUsername, loggedInUser, page, limit) => {
  setIsLoading(true);

  try {
    const { data } = await axiosPrivate.get(`/posts/all`, { 
      params: { 
        ...filters, 
        loggedInUser, 
        filterUsername,
        page,
        limit: limit
      } 
    });
    // Safeguard if data is not an array or doesn't exist

    if (page === 1) {
      setPosts(data); // replace
    } else {
      setPosts(prevPosts => [...prevPosts, ...data]); // append
    }


  } catch (err) {
    // console.error("Error fetching posts:", err);

    let errorMsg = "Failed to fetch posts.";
    if (err.response?.data?.error) {
      errorMsg += ` ${err.response.data.error}`;
    } else if (err.message) {
      errorMsg += ` ${err.message}`;
    }

    // Update error state
    setError(errorMsg);
  } finally {
    setIsLoading(false);
  }
};

const fetchPostById = async (postId, setPost, setIsLoading, setError) => {
  setIsLoading(true);

  try {
    const { data } = await axiosPrivate.get(`/posts/${postId}`);

    // Safeguard if data does not exist
    if (data) {
      setPost(data); // Set the post data
    } else {
      setError("Post not found.");
    }
  } catch (err) {
    let errorMsg = "Failed to fetch post.";
    if (err.response?.data?.error) {
      errorMsg += ` ${err.response.data.error}`;
    } else if (err.message) {
      errorMsg += ` ${err.message}`;
    }

    // Update error state
    setError(errorMsg);
  } finally {
    setIsLoading(false);
  }
};



export { fetchPosts, fetchPostById };