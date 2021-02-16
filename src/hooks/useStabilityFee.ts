import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import basisCash from '../basis-cash';
import { AppState } from '../state';

const useStabilityFee = () => {
  const [price, setPrice] = useState<string>('1');


  const stabilityFees = useSelector<AppState, string>(
    (state) => state.treasury.stabilityFees,
  );

  const fetchCashPrice = useCallback(async () => {
    setPrice(stabilityFees);
  }, [basisCash]);

  useEffect(() => {
    fetchCashPrice().catch((err) =>
      console.error(`Failed to fetch stability fees: ${err.stack}`),
    );
  }, [fetchCashPrice]);

  return price;
};

export default useStabilityFee;
