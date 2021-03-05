import { createReducer } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';
import { Vaults, BoardroomsV2 } from '../../basis-cash/config';
import * as Actions from './actions';


export interface VaultState {
  // boardrooms: {
  //   [key in BoardroomsV2]: BigNumber
  // }

  vaults: {
    [key in Vaults]: BigNumber
  }
}

export const initialState: VaultState = {
  vaults: {
    [Vaults.arth]: BigNumber.from(0),
    [Vaults.arthDaiLiquidity]: BigNumber.from(0),
    [Vaults.arthEthLiquidity]: BigNumber.from(0),
    [Vaults.maha]: BigNumber.from(0),
  },

  // boardrooms: {
  //   [BoardroomsV2.arthArth]: BigNumber.from(0),
  //   [BoardroomsV2.arthArthMlpLiquidity]: BigNumber.from(0),
  //   [BoardroomsV2.arthMaha]: BigNumber.from(0),
  //   [BoardroomsV2.mahaArth]: BigNumber.from(0),
  //   [BoardroomsV2.mahaArthMlpLiquidity]: BigNumber.from(0),
  //   [BoardroomsV2.mahaMaha]: BigNumber.from(0),
  // }
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(Actions.updateVaultArthBalance, (t, { payload }) => { t.vaults.arth = payload })
    .addCase(Actions.updateVaultArthDaiBalance, (t, { payload }) => { t.vaults.arthDaiLiquidity = payload })
    .addCase(Actions.updateVaultMahaBalance, (t, { payload }) => { t.vaults.maha = payload })
    .addCase(Actions.updateVaultArthEthBalance, (t, { payload }) => { t.vaults.arthEthLiquidity = payload })

    // .addCase(Actions.updateArthArthEarnings, (t, { payload }) => { t.boardrooms.arthArth = payload })
    // .addCase(Actions.updateArthArthMLPEarnings, (t, { payload }) => { t.boardrooms.arthArthMlpLiquidity = payload })
    // .addCase(Actions.updateArthMahaEarnings, (t, { payload }) => { t.boardrooms.arthMaha = payload })
    // .addCase(Actions.updateMahaArthEarnings, (t, { payload }) => { t.boardrooms.mahaArth = payload })
    // .addCase(Actions.updateMahaArthMLPEarnings, (t, { payload }) => { t.boardrooms.mahaArthMlpLiquidity = payload })
    // .addCase(Actions.updateMahaMahaEarnings, (t, { payload }) => { t.boardrooms.mahaMaha = payload })
);
