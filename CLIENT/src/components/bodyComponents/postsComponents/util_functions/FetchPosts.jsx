import { axiosPrivate } from "../../../../api/axios";

const fetchPosts = async (filters, setPosts, setIsLoading, setError, filterUsername, loggedInUser, page) => {
  setIsLoading(true);

  try {
    const { data } = await axiosPrivate.get(`/posts/all`, { 
      params: { 
        ...filters, 
        loggedInUser, 
        filterUsername,
        page,
        limit: 1 //20 in production 
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

const fetchMyPosts = async (filters, setPosts, setIsLoading, setError, loggedInUser) => {
  setIsLoading(true);

  try {
    const { data } = await axiosPrivate.get(`/posts/${loggedInUser}`, { 
      params: { ...filters, loggedInUser } 
    });

    // Safeguard if data is not an array or doesn't exist
    setPosts(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Error fetching my posts:", err);

    let errorMsg = "Failed to fetch my posts.";
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

export { fetchPosts, fetchMyPosts };