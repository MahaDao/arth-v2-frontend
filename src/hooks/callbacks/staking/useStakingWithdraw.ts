import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { parseUnits } from 'ethers/lib/utils';

import useCore from '../../useCore';
import useTokenDecimals from '../../useTokenDecimals';
import { useAddPopup } from '../../../state/application/hooks';
import formatErrorMessage from '../../../utils/formatErrorMessage';
import { useTransactionAdder } from '../../../state/transactions/hooks';

export default function (
  stakingContract: string,
  amount: number,
  depositToken: string,
  symbol: string
) {
  const core = useCore();
  const addPopup = useAddPopup();
  const addTransaction = useTransactionAdder();
  const tokenDecimals = useTokenDecimals(depositToken);

  const action = useCallback(async (callback: () => void): Promise<void> => {
    const contract = core.contracts[stakingContract];

    try {
      const response = await contract.withdraw(
        BigNumber.from(parseUnits(`${amount}`, tokenDecimals))
      );

      addTransaction(response, {
        summary: `Withdraw ${amount.toLocaleString()} ${symbol}`
      });

      if (callback) callback();
    } catch (e) {
      addPopup({
        error: {
          message: formatErrorMessage(e?.data?.message || e?.message),
          stack: e.stack
        }
      });
    }
  }, [
    core.contracts,
    tokenDecimals,
    stakingContract,
    amount,
    addPopup,
    addTransaction,
    symbol
  ]);

  return action;
}
