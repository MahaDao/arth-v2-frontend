import { useCallback, useEffect, useState } from 'react';
import useBasisCash from './useBasisCash';
import { BigNumber } from 'ethers';
import { useSelector } from 'react-redux';
import { AppState } from '../state';

const useCashTargetPrice = () => {
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(1).pow(18));
  const basisCash = useBasisCash();

  const oraclePrice = useSelector<AppState, string>((state) => state.oracle.GMUOraclePrice);

  const fetchOraclePrice = useCallback(async () => {
    setPrice(BigNumber.from(oraclePrice));
  }, [basisCash]);

  useEffect(() => {
    fetchOraclePrice().catch((err) =>
      console.error(`Failed to fetch ARTHB price: ${err.stack}`),
    );
  }, [setPrice, basisCash, fetchOraclePrice]);

  return price;
};

export default useCashTargetPrice;
