import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface BankState {
  bankData: unknown | null;
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
    setBankData: (state, action: PayloadAction<unknown>) => {
      state.bankData = action.payload;
      state.loading = false;
    },
  },
})

export const { setBankData } = bankSlice.actions;

export default bankSlice.reducer;