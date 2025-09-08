// "use server"
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { set } from 'zod';
// import { cookies } from 'next/headers';

export interface UserState {
  status: boolean;
  isLoggedIn: boolean;
  userData: unknown | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  status: false,
  isLoggedIn: false,
  userData: null,
  token: null,
  loading: false,
  error: null,
}
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: unknown; token: string }>) => {
      debugger;
      state.isLoggedIn = true;
      state.userData = action.payload.user;
      state.token = action.payload.token;
    },
    setUserData: (state, action: PayloadAction<unknown>) => {
      state.userData = action.payload;
    },
    logout: (state) => {
            // debugger
            state.isLoggedIn = false;
            state.userData = null;
            state.token = null;
            // Side effects like cookie deletion should be handled outside reducers (e.g., in thunks or components)
        }
  },
})

export const { login,logout, setUserData } = userSlice.actions

export default userSlice.reducer