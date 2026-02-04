import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import { loginUser, logoutUser, apiError, reset_login_flag } from "./reducer";
import { clearTokens, saveTokens } from "utils/tokenStorage";
import { accessToken,refreshToken } from "api/dummyToken";

export const loginSuccess =
  (user: any, navigate: any) => async (dispatch: any) => {
    try {

      // const response = await api.post(loginUrl, user);
      // const data = response.data;
      
      const data = {
        username:user.username,
        first_name:"viswajith"
      }

      const tokens = {
        access_token: accessToken,
        refresh_token: refreshToken,
      };

      saveTokens(tokens);
      sessionStorage.setItem("authUser", JSON.stringify(data));
      dispatch(loginUser(data));
      navigate("/dashboard");

    } catch (error: any) {
      dispatch(apiError(error));
    }
  };


export const logoutSuccess = () => async (dispatch: any) => {
  try {
    sessionStorage.removeItem("authUser");
    clearTokens();

    let fireBaseBackend: any = getFirebaseBackend();
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = fireBaseBackend.logout;
      dispatch(logoutUser(response));
    } else {
      dispatch(logoutUser(true));
    }
  } catch (error: any) {
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => async (dispatch: any) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error: any) {
    dispatch(apiError(error));
  }
};
