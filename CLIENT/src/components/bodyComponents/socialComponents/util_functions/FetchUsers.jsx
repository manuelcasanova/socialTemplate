import { axiosPrivate } from "../../../../api/axios";

const fetchUsers = async (filters, setUsers, setIsLoading, setError)  => {
  setIsLoading(true)
  try {
    const [usersResponse] = await Promise.all([
      axiosPrivate.get(`/social/users/all`, { params: filters })

    ]);

    setUsers(usersResponse.data); // Set user data
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

export default fetchUsers