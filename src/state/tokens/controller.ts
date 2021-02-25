import { Dispatch } from '@reduxjs/toolkit';
import { value } from 'numeral';
import { BasisCash } from '../../basis-cash/BasisCash';
import {
  updateBalanceOfArth,
  updateBalanceOfArthb,
  updateBalanceOfDai,
  updateBalanceOfMaha,
  updateTotalSupplyArth,
  updateTotalSupplyArthb,
  updateTotalSupplyDai,
  updateTotalSupplyMaha,
} from './actions';

export const init = (basisCash: BasisCash, dispatch: Dispatch, account: string) => {
  const BALANCE_OF_EVENTS: string[] = [
    'BALANCE_OF_ARTH',
    'BALANCE_OF_ARTHB',
    'BALANCE_OF_MAHA',
    'BALANCE_OF_DAI',
  ];

  const TOTAL_SUPPLY_EVENTS: string[] = [
    'TOTAL_SUPPLY_ARTH',
    'TOTAL_SUPPLY_ARTHB',
    'TOTAL_SUPPLY_MAHA',
    'TOTAL_SUPPLY_DAI',
  ];

  const COIN_ADDRESSES: string[] = [
    basisCash.ARTH.address,
    basisCash.ARTHB.address,
    basisCash.MAHA.address,
    basisCash.DAI.address,
  ];

  const tokenCalls = [];

  basisCash.multicall.on('TOTAL_SUPPLY_ARTH', (val) => dispatch(updateTotalSupplyArth(val)));
  basisCash.multicall.on('TOTAL_SUPPLY_ARTHB', (val) => dispatch(updateTotalSupplyArthb(val)));
  basisCash.multicall.on('TOTAL_SUPPLY_MAHA', (val) => dispatch(updateTotalSupplyMaha(val)));
  basisCash.multicall.on('TOTAL_SUPPLY_DAI', (val) => dispatch(updateTotalSupplyDai(val)));

  for (let i = 0; i < TOTAL_SUPPLY_EVENTS.length; i++) {
    tokenCalls.push({
      key: TOTAL_SUPPLY_EVENTS[i],
      target: COIN_ADDRESSES[i],
      call: ['totalSupply()(uint256)'],
      convertResult: (val: any) => val.toString(),
    });
  }

  if (account) {
    basisCash.multicall.on('BALANCE_OF_ARTH', (val) => dispatch(updateBalanceOfArth(val)));
    basisCash.multicall.on('BALANCE_OF_ARTHB', (val) => dispatch(updateBalanceOfArthb(val)));
    basisCash.multicall.on('BALANCE_OF_MAHA', (val) => dispatch(updateBalanceOfMaha(val)));
    basisCash.multicall.on('BALANCE_OF_DAI', (val) => dispatch(updateBalanceOfDai(val)));

    for (let i = 0; i < BALANCE_OF_EVENTS.length; i++) {
      tokenCalls.push({
        key: BALANCE_OF_EVENTS[i],
        target: COIN_ADDRESSES[i],
        call: ['balanceOf(address)(uint256)', account],
        convertResult: (val: any) => val / 10 ** 18,
      });
    }
  }

  return tokenCalls;
};
