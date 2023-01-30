import { useCallback } from 'react';
import { useQuery, useQueryClient, UseQueryResult } from 'react-query';
import useAxiosPrivate from './useAxiosPrivate';
import type { UserType } from 'types/models';

const getLocalUser = () : UserType | null => {
    const user : string | null = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

const setLocalUser = (user : UserType | null) => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
}

const useUser = () => {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();

    const getUserData = useCallback(async (curUser : UserType | undefined) : Promise<UserType | null> => {
        if (!curUser?.token) return null;
        const { data: user } = await axiosPrivate.get('/auth/userinfo', { headers: { Authorization: `Bearer ${curUser.token}` } });
        return user;
    }, [axiosPrivate]);

    const queryResult : UseQueryResult<UserType> = useQuery(["user"], () => getUserData(queryResult.data), {
        initialData: getLocalUser,
        onSuccess: res => {
            if (!res) {
                localStorage.removeItem("user");
            } else {
                setLocalUser(res);
            }
        },
        onError: err => {
            console.log(err);
            queryClient.setQueryData(["user"], null);
            localStorage.removeItem("user");
        }
    });

    const setUser = (newUser : UserType) => {
        queryClient.setQueryData(["user"], newUser);
    }
    
    const clearUser = () => {
        queryClient.setQueryData(["user"], null);
    }

    return { user: queryResult.data, setUser, clearUser };
};

export default useUser;