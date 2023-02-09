'use client'

import { useCallback } from 'react';
import { useQuery, useQueryClient, UseQueryResult } from 'react-query';
import useAxiosPrivate from './useAxiosPrivate';
import type { UserType } from 'types/models';
import useRefreshToken from './useRefreshToken';

const useUser = () => {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();
    const refresh = useRefreshToken();

    const getUserData = useCallback(async (userData : UserType | undefined) : Promise<UserType | null> => {
        let token = (userData && userData.token);
        if (userData === undefined) token = await refresh();
        else if (!userData) return null;

        const { data: user } = await axiosPrivate.get('/auth/userinfo', { headers: { Authorization: `Bearer ${token}` } });
        return user;
    }, [axiosPrivate, refresh]);

    const queryResult : UseQueryResult<UserType> = useQuery(["user"], () => getUserData(queryResult?.data), {
        initialData: undefined,
        onError: err => {
            console.log(err);
            queryClient.setQueryData(["user"], null);
        }
    });

    const setUser = (newUser : UserType) => {
        queryClient.setQueryData(["user"], newUser);
    }
    
    const clearUser = () => {
        queryClient.setQueryData(["user"], null);
    }

    return { user: queryResult.data, isLoading: queryResult.isLoading, setUser, clearUser };
};

export default useUser;