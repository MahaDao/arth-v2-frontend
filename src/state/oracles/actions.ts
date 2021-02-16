import { createAction } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';

export const updateGMUOraclePrice = createAction<string>('oracles/updateGMUOraclePrice');

