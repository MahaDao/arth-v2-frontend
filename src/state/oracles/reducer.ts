import { createReducer } from '@reduxjs/toolkit';
import {
updateGMUOraclePrice
} from './actions';

export interface OracleState {
  GMUOraclePrice: string;
}

export const initialState: OracleState = {
  GMUOraclePrice: '0',

};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateGMUOraclePrice, (t, { payload }) => {
      t.GMUOraclePrice = payload;
    })

);
