'use client';

import { axiosInstance as api } from '../apis';
import { useQueryClient } from 'react-query';
import type { UserType } from '@/types/models';

const useRefreshToken = () => {
    const queryClient = useQueryClient();

    const refresh = async () => {
        const res = await api.get<{ token: string }>('/auth/refresh', {
            withCredentials: true
        });
        queryClient.setQueryData(["user"], (user : UserType | null | undefined) => ({ ...user, token: res.data.token } as UserType));
        return res.data.token;
    };

    return refresh;
};

export default useRefreshToken;