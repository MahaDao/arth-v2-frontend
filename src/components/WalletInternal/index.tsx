import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import React, { useState } from 'react';
import Loader from 'react-spinners/BeatLoader';
import { useMediaQuery } from 'react-responsive';
import { Container, Grid, IconButton } from '@material-ui/core';

import copy from '../../assets/svg/copy.svg';
import metamask from '../../assets/svg/metamask.svg';

import Button from '../Button';
import TokenSymbol from '../TokenSymbol';
import CustomModal from '../CustomModal';
import HtmlTooltip from '../HtmlTooltip';

import useCore from '../../hooks/useCore';
import useTokenBalanceOf from '../../hooks/state/useTokenBalanceOf';
import { getDisplayBalance, truncateMiddle } from '../../utils/formatBalance';

interface IProps {
  disconnect?: boolean;
  setWalletInfo: (val: boolean) => void;
  walletInfo: boolean;
}

export const WalletInternal = (props: IProps) => {
  const [ConfirmationModal, setConfirmationModal] = useState<boolean>(props.disconnect);
  const [toolTipText, settoolTipText] = useState<string>('copy');

  const isMobile = useMediaQuery({ maxWidth: '600px' });

  const core = useCore();
  const { account, reset } = useWallet();
  const { isLoading: isARTHBalanceLoading, value: arthBalance } = useTokenBalanceOf(
    core.ARTH,
    account,
  );
  const { isLoading: isMAHABalanceLoading, value: mahaBalance } = useTokenBalanceOf(
    core.MAHA,
    account,
  );
  const { isLoading: isARTHXBalanceLoading, value: arthxBalance } = useTokenBalanceOf(
    core.ARTHX,
    account,
  );

  const onClose = () => {
    setConfirmationModal(false);
  };

  return (
    <>
      <Container style={{ background: '#1e1d1d', marginTop: -2 }}>
        <CustomModal
          closeButton
          handleClose={onClose}
          open={ConfirmationModal}
          modalTitleStyle={{}}
          modalContainerStyle={{}}
          modalBodyStyle={{}}
          title={`Disconnect Wallet`}
        >
          <div>
            <PrimaryText>
              Are you sure you want to disconnect {truncateMiddle(account, 15)} ?
            </PrimaryText>
            <SecondaryText>{account}</SecondaryText>
            <Grid
              container
              spacing={2}
              direction={isMobile ? 'column-reverse' : 'row'}
              style={{ marginTop: '32px' }}
            >
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Button
                  variant={'transparent'}
                  text="Cancel"
                  size={'lg'}
                  onClick={() => {
                    onClose();
                  }}
                />
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Button
                  text={'Disconnect'}
                  size={'lg'}
                  onClick={async () => {
                    // Disconnect wallet code here.
                    onClose();
                    localStorage.setItem('disconnectWallet', '1');
                    reset();
                    props.setWalletInfo(false);
                    window.location.reload();
                  }}
                  tracking_id={'disconnect_wallet'}
                />
              </Grid>
            </Grid>
          </div>
        </CustomModal>

        <StyledLink>
          <span>Your Account</span>
          <AccountDetails>
            <IconButton>
              <img alt="Metamask" height={32} src={metamask} />
            </IconButton>
            <span>{truncateMiddle(account, 15)}</span>
            <HtmlTooltip
              title={
                <React.Fragment>
                  <span>{toolTipText}</span>
                </React.Fragment>
              }
            >
              <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(account.toString());
                  settoolTipText('Copied!');
                }}
              >
                <img alt="Copy" height={24} src={copy} />
              </IconButton>
            </HtmlTooltip>
          </AccountDetails>
        </StyledLink>
        <StyledLink>
          <span>Network: </span>
          <RowName style={{ textAlign: 'center' }}>
            <NetworkDiv colorCode={'#FCB40012'}>
              <NetworkName colorCode={'#FCB400'}>{core.config.networkName}</NetworkName>
            </NetworkDiv>
          </RowName>
        </StyledLink>
        <StyledRows>
          <RowName>
            <IconButton>
              <TokenSymbol symbol={'MAHA'} size={44} />
            </IconButton>
            <span>
              {isMAHABalanceLoading ? (
                <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
              ) : (
                Number(getDisplayBalance(mahaBalance)).toLocaleString()
              )}{' '}
              MAHA
            </span>
          </RowName>
          <DollarValue>{/* ${props?.walletData?.mahaDollars} */}</DollarValue>
        </StyledRows>
        <StyledRows>
          <RowName>
            <IconButton>
              <TokenSymbol symbol={'ARTH'} size={44} />
            </IconButton>
            <span>
              {isARTHBalanceLoading ? (
                <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
              ) : (
                Number(getDisplayBalance(arthBalance)).toLocaleString()
              )}{' '}
              ARTH
            </span>
          </RowName>
          <DollarValue>{/* ${props?.walletData?.arthDollars} */}</DollarValue>
        </StyledRows>
        <StyledRows>
          <RowName>
            <IconButton>
              <TokenSymbol symbol={'ARTHX'} size={44} />
            </IconButton>
            <span>
              {isARTHXBalanceLoading ? (
                <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
              ) : (
                Number(getDisplayBalance(arthxBalance)).toLocaleString()
              )}{' '}
              ARTHX
            </span>
          </RowName>
          <DollarValue>{/* ${props?.walletData?.arthxDollars} */}</DollarValue>
        </StyledRows>
        <StyledRows style={{ marginBottom: -5 }}>
          <Button
            variant={'transparent'}
            text={'Disconnect'}
            onClick={async () => {
              setConfirmationModal(true);
            }}
          />
        </StyledRows>
      </Container>
    </>
  );
};

const StyledLink = styled.div`
  height: 80px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  &:hover {
    color: rgba(255, 255, 255, 0.64);
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(70px);
  }
  &.active {
    color: rgba(255, 255, 255, 0.88);
  }
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  cursor: pointer;
`;

const NetworkDiv = styled.div`
  background: ${(colorProps: { colorCode: string }) => colorProps.colorCode};
  border-radius: 6px;
  padding: 4px 12px;
`;

const NetworkName = styled.div`
  color: ${(colorProps: { colorCode: string }) => colorProps.colorCode};
  border-radius: 6px;
  padding: 4px 12px;
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
`;

const PrimaryText = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.88);
  margin-bottom: 8px;
`;

const SecondaryText = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: rgba(255, 255, 255, 0.64);
  margin-bottom: 0;
`;

const AccountDetails = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  max-width: 40%;
  margin: 0px 20px;
`;

const StyledRows = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 20px 0px;
`;

const RowName = styled.div`
  display: flex;
  align-items: center;
  justify-content: baseline;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.88);
  margin-left: -15px;
`;

const DollarValue = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: right;
  color: rgba(255, 255, 255, 0.64);
  display: flex;
  align-items: center;
`;
