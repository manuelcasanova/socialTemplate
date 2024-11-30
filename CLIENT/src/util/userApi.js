import useAxiosPrivate from '../hooks/useAxiosPrivate'; 
import { useState, useEffect } from 'react';

const useUserApi = (userId) => {
  const axiosPrivate = useAxiosPrivate(); 
  const [userData, setUserData] = useState(null);

  const getUserById = async () => {

    if (!userId) {
      console.log('No userId provided, skipping fetch.');
      return; // If no userId is provided, return early
    }

    try {
      const response = await axiosPrivate.get(`/users/${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserById();
    }
  }, [userId]); // This will trigger the effect when userId changes

  return { getUserById, userData };
};

export default useUserApi;
