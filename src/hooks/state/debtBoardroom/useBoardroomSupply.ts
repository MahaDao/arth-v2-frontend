import { useWallet } from 'use-wallet';
import { BigNumber } from '@ethersproject/bignumber';
import { useCallback, useEffect, useState } from 'react';

import useCore from '../../useCore';
import { useBlockNumber } from '../../../state/application/hooks';

type State = {
  isLoading: boolean;
  value: BigNumber;
};

export default (symbol: string) => {
  const stakingContract = symbol === 'ARTH' ? 'ARTHDebtBoardroom' : 'ARTHXDebtBoardroom';
  const [value, setValue] = useState<State>({ isLoading: true, value: BigNumber.from(0) });

  const core = useCore();
  const { account } = useWallet();
  const blockNumber = useBlockNumber();

  const fetchValue = useCallback(async () => {
    const contract = core.contracts[stakingContract];
    setValue({ isLoading: false, value: await contract.totalSupply() });
  }, [core.contracts, stakingContract]);

  useEffect(() => {
    fetchValue().catch((err) => console.error(`Failed to fetch staking balance: ${err}`));
  }, [blockNumber, account, fetchValue]);

  return value;
};
