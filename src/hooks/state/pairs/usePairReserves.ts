import { Fetcher, Route, Token } from '@dfyn/sdk';
import { useCallback, useEffect, useState } from 'react';

import useCore from '../../useCore';
import ERC20 from '../../../basis-cash/ERC20';

type State = {
  isLoading: boolean,
  value: {
    firstCoin: string,
    secondCoin: string
  }
}

const usePairReserves = (assetA: ERC20, assetB: ERC20) => {
  const [reserves, setReserves] = useState<State>({
    isLoading: true,
    value: {
      firstCoin: '0',
      secondCoin: '0'
    }
  });

  const core = useCore();

  const fetchCashPrice = useCallback(async () => {
    const assetAT = new Token(core.config.chainId, assetA.address, 18);
    const assetBT = new Token(core.config.chainId, assetB.address, 18);

    const pair = await Fetcher.fetchPairData(assetAT, assetBT, core.provider);
    setReserves({
      isLoading: false,
      value: {
        firstCoin: assetA.address === assetAT.address ? pair.reserve0.toSignificant(3) : pair.reserve1.toSignificant(3),
        secondCoin: assetA.address === assetAT.address ? pair.reserve1.toSignificant(3) : pair.reserve0.toSignificant(3),
      }
    });
  }, [assetA.address, assetB.address, core]);

  useEffect(() => {
    fetchCashPrice().catch((err) =>
      console.error(`Failed to fetch uniswap price: ${err.stack}`),
    );
  }, [fetchCashPrice]);

  return reserves;
};

export default usePairReserves;
