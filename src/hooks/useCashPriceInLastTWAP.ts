import { useCallback, useEffect, useState } from 'react';
import useBasisCash from './useBasisCash';
import config from '../config';
import { BigNumber } from 'ethers';
import { useSelector } from 'react-redux';
import { AppState } from '../state';

const useCashPriceInLastTWAP = () => {
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0));
  const basisCash = useBasisCash();

  const cashPriceInLastTWAP = useSelector<AppState, string>(
    (state) => state.treasury.cashPriceInLastTWAP,
  );

  const fetchCashPrice = useCallback(async () => {
    setPrice(BigNumber.from(cashPriceInLastTWAP));
  }, [basisCash]);

  useEffect(() => {
    fetchCashPrice().catch((err) => console.error(`Failed to fetch ARTH price: ${err.stack}`));
    const refreshInterval = setInterval(fetchCashPrice, 60 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, [setPrice, basisCash, fetchCashPrice]);

  return price;
};

export default useCashPriceInLastTWAP;
