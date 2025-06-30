export const fetchRoleAdminHistory = async (axiosPrivate, filters = {}) => {
  try {
    // Make the GET request to fetch role admin history without filters
    const response = await axiosPrivate.get('/role-admin-history', 
      {
params: filters
      });
    // console.log('response.data in fetchRoleAdminHistory',  response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching role admin history:', error);
    throw error;
  }
};
