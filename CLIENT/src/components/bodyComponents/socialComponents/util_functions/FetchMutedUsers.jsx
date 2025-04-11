import { axiosPrivate } from "../../../../api/axios";

const fetchMutedUsers = async (filters, setMutedUsers, setIsLoading, setError, loggedInUser)  => {
  setIsLoading(true)
  try {
    const [usersResponse] = await Promise.all([
      axiosPrivate.get(`/social/users/muted`, { params: {...filters, userId: loggedInUser} })

    ]);

    setMutedUsers(usersResponse.data); // Set user data
  } catch (err) {
    console.error('Error fetching muted users:', err);

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

export default fetchMutedUsers