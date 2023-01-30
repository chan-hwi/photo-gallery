import { useCallback } from 'react';
import useUser from "./useUser";
import useAxiosPrivate from "./useAxiosPrivate";
import type { UserType } from '../types/models';

const useAuth = () => {
    const api = useAxiosPrivate();
    const { setUser, clearUser } = useUser();

    const login = useCallback(async (username : string, password : string) => {
        const res = await api.post<UserType>('/auth/login', { username, password });
        setUser(res.data);
    }, [setUser, api]);

    const register = useCallback(async (user : UserType | undefined) => {
        const res = await api.post<UserType>('/auth/register', { user });
        setUser(res.data);
    }, [setUser, api]);

    const logout = useCallback(async () => {
        await api.post<void>('/auth/logout');
        clearUser();
    }, [clearUser, api]);
    return { login, register, logout };
};

export default useAuth;