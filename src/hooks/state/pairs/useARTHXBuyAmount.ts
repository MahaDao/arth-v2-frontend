import { BigNumber } from 'ethers';
import { Fetcher, Token, TokenAmount } from '@dfyn/sdk';
import { useCallback, useEffect, useState } from 'react';

import useCore from '../../useCore';
import ERC20 from '../../../basis-cash/ERC20';

type State = {
  isLoading: boolean,
  value: string
}

const useARTHXBuyAmount = (
  assetA: ERC20,
  assetB: ERC20,
  assetAAmount: BigNumber,
) => {
  const [reserves, setReserves] = useState<State>({
    isLoading: true,
    value: '0'
  });

  const core = useCore();
  const fetchCashPrice = useCallback(async () => {
    if (assetAAmount.lte(0)) {
      return;
    }

    const assetAT = new Token(core.config.chainId, assetA.address, 18);
    const assetBT = new Token(core.config.chainId, assetB.address, 18);

    const pair = await Fetcher.fetchPairData(assetAT, assetBT, core.provider);

    const [outputAmount,] = pair.getOutputAmount(new TokenAmount(assetAT, assetAAmount.toString()));
    setReserves({
      isLoading: false,
      value: outputAmount.toSignificant(18)
    });
  }, [
    assetA,
    assetB,
    core,
    assetAAmount
  ]);

  useEffect(() => {
    fetchCashPrice().catch((err) =>
      console.error(`Failed to fetch liquidity minted: ${err.stack}`),
    );
  }, [fetchCashPrice]);

  return reserves;
};

export default useARTHXBuyAmount;
