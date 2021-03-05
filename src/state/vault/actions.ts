import { createAction } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';

export const updateVaultArthBalance = createAction<BigNumber>('vault/updateVaultArthBalance')
export const updateVaultMahaBalance = createAction<BigNumber>('vault/updateVaultMahaBalance')
export const updateVaultArthDaiBalance = createAction<BigNumber>('vault/updateVaultArthMlpBalance')
export const updateVaultArthEthBalance = createAction<BigNumber>('vault/updateVaultArthEthBalance')


export const updateArthArthEarnings = createAction<BigNumber>('vault/updateArthArthEarnings')
export const updateArthArthMLPEarnings = createAction<BigNumber>('vault/updateArthArthMLPEarnings')
export const updateArthMahaEarnings = createAction<BigNumber>('vault/updateArthMahaEarnings')
export const updateMahaArthEarnings = createAction<BigNumber>('vault/updateMahaArthEarnings')
export const updateMahaArthMLPEarnings = createAction<BigNumber>('vault/updateMahaArthMLPEarnings')
export const updateMahaMahaEarnings = createAction<BigNumber>('vault/updateMahaMahaEarnings')
