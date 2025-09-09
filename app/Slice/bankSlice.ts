import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface BankApi {
  id: number;
  name: string;
  code: string;
  address: string;
  contactemail: string;
  createdat: string;
  status: string;
}

export interface BankState {
  bankData: BankApi[] | null;
  loading: boolean;
}

const initialState: BankState = {
  bankData: null,
  loading: false,
}

export const bankSlice = createSlice({
  name: 'bank',
  initialState,
  reducers: {
    setBankData: (state, action: PayloadAction<BankApi[] | null>) => {
      state.bankData = action.payload;
      state.loading = false;
    },
  },
})

export const { setBankData } = bankSlice.actions;

export default bankSlice.reducer;