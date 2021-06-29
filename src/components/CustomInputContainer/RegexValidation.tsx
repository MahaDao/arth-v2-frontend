export const NumberInputRegex = /^\d+(\.\d*)?$/;
export const mediatoryRegex = /^[0]+\d+(\.\d+)?$/;
export const RestrictDecimalsDigitsInputRegex = /^[0-9]{0,18}(\.[0-9]{0,6})?$/;
export const RestrictDecimalsDigitsInputRegexSlippage = /^[0-9]{0,3}(\.[0-9]{0,3})?$/;

export const ValidateNumber = (val: string) => {
  return NumberInputRegex.test(val)
}

export const checkForAfterDecimalDigits = (val: string, decimals = 6) => {
  const RestrictDecimalsDigitsInputRegex = new RegExp('^[0-9]{0,18}(\.[0-9]{0,'+ decimals +'})?$');
  console.log('/^[0-9]{0,18}(\.[0-9]{0,${decimals})?$/', /^[0-9]{0,18}(\.[0-9]{0,${decimals})?$/)
  return RestrictDecimalsDigitsInputRegex.test(val)
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
