import axios from '../api/axios';
import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';

const useRefreshToken = () => {
    const navigate = useNavigate();

    const { setAuth } = useAuth();

    const refresh = async () => {
        try {
            const response = await axios.get('/refresh', {
                withCredentials: true
            });

            setAuth(prev => {

                return {
                    ...prev,
                    roles: response.data.roles,
                    accessToken: response.data.accessToken,
                    userId: response.data.userId
                }
            });
            return response.data.accessToken;
        } catch (err) {
            if (err?.response?.status === 401) {
                // Expected if no session exists; redirect but no scary log
                console.info('User not logged in. Redirecting to signin.');
            } else {
                // console.error('Refresh failed', err);
            }
            navigate('/signin', { replace: true });
            throw err; // important to throw, so axiosPrivate knows it failed
        }
    }
    return refresh;
};

export default useRefreshToken;
