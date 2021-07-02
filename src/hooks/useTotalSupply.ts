import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import useCore from './useCore';
import { useBlockNumber } from '../state/application/hooks';

type State = {
  isLoading: boolean;
  value: BigNumber;
}

export default (tokenSymbol: string) => {
  const [totalSupply, setTotalSupply] = useState<State>({ isLoading: true, value: BigNumber.from(0) });

  const core = useCore();
  const blockNumber = useBlockNumber();

  const fetchValue = useCallback(async () => {
    setTotalSupply({ isLoading: false, value: await core.tokens[tokenSymbol].totalSupply() });
  }, [core.tokens, tokenSymbol]);

  useEffect(() => {
    fetchValue().catch((err) => console.error(`Failed to fetch ${tokenSymbol} supply: ${err.stack}`));
  }, [blockNumber, totalSupply, core, tokenSymbol, fetchValue]);

  return totalSupply;
};
