import React from 'react';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';

import Button from '../../Button/Button';
import AccountModal from './AccountModal';

import walletIcon from '../../../assets/svg/wallet-24.svg';

import config from '../../../config';
import { truncateMiddle } from '../../../utils/formatBalance';

interface AccountButtonProps {
  showWarning: boolean;
}

const AccountButton: React.FC<AccountButtonProps> = ({
  showWarning = false
}: AccountButtonProps) => {
  const [showModal, toggleModal] = React.useState(false);
  const { account, connect } = useWallet();

  const switchMetamaskChain = () => {
    // @ts-ignore
    if (window.ethereum) {
      // @ts-ignore
      window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + Number(config.chainId).toString(16) }],
      })
        .then(() => {
          window.location.reload();
        })
        .catch((error: any) => {
          if (error.code === 4902) addNetworkToMetamask();
        });
    }
  }

  const addNetworkToMetamask = () => {
    // @ts-ignore
    if (window.ethereum) {
      // @ts-ignore
      window.ethereum
        // @ts-ignore
        .request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x' + Number(config.chainId).toString(16),
              chainName: config.networkName,
              rpcUrls: [config.defaultRPCURL],
              iconUrls: [config.defaultIconURL || ''],
              blockExplorerUrls: [config.etherscanUrl],
              nativeCurrency: {
                name: config.blockchainTokenName,
                symbol: config.blockchainToken,
                decimals: config.blockchainTokenDecimals
              },
            },
          ],
        })
        .then(() => {
          window.location.reload();
        })
        .catch((error: any) => {
          if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error.
            console.log('We cannot encrypt anything without the key.');
          }
        });
    }
  }


  return (
    <>
      {
        showModal && <AccountModal onClose={() => toggleModal(!showModal)} />
      }
      <StyledAccountButton>
        {
          showWarning ? (
            <Button
              variant="transparent"
              onClick={switchMetamaskChain}
              size="sm"
              text="Switch network"
            />
          ) : (
            !account ? (
              <Button
                variant="transparent"
                onClick={() => {
                  connect('injected').then(() => {
                    localStorage.removeItem('disconnectWallet')
                  })
                }}
                size="sm"
                text="Connect"
                tracking_id={'connect_wallet'}
              />
            ) : (
              <Button
                onClick={() => toggleModal(true)}
                size="sm"
                variant={'transparent'}
                text={truncateMiddle(account, 12, '...')}
              >
                <img alt="wallet" src={walletIcon} className="margin-right-10" onClick={() => toggleModal(true)} />
              </Button>
            )
          )
        }
      </StyledAccountButton>
    </>
  );
};

const StyledAccountButton = styled.div``;

export default AccountButton;
