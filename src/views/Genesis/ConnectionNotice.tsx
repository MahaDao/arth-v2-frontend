import { useWallet } from 'use-wallet';
import styled from 'styled-components';
import Countdown from 'react-countdown';
import Grid from '@material-ui/core/Grid';
import {
  Checkbox,
  CheckboxProps,
  createStyles,
  Divider,
  LinearProgress,
  makeStyles,
  Slider,
  Theme,
  withStyles,
} from '@material-ui/core';
import { parseUnits } from 'ethers/lib/utils';
import Loader from 'react-spinners/BeatLoader';
import { useMediaQuery } from 'react-responsive';
import { BigNumber } from '@ethersproject/bignumber';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import React, { useEffect, useMemo, useState } from 'react';
import makeUrls, { TCalendarEvent } from 'add-event-to-calendar';
import ethereumChain from '../../assets/svg/ethereumChain.svg';
import polygon from '../../assets/svg/polygon.svg';
import { Mixpanel } from '../../analytics/Mixpanel';

withStyles({
  root: {
    color: 'rgba(255, 255, 255, 0.32)',
    '&$checked': {
      color: '#FF7F57',
    },
  },
  checked: {
    color: 'white',
  },
})((props: CheckboxProps) => <Checkbox {...props} />);

makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    margin: {
      height: theme.spacing(3),
    },
  }),
);

withStyles({
  root: {
    height: 15,
    width: '95%',
  },
  thumb: {
    height: 10,
    width: 10,
    border: '2px solid currentColor',
    color: '#FFA981',
    marginTop: -3.5,
    marginLeft: -3,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-100% - 5px)',
  },
  marked: {
    color: 'red',
  },
  markLabel: {},
  track: {
    height: 3,
    borderRadius: 3,
    color: '#FFA981',
  },
  rail: {
    height: 3,
    borderRadius: 3,
    color: '#D74D26',
  },
  markLabelActive: {
    fontStyle: 'normal',
    fontWeight: 300,
    fontSize: '12px',
    lineHeight: '130%',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.88)',
  },
  mark: {
    color: 'transparent',
  },
})(Slider);

const ConnectionNotice = () => {
  const addMaticToMetamask = () => {
    // @ts-ignore
    if (window.ethereum) {
      // @ts-ignore
      window.ethereum
        // @ts-ignore
        .request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x89',
              chainName: 'Matic Network',
              rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
              iconUrls: [
                'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png',
              ],
              blockExplorerUrls: ['https://polygonscan.com/'],
              nativeCurrency: {
                name: 'Matic Token',
                symbol: 'MATIC',
                decimals: 18,
              },
            },
          ], // you must have access to the specified account
        })
        .then((result: any) => {
          window.location.reload();
        })
        .catch((error: any) => {
          if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
            console.log('We can encrypt anything without the key.');
          } else {
            console.error(error);
          }
        });
    }
  };

  return (
    <MainDiv>
      <ConnectionNote>
        To participate in the Genesis, you must either be connected to the Matic/Polygon network
        or to the Ethereum network.
        <SwitchBox>
          <Parts
            style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
            onClick={() => {
              Mixpanel.track('Redirection:Polygon');
              window.open('https://polygon.arthcoin.com', '_self');
            }}
          >
            <img src={polygon} alt="calendar" height={64} style={{ marginBottom: '12px' }} />
            <PartsTitle>Polygon chain</PartsTitle>
            <PartsSubtitle> Move to polygon.arthcoin.com </PartsSubtitle>
          </Parts>
          <Parts
            onClick={() => {
              Mixpanel.track('Redirection:Ethereum');
              window.open('https://ethereum.arthcoin.com', '_self');
            }}
          >
            <img
              src={ethereumChain}
              alt="calendar"
              height={64}
              style={{ marginBottom: '12px' }}
            />
            <PartsTitle>Ethereum Chain</PartsTitle>
            <PartsSubtitle> Move to ethereum.arthcoin.com </PartsSubtitle>
          </Parts>
        </SwitchBox>
        {/*<AddPolygon onClick={addMaticToMetamask}>*/}
        {/*  Click here to add Polygon to your Metamask*/}
        {/*</AddPolygon>*/}
        {/*<br />*/}
        {/*Once you are in the right network, you can connect your wallet and enter into the site.*/}
        {/*<br />*/}
        {/*<br />*/}
      </ConnectionNote>
    </MainDiv>
  );
};

const MainDiv = styled.div`
  width: 100vw;
  height: calc(100vh - 72px);
`;

const ConnectionNote = styled.div`
  max-width: 500px;
  text-align: center;
  color: #fff;
  margin: 24px auto 0 auto;
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: rgba(255, 255, 255, 0.88);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media (max-width: 600px) {
    width: 90%;
    top: 32px;
    left: 5%;
    transform: translate(0, 0);
  }
`;

const SwitchBox = styled.div`
  background: linear-gradient(180deg, #48423e 0%, #373030 100%);
  box-shadow: 0px 8px 16px -2px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  text-align: center;
  margin-top: 12px;
`;

const Parts = styled.div`
  text-align: center;
  padding: 32px;
  cursor: pointer;
`;

const PartsTitle = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  color: rgba(255, 255, 255, 0.88);
  margin-bottom: 2px;
`;

const PartsSubtitle = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 135%;
  text-align: center;
  color: rgba(255, 255, 255, 0.64);
  margin-bottom: 0;
`;

const AddPolygon = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #ff7f57;
  cursor: pointer;
`;

export default ConnectionNotice;
