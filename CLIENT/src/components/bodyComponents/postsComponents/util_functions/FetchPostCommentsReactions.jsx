import { axiosPrivate } from "../../../../api/axios";

const fetchPostCommentsReactionsCount = async ({commentId, setReactionsCount, setError, setIsLoading, loggedInUserId}) => {
  setIsLoading(true);

  try {
    // console.log("hit FetchPostReactions.jsx")
    const { data } = await axiosPrivate.get(`/posts/comments/reactions/count`, { 
      params: { 
        commentId,
        loggedInUserId
      } 
    });

    setReactionsCount(data);

  } catch (err) {
    let errorMsg = "Failed to fetch reactions count.";
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

const fetchPostCommentsReactionsData = async ({commentId, setPostReactions, setError, setIsLoading, loggedInUserId}) => {
  setIsLoading(true);

  try {
    // console.log("hit FetchPostReactions.jsx")
    const { data } = await axiosPrivate.get(`/posts/comments/reactions/data`, { 
      params: { 
        commentId,
        loggedInUserId
      } 
    });

    setPostReactions(data);

  } catch (err) {
    let errorMsg = "Failed to fetch post reactions.";
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

export { fetchPostCommentsReactionsCount, fetchPostCommentsReactionsData };