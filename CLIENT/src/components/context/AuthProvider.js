import React, { createContext, useState, useMemo } from "react";

// Define the structure of the auth state to avoid passing an empty object
const initialAuthState = {
    accessToken: null,
    user: null,
    roles: [],
    isAuthenticated: false,
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(initialAuthState);

    // Memoize the context value to avoid unnecessary re-renders
    const contextValue = useMemo(() => ({ auth, setAuth }), [auth]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
