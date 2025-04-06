import { axiosPrivate } from "../../../../api/axios";

const fetchMessages = async (filters, setMessages, setIsLoading, setError, loggedInUser, userId)  => {

  setIsLoading(true)


  try {
    const [messages] = await Promise.all([
      axiosPrivate.get(`/messages/all`, { params: {...filters, loggedInUser, userId} })

    ]);
    setMessages(messages.data); 
  } catch (err) {
    setError(`Failed to fetch data: ${err.response?.data?.error || err.message}`);
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

export default fetchMessages