import { useCallback } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import useAxiosPrivate from './useAxiosPrivate';

const getLocalUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

const setLocalUser = (user) => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
}

const useUser = () => {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();

    const getUserData = useCallback(async (curUser) => {
        if (!curUser?.token) return null;
        const { data: user } = await axiosPrivate.get('/auth/userinfo', { headers: { Authorization: `Bearer ${curUser.token}` } });
        return user;
    }, [axiosPrivate]);

    const { data: user } = useQuery(["user"], () => getUserData(user), {
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

    const setUser = (newUser) => {
        queryClient.setQueryData(["user"], newUser);
    }
    
    const clearUser = () => {
        queryClient.setQueryData(["user"], null);
    }

    return { user, setUser, clearUser };
};

export default useUser;