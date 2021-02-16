import { configureStore, Dispatch, getDefaultMiddleware } from '@reduxjs/toolkit';
import { save, load } from 'redux-localstorage-simple';
import transactions from './transactions/reducer';
import application from './application/reducer';
import treasury from './treasury/reducer';
import oracle from './oracles/reducer';

import { createLogger } from 'redux-logger';
import BasisCash from '../basis-cash';
import * as Treasury from './treasury/controller';
import * as Oracle from './oracles/controller';

const PERSISTED_KEYS: string[] = ['transactions', 'treasury'];

const store = configureStore({
  reducer: {
    application,
    transactions,
    treasury,
    oracle,
  },
  middleware: [
    ...getDefaultMiddleware({ thunk: false }),
    save({ states: PERSISTED_KEYS }),
    createLogger(),
  ],
  preloadedState: load({ states: PERSISTED_KEYS }),
});

export function initMulticallListners(basisCash: BasisCash, dispatch: Dispatch<any>) {
  Treasury.init(basisCash, dispatch)
  Oracle.init(basisCash, dispatch)
}

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
