import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL, ADMIN_URL, MASTER_API, PLANT_API_URL } from "./constants";


export const STATE_API = `${MASTER_API}/state`;
export const DISTRICT_API = `${MASTER_API}/district`;
export const MENU_API = `${MASTER_API}/menu`;
export const ROLE_API = `${MASTER_API}/role`;
export const ROLEMENU_API = `${MASTER_API}/rolemenu`;
export const USER_API = `${MASTER_API}/users`;
export const REGION_API = `${MASTER_API}/region`;
export const AREA_API = `${MASTER_API}/area`;
export const BRANCH_API = `${MASTER_API}/branch`;
export const SECTOR_API = `${MASTER_API}/sector`;

//division
export const GET_STATE_LIST = STATE_API + "/listState"
export const GET_DISTRICT_LIST = DISTRICT_API + "/listDistrict"
export const GET_AREA_LIST = AREA_API + "/listArea"
export const GET_BRANCH_LIST = BRANCH_API + "/listBranch"

//
export const ADD_STATE = STATE_API + "/add"
export const UPDATE_STATE = STATE_API + "/update"
export const DELETE_STATE = STATE_API + "/delete"

export const ADD_DISTRICT = DISTRICT_API + "/add"
export const UPDATE_DISTRICT = DISTRICT_API + "/update"
export const DELETE_DISTRICT = DISTRICT_API + "/delete"


export const ADD_AREA = AREA_API + "/add"
export const UPDATE_AREA = AREA_API + "/update"
export const DELETE_AREA = AREA_API + "/delete"


export const ADD_BRANCH = BRANCH_API + "/add"
export const UPDATE_BRANCH = BRANCH_API + "/update"
export const DELETE_BRANCH = BRANCH_API + "/delete"
// Registration & Authentication API's
export const login_request = BASE_URL + '/auth/login';
export const register_request = BASE_URL + "/auth/register"
export const refresh_token_request = BASE_URL + '/auth/refresh-accesstoken';
export const userinfo_request = BASE_URL + '/auth/user-info'
//admin API's
export const GET_USER_LIST = ADMIN_URL + "/master/users/listUser"
export const GET_MENU_LIST = ADMIN_URL + "/master/menu/listMenu"
export const GET_ROLE_LIST = ADMIN_URL + "/master/role/listRole"
export const GET_ROLE_MENU_LIST = ADMIN_URL + "/master/rolemenu/listRoleMenu"
export const addRole = `${ROLE_API}/add`;
export const addRoleMenu = `${ROLEMENU_API}/add`;

export const GET_ORGANISATIONTYPE_LIST = ADMIN_URL + "/master/organisationtype/listOrganisationType"
export const ADD_ORGANISATIONTYPE = ADMIN_URL + "/master/organisationtype/add"
export const UPDATE_ORGANISATIONTYPE = ADMIN_URL + "/master/organisationtype/update"
export const DELETE_ORGANISATIONTYPE = ADMIN_URL + "/master/organisationtype/delete"

export const GET_ORGANISATION_LIST = ADMIN_URL + "/master/organisation/listOrganisation"
export const ADD_ORGANISATION = ADMIN_URL + "/master/organisation/add"
export const DELETE_ORGANISATION = ADMIN_URL + "/master/organisation/delete"
export const UPDATE_ORGANISATION = ADMIN_URL + "/master/organisation/update"

// User API's
export const update_user_url = "/users/:id"
export const delete_user_url = "/users/:id"

// Plant API's
export const order_url = PLANT_API_URL+"/api/orders/"
export const plant_url = PLANT_API_URL+"/api/products/"
export const category_url = PLANT_API_URL+"/api/categories/"
export const transcation_url = PLANT_API_URL+"/api/transactions/"
export const carousel_url = PLANT_API_URL+"/api/carousels/"
export const review_url = PLANT_API_URL+"/api/reviews/"

export const http = axios.create({})

const getAccessToken = () => {
    return localStorage.getItem("access_token");
};

const setLocalStorage = (key: string, value: string) => {
    localStorage.setItem(key, value);
}

const setAccessToken = (key:string,token: string) => {
    setLocalStorage(key, token);
}
const setRefreshToken = (key:string,token: string) => {
    setLocalStorage(key, token);
}

let setNetworkOnline: ((isOnline: boolean) => void) | null = null;

export const setNetworkContextSetter = (setter: (isOnline: boolean) => void) => {
    setNetworkOnline = setter;
}

export const redirectToLogin = () => {
    // Clear localStorage and redirect to login page
    localStorage.clear();
    window.location.href = "/login";
}

export const removeAllLocalStorage = () => {
    localStorage.clear();
}

async function refreshToken(refreshToken: string | null,originalRequest:any ) {
    console.log("AuthService - Attempting to refresh token",refreshToken);

          return axios.post(refresh_token_request, {refresh_token: refreshToken},
            {
              headers: {
                'Content-Type': 'application/json',
                // 'Access-Control-Allow-Origin': '*'
              }
            })
            .then((res:any) => {
                console.log("AuthService - Token refresh response:", res);
                console.log("AuthService - Token refresh successful, response:", res);
                const { access_token, refresh_token } = res;
                setAccessToken("access_token", access_token);
                setRefreshToken("refresh_token", refresh_token);
                console.log("AuthService - Token refresh successful, new access token saved");
                originalRequest.headers.Authorization = `Bearer ${getAccessToken()}`;
                console.log("AuthService - Token refresh successful, response:", res.data);
                return axios(originalRequest);

            //   if (res.status === 200) {
            //     console.log("AuthService - Token refresh successful, response:", res.data);
            //     const { access_token, refresh_token } = res.data;
            //     setAccessToken("access_token", access_token);
            //     setRefreshToken("refresh_token", refresh_token);
            //     console.log("AuthService - Token refresh successful, new access token saved");
            //     originalRequest.headers.Authorization = `Bearer ${getAccessToken()}`;
    
            //     return axios(originalRequest);
            //   }
    
            }).catch(error => {
              console.error("AuthService - Token refresh failed:", error.response?.data || error.message);
            })
    // try {
    //   const response = await http({
    //     method: 'POST',
    //     url: refresh_token_request,
    //     data: {
    //         refresh_token: refreshToken // No body needed for refresh token request     

    //     }
    //   })
      
    //   const { access_token, refresh_token } = response.data;
    //     //   console.log("response.data",response)
    //   if(response.status==203){

    //     // authService.logout()
    //     redirectToLogin();//added to while refresh token become 203
    //     return 
    //   }
    //   if(access_token!=undefined){
    //     setAccessToken("access_token",access_token)
    //     setRefreshToken("refresh_token",refresh_token)
    //   }
    //   // localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
    //   // console.log("AuthService - New access token saved to localStorage");
      
    //   // If we have a redirect URL from refresh, go there
    // //   if (redirect_url) {
    // //     // console.log("AuthService - Redirecting after token refresh to:", redirect_url);
    // //     window.location.href = redirect_url;
    // //   }
      
    //   return access_token;
    // } catch (error) {
    //   // console.error('AuthService - Token refresh failed:', error.response?.data || error.message);
    //   // localStorage.removeItem(ACCESS_TOKEN_KEY);
    // //   removeAllLocalStorage()
    //   // throw new Error('Token refresh failed');
    //   return null;
    // }
  }

// http.interceptors.request.use((config: any) => {
//     const isAuthRequest = config.url.includes(login_request) || config.url.includes(register_request);
//     if (!isAuthRequest) {
//         console.log("Request URL:", config.url);
//         const token = localStorage.getItem("access_token");
//         console.log("Attaching token to request:", token);
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         } else {
//             console.warn("No access token found in localStorage");
//         }
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });


// Setup request interceptor for adding auth token
http.interceptors.request.use(
    async (config:any) => {
        // console.log("AuthService - Request interceptor for URL:", config.url);
        
        if (!config.url.includes(login_request) && !config.url.includes(register_request)) {
            const token = getAccessToken();
            if (token) {
                // console.log("AuthService - Token found, checking expiration");
                // Check if token is expired
                console.log("AuthService - Attaching token to request:", token);
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                // console.log("AuthService - No token found for authenticated request");
            }
        }
        return config;
    },
    (error) => {
        // console.error("AuthService - Request interceptor error:", error);
        return Promise.reject(error);
    }
    );
    
    // Setup response interceptor for handling token expiration
http.interceptors.response.use(
    (response) => {
        // Set network online when we get a successful response
        if (setNetworkOnline) {
            setNetworkOnline(true);
            console.log("Network status: Online");
        }
        return response;
    },
    async (error) => {
        // console.error("http:", error);
        const originalRequest = error.config;
        
        if (error.code === "ERR_NETWORK") {
            // console.log("Network error detected - not redirecting to login");
            if (setNetworkOnline) {
                setNetworkOnline(false);
                console.log("Network status: Offline");
            }
            // Don't redirect on network errors, just reject the promise
            // return Promise.reject(error);
        } else if (error.response?.status === 500) {
             toast( error.response.data.message +"!!", { position: 'top-right', type: 'error' })
            return Promise.reject(error);
        }else if (error.response?.status === 203) {
            toast( error.response.data.message +"!!", { position: 'top-right', type: 'error' })
            redirectToLogin();
            return Promise.reject(error);
         }else {
            // If 401 and not a refresh token request and not already retried
            if (error.response?.status === 401 && !originalRequest.url.includes('/auth/refresh-accesstoken') && !originalRequest._retry) {
                originalRequest._retry = true;
                console.log("AuthService - 401 detected, attempting token refresh");
                try {
                    const newToken = await refreshToken(localStorage.getItem("refresh_token"),originalRequest);
                    if (newToken) {
                        // console.log("AuthService - New token obtained, retrying original request");
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return http(originalRequest);
                    }
                } catch (refreshError) {
                    // console.error("AuthService - Refresh failed on 401 response:", refreshError);
                    redirectToLogin();
                    return Promise.reject(refreshError);
                }
            }

            if(error.response?.status === 503){
                console.log("service un available")
                toast(  "service un available !!", { position: 'top-right', type: 'error' })
            }
            //503 not catched
            return Promise.reject(error);
        }
    }
);