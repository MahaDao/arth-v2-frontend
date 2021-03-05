import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { save, load } from 'redux-localstorage-simple';
import transactions from './transactions/reducer';
import application from './application/reducer';
import treasury from './treasury/reducer';
import token from './token/reducer';
import vault from './vault/reducer';
import { createLogger } from 'redux-logger'


const PERSISTED_KEYS: string[] = ['transactions', 'token'];

const store = configureStore({
  reducer: {
    application,
    transactions,
    treasury,
    vault,
    token
  },
  middleware: [...getDefaultMiddleware({ serializableCheck: false, thunk: false }), save({ states: PERSISTED_KEYS }), createLogger()],
  preloadedState: load({ states: PERSISTED_KEYS }),
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
