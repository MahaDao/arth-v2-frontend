import { BigNumber } from '@ethersproject/bignumber';
import { useCallback, useEffect, useState } from 'react';
import useCore from '../../useCore';

export default (collateralPoolToken: string) => {
  const [value, setValue] = useState(BigNumber.from(0));
  const core = useCore();

  const fetchValue = useCallback(async () => {
    const pool = core.getCollatearalPool(collateralPoolToken);
    setValue(await pool.redemptionFee());
  }, [collateralPoolToken, core]);

  useEffect(() => {
    fetchValue().catch((err) =>
      console.error(`Failed to fetch collateral pool minting fee: ${err.stack}`),
    );
  }, [fetchValue]);

  return value;
};