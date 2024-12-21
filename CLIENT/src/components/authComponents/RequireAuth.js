import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { jwtDecode } from 'jwt-decode';

const RequireAuth = ({ allowedRoles }) => {

    const { auth } = useAuth();
    const location = useLocation();

    const decoded = auth?.accessToken
    ? jwtDecode(auth.accessToken)
    : undefined

    const roles = decoded?.UserInfo?.roles || []
    
    console.log("roles", roles)

    return (
        roles.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : auth?.accessToken
            ? (
                // If they are not subscribed, redirect to subscription page
                allowedRoles.includes('User_subscribed') 
                    ? <Navigate to="/subscribe" state={{ from: location }} replace />
                    : <Navigate to="/unauthorized" state={{ from: location }} replace />
            )
                : <Navigate to="/signin" state={{ from: location }} replace />
    );
}

export default RequireAuth;