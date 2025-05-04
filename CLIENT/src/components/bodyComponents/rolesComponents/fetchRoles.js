import { axiosPrivate } from "../../../api/axios";

const fetchRoles = async () => {
  try {
    const { data } = await axiosPrivate.get(`/roles/`);
    return data;
  } catch (err) {
    let errorMsg = "Failed to fetch roles.";
    if (err.response?.data?.error) {
      errorMsg += ` ${err.response.data.error}`;
    } else if (err.message) {
      errorMsg += ` ${err.message}`;
    }
    throw new Error(errorMsg);
  }
};

const fetchCustomRoles = async () => {
  try {
    const { data } = await axiosPrivate.get(`/roles/custom`);
    return data;
  } catch (err) {
    let errorMsg = "Failed to fetch roles.";
    if (err.response?.data?.error) {
      errorMsg += ` ${err.response.data.error}`;
    } else if (err.message) {
      errorMsg += ` ${err.message}`;
    }
    throw new Error(errorMsg);
  }
};

export { fetchRoles, fetchCustomRoles };
