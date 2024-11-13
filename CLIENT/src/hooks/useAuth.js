import { useContext } from 'react';
import AuthContext from '../../src/components/context/AuthProvider';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const { auth, setAuth } = useContext(AuthContext);

  const handleLogin = (accessToken) => {
    const decoded = jwtDecode(accessToken);

    setAuth({
      accessToken,
      roles: decoded.UserInfo?.roles || [], // Assuming roles are stored in decoded.UserInfo.roles
      isAuthenticated: true, // Mark the user as authenticated
      userId: decoded.UserInfo?.userId
    });
  };

  return { auth, setAuth, handleLogin };
};

export default useAuth;
