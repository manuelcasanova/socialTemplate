import { axiosPrivate } from "../../../../api/axios";

const fetchFollowers = async (filters, setFollowers, setIsLoading, setError, loggedInUser)  => {

  setIsLoading(true)


  try {
    const [usersResponse] = await Promise.all([
      axiosPrivate.get(`/social/users/followers`, { params: {...filters, userId: loggedInUser} })

    ]);
      //  console.log("usersResponse.data", usersResponse.data)
    setFollowers(usersResponse.data); // Set user data

  } catch (err) {
    console.error('Error fetching followers:', err);

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

export default fetchFollowers