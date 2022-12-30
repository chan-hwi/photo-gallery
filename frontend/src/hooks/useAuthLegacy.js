import axios from "axios";
import { useEffect, useCallback } from "react";
import { useQueryClient, useMutation, useQuery } from 'react-query';
import { actions } from '../providers/UserProvider';

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

function useAuthLegacy({ token, dispatch }) {
    const login = useCallback(async (username, password) => {
        try {
            const { data: res } = await api.post("/auth/login", { username, password });
            return res;
        } catch (e) {
            console.log(e);
        }
    }, []);

    const register = useCallback(async (user) => {
        try {
            const { data: res } = await api.post("/auth/register", { user });
            return res;
        } catch (e) {
            console.log(e);
        }
    }, []);

    const refresh = useCallback(async () => {
        try {
            const { data: res } = await api.post("/auth/refresh");
            dispatch({ type: actions.SET_TOKEN, payload: res.token });
            return res;
        } catch (e) {
            console.log(e.response);
            return Promise.reject(e);
        }
    }, [dispatch]);
    
    const getUserInfo = useCallback(async () => {
      try {
        const { data: res } = await api.get("/auth/users");
        return res;
      } catch (e) {
        console.log(e);
        return Promise.reject(e);
      }
    }, []);

    const logout = useCallback(async () => {
        try {
            const res = await api.post('/auth/logout');
            return res;
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    }, []);

    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use(config => {
            if (!config.headers['Authorization'] && token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        }, err => Promise.reject(err));

        const responseInterceptor = api.interceptors.response.use(res => res, async err => {
            console.log(err.response);

            const config = err.config;
            if (err?.response?.status === 401 && !config.sent) {
                config.sent = true;
                const { token: new_access_token } = await refresh();
                config.headers['Authorization'] = `Bearer ${new_access_token}`;
                return api(config);
            }
            return Promise.reject(err);
        });

        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        }
    }, [token, refresh]);

    return { api, login, register, getUserInfo, logout };
};

export default useAuthLegacy;
