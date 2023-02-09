'use client';

import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { use, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import useRefreshToken from './useRefreshToken';
import type { UserType } from '@/types/models';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
});

const useAxiosPrivate = () => {
    const queryClient = useQueryClient();
    const token = queryClient?.getQueryData<UserType>(["user"])?.token;
    const refresh = useRefreshToken();
    
    useEffect(() => {
        const reqInterceptorFn = api.interceptors.request.use(config => {
            const authHeader = config.headers['Authorization'];
            if (!authHeader)
                config.headers['Authorization'] = `Bearer ${token}`;

            return config;
        }, err => Promise.reject(err));
        
        const resInterceptorFn = api.interceptors.response.use(res => res, async err => {
            const config = err.config;

            if (err?.response?.status === 401 && !config?.sent) {
                config.sent = true;
                const newToken = await refresh();
                config.headers['Authorization'] = `Bearer ${newToken}`;
                return api(config);
            }

            return Promise.reject(err);
        });

        return () => {
            api.interceptors.request.eject(reqInterceptorFn);
            api.interceptors.response.eject(resInterceptorFn);
        }
    }, [token, refresh]);   
    
    return api;
};

export default useAxiosPrivate;