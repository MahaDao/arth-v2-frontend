import { Dispatch } from '@reduxjs/toolkit';
import { BasisCash } from '../../basis-cash/BasisCash';
import {
  updateNextEpochPoint,
  updateCurrentEpoch,
  updatePeriod,
  updateStabilityFees,
} from './actions';

export const init = (basisCash: BasisCash, dispatch: Dispatch) => {
  basisCash.multicall.on('TREASURY_NEXT_EPOCH_POINT', (val) =>
    dispatch(updateNextEpochPoint(val)),
  );
  basisCash.multicall.on('TREASURY_PERIOD', (val) => dispatch(updatePeriod(val)));
  basisCash.multicall.on('TREASURY_CURRENT_EPOCH', (val) => dispatch(updateCurrentEpoch(val)));
  basisCash.multicall.on('TREASURY_STABILITY_FEES', (val) =>
    dispatch(updateStabilityFees(val)),
  );

  basisCash.multicall.addCalls([
    {
      key: 'TREASURY_NEXT_EPOCH_POINT',
      target: basisCash.contracts.Treasury.address,
      call: ['nextEpochPoint()(uint256)'],
      convertResult: (val) => val.toNumber(),
    },
    {
      key: 'TREASURY_PERIOD',
      target: basisCash.contracts.Treasury.address,
      call: ['getPeriod()(uint256)'],
      convertResult: (val) => val.toNumber(),
    },
    {
      key: 'TREASURY_CURRENT_EPOCH',
      target: basisCash.contracts.Treasury.address,
      call: ['getCurrentEpoch()(uint256)'],
      convertResult: (val) => val.toNumber(),
    },
    {
      key: 'TREASURY_STABILITY_FEES',
      target: basisCash.contracts.Treasury.address,
      call: ['stabilityFee()(uint256)'],
      convertResult: (val) => val.toString(),
    },
  ]);
};
