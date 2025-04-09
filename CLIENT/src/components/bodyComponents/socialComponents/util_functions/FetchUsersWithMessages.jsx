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
    setError(`Failed to fetch users with messages: ${err.response.data.error}`);
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

export default fetchUsersWithMessages;
