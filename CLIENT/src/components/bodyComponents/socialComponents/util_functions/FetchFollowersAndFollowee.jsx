import { axiosPrivate } from "../../../../api/axios";

const fetchFollowersAndFollowee = async (filters, setFollowee, setIsLoading, setError, loggedInUser, filterUsername)  => {

  setIsLoading(true)

  try {
    const [usersResponse] = await Promise.all([
      axiosPrivate.get(`/social/users/followersAndFollowee`, { params: {...filters, userId: loggedInUser, username: filterUsername} })

    ]);

    setFollowee(usersResponse.data); // Set user data
  } catch (err) {
    console.error('Error fetching followers and followees:', err);

    let errorMsg = 'Failed to fetch data.';
    if (err.response?.data?.error) {
      errorMsg += ` ${err.response.data.error}`;
    } else if (err.message) {
      errorMsg += ` ${err.message}`;
    }

    setError(errorMsg);
  } finally {
    setIsLoading(false);
  }
};

export default fetchFollowersAndFollowee