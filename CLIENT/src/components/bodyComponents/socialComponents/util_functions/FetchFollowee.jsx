import { axiosPrivate } from "../../../../api/axios";

const fetchFollowee = async (filters, setFollowee, setIsLoading, setError, loggedInUser)  => {

  setIsLoading(true)


  try {
    const [usersResponse] = await Promise.all([
      axiosPrivate.get(`/social/users/followee`, { params: {...filters, userId: loggedInUser} })

    ]);
    // console.log("usersResponse.data", usersResponse.data)
    setFollowee(usersResponse.data); // Set user data
  } catch (err) {
    console.error('Error fetching followees:', err);

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

export default fetchFollowee