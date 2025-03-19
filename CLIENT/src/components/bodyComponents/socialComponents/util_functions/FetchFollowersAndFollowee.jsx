import { axiosPrivate } from "../../../../api/axios";

const fetchFollowersAndFollowee = async (filters, setFollowee, setIsLoading, setError, loggedInUser)  => {

  setIsLoading(true)

  try {
    const [usersResponse] = await Promise.all([
      axiosPrivate.get(`/social/users/followersAndFollowee`, { params: {...filters, userId: loggedInUser} })

    ]);

    setFollowee(usersResponse.data); // Set user data
  } catch (err) {
    setError(`Failed to fetch data: ${err.response.data.error}`);
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

export default fetchFollowersAndFollowee