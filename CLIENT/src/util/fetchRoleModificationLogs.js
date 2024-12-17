export const fetchRoleChangeLogs = async (axiosPrivate, filters) => {
  try {
    // Clean the filters object: remove keys with empty values (null, undefined, or empty strings)
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => value !== "" && value !== undefined && value !== null)
    );

    // Convert the cleaned filters object into a query string
    const queryString = new URLSearchParams(cleanedFilters).toString();

    // Make the GET request with the cleaned filters as query parameters
    const response = await axiosPrivate.get(`/log-events/role-modification/logs?${queryString}`);

    return response.data;
  } catch (err) {
    throw new Error(`Failed to fetch role change logs: ${err.response ? err.response.data.message : err.message}`);
  }
};
