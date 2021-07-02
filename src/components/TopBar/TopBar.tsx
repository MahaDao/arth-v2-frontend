import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import { useLocation } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import detectEthereumProvider from '@metamask/detect-provider';
import React, { useEffect, useState, useCallback, useMemo } from 'react';

import Logo from '../Logo';
import InfoIcon from '../../assets/img/InfoIcon.svg';
import CloseIcon from '../../assets/img/CloseIcon.svg';

import Button from '../Button';
import Nav from './components/Nav';
import TxButton from './components/TxButton';
import MobileNav from './components/MobileNav';
import AccountButton from './components/AccountButton';

import config from '../../config';
import useCore from '../../hooks/useCore';
import { Mixpanel } from '../../analytics/Mixpanel';

const TopBar: React.FC = () => {
  const core = useCore();
  const { account } = useWallet();

  const [showMobileMenu, toggleMobileMenu] = useState(false);
  const [showWarning, setShowWarning] = React.useState(false);

  const isMainnet = useMemo(() => {
    return core.config.chainId in [137, 1, 'bsc']
  }, [core]);

  const processNetwork = useCallback(async () => {
    const provider: any = await detectEthereumProvider();

    if (provider) {
      const chainId = Number(await provider.request({ method: 'eth_chainId' }));
      setShowWarning(chainId !== config.chainId);
    }
  }, []);

  // ScreenView Analytics.
  const location = useLocation();
  React.useEffect(() => {
    Mixpanel.track(`ScreenView:${location.pathname}`);
  }, [location]);

  useEffect(() => {
    if (account) {
      Mixpanel.identify(account);
      Mixpanel.people.set({ walletId: account });
    }

    processNetwork();
  }, [account, processNetwork]);

  return (
    <TopBarContainer>
      <StyledTopBar>
        <StyledTopBarInner>
          <div className="dialog-class">
            <Logo />
            <HideonPhone>
              <Nav isMainnet={isMainnet} />
            </HideonPhone>
          </div>
          <HideonPhone>
            <div
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
                alignItems: 'center',
              }}
            >
              <TxButton />
              <div style={{ marginRight: '12px' }}>
                <Button
                  text={'Get MAHA'}
                  size={'sm'}
                  onClick={() =>
                    window.open(
                      'https://app.uniswap.org/#/swap?outputCurrency=0xb4d930279552397bba2ee473229f89ec245bc365',
                    )
                  }
                  tracking_id={'get_MAHA'}
                />
              </div>
              <AccountButton showWarning={showWarning} />
            </div>
          </HideonPhone>
          <HideOnBigScreen>
            <div className="dialog-class">
              {
                !!account && (
                  <div style={{ maxWidth: '340px', width: '100%', margin: '0px 15px' }}>
                    <TxButton />
                  </div>
                )
              }
              <div style={{ marginRight: '12px' }}>
                <Button
                  text={'Get MAHA'}
                  size={'sm'}
                  onClick={() =>
                    window.open(
                      'https://app.uniswap.org/#/swap?outputCurrency=0xb4d930279552397bba2ee473229f89ec245bc365',
                    )
                  }
                  tracking_id={'get_MAHA'}
                />
              </div>
              {
                !showMobileMenu ? (
                  <MenuIcon
                    style={{ color: 'white' }}
                    className="pointer"
                    onClick={() => toggleMobileMenu(true)}
                  />
                ) : (
                  <img
                    src={CloseIcon}
                    width="24px"
                    alt=""
                    className="pointer"
                    onClick={() => toggleMobileMenu(false)}
                  />
                )
              }
            </div>
          </HideOnBigScreen>
          {
            showMobileMenu && (
              <MobileNav showWarning={showWarning} isMainnet={isMainnet} onClick={() => toggleMobileMenu(false)} />
            )
          }
        </StyledTopBarInner>
      </StyledTopBar>
      {
        showWarning && (
          <ShowWarning>
            <ShowWarningInner>
              <img src={InfoIcon} alt="" width="24px" className="margin-right-5" />
              Please make sure that you are connected to {core.config.networkName}.
            </ShowWarningInner>
          </ShowWarning>
        )
      }
    </TopBarContainer>
  );
};

const TopBarContainer = styled.div`
  position: fixed;
  z-index: 100;
  display: flex;
  flex-direction: column;
  width: 100%;
  top: 0;
`;

const HideonPhone = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 1400px) {
    display: none;
  } ;
`;

const HideOnBigScreen = styled.div`
  display: none;
  @media (max-width: 1400px) {
    display: block;
  } ;
`;

const StyledTopBar = styled.div`
  ox-sizing: border-box;
  margin: 0 auto;
  width: 100%;
  background: rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
`;

const ShowWarningInner = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: rgba(255, 255, 255, 0.88);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
`;

const ShowWarning = styled.div`
  background: #ba1e38;
  box-sizing: border-box;
  padding: 10px 0px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  left: 28%;
  right: 28%;
  top: 90px;
  @media (max-width: 768px) {
    width: 95%;
    left: 2.5%;
    right: 2.5%;
  } ;
`;

const WarningSpan = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  color: #ffffff;
  opacity: 0.88;
`;

const StyledTopBarInner = styled.div`
  align-items: center;
  display: flex;
  height: ${(props) => props.theme.topBarSize}px;
  justify-content: space-between;
  width: 100%;
  padding: 0 24px;
  flex-wrap: wrap;
  @media (max-width: 600px) {
    padding: 0 16px;
  }
`;

const ColorIcon = styled.div`
  background: ${(colorProps: { colorCode: string }) => colorProps.colorCode};
  width: 10px;
  border-radius: 50%;
  height: 10px;
  margin-right: 5px;
`;

export default TopBar;
