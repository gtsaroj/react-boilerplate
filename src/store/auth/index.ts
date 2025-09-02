import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  user: Auth.AuthState | null;
} = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<Auth.AuthState>) => {
      state.user = action.payload;
    },
  },
});

export const { addUser } = authSlice.actions;
export default authSlice.reducer;
