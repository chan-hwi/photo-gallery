import { useCallback } from 'react';
import useUser from "./useUser";
import useAxiosPrivate from "./useAxiosPrivate";

const useAuth = () => {
    const api = useAxiosPrivate();
    const { setUser, clearUser } = useUser();

    const login = useCallback(async (username, password) => {
        const res = await api.post('/auth/login', { username, password });
        setUser(res.data);
    }, [setUser, api]);

    const register = useCallback(async (user) => {
        const res = await api.post('/auth/register', { user });
        setUser(res.data);
    }, [setUser, api]);

    const logout = useCallback(async () => {
        await api.post('/auth/logout');
        clearUser();
    }, [clearUser, api]);
    return { login, register, logout };
};

export default useAuth;