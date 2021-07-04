import { useEffect } from 'react';
import { useWallet } from 'use-wallet';

export const WalletAutoConnect = async () => {
  const { account, connect } = useWallet();
  const shouldBeDisconnected = localStorage.getItem('disconnectWallet');

  useEffect(() => {
    if (!shouldBeDisconnected && !!!account) connect('injected');
  });

  return true;
};
