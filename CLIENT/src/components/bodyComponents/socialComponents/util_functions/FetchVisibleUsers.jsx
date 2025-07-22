import { axiosPrivate } from "../../../../api/axios";

const fetchVisibleUsers = async (filters, setUsers, setIsLoading, setError, filterUsername)  => {
  setIsLoading(true)
  try {
    const [usersResponse] = await Promise.all([
      axiosPrivate.get(`/social/users/visible`, {
        params: {
          ...filters,
          username: filterUsername, 
        },
      }),
    ]);

    setUsers(usersResponse.data); // Set user data
  } catch (err) {
    console.error("Error fetching visible users:", err);

    let errorMsg = "Failed to fetch visible users.";
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

export default fetchVisibleUsers