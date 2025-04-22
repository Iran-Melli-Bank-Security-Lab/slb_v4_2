import { axiosUpload } from "@/api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosUpload = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {

        const requestIntercept = axiosUpload.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                // config.headers['Content-Type'] = 'multipart/form-data'
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosUpload.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosUpload(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosUpload.interceptors.request.eject(requestIntercept);
            axiosUpload.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh])

    return axiosUpload;
}

export default useAxiosUpload;