import { useCallback } from 'react';
import { useQuery, useQueryClient, UseQueryResult } from 'react-query';
import useAxiosPrivate from './useAxiosPrivate';
import type { UserType } from 'types/models';
import useRefreshToken from './useRefreshToken';

// const getLocalUser = () : UserType | null => {
//     const user : string | null = localStorage.getItem("user");
//     return user ? JSON.parse(user) : null;
// }

// const setLocalUser = (user : UserType | null) => {
//     if (user) localStorage.setItem("user", JSON.stringify(user));
// }

const useUser = () => {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();
    const refresh = useRefreshToken();

    const getUserData = useCallback(async (curUser : UserType | undefined) : Promise<UserType | null> => {
        // if (!curUser?.token) return null;
        let token = curUser && curUser.token;
        if (curUser === undefined) token = await refresh();
        else if (!curUser) return null;
        const { data: user } = await axiosPrivate.get('/auth/userinfo', { headers: { Authorization: `Bearer ${token}` } });
        return user;
    }, [axiosPrivate, refresh]);

    const queryResult : UseQueryResult<UserType> = useQuery(["user"], () => getUserData(queryResult.data), {
        // initialData: getLocalUser,
        initialData: undefined,
        // onSuccess: res => {
        //     if (!res) {
        //         localStorage.removeItem("user");
        //     } else {
        //         setLocalUser(res);
        //     }
        // },
        onError: err => {
            console.log(err);
            queryClient.setQueryData(["user"], null);
            // localStorage.removeItem("user");
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