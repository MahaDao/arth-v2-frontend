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
  balanceOfArth: number;
  balanceOfArthb: number;
  balanceOfDai: number;
  balanceOfMaha: number;
  totalSupplyArth: string;
  totalSupplyArthb: string;
  totalSupplyDai: string;
  totalSupplyMaha: string;
}

export const initialState: TokenState = {
  balanceOfArth: 1,
  balanceOfArthb: 1,
  balanceOfDai: 1,
  balanceOfMaha: 1,
  totalSupplyArth: '1',
  totalSupplyArthb: '1',
  totalSupplyDai: '1',
  totalSupplyMaha: '1',
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateBalanceOfArth, (t, { payload }) => {
      t.balanceOfArth = payload;
    })
    .addCase(updateBalanceOfArthb, (t, { payload }) => {
      t.balanceOfArthb = payload;
    })
    .addCase(updateBalanceOfMaha, (t, { payload }) => {
      t.balanceOfMaha = payload;
    })
    .addCase(updateBalanceOfDai, (t, { payload }) => {
      t.balanceOfDai = payload;
    })
    .addCase(updateTotalSupplyArth, (t, { payload }) => {
      t.totalSupplyArth = payload;
    })
    .addCase(updateTotalSupplyArthb, (t, { payload }) => {
      t.totalSupplyArthb = payload;
    })
    .addCase(updateTotalSupplyMaha, (t, { payload }) => {
      t.totalSupplyDai = payload;
    })
    .addCase(updateTotalSupplyDai, (t, { payload }) => {
      t.totalSupplyMaha = payload;
    }),
);
