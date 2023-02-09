'use client';

import { useCallback } from 'react';
import useUser from "./useUser";
import useAxiosPrivate from "./useAxiosPrivate";
import type { UserType, UserFormType } from '../types/models';
import { useQueryClient } from 'react-query';

const useAuth = () => {
    const api = useAxiosPrivate();
    const { setUser, clearUser } = useUser();

    const login = useCallback(async (username : string, password : string) => {
        const res = await api.post<UserType>('/auth/login', { username, password });
        console.log(res);
        setUser(res.data);
    }, [setUser, api]);

    const register = useCallback(async (user : UserFormType) => {
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