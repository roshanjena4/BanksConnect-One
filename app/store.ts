import { configureStore, combineReducers } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist'
import {FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER} from 'redux-persist';

import userReducer from './Slice/userSlice'
import accountReducer from './Slice/accountSlice'
import transactionReducer from './Slice/transactionSlice'
import bankReducer from './Slice/bankSlice'
import cardsReducer from './Slice/cardsSlice'

const rootReducers = combineReducers({
  user: userReducer,
  account: accountReducer,
  transaction: transactionReducer,
  bank: bankReducer,
  cards: cardsReducer,
})

const configPersist = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'account', 'transaction', 'bank', 'cards'], //allow to persist
}

const persistedReducer = persistReducer(configPersist, rootReducers)
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch