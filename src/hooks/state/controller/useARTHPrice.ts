import { BigNumber } from '@ethersproject/bignumber';
import { useCallback, useEffect, useState } from 'react';

import useCore from '../../useCore';

type State = {
  isLoading: boolean;
  value: BigNumber;
};

export default () => {
  const [customState, setCustomState] = useState<State>({
    isLoading: true,
    value: BigNumber.from(0),
  });
  const core = useCore();

  const fetchCashPrice = useCallback(async () => {
    const controller = core.contracts.UniswapPairOracle_ARTH_USDC;
    const decimals = BigNumber.from(10).pow(18);

    console.log(
      core.ARTH.address,
      1000000000000000000,
      // await controller.consult(core.ARTH.address, 1000000000000000000),
    );

    setCustomState({
      isLoading: false,
      value: await controller.consult(core.ARTH.address, decimals),
    });
  }, [core.ARTH.address, core.contracts.UniswapPairOracle_ARTH_USDC]);

  useEffect(() => {
    fetchCashPrice().catch((err) =>
      console.error(`Failed to fetch uniswap price: ${err.stack}`),
    );
  }, [fetchCashPrice]);

  return customState;
};
