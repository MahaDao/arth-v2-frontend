import { useCallback, useEffect, useState } from 'react';
import useBasisCash from './useBasisCash';
import { BigNumber } from 'ethers';

const useCashTargetPrice = () => {
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0));
  const basisCash = useBasisCash();

  const fetchCashPrice = useCallback(async () => {
    // console.log(await basisCash.getTargetPrice())
    setPrice(await basisCash.getTargetPrice());
  }, [basisCash]);

  useEffect(() => {
    fetchCashPrice().catch((err) => console.error(`Failed to fetch ARTHB price: ${err.stack}`));
  }, [setPrice, basisCash, fetchCashPrice]);

  return price;
};

export default useCashTargetPrice;