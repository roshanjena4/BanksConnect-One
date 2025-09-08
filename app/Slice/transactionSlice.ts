import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface TransactionState {
  transactionData: unknown | null;
  loading: boolean;
}

const initialState: TransactionState = {
  transactionData: null,
  loading: false,
}

export const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactionData: (state, action: PayloadAction<unknown>) => {
      state.transactionData = action.payload;
      state.loading = false;
    },
  },
})

export const { setTransactionData } = transactionSlice.actions;

export default transactionSlice.reducer;
