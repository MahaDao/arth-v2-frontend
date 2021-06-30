import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';
import { parseUnits } from 'ethers/lib/utils';
import { BigNumber } from '@ethersproject/bignumber';
import React, { useEffect, useMemo, useState } from 'react';
import { withSnackbar, WithSnackbarProps } from 'notistack';

import arrowDown from '../../../assets/svg/arrowDown.svg';

import TransparentInfoDiv from '../../../components/CustomTransparentInfoDiv/InfoDiv';
import Button from '../../../components/Button';
import CollaterallizeCheckmark from './Collaterallize';
import MinorInputContainer from './MinorInputContainer';
import CustomModal from '../../../components/CustomModal';
import { CustomSnack } from '../../../components/SnackBar';
import prettyNumber from '../../../components/PrettyNumber';
import CustomToolTip from '../../../components/CustomTooltip';
import SlippageContainer from '../../../components/SlippageContainer';
import CustomSuccessModal from '../../../components/CustomSuccesModal';
import CustomInputContainer from '../../../components/CustomInputContainer';
import { ValidateNumber } from '../../../components/CustomInputContainer/RegexValidation';

import useCore from '../../../hooks/useCore';
import useTokenDecimals from '../../../hooks/useTokenDecimals';
import { getDisplayBalance } from '../../../utils/formatBalance';
import useTokenBalance from '../../../hooks/state/useTokenBalance';
import useBuybackFee from '../../../hooks/state/controller/useBuybackFee';
import usePerformBuyback from '../../../hooks/callbacks/pools/performBuyback';
import useApprove, { ApprovalState } from '../../../hooks/callbacks/useApprove';
import useARTHXOraclePrice from '../../../hooks/state/controller/useARTHXPrice';
import useCollateralPoolPrice from '../../../hooks/state/pools/useCollateralPoolPrice';
import useCollateralPoolExcessCollat from '../../../hooks/state/pools/useCollateralPoolExcessCollat';

type Iprops = {
  onChange?: () => void;
};

const BuyBack = (props: WithSnackbarProps & Iprops) => {
  const [redeemAmount, setRedeemAmount] = useState<string>('0');
  const [receiveAmount, setReceiveAmount] = useState<string>('0');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isInputFieldError, setIsInputFieldError] = useState<boolean>(false);
  const [successModal, setSuccessModal] = useState<boolean>(false);

  const core = useCore();
  const { account, connect } = useWallet();
  const [selectedCollateral, setSelectedCoin] = useState(core.getDefaultCollateral());
  const collateralTypes = useMemo(() => core.getCollateralTypes(), [core]);
  const collateralPool = core.getCollatearalPool(selectedCollateral);
  const tokenDecimals = useTokenDecimals(selectedCollateral);
  
  const {isLoading: isARTHXBalanceLoading, value: arthxBalance} = useTokenBalance(core.ARTHX);
  const {isLoading: isARTHXPriceLoading, value: arthxPrice} = useARTHXOraclePrice();
  const {isLoading: isExcessCollateralLoading, value: collateralToBeBoughtBack} = useCollateralPoolExcessCollat(selectedCollateral);
  const {isLoading: isCollateralPriceLoading, value: collateralGMUPrice} = useCollateralPoolPrice(selectedCollateral);
  const {isLoading: isFeeLoading, value: buybackFee} = useBuybackFee();

  const [approveStatus, approve] = useApprove(core.ARTHX, collateralPool.address);

  useEffect(() => window.scrollTo(0, 0), []);

  const tradingFee = useMemo(() => {
    return BigNumber
      .from(parseUnits(`${receiveAmount}`, tokenDecimals))
      .mul(buybackFee)
      .div(1e6);
  }, [receiveAmount, tokenDecimals, buybackFee]);

  const collateralAmountAfterFees = useMemo(() => {
    return BigNumber.from(parseUnits(`${receiveAmount}`, tokenDecimals)).sub(tradingFee);
  }, [receiveAmount, tokenDecimals, tradingFee]);

  const performBuyback = usePerformBuyback(
    selectedCollateral,
    BigNumber.from(parseUnits(`${redeemAmount}`, 18)),
    collateralAmountAfterFees,
  );

  const isARTHXApproved = approveStatus === ApprovalState.APPROVED;
  const isWalletConnected = !!account;
  const isARTHXApproving = approveStatus === ApprovalState.PENDING;

  if (!core) return <div />;

  const handleBuyback = () => {
    performBuyback(() => {
      setOpenModal(false);
      setSuccessModal(true);
    });
  };

  const onRedeemValueChange = (val: string) => {
    if (val === '' || arthxPrice.lte(0) || collateralGMUPrice.lte(0)) {
      setRedeemAmount('0');
      setReceiveAmount('0');
      return;
    }

    let check = ValidateNumber(val);
    setRedeemAmount(check ? val : String(val));
    if (!check) return;
    const valInNumber = Number(val);
    if (!valInNumber) return;

    const amountBN = arthxPrice
      .mul(BigNumber.from(
        parseUnits(`${valInNumber}`, 18)
      ))
      .div(BigNumber.from(10).pow(18 - tokenDecimals))
      .div(collateralGMUPrice);

    setReceiveAmount(getDisplayBalance(amountBN, tokenDecimals, 3));
  };

  const buyBackContainer = () => {
    return (
      <LeftTopCard className={'custom-mahadao-container'}>
        <LeftTopCardHeader className={'custom-mahadao-container-header'}>
          <HeaderTitle>
            <div>
              Buyback
              <CustomToolTip toolTipText={'loreum ipsum'} />
            </div>
            <SlippageContainer />
          </HeaderTitle>
          <HeaderSubtitle>
            {prettyNumber(getDisplayBalance(collateralToBeBoughtBack, 18))}{' '}
            <HardChip>{selectedCollateral}</HardChip>
            <br />
            <TextForInfoTitle>To be bought back</TextForInfoTitle>
          </HeaderSubtitle>
        </LeftTopCardHeader>
        <LeftTopCardContainer className={'custom-mahadao-container-content'}>
          <CustomInputContainer
            ILabelValue={'Enter Amount'}
            IBalanceValue={`${getDisplayBalance(arthxBalance)}`}
            ILabelInfoValue={''}
            disabled={collateralToBeBoughtBack.eq(0)}
            DefaultValue={redeemAmount.toString()}
            hasDropDown={false}
            LogoSymbol={'ARTHX'}
            SymbolText={'ARTHX'}
            inputMode={'decimal'}
            setText={(val: string) => onRedeemValueChange(val)}
            tagText={'MAX'}
            errorCallback={(flag: boolean) => { setIsInputFieldError(flag) }}
            DisableMsg={
              collateralToBeBoughtBack.eq(0)
                ? 'Current pool has no collateral to be bought back.'
                : ''
            }
          />
          <PlusMinusArrow>
            <img src={arrowDown} alt="arrow" />
          </PlusMinusArrow>
          <MinorInputContainer
            ILabelValue={'You receive'}
            IBalanceValue={''}
            ILabelInfoValue={''}
            DefaultValue={receiveAmount.toString()}
            LogoSymbol={selectedCollateral}
            hasDropDown={true}
            SymbolText={selectedCollateral}
            dropDownValues={collateralTypes}
            ondropDownValueChange={(data) => setSelectedCoin(data)}
          />
          <div>
            <TcContainer>
              <OneLineInputwomargin style={{ marginBottom: '5px' }}>
                <div style={{ flex: 1 }}>
                  <TextWithIcon>
                    Trading Fee
                  </TextWithIcon>
                </div>
                <OneLineInputwomargin>
                  <BeforeChip>
                    {
                      Number(getDisplayBalance(tradingFee, tokenDecimals))
                      .toLocaleString('en-US', {maximumFractionDigits: tokenDecimals})
                    }
                  </BeforeChip>
                  <TagChips>{selectedCollateral}</TagChips>
                </OneLineInputwomargin>
              </OneLineInputwomargin>
            </TcContainer>
            <div style={{ marginTop: 35 }}>
              {!isWalletConnected ? (
                <Button
                  text={'Connect Wallet'}
                  size={'lg'}
                  onClick={() => connect('injected').then(() => {
                    localStorage.removeItem('disconnectWallet')
                  })}
                />
              ) : (
                <>
                  {!isARTHXApproved && (
                    <>
                      <Button
                        text={!isARTHXApproved ? `Approve ARTHX` : 'Approved ARTHX'}
                        size={'lg'}
                        disabled={
                          collateralToBeBoughtBack.eq(0) ||
                          isInputFieldError ||
                          isARTHXApproved ||
                          !Number(redeemAmount)
                        }
                        loading={isARTHXApproving}
                        onClick={approve}
                      />
                      <br />
                    </>
                  )}
                  <Button
                    text={'Buyback'}
                    disabled={
                      collateralToBeBoughtBack.eq(0) ||
                      isInputFieldError ||
                      !isARTHXApproved ||
                      !Number(redeemAmount) ||
                      !Number(receiveAmount)
                    }
                    size={'lg'}
                    onClick={() => {
                      setOpenModal(true);
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </LeftTopCardContainer>
      </LeftTopCard>
    );
  };

  const recollatateralizeConatiner = () => {
    return (
      <LeftTopCardChecked className={'custom-mahadao-box'} style={{ height: '100%' }}>
        <LeftTopCardHeader className={'custom-mahadao-container-header'}>
          <HeaderTitle style={{ justifyContent: 'flex-start' }}>
            {'Recollatateralize'}
            <CustomToolTip toolTipText={'loreum ipsum'} />
          </HeaderTitle>
          <HeaderSubtitle>
            <TextForInfoTitle>The Protocol is currently collateralised</TextForInfoTitle>
          </HeaderSubtitle>
        </LeftTopCardHeader>
        <CollaterallizeCheckmark subText={'The Protocol is currently collateralised'} />
      </LeftTopCardChecked>
    );
  };

  return (
    <div>
      <Grid container>
        <Grid container lg={8} md={12} sm={12} xs={12}>
          <Grid item lg={6} md={12} sm={12} xs={12} style={{ zIndex: 1 }}>
            {buyBackContainer()}
          </Grid>
          <Grid item lg={6} md={12} sm={12} xs={12}>
            <RightTopCard className={'custom-mahadao-box'}>
              <RightTopCardHeader style={{}}>Current Fee Rates</RightTopCardHeader>
              <div style={{ marginBottom: '8px' }}>
                <OneLineInput>
                  <div style={{ flex: 1 }}>
                    <TextForInfoTitle>
                      Trading Fee
                      <CustomToolTip toolTipText={'loreum ipsum'} />
                    </TextForInfoTitle>
                  </div>
                  <InputLabelSpanRight>
                    {
                      Number(getDisplayBalance(buybackFee, 4, 4))
                        .toLocaleString('en-US', { maximumFractionDigits: 4 })
                    }%
                  </InputLabelSpanRight>
                </OneLineInput>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <OneLineInput>
                  <div style={{ flex: 1 }}>
                    <TextForInfoTitle>ARTHX Oracle Price</TextForInfoTitle>
                  </div>
                  <InputLabelSpanRight>
                    ${
                      Number(getDisplayBalance(arthxPrice, 6, 6))
                        .toLocaleString('en-US', { maximumFractionDigits: 6 })
                    }
                  </InputLabelSpanRight>
                </OneLineInput>
              </div>
            </RightTopCard>
          </Grid>
        </Grid>
        <Grid item lg={4} md={12} sm={12} xs={12}>
          {recollatateralizeConatiner()}
        </Grid>
      </Grid>
      <CustomModal
        closeButton
        handleClose={() => setOpenModal(false)}
        open={openModal}
        modalTitleStyle={{}}
        modalContainerStyle={{}}
        modalBodyStyle={{}}
        title={`Confirm Buyback ARTHX`}
      >
        <div>
          <TransparentInfoDiv
            labelData={`Your Share Amount`}
            rightLabelUnit={'ARTHX'}
            rightLabelValue={Number(redeemAmount).toLocaleString()}
          />

          <TransparentInfoDiv
            labelData={`Trading Fee`}
            rightLabelUnit={selectedCollateral}
            rightLabelValue={
              Number(getDisplayBalance(tradingFee, tokenDecimals))
                .toLocaleString('en-US', { maximumFractionDigits: tokenDecimals })
            }
          />

          <Divider style={{ background: 'rgba(255, 255, 255, 0.08)', margin: '15px 0px' }} />

          <TransparentInfoDiv
            labelData={`You will receive collateral`}
            rightLabelUnit={selectedCollateral}
            rightLabelValue={Number(receiveAmount).toLocaleString()}
          />

          <Grid container spacing={2} style={{ marginTop: '32px' }}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Button
                variant={'transparent'}
                text="Cancel"
                size={'lg'}
                onClick={() => {
                  setOpenModal(false);
                  let options = {
                    content: () =>
                      CustomSnack({
                        onClose: props.closeSnackbar,
                        type: 'red',
                        data1: `Buyback ${Number(redeemAmount).toLocaleString()} ${selectedCollateral} cancelled`,
                      }),
                  };
                  props.enqueueSnackbar('timepass', options);
                }}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Button
                disabled={
                  collateralToBeBoughtBack.eq(0) ||
                  isInputFieldError ||
                  !isARTHXApproved ||
                  !Number(redeemAmount) ||
                  !Number(receiveAmount)
                }
                text={'Buyback'}
                size={'lg'}
                onClick={handleBuyback}
              />
            </Grid>
          </Grid>
        </div>
      </CustomModal>
      <CustomSuccessModal
        modalOpen={successModal}
        setModalOpen={() => setSuccessModal(false)}
        title={'Buyback ARTHX successful!'}
        subTitle={''}
        subsubTitle={'Your collateral has now been boughtback for ARTHX'}
      />
    </div>
  );
};

const TcContainer = styled.div`
  margin-top: 24px;
`;

const HeaderTitle = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-content: center;
`;

const HeaderSubtitle = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.88);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  margin: 4px 0 0 0;
`;

const HardChip = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 2px 8px;
  font-family: Inter;
  font-style: normal;
  color: rgba(255, 255, 255, 0.64);
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  margin-left: 4px;
  margin-right: 4px;
`;

const LeftTopCard = styled.div`
`;

const LeftTopCardChecked = styled.div`
  padding: 0 !important;
  margin-left: 12px;
  @media (max-width: 600px) {
    margin-left: 0;
    margin-top: 24px;
  }
`;

const RightTopCard = styled.div`
  height: 100%;
  margin-left: -5px;
  @media (max-width: 600px) {
    margin-left: 0;
    margin-top: -10px;
    height: auto;
  }
`;

const RightTopCardHeader = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  margin: 12px 0;
`;

const LeftTopCardHeader = styled.div`
  padding-top: 32px;
  padding-bottom: 32px;
`;

const LeftTopCardContainer = styled.div``;
const PlusMinusArrow = styled.div`
  width: 100%;
  height: 20px;
  border-radius: 1.33px;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  font-size: 20px;
  margin: 12px 0;
`;

const OneLineInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
  margin: 8px 0 0 0;
`;

const OneLineInputwomargin = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
`;

const TextWithIcon = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.88);
`;

const TextForInfoTitle = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  color: #ffffff;
  opacity: 0.64;
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

const InputLabelSpanRight = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.88);
  margin-right: 5px;
`;

export default withSnackbar(BuyBack);
