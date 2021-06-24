import { BigNumber } from 'ethers';
import { useWallet } from 'use-wallet';
import { useCallback, useEffect, useState } from 'react';

import useCore from '../useCore';
import ERC20 from '../../basis-cash/ERC20';
import config from '../../config';

const useAllowance = (token: ERC20, spender: string, pendingApproval?: boolean) => {
  const [allowance, setAllowance] = useState<BigNumber>(BigNumber.from(0));
  const { account } = useWallet();
  const core = useCore();

  const fetchAllowance = useCallback(async () => {
    if (!account) return;
    const allowance = await token.allowance(account, spender);
    setAllowance(allowance);
  }, [account, spender, token]);

  useEffect(() => {
    if (core.isUnlocked) {
      fetchAllowance().catch((err) =>
        console.log(
          `Failed to fetch allowance for ${token.address} ${account} ${spender}: ${err.stack}`,
        ),
      );

      let refreshInterval = setInterval(fetchAllowance, config.refreshInterval);
      return () => clearInterval(refreshInterval);
    }
  }, [account, core.isUnlocked, fetchAllowance, spender, token]);

  useEffect(() => {
    if (account && spender && token) {
      fetchAllowance().catch((err) => console.log(`Failed to fetch allowance: ${err.stack}`));
    }
  }, [account, spender, token, pendingApproval, fetchAllowance]);

  return allowance;
};

export default useAllowance;
