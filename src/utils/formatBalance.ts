import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

import ERC20 from '../basis-cash/ERC20';

export const getDisplayBalance = (balance: BigNumber, decimals = 18, fractionDigits = 3) => {
  const formattedBalance: string = getBalance(balance, decimals);
  return formattedBalance
};

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => {
  return getDisplayBalance(balance, decimals);
};

export const getDisplayBalanceToken = (
  balance: BigNumber,
  token: ERC20,
  fractionDigits = 3,
) => {
  return getDisplayBalance(balance, token.decimal, fractionDigits);
};

export function getBalance(balance: BigNumber, decimals = 18): string {
  return formatUnits(balance, decimals);
}

export const truncateMiddle = function (
  fullStr: string = '12345678922500025',
  strLen: number,
  separator?: string,
) {
  if (fullStr.length <= strLen) return fullStr;

  separator = separator || '...';

  var sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 3),
    backChars = Math.floor(charsToShow / 3);

  return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
};
