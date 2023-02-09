import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
// import * as cookie from 'cookie';
// import * as setCookie from 'set-cookie-parser';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000'
});

const privateAxiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true
});

createAuthRefreshInterceptor(privateAxiosInstance, prevRequest =>
    axiosInstance.get('http://localhost:3000/api/refresh').then(res => {
        const authHeader = `Bearer ${res.data.token}`;
        axiosInstance.defaults.headers.Authorization = authHeader;
        prevRequest.response.config.headers.Authorization = authHeader;

        // console.log('pvr', prevRequest)
        console.log('here', res.headers);

        // const resCookie = setCookie.parse(res.headers['set-cookie'])[0];
        // axiosInstance.defaults.headers.cookie = cookie.serialize(resCookie.name, resCookie.value);

        return Promise.resolve();
    })
);

export { privateAxiosInstance };