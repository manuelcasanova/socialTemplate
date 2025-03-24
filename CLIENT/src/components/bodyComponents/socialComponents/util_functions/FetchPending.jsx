import { axiosPrivate } from "../../../../api/axios";

const fetchPending = async (filters, setPending, setIsLoading, setError, loggedInUser)  => {

  setIsLoading(true)


  try {

    const [usersResponse] = await Promise.all([
      axiosPrivate.get(`/social/users/pending`, { params: {...filters, userId: loggedInUser} })

    ]);
    setPending(usersResponse.data); // Set user data
  } catch (err) {
    setError(`Failed to fetch data: ${err.response.data.error}`);
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

export default fetchPending