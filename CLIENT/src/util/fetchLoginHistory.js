export const fetchLoginHistory = async (axiosPrivate) => {
  try {
    const response = await axiosPrivate.get('/login-history'); 
    return response.data; 
  } catch (error) {
    console.error('Error fetching login history:', error);
    throw error;
  }
};
