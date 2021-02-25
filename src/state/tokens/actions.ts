import { createAction } from '@reduxjs/toolkit';

export const updateBalanceOfArth = createAction<string>('tokens/updateBalanceOfArth');
export const updateBalanceOfArthb = createAction<string>('tokens/updateBalanceOfArthb');
export const updateBalanceOfMaha = createAction<string>('tokens/updateBalanceOfMaha');
export const updateBalanceOfDai = createAction<string>('tokens/updateBalanceOfDai');

export const updateTotalSupplyArth = createAction<string>('tokens/updateTotalSupplyArth');
export const updateTotalSupplyArthb = createAction<string>('tokens/updateTotalSupplyArthb');
export const updateTotalSupplyMaha = createAction<string>('tokens/updateTotalSupplyMaha');
export const updateTotalSupplyDai = createAction<string>('tokens/updateTotalSupplyDai');