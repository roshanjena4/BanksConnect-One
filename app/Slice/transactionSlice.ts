import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface TransactionApi {
  id: number;
  from_account_id: string;
  to_account_id: string;
  transaction_type: string;
  amount: number;
  category: string;
  description: string;
  status: string;
  transaction_time: string;
}

export interface TransactionState {
  transactionData: TransactionApi[] | null;
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
    setTransactionData: (state, action: PayloadAction<TransactionApi[] | null>) => {
      state.transactionData = action.payload;
      state.loading = false;
    },
  },
})

export const { setTransactionData } = transactionSlice.actions;

export default transactionSlice.reducer;
