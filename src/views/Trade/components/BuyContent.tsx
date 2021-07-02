import { BigNumber } from 'ethers';
import { useWallet } from 'use-wallet';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';
import { parseUnits } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';

import arrowDown from '../../../assets/svg/arrowDown.svg';

import TransparentInfoDiv from '../../../components/CustomTransparentInfoDiv/InfoDiv';
import Button from '../../../components/Button';
import CustomModal from '../../../components/CustomModal';
import CustomToolTip from '../../../components/CustomTooltip';
import CustomInputContainer from '../../../components/CustomInputContainer';
import { ValidateNumber } from '../../../components/CustomInputContainer/RegexValidation';

import useCore from '../../../hooks/useCore';
import useDFYNPrice from '../../../hooks/state/pairs/useDFYNPrice';
import useTokenBalance from '../../../hooks/state/useTokenBalance';
import useBuyARTHX from '../../../hooks/callbacks/pairs/useBuyARTHX';
import { getDisplayBalanceToken } from '../../../utils/formatBalance';
import useARTHXBuyAmount from '../../../hooks/state/pairs/useARTHXBuyAmount';
import useApprove, { ApprovalState } from '../../../hooks/callbacks/useApprove';

const BuyContent = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  const [isInputFieldError, setIsInputFieldError] = useState<boolean>(false);
  const [buyAmount, setBuyAmount] = useState<string>('0');
  const [openModal, setOpenModal] = useState<boolean>(false);

  const core = useCore();
  const { account, connect } = useWallet();
  const tradetoken = core.tokens['ARTH'];

  const { isLoading: isBuyAmountBalanceLoading, value: buyAmountBalance } = useTokenBalance(
    core.tokens['ARTH'],
  );

  const price = useDFYNPrice(core.tokens['ARTH'], core.tokens['ARTHX']);

  const { isLoading: isOutAmountLoading, value: outputAmount } = useARTHXBuyAmount(
    core.tokens['ARTH'],
    core.tokens['ARTHX'],
    BigNumber.from(parseUnits(`${buyAmount}`, 18)),
  );

  const buyARTHX = useBuyARTHX(
    core.tokens['ARTHX'].address,
    core.tokens['ARTH'].address,
    BigNumber.from(parseUnits(`${buyAmount}`, 18)),
    BigNumber.from(parseUnits(`${outputAmount}`, 18)),
    account,
  );

  const handleBuyARTHX = () => {
    buyARTHX(() => {
      setOpenModal(false);
    });
  };

  const [approveARTHStatus, approveARTH] = useApprove(
    core.tokens['ARTH'],
    core.contracts.ArthPoolRouter.address,
  );

  const isARTHApproving = approveARTHStatus === ApprovalState.PENDING;
  const isARTHApproved = approveARTHStatus === ApprovalState.APPROVED;

  const onBuyAmountChange = async (val: string) => {
    if (val === '' || price === '-') {
      setBuyAmount('0');
      return;
    }

    const check: boolean = ValidateNumber(val);
    setBuyAmount(check ? val : String(Number(val)));
  };

  const BuyConfirmModal = () => {
    return (
      <CustomModal
        closeButton
        handleClose={() => setOpenModal(false)}
        open={openModal}
        modalTitleStyle={{}}
        modalContainerStyle={{}}
        modalBodyStyle={{}}
        title={`Confirm Buy`}
      >
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
            rightLabelValue={outputAmount.toString()}
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
                disabled={isInputFieldError || !Number(buyAmount) || !Number(outputAmount)}
                onClick={handleBuyARTHX}
              />
            </Grid>
          </Grid>
        </div>
      </CustomModal>
    );
  };

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
          tokenDecimals={18}
        />
        <PlusMinusArrow>
          <img alt="Arrow" src={arrowDown} />
        </PlusMinusArrow>
        <div>
          <TextWithIcon style={{ marginBottom: '12px' }}>You Receive</TextWithIcon>
          <ReceiveContainer>
            <OneLineInputwomargin>
              <div style={{ flex: 1 }}>
                <TextWithIcon>
                  ARTHX
                  <CustomToolTip toolTipText={'Amount of ARTHX bought'} />
                </TextWithIcon>
              </div>
              <OneLineInputwomargin>
                <BeforeChip className={'custom-mahadao-chip'}>
                  {Number(buyAmount) ? Number(outputAmount).toLocaleString() : '0'}
                </BeforeChip>
                <TagChips>ARTHX</TagChips>
              </OneLineInputwomargin>
            </OneLineInputwomargin>
            {/* <OneLineInputwomargin>
              <div style={{ flex: 1 }}>
                <TextWithIcon>Liquidity on Uniswap</TextWithIcon>
              </div>
              <OneLineInputwomargin>
                <BeforeChip>$ 9,760,068</BeforeChip>
              </OneLineInputwomargin>
            </OneLineInputwomargin>
             <br /> */}
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
          </ReceiveContainer>
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
          ) : isARTHApproved ? (
            <Button
              text={'Buy'}
              size={'lg'}
              variant={'default'}
              disabled={
                isInputFieldError ||
                isOutAmountLoading ||
                !Number(buyAmount) ||
                !Number(outputAmount)
              }
              onClick={() => setOpenModal(true)}
            />
          ) : (
            <Button
              text={isARTHApproving ? 'Approving ARTH' : 'Approve ARTH'}
              size={'lg'}
              variant={'default'}
              disabled={
                isInputFieldError ||
                !Number(buyAmount) ||
                !Number(outputAmount) ||
                isOutAmountLoading
              }
              onClick={approveARTH}
              loading={isARTHApproving}
            />
          )}
        </div>
      </LeftTopCardContainer>
      {BuyConfirmModal()}
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

const ReceiveContainer = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
`;

const PlusMinusArrow = styled.div`
  width: 100%;
  border-radius: 1.33px;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  font-size: 20px;
  margin: 12px 0;
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
  font-family: Inter;
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
