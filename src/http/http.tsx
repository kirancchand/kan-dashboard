import axios from "axios";

export const BASE_URL = 'http://18.218.205.124:8084'
export const DEV_URL = 'http://localhost:5000'
export const ADMIN_URL = "http://18.218.205.124:8070"
export const PLANT_API_URL = 'http://localhost:5000'

// Registration & Authentication API's
export const login_request = BASE_URL + '/auth/login';
export const register_request = BASE_URL + "/auth/register"
export const refresh_token_request = BASE_URL + '/auth/refresh-accesstoken';
export const userinfo_request = BASE_URL + '/auth/user-info'
export const GET_USER_LIST = ADMIN_URL + "/master/users/listUser"

// User API's
export const update_user_url = "/users/:id"
export const delete_user_url = "/users/:id"

// Plant API's
export const order_url = PLANT_API_URL+"/api/orders/"
export const plant_url = PLANT_API_URL+"/api/products/"

export const http = axios.create({})

http.interceptors.request.use((config: any) => {
    const isAuthRequest = config.url.includes(login_request) || config.url.includes(register_request);
    if (!isAuthRequest) {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("No access token found in localStorage");
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});