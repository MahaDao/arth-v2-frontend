import { useCallback, useEffect, useState } from 'react';
import useBasisCash from './useBasisCash';
import { TokenStat } from '../basis-cash/types';


const useBondStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const basisCash = useBasisCash();

  const fetchBondPrice = useCallback(async () => {
    setStat(await basisCash.getBondStat());
  }, [basisCash]);

  useEffect(() => {
    fetchBondPrice().catch((err) => console.error(`Failed to fetch ARTHB price: ${err.stack}`));
    const refreshInterval = setInterval(fetchBondPrice, 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, [setStat, basisCash, fetchBondPrice]);

  return stat;
};

export default useBondStats;
