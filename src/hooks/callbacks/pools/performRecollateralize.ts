import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { useTransactionAdder } from '../../../state/transactions/hooks';
import useCore from '../../useCore';
import { getDisplayBalance } from '../../../utils/formatBalance';



export default function (collateralToken: string, collateralAmount: BigNumber, arthxOutMin: BigNumber) {
  const addTransaction = useTransactionAdder();
  const core = useCore();

  const action = useCallback(async (callback?: () => void): Promise<void> => {
    const pool = core.getCollatearalPool(collateralToken)

    const response = await pool.recollateralizeARTH(collateralAmount, arthxOutMin)
    addTransaction(response, {
      summary: `Recollateralize ${getDisplayBalance(collateralAmount)} ${collateralToken}`
    });

    if (callback) callback()
  }, [core, collateralToken, collateralAmount, arthxOutMin, addTransaction]);

  // TODO: do something about the apprve

  return action;
}