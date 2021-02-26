import { createAction } from '@reduxjs/toolkit';

export const updateNextEpochPoint = createAction<number>('treasury/updateNextEpochPoint');
export const updatePeriod = createAction<number>('treasury/updatePeriod');
export const updateCurrentEpoch = createAction<number>('treasury/updateCurrentEpoch');
export const updateStabilityFees = createAction<string>('treasury/updateStabilityFees');
export const updateCashPriceInLastTWAP = createAction<string>(
  'treasury/updateCashPriceInLastTWAP',
);
export const updateBondOraclePriceInLastTWAP = createAction<string>(
  'treasury/updateBondOraclePriceInLastTWAP',
);
