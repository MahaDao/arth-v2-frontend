import { useWallet } from 'use-wallet';
import { BigNumber } from '@ethersproject/bignumber';
import { useCallback, useEffect, useState } from 'react';

import useCore from '../../useCore';
import { useBlockNumber } from '../../../state/application/hooks';

type State = {
  isLoading: boolean;
  value: BigNumber;
};

export default () => {
  const [value, setValue] = useState<State>({ isLoading: true, value: BigNumber.from(0) });

  const core = useCore();
  const { account } = useWallet();
  const blockNumber = useBlockNumber();

  const fetchValue = useCallback(async () => {
    if (!account) {
      setValue({ isLoading: false, value: BigNumber.from(0) });
      return;
    }

    // TODO: remove the `|| {....}`
    const contract = core.contracts.FeeRouter || { totalSwapped: () => BigNumber.from(0) };
    setValue({ isLoading: false, value: await contract.totalSwapped() });
  }, [core.contracts, account]);

  useEffect(() => {
    if (core.isUnlocked) {
      fetchValue().catch((err) => console.error(`Failed to fetch total fee: ${err}`));
    }
  }, [core.isUnlocked, blockNumber, account, fetchValue]);

  return value;
};
