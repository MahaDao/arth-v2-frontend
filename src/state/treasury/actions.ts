import { createAction } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';

export const updateNextEpochPoint = createAction<number>('transactions/updateNextEpochPoint');
export const updatePeriod = createAction<number>('transactions/updatePeriod');
export const updateCurrentEpoch = createAction<number>('transactions/updateCurrentEpoch');
export const updateStabilityFees = createAction<string>('treasury/updateStabilityFees');
export const updateCashPriceInLastTWAP = createAction<string>(
  'transactions/updateCashPriceInLastTWAP',
);
export const updateBondOraclePriceInLastTWAP = createAction<string>(
  'transactions/updateBondOraclePriceInLastTWAP',
);
