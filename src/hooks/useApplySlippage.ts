import { useMemo } from 'react';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

import { useSlippage } from '../state/slippage/hooks';

export default (amount: BigNumber) => {
  const slippageState = useSlippage();

  return useMemo(() => {
    const slippageRate = Number(slippageState.value) / 100;
    if (!slippageRate) return amount;

    const precisionFixesSlippageRate = Math.floor(slippageRate * 1e6) / 1e6;
    const slippageRateBN = BigNumber.from(parseUnits(`${precisionFixesSlippageRate}`, 6));

    return (
      amount
        .mul(BigNumber.from(1e6).sub(slippageRateBN))
        .div(1e6)
    );
  }, [amount, slippageState])
}
