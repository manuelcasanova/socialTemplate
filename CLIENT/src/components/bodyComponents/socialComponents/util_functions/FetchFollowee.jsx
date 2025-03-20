import { axiosPrivate } from "../../../../api/axios";

const fetchFollowee = async (filters, setFollowee, setIsLoading, setError, loggedInUser)  => {

  setIsLoading(true)


  try {
    const [usersResponse] = await Promise.all([
      axiosPrivate.get(`/social/users/followee`, { params: {...filters, userId: loggedInUser} })

    ]);
console.log("hit")
console.log("usersREsponse.data", usersResponse.data)
    setFollowee(usersResponse.data); // Set user data
    console.log("hit2")
  } catch (err) {
    setError(`Failed to fetch data: ${err.response.data.error}`);
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

export default fetchFollowee