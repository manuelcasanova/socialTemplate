export const fetchLoginHistory = async (axiosPrivate, filters) => {
  try {
     // Clean the filters object: remove keys with empty values (null, undefined, or empty strings)
     const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => value !== "" && value !== undefined && value !== null)
    );

    // Convert the cleaned filters object into a query string
    const queryString = new URLSearchParams(cleanedFilters).toString();

    // Make the GET request with the cleaned filters as query parameters
    const response = await axiosPrivate.get(`/login-history?${queryString}`); 
    return response.data; 
  } catch (error) {
    console.error('Error fetching login history:', error);
    throw error;
  }
};
