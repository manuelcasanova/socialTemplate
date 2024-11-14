import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {

        console.log('Refreshing access token...');

        try {
            // Make the API request to refresh the token
            const response = await axios.get('/refresh', {
                withCredentials: true,
            });

            console.log('Received response from /refresh:', response);

            // Check if the response contains the necessary data
            if (response?.data?.accessToken && response?.data?.roles) {

                console.log('Access token and roles found:', response.data); 

                setAuth((prev) => ({
                    ...prev,  // Spread previous auth state to keep other info intact
                    roles: response.data.roles,  // Update roles
                    accessToken: response.data.accessToken,  // Update access token
                }));
                
                return response.data.accessToken;
            } else {
                // If no valid data in response, handle appropriately
                console.error('Failed to retrieve access token and roles:', response); // Log if the data is invalid
                throw new Error('Failed to retrieve access token and roles.');
            }
        } catch (error) {
            console.error("Error refreshing access token:", error);
            // Optionally redirect user to login or show an error message
            // Example: navigate('/login');
            throw error;  // Rethrow the error for the calling component to handle
        }
    };

    return refresh;
};

export default useRefreshToken;
