import { axiosPrivate } from "../../../../api/axios";

const fetchNewMessagesNotification = async (loggedInUser, setUsersWithNewMessages, setIsLoading, setError) => {
  setIsLoading(true);
  try {
    // console.log("hit fetch neew messages notification.jsx")
    const response = await axiosPrivate.get(`/messages/getnewmessagesnotification`, { params: { loggedInUser } });

    // console.log('Response from server:', response.data); 

        // Check if response.data is empty, if so, set it to an empty object or array.
        if (response.data.message === 'No new messages found') {
          setUsersWithNewMessages([]); 
        } else {
          setUsersWithNewMessages(response.data);
        }
  } catch (err) {
    const errorMessage = err?.response?.data?.error || err?.response?.data?.message || 'An unexpected error occurred';
    setError(`Failed to fetch new messages notification: ${errorMessage}`);
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

export default fetchNewMessagesNotification;
