import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useBasisCash from './useBasisCash';
import config from '../config';
import { Boardrooms, BoardroomVersion } from '../basis-cash/config';

const useEarningsOnBoardroomV2 = (kind: Boardrooms, version: BoardroomVersion) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const basisCash = useBasisCash();

  const fetchBalance = useCallback(async () => {
    setBalance(await basisCash.getEarningsOnBoardroom(kind, version));
  }, [basisCash, kind, version]);

  useEffect(() => {
    if (basisCash.isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));
      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [basisCash.isUnlocked, fetchBalance]);

  return balance;
};

export default useEarningsOnBoardroomV2;
