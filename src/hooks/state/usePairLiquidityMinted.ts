import { BigNumber } from 'ethers';
import { Fetcher, Token, TokenAmount } from '@dfyn/sdk';
import { useCallback, useEffect, useState } from 'react';

import useCore from '../useCore';
import ERC20 from '../../basis-cash/ERC20';
import useTotalSupply from '../useTotalSupply';

type State = {
  isLoading: boolean,
  value: string
}

const usePairLiquidityMinted = (
  assetA: ERC20,
  assetB: ERC20,
  assetAAmount: BigNumber,
  assetBAmount: BigNumber,
  pairSymbol: string
) => {
  const [reserves, setReserves] = useState<State>({
    isLoading: true,
    value: '0'
  });

  const core = useCore();
  const { isLoading: isTotalSupplyLoading, value: totalSupply } = useTotalSupply(pairSymbol);

  const fetchCashPrice = useCallback(async () => {
    if (isTotalSupplyLoading) return;
    if (assetAAmount.lte(0) || assetBAmount.lte(0)) {
      return;
    }

    const assetAT = new Token(core.config.chainId, assetA.address, 18);
    const assetBT = new Token(core.config.chainId, assetB.address, 18);

    const pair = await Fetcher.fetchPairData(assetAT, assetBT, core.provider);
    const totalSupplyTokenAmount = new TokenAmount(pair.liquidityToken, totalSupply.toString());
    const [assetATokenAmount, assetBTokenAmount] = assetAT.address === pair.token0.address
      ? [new TokenAmount(pair.token0, assetAAmount.toString()), new TokenAmount(pair.token1, assetBAmount.toString())]
      : [new TokenAmount(pair.token1, assetBAmount.toString()), new TokenAmount(pair.token0, assetAAmount.toString())];

    const liquidityMinted = pair.getLiquidityMinted(totalSupplyTokenAmount, assetATokenAmount, assetBTokenAmount);
    setReserves({
      isLoading: false,
      value: liquidityMinted.toSignificant(3)
    });
  }, [
    assetA,
    isTotalSupplyLoading,
    totalSupply,
    assetB,
    core,
    assetBAmount,
    assetAAmount
  ]);

  useEffect(() => {
    fetchCashPrice().catch((err) =>
      console.error(`Failed to fetch liquidity minted: ${err.stack}`),
    );
  }, [fetchCashPrice]);

  return reserves;
};

export default usePairLiquidityMinted;
