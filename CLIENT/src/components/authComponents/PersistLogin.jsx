import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from '../../hooks/useRefreshToken';
import useAuth from '../../hooks/useAuth';
import useLocalStorage from "../../hooks/useLocalStorage";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    const [persist] = useLocalStorage('persist', false);

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                if (err?.response?.status === 401) {
                    console.warn('No valid refresh token — user not logged in.');
                } else {
                    // console.error('Error verifying refresh token:', err);
                }
            }
            finally {
                if (isMounted) setIsLoading(false);
            }
        }

        if (!auth?.accessToken && persist) {
            verifyRefreshToken();
        } else {
            setIsLoading(false);
        }

        return () => {
            isMounted = false;
        };
    }, [auth?.accessToken, persist]);

    if (!persist) {
        return <Outlet />;
    }

    return isLoading ? <LoadingSpinner /> : <Outlet />;
};

export default PersistLogin