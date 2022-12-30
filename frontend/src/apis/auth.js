import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true
});

function setAuthorizationHeaderCallback(token) {
    return function (config) {
        config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    };
}

export const login = async (username, password) => {
    try {
        const { data: res } = await api.post('/auth/login', { username, password });
        api.interceptors.request.use(setAuthorizationHeaderCallback(res.token));
        return res;
    } catch (e) {
        console.log(e);
    }
}

export const register = async (user) => {
    try {
        const { data: res } = await api.post('/auth/register', { user });
        api.interceptors.request.use(setAuthorizationHeaderCallback(res.token));
        return res;
    } catch (e) {
        console.log(e);
    }
}

const refresh = async () => {
    try {
        const { data: res } = await api.post('/auth/refresh');

        api.interceptors.request.use(setAuthorizationHeaderCallback(res.token));
        
        console.log(res);
        return res;
    } catch (e) {
        console.log(e.response);
        return Promise.reject(e);
    }
}

api.interceptors.response.use(res => res, async err => {
    console.log(err.response);

    try {
        if (err?.response?.status === 401) {
            await refresh();
            return await api(err.config);
        }
        return Promise.reject(err);
    } catch (e) {
        return Promise.reject(e);
    }
});

export const getUserInfo = async () => {
    try {
        const res = await api.get('/auth/users');
        console.log(res);
        return res;
    } catch (e) {
        console.log(e);
        return Promise.reject(e);
    }
}

export default api;