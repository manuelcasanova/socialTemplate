import { axiosPrivate } from "../../../../api/axios";

const fetchUsernameById = async (filters, setFollowers, setIsLoading, setError, loggedInUser)  => {

  setIsLoading(true)


  try {
    const [usersResponse] = await Promise.all([
      axiosPrivate.get(`/social/users/username`, { params: {...filters, userId: loggedInUser} })

    ]);
    setFollowers(usersResponse.data); // Set user data
  } catch (err) {
    setError(`Failed to fetch data: ${err.response?.data?.error || err.message}`);
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

export default fetchUsernameById