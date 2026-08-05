import { BASE_URL, ADMIN_URL, MASTER_API, PLANT_API_URL,ELASTIC_URL,VILLAGE_URL } from '../../http/constants'
export const ADD_VILLAGE_NAME = VILLAGE_URL + "/api/villageapps"
export const GET_VILLAGE_NAME = VILLAGE_URL + "/api/villageapps/list"
export const UPDATE_VILLAGE_NAME = VILLAGE_URL + "/api/villageapps/update"
export const DELETE_VILLAGE_NAME = VILLAGE_URL + "/api/villageapps/delete"


export const ADD_VILLAGE_CAROUSEL = VILLAGE_URL + "/api/carousel"
export const GET_VILLAGE_CAROUSEL = VILLAGE_URL + "/api/carousel/list"
export const UPDATE_VILLAGE_CAROUSEL = VILLAGE_URL + "/api/carousel/update"
export const DELETE_VILLAGE_CAROUSEL = VILLAGE_URL + "/api/carousel/delete"


export const MD_URL = VILLAGE_URL+'/api/keyValue';
export const GET_ORGANISATION_LIST = ADMIN_URL + "/master/organisation/listOrganisation"


export const ADD_VILLAGE_ORGANISATION = VILLAGE_URL + "/api/organisations"
export const GET_VILLAGE_ORGANISATION = VILLAGE_URL + "/api/organisations/list"
export const UPDATE_VILLAGE_ORGANISATION = VILLAGE_URL + "/api/organisations/update"
export const DELETE_VILLAGE_ORGANISATION = VILLAGE_URL + "/api/organisations/delete"

export const ADD_VILLAGE_ADVERTISEMENT = VILLAGE_URL + "/api/advertisements"
export const GET_VILLAGE_ADVERTISEMENT = VILLAGE_URL + "/api/advertisements/list"
export const UPDATE_VILLAGE_ADVERTISEMENT = VILLAGE_URL + "/api/advertisements/update"
export const DELETE_VILLAGE_ADVERTISEMENT = VILLAGE_URL + "/api/advertisements/delete"

export const ADD_VILLAGE_USERS = VILLAGE_URL + "/api/users"
export const GET_VILLAGE_USERS = VILLAGE_URL + "/api/users/list"
export const GET_VILLAGE_ALL_USERS = VILLAGE_URL + "/api/users/alllist"
export const DELETE_VILLAGE_USERS = VILLAGE_URL + "/api/users/delete"
export const UPDATE_VILLAGE_USERS = VILLAGE_URL + "/api/users/update"






