import { BigNumber } from 'ethers';
import { useCallback } from 'react';

import useCore from '../../useCore';
import useApplySlippage from '../../useApplySlippage';
import { useAddPopup } from '../../../state/application/hooks';
import formatErrorMessage from '../../../utils/formatErrorMessage';
import { useTransactionAdder } from '../../../state/transactions/hooks';

export default function (
  tokenA: string,
  tokenB: string,
  amountADesired: BigNumber,
  amountBDesired: BigNumber,
  to: string
) {
  const core = useCore();
  const addPopup = useAddPopup();
  const addTransaction = useTransactionAdder();

  const amountAMinAfterSlippage = useApplySlippage(amountADesired);
  const amountBMinAfterSlippage = useApplySlippage(amountBDesired);

  const action = useCallback(async (callback?: () => void): Promise<void> => {
    try {
      const response = await core.contracts.ArthPoolRouter.addLiquidity(
        tokenA,
        tokenB,
        amountADesired,
        amountBDesired,
        amountAMinAfterSlippage,
        amountBMinAfterSlippage,
        to,
        Math.ceil(Date.now() / 1000) + 5 * 60,
      );

      addTransaction(response, {
        summary: `Add Liquidity`
      });

      if (callback) callback();
    } catch (e) {
      addPopup({
        error: {
          message: formatErrorMessage(e?.data?.message || e?.message),
          stack: e?.stack
        }
      });
    }
  }, [
    core,
    addPopup,
    addTransaction,
    tokenA,
    tokenB,
    amountADesired,
    amountBDesired,
    amountAMinAfterSlippage,
    amountBMinAfterSlippage,
    to
  ]);

  return action;
}
