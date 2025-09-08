import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CardsState {
  cardsData: unknown | null;
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
    setCardsData: (state, action: PayloadAction<unknown>) => {
      state.cardsData = action.payload;
      state.loading = false;
    },
  },
})

export const { setCardsData } = cardsSlice.actions;

export default cardsSlice.reducer;
