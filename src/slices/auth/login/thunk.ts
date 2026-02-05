import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  loginSuccess,
  logoutUser,
  apiError,
  reset_login_flag,
} from "./reducer";
import { clearTokens, saveTokens } from "utils/tokenStorage";
import { http,userinfo_request } from "http/http";
import { userInformation } from "slices/thunks";

export const loginUser =
  (response: any, navigate: any) => async (dispatch: any) => {
    try {
      const { data } = response;
      const tokens = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      };

      saveTokens(tokens);
      const userinfo = await http.get(userinfo_request);
      dispatch(userInformation(userinfo));

      sessionStorage.setItem("authUser", JSON.stringify(data));
      dispatch(loginSuccess(data));
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
