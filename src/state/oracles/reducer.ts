import { createReducer } from '@reduxjs/toolkit';
import {
  updateGMUOraclePrice,
  updateSMGOraclePrice,
  updateSMGOracleBlockTimestampLast,
} from './actions';

export interface OracleState {
  GMUOraclePrice: string;
  SMGOraclePrice: string;
  SMGOracleBlockTimestampLast: string;
}

export const initialState: OracleState = {
  GMUOraclePrice: '0',
  SMGOraclePrice: '0',
  SMGOracleBlockTimestampLast: '0',
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateGMUOraclePrice, (t, { payload }) => {
      t.GMUOraclePrice = payload;
    })
    .addCase(updateSMGOraclePrice, (t, { payload }) => {
      t.SMGOraclePrice = payload;
    })
    .addCase(updateSMGOracleBlockTimestampLast, (t, { payload }) => {
      t.SMGOracleBlockTimestampLast = payload;
    }),
);
