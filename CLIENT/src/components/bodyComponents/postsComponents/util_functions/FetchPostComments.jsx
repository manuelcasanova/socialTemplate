import { axiosPrivate } from "../../../../api/axios";

const fetchPostCommentsCount = async ({postId, setCommentsCount, setError, setIsLoading, loggedInUserId}) => {
  setIsLoading(true);

  try {
    // console.log("hit fetchPostComments.jsx")
    const { data } = await axiosPrivate.get(`/posts/comments/count`, { 
      params: { 
        postId,
        loggedInUserId
      } 
    });

    setCommentsCount(data);

  } catch (err) {
    let errorMsg = "Failed to fetch comments count.";
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

const fetchPostComments = async ({postId, setPostComments, setError, setIsLoading, loggedInUserId}) => {
  setIsLoading(true);

  try {
    // console.log("hit fetchPostComments.jsx")
    const { data } = await axiosPrivate.get(`/posts/comments/data`, { 
      params: { 
        postId,
        loggedInUserId
      } 
    });

    setPostComments(data);

  } catch (err) {
    let errorMsg = "Failed to fetch comments count.";
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


export { fetchPostCommentsCount, fetchPostComments };