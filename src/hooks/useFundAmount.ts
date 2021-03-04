import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useBasisCash from './useBasisCash';

const useFundAmount = (kind: 'development' | 'ecosystem' | 'bonds' | 'rainyday') => {
  const [amount, setAmount] = useState(BigNumber.from(0));
  const basisCash = useBasisCash();


  useEffect(() => {
    const { Treasury, DevelopmentFund, } = basisCash.contracts;
    if (kind === 'bonds') basisCash.ARTH.balanceOf(Treasury.address).then(setAmount);
    else if (kind === 'ecosystem') basisCash.ARTH.balanceOf(DevelopmentFund.address).then(setAmount);
    else if (kind === 'development') basisCash.ARTH.balanceOf(DevelopmentFund.address).then(setAmount);
    else if (kind === 'rainyday') Treasury.rainyDayFund().then(setAmount)
  }, [kind, basisCash.ARTH, basisCash.contracts]);
  return amount;
};

export default useFundAmount;
