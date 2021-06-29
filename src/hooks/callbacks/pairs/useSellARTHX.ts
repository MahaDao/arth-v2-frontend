import { BigNumber } from 'ethers';
import { useCallback } from 'react';

import useCore from '../../useCore';
import useApplySlippage from '../../useApplySlippage';
import { useAddPopup } from '../../../state/application/hooks';
import formatErrorMessage from '../../../utils/formatErrorMessage';
import { useTransactionAdder } from '../../../state/transactions/hooks';

export default function (
  buyToken: string,
  sellToken: string,
  amountIn: BigNumber,
  amountOutMin: BigNumber,
  to: string
) {
  const core = useCore();
  const addPopup = useAddPopup();
  const addTransaction = useTransactionAdder();

  const amountOutAfterSlippage = useApplySlippage(amountOutMin);

  const action = useCallback(async (callback?: () => void): Promise<void> => {
    try {
      const response = await core.contracts.UniswapV2Router02.swapExactTokensForTokens(
        amountIn,
        amountOutAfterSlippage,
        [sellToken, buyToken],
        to,
        Math.ceil(Date.now() / 1000) + 5 * 60 * 1000,
      );

      addTransaction(response, {
        summary: `Buy ARTHX`
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
    buyToken,
    sellToken,
    amountIn,
    amountOutAfterSlippage,
    to,
  ]);

  return action;
}
