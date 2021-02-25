import { configureStore, Dispatch, getDefaultMiddleware } from '@reduxjs/toolkit';
import { save, load } from 'redux-localstorage-simple';
import { createLogger } from 'redux-logger';
import transactions from './transactions/reducer';
import application from './application/reducer';
import treasury from './treasury/reducer';
import oracle from './oracles/reducer';
import tokens from './tokens/reducer';
import * as Treasury from './treasury/controller';
import * as Oracle from './oracles/controller';
import * as Tokens from './tokens/controller';
import BasisCash from '../basis-cash';
import { IMulticallInput } from '../basis-cash/Mulitcall';

const PERSISTED_KEYS: string[] = ['transactions', 'treasury'];

const store = configureStore({
  reducer: {
    application,
    transactions,
    treasury,
    oracle,
    tokens,
  },
  middleware: [
    ...getDefaultMiddleware({ thunk: false }),
    save({ states: PERSISTED_KEYS }),
    createLogger(),
  ],
  preloadedState: load({ states: PERSISTED_KEYS }),
});

export function initMulticallListners(
  basisCash: BasisCash,
  dispatch: Dispatch<any>,
  account: string,
) {
  let multiCalls: IMulticallInput[] = [];

  multiCalls = [...multiCalls, ...Treasury.init(basisCash, dispatch)];
  multiCalls = [...multiCalls, ...Oracle.init(basisCash, dispatch)];
  multiCalls = [...multiCalls, ...Tokens.init(basisCash, dispatch, account)];

  basisCash.multicall.addCalls(multiCalls);
}

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
