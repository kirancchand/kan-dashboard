import { createSlice } from "@reduxjs/toolkit";
import { boolean } from "yup";

export const initialState = {
  error: "",
  success: false,
  user: {}
};

const ProfileSlice = createSlice({
  name: "Profile",
  initialState,
  reducers: { 
    profileSuccess(state : any, action : any) {
      state.success = true
      state.user = action.payload
    },
    profileError(state, action) {
        state.error = action.payload
    },
    editProfileChange(state){
      state = { ...state };
    },
    resetProfileFlagChange(state : any){
      state.success = null
    }
  },
});

export const {
    profileSuccess,
    profileError,
    editProfileChange,
    resetProfileFlagChange
} = ProfileSlice.actions

export default ProfileSlice.reducer;