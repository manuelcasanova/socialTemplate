import { axiosPrivate } from "../../../../api/axios";

const fetchPostReactionsCount = async ({postId, setReactionsCount, setError, setIsLoading}) => {
  setIsLoading(true);

  try {
    // console.log("hit FetchPostReactions.jsx")
    const { data } = await axiosPrivate.get(`/posts/reactions/count`, { 
      params: { 
        postId
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

const fetchPostReactionsData = async ({postId, setPostReactions, setError, setIsLoading}) => {
  setIsLoading(true);

  try {
    console.log("hit FetchPostReactions.jsx")
    const { data } = await axiosPrivate.get(`/posts/reactions/data`, { 
      params: { 
        postId
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

export { fetchPostReactionsCount, fetchPostReactionsData };