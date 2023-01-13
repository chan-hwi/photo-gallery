import { axiosInstance as api } from '../apis';
import { useQueryClient } from 'react-query';

const useRefreshToken = () => {
    const queryClient = useQueryClient();

    const refresh = async () => {
        const res = await api.get('/auth/refresh', {
            withCredentials: true
        });
        queryClient.setQueryData(["user"], user => ({ ...user, token: res?.data?.token }));
        return res?.data?.token;
    };

    return refresh;
};

export default useRefreshToken;