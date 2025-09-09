import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface CardApi {
  id: number;
  card_number: string;
  account_no: string;
  card_type: string;
  expiry_date: string;
  cvv: string;
  cardholder_name: string;
  pin: string;
  status: string;
  issued_at: string;
}

export interface CardsState {
  cardsData: CardApi[] | null;
  loading: boolean;
}

const initialState: CardsState = {
  cardsData: null,
  loading: false,
}

export const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setCardsData: (state, action: PayloadAction<CardApi[] | null>) => {
      state.cardsData = action.payload;
      state.loading = false;
    },
  },
})

export const { setCardsData } = cardsSlice.actions;

export default cardsSlice.reducer;
