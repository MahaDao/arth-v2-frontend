import { BigNumber } from 'ethers';
import { useWallet } from 'use-wallet';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';
import { parseUnits } from 'ethers/lib/utils';
import Loader from 'react-spinners/BeatLoader';
import React, { useEffect, useMemo, useState } from 'react';

import arrowDown from '../../../assets/svg/arrowDown.svg';

import TransparentInfoDiv from './InfoDiv';
import Button from '../../../components/Button';

import CustomModal from '../../../components/CustomModal';
import CustomToolTip from '../../../components/CustomTooltip';
import CustomInputContainer from '../../../components/CustomInputContainer';
import { ValidateNumber } from '../../../components/CustomInputContainer/RegexValidation';

import useCore from '../../../hooks/useCore';
import useDFYNPrice from '../../../hooks/useDFYNPrice';
import useARTHXTaxFee from '../../../hooks/state/useARTHXTaxFee';
import useTokenBalance from '../../../hooks/state/useTokenBalance';
import { getDisplayBalanceToken } from '../../../utils/formatBalance';
import useARTHXBuyAmount from '../../../hooks/state/useARTHXBuyAmount';
import useSellARTHX from '../../../hooks/callbacks/pairs/useSellARTHX';
import useApprove, { ApprovalState } from '../../../hooks/callbacks/useApprove';

const SellContent = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  const [sellAmount, setSellAmount] = useState<string>('0');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isInputFieldError, setIsInputFieldError] = useState<boolean>(false);

  const core = useCore();
  const { account, connect } = useWallet();
  const sellToken = core.tokens['ARTHX'];

  const { isLoading: isSellAmountBalanceLoading, value: sellAmountBalance } = useTokenBalance(
    core.tokens['ARTHX']
  );
  const price = useDFYNPrice(
    core.tokens['ARTHX'],
    core.tokens['ARTH']
  );
  const { isLoading: isTaxPercentLoading, value: taxPercent } = useARTHXTaxFee();

  const [isTradingFeeLoading, tradingFee] = useMemo(() => {
    if (isTaxPercentLoading) return [true, BigNumber.from(0)];
    if (taxPercent.lte(0)) return [false, BigNumber.from(0)];

    return [
      false,
      BigNumber.from(parseUnits(`${sellAmount}`, 18))
        .mul(taxPercent)
        .div(1e6)
    ];
  }, [isTaxPercentLoading, taxPercent, sellAmount]);

  const { isLoading: isOutAmountLoading, value: outputAmount } = useARTHXBuyAmount(
    core.tokens['ARTHX'],
    core.tokens['ARTH'],
    BigNumber.from(parseUnits(`${sellAmount}`, 18)).sub(tradingFee)
  );

  const onSellAmountChange = (val: string) => {
    if (val === '' || price === '-') {
      setSellAmount('0');
      return;
    }

    const check: boolean = ValidateNumber(val);
    setSellAmount(check ? val : String(Number(val)));
  }

  const [approveARTHXStatus, approveARTHX] = useApprove(
    core.tokens['ARTHX'],
    core.contracts.UniswapV2Router02.address
  );

  const sellARTHX = useSellARTHX(
    core.tokens['ARTH'].address,
    core.tokens['ARTHX'].address,
    BigNumber.from(parseUnits(`${sellAmount}`, 18)).sub(tradingFee),
    BigNumber.from(parseUnits(`${outputAmount}`, 18)),
    account
  );

  const handleSellARTHX = () => {
    sellARTHX(() => {
      setOpenModal(false);
    })
  }

  const isARTHXApproving = approveARTHXStatus === ApprovalState.PENDING;
  const isARTHXApproved = approveARTHXStatus === ApprovalState.APPROVED;

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
            labelData={`Fee`}
            rightLabelUnit={'ARTHX'}
            rightLabelValue={Number(getDisplayBalanceToken(tradingFee, core.tokens['ARTHX'])).toLocaleString()}
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
            rightLabelValue={Number(outputAmount).toLocaleString()}
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
                onClick={handleSellARTHX}
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
          <img alt='Arrow' src={arrowDown} />
        </PlusMinusArrow>
        <TextWithIcon style={{ marginBottom: '12px' }}>You Receive</TextWithIcon>
        <ReceiveContainer>
          <OneLineInputwomargin>
            <div style={{ flex: 1 }}>
              <TextWithIcon>
                ARTH
                <CustomToolTip
                  toolTipText={'Amount of ARTH bought'}
                />
              </TextWithIcon>
            </div>
            <OneLineInputwomargin>
              <BeforeChip className={'custom-mahadao-chip'}>
                {
                  Number(sellAmount)
                    ? Number(outputAmount).toLocaleString()
                    : '0'
                }
              </BeforeChip>
              <TagChips>ARTHX</TagChips>
            </OneLineInputwomargin>
          </OneLineInputwomargin>
          <OneLineInputwomargin style={{ marginTop: '10px' }}>
            <div style={{ flex: 1 }}>
              <TextWithIcon>
                Fee
              </TextWithIcon>
            </div>
            <OneLineInputwomargin>
              <BeforeChip>
                {
                  isTradingFeeLoading
                    ? <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
                    : Number(getDisplayBalanceToken(tradingFee, core.tokens['ARTHX'])).toLocaleString()
                }
              </BeforeChip>
              <TagChips>ARTHX</TagChips>
            </OneLineInputwomargin>
          </OneLineInputwomargin>
          <OneLineInputwomargin style={{ marginTop: '10px' }}>
            <div style={{ flex: 1 }}>
              <TextWithIcon>Price</TextWithIcon>
            </div>
            <OneLineInputwomargin>
              <BeforeChip>{price}</BeforeChip>
              <TagChips style={{ marginRight: '4px' }}>ARTHX</TagChips>
              <BeforeChip>per</BeforeChip>
              <TagChips>ARTH</TagChips>
            </OneLineInputwomargin>
          </OneLineInputwomargin>
        </ReceiveContainer>
        {
          !!!account ? (
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
            isARTHXApproved
              ? (
                <Button
                  text={'Sell'}
                  size={'lg'}
                  disabled={
                    isInputFieldError ||
                    !Number(sellAmount) ||
                    !Number(outputAmount)
                  }
                  onClick={() => setOpenModal(true)}
                />
              )
              : (
                <Button
                  text={
                    isARTHXApproving
                      ? 'Approving ARTHX'
                      : 'Approve ARTHX'
                  }
                  size={'lg'}
                  disabled={
                    isOutAmountLoading ||
                    isInputFieldError ||
                    !Number(sellAmount) ||
                    !Number(outputAmount)
                  }
                  loading={isARTHXApproving}
                  onClick={approveARTHX}
                />
              )
          )
        }
      </LeftTopCardContainer>
      {
        sellConfirmModal()
      }
    </div>
  );
};

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

const ReceiveContainer = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
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
