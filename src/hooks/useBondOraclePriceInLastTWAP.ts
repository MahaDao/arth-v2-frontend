import { useCallback, useEffect, useState } from 'react';
import useBasisCash from './useBasisCash';
import { BigNumber } from 'ethers';

const useBondOraclePriceInLastTWAP = () => {
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0));
  const basisCash = useBasisCash();

  const fetchCashPrice = useCallback(async () => {
    setPrice(await basisCash.getBondOraclePriceInLastTWAP());
  }, [basisCash]);

  useEffect(() => {
    fetchCashPrice().catch((err) => console.error(`Failed to fetch ARTH 1hr TWAP price: ${err.stack}`));
    const refreshInterval = setInterval(fetchCashPrice, 60 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, [setPrice, basisCash, fetchCashPrice]);

  return price;
};

export default useBondOraclePriceInLastTWAP;
