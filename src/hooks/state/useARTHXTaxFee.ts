import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import useCore from '../useCore';
import { useBlockNumber } from '../../state/application/hooks';

type State = {
  isLoading: boolean;
  value: BigNumber;
}

export default () => {
  const [price, setPrice] = useState<State>({ isLoading: true, value: BigNumber.from(1).pow(18) });

  const core = useCore();
  const blockNumber = useBlockNumber();

  const fetchValue = useCallback(async () => {
    setPrice({ isLoading: false, value: await core.contracts['ARTHShares'].taxPercent() });
  }, [core]);

  useEffect(() => {
    fetchValue().catch((err) => console.error(`Failed to fetch tax fee: ${err.stack}`));
  }, [blockNumber, setPrice, core, fetchValue]);

  return price;
};
