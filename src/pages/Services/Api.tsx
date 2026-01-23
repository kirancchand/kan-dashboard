import {BASE_URL} from './constant' 
// ........reponse.......///
export const fetchCategoryApi=BASE_URL+"/cake/getAllCategory"
export const fetchGetAllCake=BASE_URL+"/cake/getAllCake"  
export const fetchGetAllComments=BASE_URL+"/cake/getAllComments"  
export const fetchGetCakeWithCommentsByCakeId=BASE_URL+"/cake/getCakeWithCommentsByCakeId/2"
export const fetchGetAllOrders=BASE_URL+"/cake/getAllOrders"
export const fetchGetIndividualOrders=BASE_URL+"/cake/getOrderDetailsByOrderId/2508202500001" 
export const fetchGetAllCategory=BASE_URL+"/book/getAllCategory" 
export const fetchGetAllBooks=BASE_URL+"/book/getAllBook" 
export const fetchgetAllusers=BASE_URL+"/cake/getAllUsers"
export const fetchgetAllCustomerQuery=BASE_URL+"/cake/getAllCustomerQuery" 
// ...........Add...............///
export const fetchaddCategory=BASE_URL+"/cake/addCategory" 
export const fetchaddCake=BASE_URL+"/cake/addCake"
export const fetchaddbookCategory=BASE_URL+"/book/addCategory"
export const fetchkeyvalues=BASE_URL+"/keyValue" 
export const fetchaddsplashimages=BASE_URL+"/cake/addSplashImage"
