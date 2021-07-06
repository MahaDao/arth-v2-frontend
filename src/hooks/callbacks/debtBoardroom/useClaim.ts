import { useCallback } from 'react';

import useCore from '../../useCore';
import { useAddPopup } from '../../../state/application/hooks';
import formatErrorMessage from '../../../utils/formatErrorMessage';
import { useTransactionAdder } from '../../../state/transactions/hooks';

export default function (symbol: string) {
  const core = useCore();
  const addPopup = useAddPopup();
  const addTransaction = useTransactionAdder();

  const action = useCallback(
    async (callback?: () => void): Promise<void> => {
      try {
        const contract =
          symbol === 'ARTH'
            ? core.contracts.ARTHDebtBoardroom
            : core.contracts.ARTHXDebtBoardroom; // [symbol];
        const response = await contract.claimReward();

        addTransaction(response, {
          summary: `Claim Debt`,
        });

        if (callback) callback();
      } catch (e) {
        console.log(e);
        addPopup({
          error: {
            message: formatErrorMessage(e?.data?.message || e?.message),
            stack: e?.stack,
          },
        });
      }
    },
    [
      symbol,
      core.contracts.ARTHDebtBoardroom,
      core.contracts.ARTHXDebtBoardroom,
      addTransaction,
      addPopup,
    ],
  );

  return action;
}
