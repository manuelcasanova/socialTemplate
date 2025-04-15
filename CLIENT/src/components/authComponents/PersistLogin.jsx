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
                // await new Promise(resolve => setTimeout(resolve, 2000));

                await refresh();
            }
            catch (err) {
                if (err?.response?.status === 401) {
                    // console.log('No valid refresh token — user not logged in yet.');
                } else {
                    console.error('Error verifying refresh token:', err);
                }
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }

        // persist added here AFTER tutorial video
        // Avoids unwanted call to verifyRefreshToken
        !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    }, [])

    useEffect(() => {
        //console.log(`isLoading: ${isLoading}`)
        //console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
    }, [isLoading])

    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ?
                    <LoadingSpinner />
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin