import { axiosPrivate } from "../../../../api/axios";

const fetchUsersWithMessages = async (userId, setUsers, setIsLoading, setError, filterUsername, hideMuted) => {
  setIsLoading(true);
  try {
    const response = await axiosPrivate.get(`/social/users/with-messages`, { 
      params: { 
        userId,
      username: filterUsername,
      hideMuted 
    } 
  });
    setUsers(response.data); // Set the users who have exchanged messages
  } catch (err) {
    console.error("Error fetching users:", err);

    let errorMsg = "Failed to fetch users.";
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

export default fetchUsersWithMessages;
