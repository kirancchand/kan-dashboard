import axios from "axios";

export const BASE_URL = 'http://18.218.205.124:8084'
export const login_request = '/auth/login';
export const refresh_token_request = '/auth/refresh-accesstoken';
export const userinfo_request = '/auth/user-info'


export const http = axios.create({
    baseURL: BASE_URL
})

http.interceptors.request.use((config:any) => {
        if (!config.url.includes(login_request)) {
            const token = localStorage.getItem("access_token")
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    }
)


