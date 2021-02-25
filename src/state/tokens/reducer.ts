import { createReducer } from '@reduxjs/toolkit';

import {
  updateBalanceOfArth,
  updateBalanceOfArthb,
  updateBalanceOfDai,
  updateBalanceOfMaha,
  updateTotalSupplyArth,
  updateTotalSupplyArthb,
  updateTotalSupplyDai,
  updateTotalSupplyMaha,
} from './actions';

export interface TokenState {
  [symbol: string]: {
    balance: string;
    totalSupply: string;
  };
}

export const initialState: TokenState = {
  DAI: {
    balance: '0',
    totalSupply: '0',
  },
  ARTH: {
    balance: '0',
    totalSupply: '0',
  },
  ARTHB: {
    balance: '0',
    totalSupply: '0',
  },
  MAHA: {
    balance: '0',
    totalSupply: '0',
  },
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateBalanceOfArth, (state, { payload }) => {
      state.ARTH.balance = payload;
    })
    .addCase(updateBalanceOfArthb, (state, { payload }) => {
      state.ARTHB.balance = payload;
    })
    .addCase(updateBalanceOfMaha, (state, { payload }) => {
      state.MAHA.balance = payload;
    })
    .addCase(updateBalanceOfDai, (state, { payload }) => {
      state.DAI.balance = payload;
    })
    .addCase(updateTotalSupplyArth, (state, { payload }) => {
      state.ARTH.totalSupply = payload;
    })
    .addCase(updateTotalSupplyArthb, (state, { payload }) => {
      state.ARTHB.totalSupply = payload;
    })
    .addCase(updateTotalSupplyMaha, (state, { payload }) => {
      state.MAHA.totalSupply = payload;
    })
    .addCase(updateTotalSupplyDai, (state, { payload }) => {
      state.DAI.totalSupply = payload;
    }),
);
