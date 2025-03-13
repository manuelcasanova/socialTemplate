import { axiosPrivate } from "../../../../api/axios";

const fetchMutedUsers = async (filters, setMutedUsers, setIsLoading, setError, loggedInUser)  => {
  setIsLoading(true)
  try {
    const [usersResponse] = await Promise.all([
      axiosPrivate.get(`/social/users/muted`, { params: {...filters, userId: loggedInUser} })

    ]);

    setMutedUsers(usersResponse.data); // Set user data
  } catch (err) {
    setError(`Failed to fetch data: ${err.response.data.error}`);
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

export default fetchMutedUsers