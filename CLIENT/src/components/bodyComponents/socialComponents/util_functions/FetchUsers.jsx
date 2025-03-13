import { axiosPrivate } from "../../../../api/axios";

const fetchUsers = async (filters, setUsers, setIsLoading, setError)  => {
  setIsLoading(true)
  try {
    const [usersResponse] = await Promise.all([
      axiosPrivate.get(`/social/users/all`, { params: filters })

    ]);

    setUsers(usersResponse.data); // Set user data
  } catch (err) {
    setError(`Failed to fetch data: ${err.response.data.error}`);
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

export default fetchUsers