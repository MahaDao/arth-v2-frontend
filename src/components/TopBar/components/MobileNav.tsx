import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import Button from '../../Button';
import { WalletInternal } from '../../WalletInternal';

import config from '../../../config';

interface props {
  isMainnet: boolean;
  showWarning: boolean;
  onClick: () => void;
}

const MobileNav = (props: props) => {
  const { account, connect } = useWallet();

  const [walletInfo, setWalletInfo] = useState<boolean>(false);
  const [disconnect, setDisconnect] = useState<boolean>(false);

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
    <StyledNav>
      {
        !walletInfo ? (
          <div style={{ width: '100%', background: '#1e1d1d', marginTop: -2 }}>
            <StyledLink
              exact
              activeClassName="active"
              to="/genesis"
              onClick={() => props.onClick()}
            >
              Genesis
            </StyledLink>
            {/*<StyledLink
              exact
              activeClassName="active"
              to="/stats"
              onClick={() => props.onClick()}
            >
              Analytics
            </StyledLink>*/}
            {/*<StyledLink
              exact
              activeClassName="active"
              to="/mint/mint"
              onClick={() => props.onClick()}
            >
              Mint/Redeem
            </StyledLink>*/}
            {/* <StyledLink
              exact
              activeClassName="active"
              to="/stabilize/recollateralize"
              onClick={() => props.onClick()}
            >
              Stabilize
            </StyledLink> */}
            <StyledLink
              exact
              activeClassName="active"
              to="/farming"
              onClick={() => props.onClick()}
            >
              Farming
            </StyledLink>
            {/*{
              !props.isMainnet && (
                <StyledLink exact activeClassName="active" to="/faucet" onClick={() => props.onClick()}>
                  Faucet
                </StyledLink>
              )
            }*/}
            <StyledLink exact activeClassName="active" to="/rebase" onClick={() => props.onClick()}>
              Rebase
            </StyledLink>
            <StyledLink exact activeClassName="active" to="/lottery" onClick={() => props.onClick()}>
              Prizes
            </StyledLink>
            {/*<StyledLink exact activeClassName="active" to="/farming">
              Pools
            </StyledLink>*/}
          </div>
        ) : (
          <WalletInternal disconnect={disconnect} walletInfo={walletInfo} setWalletInfo={(val: boolean) => setWalletInfo(val)} />
        )
      }
      <StyledButton>
        <div style={{ maxWidth: '340px', width: '100%', margin: '10px 10px 0px 10px' }}>
          {
            props.showWarning ? (
              <Button
                text={'Switch Network'}
                onClick={switchMetamaskChain}
              />
            ) : (
              !walletInfo && <Button
                variant={'transparent'}
                text={!account ? 'Connect' : 'Wallet Info'}
                onClick={async () => {
                  if (!account) {
                    await connect('injected')
                      .then(() => {
                        setWalletInfo(!walletInfo);
                        localStorage.removeItem('disconnectWallet')
                      })
                  } else {
                    setWalletInfo(!walletInfo);
                  }
                }}
                tracking_id={!account ? 'connect_wallet' : ''}
              />
            )
          }
        </div>
      </StyledButton>
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  z-index: 100;
  flex-direction: column;
  position: fixed;
  top: 73px;
  width: 100%;
  left: 0px;
  background: #1e1d1d;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  height: calc(100vh - 72px);
  overflow-y: scroll;
`;

const StyledLink = styled(NavLink)`
  color: ${(props) => props.theme.color.grey[400]};
  height: 80px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.64);
  font-weight: 600;
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  &:hover {
    color: rgba(255, 255, 255, 0.64);
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(70px);
  }
  &.active {
    color: rgba(255, 255, 255, 0.88);
  }
  background: #1e1d1d;
`;

const StyledButton = styled.div`
  height: 80px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.64);
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: #1e1d1d;
  padding: 0 16px 0 16px;
  padding-bottom: ${(props) => props.theme.spacing[3]}px;
  &:hover {
    color: rgba(255, 255, 255, 0.64);
  }
  &.active {
  }
`;

export default MobileNav;
