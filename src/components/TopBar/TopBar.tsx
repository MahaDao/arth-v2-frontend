import React, { useEffect, useState } from 'react';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import styled from 'styled-components';
import MenuIcon from '@material-ui/icons/Menu';
import InputBase from '@material-ui/core/InputBase';
import detectEthereumProvider from '@metamask/detect-provider';

import Logo from '../Logo';
import { useWallet } from 'use-wallet';
import AccountButton from './components/AccountButton';
import Nav from './components/Nav';
import MobileNav from './components/MobileNav';
import TxButton from './components/TxButton';
import CloseIcon from '../../assets/img/CloseIcon.svg';
import InfoIcon from '../../assets/img/InfoIcon.svg';
import ExpandMore from '../../assets/img/ExpandMore.svg';
import useCore from '../../hooks/useCore';
import Button from '../Button';
import { useLocation } from 'react-router-dom';
import { Mixpanel } from '../../analytics/Mixpanel';
import { useCallback } from 'react';
import config from '../../config';

const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      borderRadius: 8,
      color: 'white',
      border: '1px solid white',
      fontSize: 14,
      padding: '0px 15px',
      marginRight: '20px',
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      position: 'relative',
      backgroundColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:focus': {
        borderRadius: 8,
      },
    },
  }),
)(InputBase);

const TopBar: React.FC = () => {
  const { account, chainId } = useWallet();
  const core = useCore();

  const [showWarning, setShowWarning] = React.useState(false);

  const [netWrokType, setNetworkType] = React.useState('mainnet');
  const [showMobileMenu, toggleMobileMenu] = useState(false);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setNetworkType(event.target.value as string);
  };

  const isMainnet = core.config.chainId in [137, 1, 'bsc'];

  const processNetwork = useCallback(async () => {
    const provider: any = await detectEthereumProvider();

    if (provider) {
      const chainId = Number(await provider.request({ method: 'eth_chainId' }));
      setShowWarning(chainId !== config.chainId);
    }
  }, []);

  // ScreenView Analytics
  let location = useLocation();
  React.useEffect(() => {
    Mixpanel.track(`ScreenView:${location.pathname}`);
    // ga.send(["pageview", location.pathname]);
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
        {/*<Container size="lg">*/}
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
              <TxButton />
              <AccountButton />
            </div>
          </HideonPhone>

          <HideOnBigScreen>
            <div className="dialog-class">
              {!!account && (
                <div style={{ maxWidth: '340px', width: '100%', margin: '0px 15px' }}>
                  <TxButton />
                </div>
              )}
              {/*{network.name !== '' && (
                  <CustomNetwork>
                    <ColorIcon colorCode={network.color} />
                    <span>{network.name}</span>
                  </CustomNetwork>
                )}*/}
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
              {!showMobileMenu ? (
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
              )}
            </div>
          </HideOnBigScreen>
          {showMobileMenu && (
            <MobileNav isMainnet={isMainnet} onClick={() => toggleMobileMenu(false)} />
          )}
        </StyledTopBarInner>
        {/*</Container>*/}
      </StyledTopBar>
      {showWarning && (
        <ShowWarning>
          <ShowWarningInner>
            <img src={InfoIcon} alt="" width="24px" className="margin-right-5" />
            Please make sure that you are connected to {core.config.networkName}.
          </ShowWarningInner>
        </ShowWarning>
      )}
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

const CustomNetwork = styled.div`
  display: flex;
  color: #fff;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.88);
  border-radius: 6px;
  align-items: center;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  height: 38px;
  justify-content: center;
  outline: none !important;
  padding: 10px 22px;
  width: 100%;
  margin-right: 12px;
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
  // position: fixed;
  // z-index: 100;
  // display: flex;
  // width: 100%;
  // top: 0;
  //background: #151414;
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
  // margin: 0px 20px;
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
  // border: 1px solid #ff9eae;
  box-sizing: border-box;
  // border-radius: 6px;
  padding: 10px 0px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  // max-width: 600px;
  z-index: 50;
  // position: absolute;
  left: 28%;
  right: 28%;
  top: 90px;
  @media (max-width: 768px) {
    // max-width: 200px;
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
  //max-width: ${(props) => props.theme.siteWidth}px;
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
  //margin-left: -10px;
`;
export default TopBar;
