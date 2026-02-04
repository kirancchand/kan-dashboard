import axios from "axios";

export const AUTH_BASE ='http://18.218.205.124:8084/'
export const loginUrl = 'auth/login';
export const refreshTokenUrl = "auth/refresh-accesstoken";


export const api = axios.create({
    baseURL:AUTH_BASE
})


