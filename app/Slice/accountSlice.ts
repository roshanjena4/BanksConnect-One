import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AccountState {
  accountData: unknown | null;
  loading: boolean;
}

const initialState: AccountState = {
  accountData: null,
  loading: false,
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccountData: (state, action: PayloadAction<unknown>) => {
      state.accountData = action.payload;
      state.loading = false;
    },
  },
})

export const { setAccountData } = accountSlice.actions;

export default accountSlice.reducer;