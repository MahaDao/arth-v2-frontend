import { Dispatch } from '@reduxjs/toolkit';
import { BasisCash } from '../../basis-cash/BasisCash';
import { updateGMUOraclePrice } from './actions';

export const init = (basisCash: BasisCash, dispatch: Dispatch) => {
  basisCash.multicall.on('ORACLE_GMU_PRICE', (val) => dispatch(updateGMUOraclePrice(val)));

  basisCash.multicall.addCalls([
    {
      key: 'ORACLE_GMU_PRICE',
      target: basisCash.contracts.GMUOracle.address,
      call: ['getPrice()(uint256)'],
      convertResult: (val) => val.toString(),
    },
  ]);
};
