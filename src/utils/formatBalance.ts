import { BigNumber } from 'ethers';

import ERC20 from '../basis-cash/ERC20';

export const getDisplayBalance = (balance: BigNumber, decimals = 18, fractionDigits = 3) => {
  const number = getBalance(balance, decimals - fractionDigits);
  return (number / 10 ** fractionDigits).toFixed(fractionDigits);
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

export function getBalance(balance: BigNumber, decimals = 18): number {
  return balance?.div(BigNumber.from(10).pow(decimals)).toNumber();
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
