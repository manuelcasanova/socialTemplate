import { axiosPrivate } from "../../../../api/axios";

const fetchMessages = async (filters, setMessages, setIsLoading, setError, loggedInUser, userId)  => {

  setIsLoading(true)


  try {
    const [messages] = await Promise.all([
      axiosPrivate.get(`/messages/all`, { params: {...filters, loggedInUser, userId} })

    ]);
    setMessages(messages.data); 
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

export default fetchMessages