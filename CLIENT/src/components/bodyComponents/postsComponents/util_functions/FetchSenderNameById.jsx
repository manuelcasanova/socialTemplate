// util_functions/FetchSenderNameById.js
import { axiosPrivate } from "../../../../api/axios";  // Adjust path if necessary

const fetchSenderNameById = async (userId, setIsLoading, setError, setSenderInfo) => {
  if (!userId) {
    setError("User ID is missing.");
    return;
  }

  setIsLoading(true);

  try {
    // Assuming you have a route like "/users/:id" to fetch a user by ID
    const response = await axiosPrivate.get(`/users/${userId}`);
    
    // Set the sender info (usually the username)
    setSenderInfo(response.data.username);
  } catch (err) {
    console.error("Error fetching sender info:", err);
    let errorMsg = "Failed to fetch user.";
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

export default fetchSenderNameById;
