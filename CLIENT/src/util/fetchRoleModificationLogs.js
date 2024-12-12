export const fetchRoleChangeLogs = async (axiosPrivate, params = {}) => {
  try {
    const response = await axiosPrivate.get(`/log-events/role-modification/logs`, { params });

    return response.data;
  } catch (err) {
    throw new Error(`Failed to fetch role change logs: ${err.response ? err.response.data.message : err.message}`);
  }
};
