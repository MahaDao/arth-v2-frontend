import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';
import { useWallet } from 'use-wallet';

import Button from '../../../components/Button';
import arrowDown from '../../../assets/svg/arrowDown.svg';
import TransparentInfoDiv from './InfoDiv';
import CustomInputContainer from '../../../components/CustomInputContainer';
import CustomModal from '../../../components/CustomModal';
import CustomToolTip from '../../../components/CustomTooltip';
import useCore from '../../../hooks/useCore';
import useTokenBalance from '../../../hooks/state/useTokenBalance';
import { getDisplayBalanceToken } from '../../../utils/formatBalance';

const SellContent = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  const core = useCore();
  const { account, connect } = useWallet();
  const [isInputFieldError, setIsInputFieldError] = useState<boolean>(false);

  const [sellAmount, setSellAmount] = useState<string>('0');
  const [receiveAmount, setReceiveAmount] = useState<string>('0');

  const [openModal, setOpenModal] = useState<boolean>(false);

  const sellToken = core.tokens['ARTHX'];
  const receiveToken = core.tokens['ARTH'];

  //Balance
  const { isLoading: isSellAmountBalanceLoading, value: sellAmountBalance } = useTokenBalance(
    core.tokens['ARTHX'],
  );

  const { isLoading: isReceiveAmountBalanceLoading, value: receiveAmountBalance } = useTokenBalance(
    core.tokens['ARTH'],
  );

  const ratio = 100;

  const onSellAmountChange = (val: string) => {
    // Dumpy code
    if (val === ''){
      setSellAmount('0');
    }
    setSellAmount(val);
    const valInNumber = Number(val);
    if (valInNumber){
      const temp = String(valInNumber * ratio);
      setSellAmount(temp);
    }
  }

  const onReceiveAmountChange = (val: string) => {
    // Dumpy code
    if (val === ''){
      setSellAmount('0');
    }
    setSellAmount(val);
    const valInNumber = Number(val);
    if (valInNumber){
      const temp = String(valInNumber * (1 / ratio));
      setSellAmount(temp);
    }
  }

  const sellConfirmModal = () => {
    return (
      <CustomModal
        closeButton
        handleClose={() => setOpenModal(false)}
        open={openModal}
        modalTitleStyle={{}}
        modalContainerStyle={{}}
        modalBodyStyle={{}}
        title={`Confirm Sell`}>
        <div>
          <TransparentInfoDiv
            labelData={`Your amount`}
            rightLabelUnit={'ARTHX'}
            rightLabelValue={sellAmount.toString()}
          />
          <TransparentInfoDiv
            labelData={`Trading Fee`}
            rightLabelUnit={'5.87'}
            rightLabelValue={'ARTH'}
          />
          <Divider
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              margin: '15px 0px',
            }}
          />
          <TransparentInfoDiv
            labelData={`You will receive`}
            rightLabelUnit={'ARTH'}
            rightLabelValue={sellAmount.toString()}
          />

          <Grid container spacing={2} style={{ marginTop: '32px' }}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Button
                variant={'transparent'}
                text="Cancel"
                size={'lg'}
                onClick={() => {
                  setOpenModal(false);
                }}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Button
                text={'Confirm Sell'}
                size={'lg'}
                onClick={() => {
                  setOpenModal(false);
                }}
              />
            </Grid>
          </Grid>
        </div>
      </CustomModal>
    )
  }

  return (
    <div>
      <LeftTopCardContainer className={'custom-mahadao-container-content'}>
        <CustomInputContainer
          ILabelValue={'You receive'}
          IBalanceValue={getDisplayBalanceToken(sellAmountBalance, sellToken)}
          isBalanceLoading={isSellAmountBalanceLoading}
          ILabelInfoValue={''}
          DefaultValue={sellAmount.toString()}
          LogoSymbol={'ARTHX'}
          hasDropDown={false}
          SymbolText={'ARTHX'}
          inputMode={'numeric'}
          setText={(val: string) => {
            onSellAmountChange(val);
          }}
          disabled={isSellAmountBalanceLoading}
          errorCallback={(flag: boolean) => {
            setIsInputFieldError(flag);
          }}
        />
        <PlusMinusArrow>
          <img src={arrowDown} />
        </PlusMinusArrow>
        <CustomInputContainer
          ILabelValue={'Enter Amount'}
          IBalanceValue={getDisplayBalanceToken(receiveAmountBalance, receiveToken)}
          isBalanceLoading={isReceiveAmountBalanceLoading}
          DefaultValue={receiveAmount.toString()}
          LogoSymbol={'ARTH'}
          hasDropDown={false}
          SymbolText={'ARTH'}
          inputMode={'numeric'}
          setText={(val: string) => {
            onReceiveAmountChange(val);
          }}
          tagText={'MAX'}
          disabled={isReceiveAmountBalanceLoading}
          errorCallback={(flag: boolean) => {
            setIsInputFieldError(flag);
          }}
        />
        <div>
          <TcContainer>
            <OneLineInputwomargin>
              <div style={{ flex: 1 }}>
                <TextWithIcon>Liquidity on Uniswap</TextWithIcon>
              </div>
              <OneLineInputwomargin>
                <BeforeChip>$ 9,760,068</BeforeChip>
              </OneLineInputwomargin>
            </OneLineInputwomargin>
            <OneLineInputwomargin style={{ marginTop: '10px' }}>
              <div style={{ flex: 1 }}>
                <TextWithIcon>Price</TextWithIcon>
              </div>
              <OneLineInputwomargin>
                <BeforeChip>0.05</BeforeChip>
                <TagChips>ARTH</TagChips>
                <BeforeChip>per</BeforeChip>
                <TagChips>ETH</TagChips>
              </OneLineInputwomargin>
            </OneLineInputwomargin>
            <OneLineInputwomargin style={{ marginTop: '10px' }}>
              <div style={{ flex: 1 }}>
                <TextWithIcon>
                  Trading fee
                  <CustomToolTip/>
                </TextWithIcon>
              </div>
              <OneLineInputwomargin>
                <BeforeChip>0.05</BeforeChip>
                <TagChips>ARTH</TagChips>
              </OneLineInputwomargin>
            </OneLineInputwomargin>
          </TcContainer>
          <Button text={'Sell'} size={'lg'} onClick={() => setOpenModal(true)} />
        </div>
      </LeftTopCardContainer>
      {sellConfirmModal()}
    </div>
  );
};

const TcContainer = styled.div`
  margin-top: 18px;
  margin-bottom: 18px;
`;

const OneLineInputwomargin = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
`;
const LeftTopCardContainer = styled.div``;
const PlusMinusArrow = styled.div`
  width: 100%;
  height: 32px;
  border-radius: 1.33px;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  font-size: 20px;
`;

const TextWithIcon = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.88);
`;

const BeforeChip = styled.span`
  ont-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.64);
  margin-right: 5px;
`;

const TagChips = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 2px 8px;
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.64);
`;

export default SellContent;
