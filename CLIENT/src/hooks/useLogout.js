// import axios from "../api/axios";
// import useAuth from "./useAuth";

// const useLogout = () => {
//     const { setAuth } = useAuth();

//     const logout = async () => {
//         setAuth({});
//         try {
//             const response = await axios('/logout', {
//                 withCredentials: true
//             });
//         } catch (err) {
//             console.error(err);
//         }
//     }

//     return logout;
// }

// export default useLogout

import axios from "../api/axios";
import useAuth from "./useAuth";

let isLoggingOut = false;

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => {
        isLoggingOut = true;
        setAuth({});
        try {
            await axios('/logout', { withCredentials: true });
        } catch (err) {
            console.error(err);
        }
    };

    return logout;
};

export const getIsLoggingOut = () => isLoggingOut;

export default useLogout;
