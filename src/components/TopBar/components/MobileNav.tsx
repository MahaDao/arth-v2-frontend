import React, { useState } from 'react';
import styled from 'styled-components';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { NavLink } from 'react-router-dom';
import AccountButton from './AccountButton';
import ExpandMore from '../../../assets/img/ExpandMore.svg';
import Button from '../../Button';
import { WalletInternal } from '../../WalletInternal';
import { useWallet } from 'use-wallet';
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

interface props {
  isMainnet: boolean
  onClick: () => void;
}

const MobileNav = (props: props) => {
  // const { walletInfo: Wallet } = props
  const { account, connect } = useWallet();

  const [netWrokType, setNetworkType] = React.useState('mainnet');
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setNetworkType(event.target.value as string);
  };
  const [walletInfo, setWallet] = useState<boolean>(false);
  const [disconnect, setDisconnect] = useState<boolean>(false);

  return (
    <StyledNav>
      {!walletInfo ? (
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
         {/* <StyledLink
            exact
            activeClassName="active"
            to="/farming"
            onClick={() => props.onClick()}
          >
            Farming
          </StyledLink>*/}
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
        <WalletInternal disconnect={disconnect} walletInfo={walletInfo} setWalletInfo={(val: boolean) => setWallet(val)} />
      )}
      <StyledButton>
        <div style={{ maxWidth: '340px', width: '100%', margin: '10px 10px 0px 10px' }}>
          {/* <AccountButton /> */}
          {!walletInfo && <Button
            variant={'transparent'}
            text={!account ? 'Connect' : 'Wallet Info'}
            onClick={async () => {
              if (!account) {
                await connect('injected')
                  .then(() => {
                    setWallet(!walletInfo);
                    localStorage.removeItem('disconnectWallet')
                  })
              } else {
                setWallet(!walletInfo);
              }
            }}
            tracking_id={!account ? 'connect_wallet' : ''}
          />}
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
  // justify-content: center;
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
    // background: rgba(255, 255, 255, 0.04);
    // backdrop-filter: blur(70px);
  }
  &.active {
    // color: rgba(255, 255, 255, 0.88);
  }
`;
const ColorIcon = styled.div`
  background: ${(colorProps: { colorCode: string }) => colorProps.colorCode};
  width: 10px;
  border-radius: 50%;
  height: 10px;
  margin-right: 5px;
  margin-left: -10px;
`;
export default MobileNav;
