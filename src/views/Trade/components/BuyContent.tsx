import { useWallet } from 'use-wallet';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';

import arrowDown from '../../../assets/svg/arrowDown.svg';

import TransparentInfoDiv from './InfoDiv';
import Button from '../../../components/Button';
import CustomModal from '../../../components/CustomModal';
import CustomInputContainer from '../../../components/CustomInputContainer';
import { ValidateNumber } from '../../../components/CustomInputContainer/RegexValidation';

import useCore from '../../../hooks/useCore';
import useDFYNPrice from '../../../hooks/useDFYNPrice';
import useTokenBalance from '../../../hooks/state/useTokenBalance';
import { getDisplayBalanceToken } from '../../../utils/formatBalance';

const BuyContent = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  const [isInputFieldError, setIsInputFieldError] = useState<boolean>(false);
  const [buyAmount, setBuyAmount] = useState<string>('0');
  const [receiveAmount, setReceiveAmount] = useState<string>('0');
  const [openModal, setOpenModal] = useState<boolean>(false);

  const core = useCore();
  const { account, connect } = useWallet();
  const tradetoken = core.tokens['ARTH'];
  const receivetoken = core.tokens['ARTHX'];

  const { isLoading: isBuyAmountBalanceLoading, value: buyAmountBalance } = useTokenBalance(
    core.tokens['ARTH']
  );
  const { isLoading: isReceiveAmountBalanceLoading, value: receiveAmountBalance } = useTokenBalance(
    core.tokens['ARTHX']
  );
  const price = useDFYNPrice(
    core.tokens['ARTH'],
    core.tokens['ARTHX']
  );

  const onBuyAmountChange = async (val: string) => {
    if (val === '' || price === '-') {
      setBuyAmount('0');
      setReceiveAmount('0');
      return;
    }

    const check: boolean = ValidateNumber(val);
    setBuyAmount(check ? val : String(Number(val)));
    if (!check) return;
    const valueInNumber: number = Number(val);
    if (!valueInNumber) return;

    const value = Number(val) / Number(price);
    setReceiveAmount(`${value}`);
  }

  const onReceiveAmountChange = async (val: string) => {
    if (val === '' || price === '-') {
      setReceiveAmount('0');
      setBuyAmount('0');
      return;
    }

    const check: boolean = ValidateNumber(val);
    setReceiveAmount(check ? val : String(Number(val)));
    if (!check) return;
    const valueInNumber: number = Number(val);
    if (!valueInNumber) return;

    const value = Number(val) * Number(price);
    setBuyAmount(`${value}`);
  }

  const BuyConfirmModal = () => {
    return (
      <CustomModal
        closeButton
        handleClose={() => setOpenModal(false)}
        open={openModal}
        modalTitleStyle={{}}
        modalContainerStyle={{}}
        modalBodyStyle={{}}
        title={`Confirm Buy`}>
        <div>
          <TransparentInfoDiv
            labelData={`Your amount`}
            rightLabelUnit={'ARTH'}
            rightLabelValue={buyAmount.toString()}
          />
          <Divider
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              margin: '15px 0px',
            }}
          />
          <TransparentInfoDiv
            labelData={`You will receive`}
            rightLabelUnit={'ARTHX'}
            rightLabelValue={receiveAmount.toString()}
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
                text={'Confirm Buy'}
                size={'lg'}
                disabled={isInputFieldError ||
                  !Number(buyAmount) ||
                  !Number(receiveAmount)
                }
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
          ILabelValue={'Enter Amount'}
          IBalanceValue={getDisplayBalanceToken(buyAmountBalance, tradetoken)}
          isBalanceLoading={isBuyAmountBalanceLoading}
          DefaultValue={buyAmount.toString()}
          LogoSymbol={'ARTH'}
          hasDropDown={false}
          SymbolText={'ARTH'}
          inputMode={'numeric'}
          setText={(val: string) => {
            onBuyAmountChange(val);
          }}
          tagText={'MAX'}
          disabled={isBuyAmountBalanceLoading}
          errorCallback={(flag: boolean) => {
            setIsInputFieldError(flag);
          }}
        />
        <PlusMinusArrow>
          <img alt='Arrow' src={arrowDown} />
        </PlusMinusArrow>
        <CustomInputContainer
          ILabelValue={'You receive'}
          IBalanceValue={getDisplayBalanceToken(receiveAmountBalance, receivetoken)}
          isBalanceLoading={isReceiveAmountBalanceLoading}
          ILabelInfoValue={''}
          DefaultValue={receiveAmount.toString()}
          LogoSymbol={'ARTHX'}
          hasDropDown={false}
          SymbolText={'ARTHX'}
          inputMode={'decimal'}
          setText={(val: string) => {
            onReceiveAmountChange(val);
          }}
          disabled={isReceiveAmountBalanceLoading}
          errorCallback={(flag: boolean) => {
            setIsInputFieldError(flag);
          }}
        />
        <div>
          <TcContainer>
            {/* <OneLineInputwomargin>
              <div style={{ flex: 1 }}>
                <TextWithIcon>Liquidity on Uniswap</TextWithIcon>
              </div>
              <OneLineInputwomargin>
                <BeforeChip>$ 9,760,068</BeforeChip>
              </OneLineInputwomargin>
            </OneLineInputwomargin> */}
            <OneLineInputwomargin style={{ marginTop: '10px' }}>
              <div style={{ flex: 1 }}>
                <TextWithIcon>Price</TextWithIcon>
              </div>
              <OneLineInputwomargin>
                <BeforeChip>{price}</BeforeChip>
                <TagChips style={{ marginRight: '4px' }}>ARTH</TagChips>
                <BeforeChip>per</BeforeChip>
                <TagChips>ARTHX</TagChips>
              </OneLineInputwomargin>
            </OneLineInputwomargin>
          </TcContainer>
          {!!!account ? (
            <Button
              text={'Connect Wallet'}
              size={'lg'}
              onClick={() =>
                connect('injected').then(() => {
                  localStorage.removeItem('disconnectWallet');
                })
              }
            />
          ) : (
            <Button
              text={'Buy'}
              size={'lg'}
              variant={'default'}
              disabled={isInputFieldError ||
                !Number(buyAmount) ||
                !Number(receiveAmount)
              }
              onClick={() => setOpenModal(true)}
            />)
          }
        </div>
      </LeftTopCardContainer>
      {BuyConfirmModal()}
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

export default BuyContent;
