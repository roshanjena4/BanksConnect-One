import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface AccountApi{
  Id: number;
  userid: number;
  bankid: number;
  accountnumber: string;
  accounttype: string;
  balance: number;
  createdat: string;
  status: string;
}

export interface AccountState {
  accountData: AccountApi[] | null;
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
    setAccountData: (state, action: PayloadAction<AccountApi[] | null>) => {
      state.accountData = action.payload;
      state.loading = false;
    },
  },
})

export const { setAccountData } = accountSlice.actions;

export default accountSlice.reducer;