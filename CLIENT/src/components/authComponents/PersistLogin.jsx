import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from '../../hooks/useRefreshToken';
import useAuth from '../../hooks/useAuth';
import useLocalStorage from "../../hooks/useLocalStorage";
// import LoadingSpinner from "./LoadingSpinner";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, setAuth } = useAuth();
    const [persist] = useLocalStorage('persist', false);

    console.log("auth in Persistlogin", auth)

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                // Ensure the token is refreshed if necessary
                const newAccessToken = await refresh();
                if (newAccessToken) {
                    // Set the refreshed token in auth state
                    setAuth((prevAuth) => ({
                        ...prevAuth,
                        accessToken: newAccessToken,
                    }));
                }
            } catch (err) {
                console.error("Token refresh failed", err);
            } finally {
                if (isMounted) {
                    setIsLoading(false); // Set loading to false once refresh attempt is done
                }
            }
        };

        // Logs for debugging
        // console.log("PersistLogin component is rendered or re-rendered");
        console.log("auth in PersistLogin", auth);
        console.log("persist in PersistLogin", persist);

        // If no access token and persist flag is true, attempt to refresh the token
        if (!auth?.accessToken && persist) {
          console.log("try to refresh the token")
            verifyRefreshToken();  // Try to refresh the token
        } else {
            setIsLoading(false);  // If no refresh needed, just set loading to false
        }

        return () => isMounted = false; // Cleanup
    }, [auth, persist, refresh, setAuth]);

    return (
        <>
            {/* Conditional rendering */}
            {!persist ? (
                <Outlet />
            ) : (
                isLoading ? (
                    <p>Loading...</p>
                    // <LoadingSpinner /> can be used here if you want a spinner
                ) : (
                    <Outlet />
                )
            )}
        </>
    );
};

export default PersistLogin;
