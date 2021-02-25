import { createAction } from '@reduxjs/toolkit';

export const updateBalanceOfArth = createAction<number>('tokens/updateBalanceOfArth');
export const updateBalanceOfArthb = createAction<number>('tokens/updateBalanceOfArthb');
export const updateBalanceOfMaha = createAction<number>('tokens/updateBalanceOfMaha');
export const updateBalanceOfDai = createAction<number>('tokens/updateBalanceOfDai');

export const updateTotalSupplyArth = createAction<string>('tokens/updateTotalSupplyArth');
export const updateTotalSupplyArthb = createAction<string>('tokens/updateTotalSupplyArthb');
export const updateTotalSupplyMaha = createAction<string>('tokens/updateTotalSupplyMaha');
export const updateTotalSupplyDai = createAction<string>('tokens/updateTotalSupplyDai');