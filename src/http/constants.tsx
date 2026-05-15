//live
// export const BASE_URL = 'http://3.23.103.50:8084'
// export const DEV_URL = 'http://3.23.103.50:5000'
// export const ADMIN_URL = "http://3.23.103.50:8070"
// export const PLANT_API_URL = 'http://3.23.103.50:5000'
////local
export const HOST='192.168.1.178'
export const BASE_URL = `http://${HOST}:8084`;
export const DEVURL = `http://${HOST}:8080`;
export const DEV_URL = `http://${HOST}:5000`
export const ADMIN_URL = `http://${HOST}:8070`
export const PLANT_API_URL = `http://${HOST}:5000`

export const GET_MASTER_DATA = ADMIN_URL + '/keyValue';
export const MASTER_API = ADMIN_URL + '/master';



