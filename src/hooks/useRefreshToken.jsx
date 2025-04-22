import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const backend= process.env.REACT_APP_SERVER_IP
    const refresh = async () => {
        
        const response = await axios.get('/refresh', {
            withCredentials: true
        });

        setAuth(prev => {

            return {
                ...prev,
                lastName: response?.data?.lastName , 
                user:response?.data?.username,  
                profileImageUrl: backend+response?.data?.profileImageUrl, 
                roles: response?.data?.roles,
                accessToken: response?.data?.accessToken,
                devOps:response?.data?.devOps,  
                _id:response?.data?._id     
            }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;
