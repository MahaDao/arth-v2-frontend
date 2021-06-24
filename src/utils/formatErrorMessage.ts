export default (message: string): string => {
  message = message.toLowerCase();

  if (message.includes('ceiling')) return 'Collateral limit reached';
  if (message.includes('slippage')) return 'Slippage limit reached';
  if (message.includes('user denied transaction')) return 'Transaction cancelled';
  if (message.includes('paused')) return 'This action is paused';
  if (message.includes('balance < required')) return 'Balance < Required';
  if (message.includes('overflow')) return 'Error';
  if (message.includes('is inactive')) return 'This action has been deactivated';

  // Fail safes like overflows etc.;
  return 'Error';

  // For testing to know errors.
  // return message[0].toUpperCase() + message.slice(1).toLowerCase();
};
