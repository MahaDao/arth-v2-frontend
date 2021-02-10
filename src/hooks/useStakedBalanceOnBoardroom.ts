import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useBasisCash from './useBasisCash';
import config from '../config';
import { Boardrooms } from '../basis-cash/config';

const useStakedBalanceOnBoardroom = (kind: Boardrooms, version: string) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const basisCash = useBasisCash();

  const fetchBalance = useCallback(async () => {
    console.log('fuck', await basisCash.getStakedSharesOnBoardroom(kind, version))
    setBalance(await basisCash.getStakedSharesOnBoardroom(kind, version));
  }, [basisCash, kind, version]);

  useEffect(() => {
    if (basisCash.isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [setBalance, basisCash.isUnlocked, fetchBalance]);

  return balance;
};

export default useStakedBalanceOnBoardroom;
