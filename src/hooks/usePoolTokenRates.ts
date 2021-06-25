import { BigNumber } from 'ethers';
import { useWallet } from 'use-wallet';
import { useCallback, useEffect, useState } from 'react';

import useCore from './useCore';
import { useBlockNumber } from '../state/application/hooks';
import config from '../config';

type State = {
  isLoading: boolean;
  value: {
    [asset: string]: BigNumber;
  };
};

export default () => {
  const [value, setValue] = useState({
    isLoading: true,
    value: { maha: BigNumber.from(0), arthx: BigNumber.from(0) },
  });

  const core = useCore();
  const { account } = useWallet();
  const blockNumber = useBlockNumber();
  const pow = BigNumber.from(10).pow(18);

  const fetchCashPrice = useCallback(async () => {
    if (!account) {
      setValue({
        isLoading: false,
        value: {
          maha: BigNumber.from(0),
          arthx: BigNumber.from(0),
        },
      });
      return;
    }
    const { PoolToken } = core.contracts;

    // const tokenARTHXBalance = await core.ARTHX.balanceOf(PoolToken.address);
    // const tokenMAHABalance = await core.MAHA.balanceOf(PoolToken.address);
    // const tokenRTSupply = await core.PoolToken.totalSupply();

    // const rateMaha = tokenMAHABalance.mul(pow).div(tokenRTSupply);
    // const rateARTHX = tokenARTHXBalance.mul(pow).div(tokenRTSupply);
    // const rates = { maha: rateMaha, arthx: rateARTHX };

    // setValue({
    //   isLoading: false,
    //   value: rates,
    // });
  }, [account, core.contracts]);

  useEffect(() => {
    if (core.isUnlocked) {
      fetchCashPrice().catch((err) =>
        console.error(`Failed to fetch PoolToken price: ${err.stack}`),
      );
    }

    const refreshInterval = setInterval(fetchCashPrice, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [blockNumber, setValue, core, account, fetchCashPrice]);

  return value;
};
