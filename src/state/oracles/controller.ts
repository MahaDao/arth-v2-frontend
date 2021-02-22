import { Dispatch } from '@reduxjs/toolkit';
import { BasisCash } from '../../basis-cash/BasisCash';
import {
  updateGMUOraclePrice,
  updateSMGOraclePrice,
  updateSMGOracleBlockTimestampLast,
} from './actions';

export const init = (basisCash: BasisCash, dispatch: Dispatch) => {
  basisCash.multicall.on('ORACLE_GMU_PRICE', (val) => dispatch(updateGMUOraclePrice(val)));
  basisCash.multicall.on('ORACLE_SMG_PRICE', (val) => dispatch(updateSMGOraclePrice(val)));
  basisCash.multicall.on('ORACLE_SMG_BLOCKTIMESTAMP', (val) =>
    dispatch(updateSMGOracleBlockTimestampLast(val)),
  );

  basisCash.multicall.addCalls([
    {
      key: 'ORACLE_GMU_PRICE',
      target: basisCash.contracts.GMUOracle.address,
      call: ['getPrice()(uint256)'],
      convertResult: (val) => val.toString(),
    },
    {
      key: 'ORACLE_SMG_PRICE',
      target: basisCash.contracts.SeigniorageOracle.address,
      call: ['price0CumulativeLast()(uint256)'],
      convertResult: (val) => val.toString(),
    },
    {
      key: 'ORACLE_SMG_BLOCKTIMESTAMP',
      target: basisCash.contracts.SeigniorageOracle.address,
      call: ['blockTimestampLast()(uint256)'],
      convertResult: (val) => val.toString(),
    },
  ]);
};
