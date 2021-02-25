import { createAction } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';

export const updateGMUOraclePrice = createAction<string>('oracles/updateGMUOraclePrice');

export const updateSMGOraclePrice = createAction<string>(
  'oracles/updateprice0CumulativeLast',
);
export const updateSMGOracleBlockTimestampLast = createAction<string>(
  'oracles/updateblockTimestampLast',
);
