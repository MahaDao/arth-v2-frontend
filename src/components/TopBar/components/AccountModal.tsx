import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { IconButton } from '@material-ui/core';
import Loader from 'react-spinners/BeatLoader';

import TokenSymbol from '../../TokenSymbol';
import HtmlTooltip from '../../HtmlTooltip';

import useCore from '../../../hooks/useCore';
import { truncateMiddle } from '../../../utils/formatBalance';
import { getDisplayBalance } from '../../../utils/formatBalance';
import useTokenBalanceOf from '../../../hooks/state/useTokenBalanceOf';

import copy from '../../../assets/svg/copy.svg';
import metamask from '../../../assets/svg/metamask.svg';

import Button from '../../Button';
import CustomModal from '../../CustomModal';

interface props {
  onClose: () => void;
}

const AccountModal: React.FC<props> = (props) => {
  const [toolTipText, settoolTipText] = useState<string>('Copy');
  const [ConfirmationModal, setConfirmationModal] = useState<boolean>(false);

  const core = useCore();
  const { account, reset } = useWallet();
  const {isLoading: isARTHBalanceLoading, value: arthBalance} = useTokenBalanceOf(core.ARTH, account);
  const {isLoading: isMAHABalanceLoading, value: mahaBalance} = useTokenBalanceOf(core.MAHA, account);
  const {isLoading: isARTHXBalanceLoading, value: arthxBalance} = useTokenBalanceOf(core.ARTHX, account);
  
  return (
    <MainDiv>
      <BackgroundAbsolute onClick={props.onClose} />
      <CustomModal
        closeButton
        handleClose={props.onClose}
        open={ConfirmationModal}
        modalTitleStyle={{}}
        modalContainerStyle={{}}
        modalBodyStyle={{}}
        title={`Disconnect Wallet`}
      >
        <>
          <PrimaryText>Are you sure you want to disconnect {truncateMiddle(account, 15)} ?</PrimaryText>
          <SecondaryText>{account}</SecondaryText>
          <Grid container spacing={2} style={{ marginTop: '32px' }}>
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <Button
                variant={'transparent'}
                text="Cancel"
                size={'lg'}
                onClick={props.onClose}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <Button
                text={'Disconnect'}
                size={'lg'}
                onClick={() => {
                  localStorage.setItem('disconnectWallet', '1')
                  reset()
                  props.onClose()
                  window.location.reload();
                }}
              />
            </Grid>
          </Grid>
        </>
      </CustomModal>
      <PositionDiv>
        <WalletDiv>
          <StyledLink>
            <span>Your Account</span>
            <AccountDetails>
              <IconButton>
                <img height={32} src={metamask} alt="metamask" />
              </IconButton>
              <span>{truncateMiddle(account, 15)}</span>
              <HtmlTooltip
                title={
                  <React.Fragment>
                    <span>{toolTipText}</span>
                  </React.Fragment>
                }
              >
                <IconButton onClick={() => {
                  navigator.clipboard.writeText(account.toString())
                  settoolTipText('Copied!')
                }}>
                <img height={24} src={copy} alt="copy" />
                </IconButton>
              </HtmlTooltip>

            </AccountDetails>
          </StyledLink>
          <div style={{ height: '4px', width: '100%' }} />
          <StyledRows>
            <RowName>
              <IconButton>
                <TokenSymbol symbol={'MAHA'} size={44} />
              </IconButton>
              {
                isMAHABalanceLoading
                  ? <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
                  : Number(getDisplayBalance(mahaBalance)).toLocaleString()
              } MAHA
            </RowName>
            {/* <DollarValue>${props?.walletData?.mahaDollars}</DollarValue> */}
          </StyledRows>

          <StyledRows>
            <RowName>
              <IconButton>
                <TokenSymbol symbol={'ARTH'} size={44} />
              </IconButton>
              <span>
                {
                  isARTHBalanceLoading
                    ? <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
                    : Number(getDisplayBalance(arthBalance)).toLocaleString()
                } ARTH
              </span>
            </RowName>
            {/* <DollarValue>${props?.walletData?.arthDollars}</DollarValue> */}
          </StyledRows>

          <StyledRows>
            <RowName>
              <IconButton>
                <TokenSymbol symbol={'ARTHX'} size={44} />
              </IconButton>
              <span>
                {
                  isARTHXBalanceLoading
                    ? <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
                    : Number(getDisplayBalance(arthxBalance)).toLocaleString()
                } ARTHX
              </span>
            </RowName>
            {/* <DollarValue>${props?.walletData?.arthxDollars}</DollarValue> */}
          </StyledRows>

          <StyledRows style={{ margin: '20px 0' }}>
            <Button
              text={'Disconnect'}
              size={'lg'}
              variant={'transparent'}
              onClick={() => setConfirmationModal(true)}
            />
          </StyledRows>
        </WalletDiv>
      </PositionDiv>
    </MainDiv>
  );
};

const BackgroundAbsolute = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
  width: 100vw;
  height: 100vh;
  z-index: 1;
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

const MainDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
  width: 100vw;
  height: 100vh;
`;

const PositionDiv = styled.div`
  box-sizing: border-box;
  margin: 0px auto;
  padding: 0px 24px;
  width: 100%;
  position: relative;
`;

const WalletDiv = styled.div`
  position: absolute;
  background: linear-gradient(180deg, #48423e 0%, #373030 100%);
  border-radius: 12px;
  right: 22px;
  top: 72px;
  width: 380px;
  z-index: 10;
  transition: 1s ease-in-out;
`;

const StyledLink = styled.div`
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  &:hover {
    border-radius: 12px;
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

const AccountDetails = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

const StyledRows = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0px 24px;
`;

const RowName = styled.div`
  display: flex;
  align-items: center;
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

export default AccountModal;
