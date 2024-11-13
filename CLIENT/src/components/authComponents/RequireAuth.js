import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';  // Ensure you import useAuth correctly
import { jwtDecode } from 'jwt-decode';

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();  // Correctly destructure auth from useAuth
  const location = useLocation();

  // If auth is null or no access token, redirect to signin page
  if (!auth?.accessToken) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Decode the access token and extract roles only when it's available
  const decoded = jwtDecode(auth.accessToken);
  const roles = decoded?.UserInfo?.roles || [];

  // Normalize roles and allowedRoles to lowercase for consistency
  const allowedRolesLower = allowedRoles.map(role => role.toLowerCase());
  const rolesLower = roles.map(role => role.toLowerCase());

  // Check if the user has any of the allowed roles
  const hasAccess = rolesLower.some(role => allowedRolesLower.includes(role));

  if (hasAccess) {
    return <Outlet />;
  }

  // If the user doesn't have the required role, redirect to unauthorized page
  return <Navigate to="/unauthorized" state={{ from: location }} replace />;
};

export default RequireAuth;
