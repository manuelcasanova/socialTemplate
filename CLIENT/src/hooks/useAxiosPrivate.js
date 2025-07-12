import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { getIsLoggingOut } from "./useLogout";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      }, error => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      async error => {
        const prevRequest = error?.config;
        const status = error?.response?.status;

        if (status === 401 && !prevRequest?.sent && !getIsLoggingOut()) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await refresh();
            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            console.error('Refresh token failed:', refreshError);
            setAuth(null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            setTimeout(() => {
              window.location.href = '/signin?message=Session expired. Please sign in again.';
            }, 100);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, setAuth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;

// import { axiosPrivate } from "../api/axios";
// import { useEffect } from "react";
// import useRefreshToken from "./useRefreshToken";
// import useAuth from "./useAuth";
// import { getIsLoggingOut } from "./useLogout";

// const useAxiosPrivate = () => {
//     const refresh = useRefreshToken();
//     const { auth, setAuth } = useAuth();
//     useEffect(() => {

//         const requestIntercept = axiosPrivate.interceptors.request.use(
//             config => {
//                 // console.log(config);
//                 if (!config.headers['Authorization']) {
//                     config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
//                 }
//                 return config;
//             }, (error) => Promise.reject(error)
//         );

//         // const responseIntercept = axiosPrivate.interceptors.response.use(
//         //     response => response,
//         //     async (error) => {
//         //         const prevRequest = error?.config;
//         //         if (error?.response?.status === 403 && !prevRequest?.sent) {
//         //             prevRequest.sent = true;
//         //             const newAccessToken = await refresh();
//         //             prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//         //             return axiosPrivate(prevRequest);
//         //         }
//         //         return Promise.reject(error);
//         //     }
//         // );

//         const responseIntercept = axiosPrivate.interceptors.response.use(
//             response => response,
//             async error => {
//               const prevRequest = error?.config;
//               const status = error?.response?.status;
          
//               // === 401 Unauthorized: handle token refresh ===
//               if (status === 401 && !prevRequest?.sent) {
//                 prevRequest.sent = true;
//                 try {
//                   const newAccessToken = await refresh();
//                   prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//                   return axiosPrivate(prevRequest);
//                 } catch (refreshError) {
//                   console.error('Refresh token failed:', refreshError);
//                   setAuth(null);
//                   console.log("👤 setAuth(null) was called");
//                   localStorage.removeItem('authToken');
//                   localStorage.removeItem('refreshToken');
          
//                   // Redirect only for auth failure
//                   setTimeout(() => {
//                     window.location.href = '/signin?message=Session expired. Please sign in again.';
//                   }, 100);
          
//                   return Promise.reject(refreshError);
//                 }
//               }
          
//               // === 403 Forbidden: pass down to component ===
//               // This is likely a permission issue (not auth/session problem), so don't redirect
//               return Promise.reject(error);
//             }
//           );
          


//         return () => {
//             axiosPrivate.interceptors.request.eject(requestIntercept);
//             axiosPrivate.interceptors.response.eject(responseIntercept);
//         }
//     }, [auth, setAuth, refresh])

//     return axiosPrivate;
// }

// export default useAxiosPrivate;