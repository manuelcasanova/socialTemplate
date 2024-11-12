import axios from 'axios';

const BACKEND = process.env.REACT_APP_BACKEND_URL;

export default axios.create({
    baseURL: BACKEND
});

export const axiosPrivate = axios.create({
    baseURL: BACKEND,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});
