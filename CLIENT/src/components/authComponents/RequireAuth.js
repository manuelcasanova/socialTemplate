import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { jwtDecode } from 'jwt-decode';

const RequireAuth = ({ allowedRoles }) => {

    const { auth } = useAuth();
    const location = useLocation();

    const decoded = auth?.accessToken
    ? jwtDecode(auth.accessToken)
    : undefined


//This checks if the roles exist in the auth context first. If not, it falls back to the decoded JWT token. If neither is available, it defaults to an empty array. It solves the update of roles when a user subscribe so they can navigate to /Subscriber

    const roles = auth?.roles || decoded?.UserInfo?.roles || []
    // const roles = decoded?.UserInfo?.roles || []

    return (
        roles.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : auth?.accessToken
            ? (
                // If they are not subscribed, redirect to subscription page
                allowedRoles.includes('User_subscribed') 
                    ? <Navigate to="/template/subscribe" state={{ from: location }} replace />
                    : <Navigate to="/template/unauthorized" state={{ from: location }} replace />
            )
                : <Navigate to="/template/signin" state={{ from: location }} replace />
    );
}

export default RequireAuth;