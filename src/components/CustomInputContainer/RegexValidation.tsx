export const NumberInputRegex = /^\d+(\.\d*)?$/;
export const mediatoryRegex = /^[0]+\d+(\.\d+)?$/;
export const RestrictDecimalsDigitsInputRegex = /^[0-9]{0,18}(\.[0-9]{0,6})?$/;
export const RestrictDecimalsDigitsInputRegexSlippage = /^[0-9]{0,3}(\.[0-9]{0,3})?$/;

export const ValidateNumber = (val: string) => {
  return NumberInputRegex.test(val)
}

export const checkForAfterDecimalDigits = (val: string, decimals = 6) => {
  let regex: RegExp = /^[0-9]{0,14}(\.[0-9]{0,6})?$/;

  if (decimals === 8) regex = /^[0-9]{0,14}(\.[0-9]{0,8})?$/;
  else if (decimals === 9) regex = /^[0-9]{0,14}(\.[0-9]{0,9})?$/;
  else if (decimals === 18) regex = /^[0-9]{0,14}(\.[0-9]{0,18})?$/;

  return regex.test(val)
}

export const checkForAfterDecimalDigitsSlippage = (val: string) => {
  return RestrictDecimalsDigitsInputRegexSlippage.test(val)
}

export const initZeroCheck = (val: string) => {
  return mediatoryRegex.test(val)
}

export const removeLeadZeros = (val: string) => {
  while (val.charAt(0) === '0') val = val.slice(1);
  return val
}

export const correctString = (val: string) => {
  if (initZeroCheck(val)) return removeLeadZeros(val)
  return val
}
