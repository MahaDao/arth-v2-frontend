import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';
import { parseUnits } from 'ethers/lib/utils';
import { BigNumber } from '@ethersproject/bignumber';
import React, { useEffect, useMemo, useState } from 'react';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import Loader from 'react-spinners/BeatLoader';

import plusSign from '../../../assets/svg/plus.svg';
import arrowDown from '../../../assets/svg/arrowDown.svg';

import PoolInfo from './PoolInfo';
import TransparentInfoDiv from './InfoDiv';
import Button from '../../../components/Button';
import CustomModal from '../../../components/CustomModal';
import { CustomSnack } from '../../../components/SnackBar';
import CustomSuccessModal from '../../../components/CustomSuccesModal';
import SlippageContainer from '../../../components/SlippageContainer';
import CustomInputContainer from '../../../components/CustomInputContainer';
import { ValidateNumber } from '../../../components/CustomInputContainer/RegexValidation';

import useCore from '../../../hooks/useCore';
import useTokenDecimals from '../../../hooks/useTokenDecimals';
import { getDisplayBalance } from '../../../utils/formatBalance';
import useTokenBalance from '../../../hooks/state/useTokenBalance';
import useRedeemARTH from '../../../hooks/callbacks/pools/useRedeemARTH';
import useARTHXPrice from '../../../hooks/state/controller/useARTHXPrice';
import useStabilityFee from '../../../hooks/state/controller/useStabilityFee';
import usePoolRedeemFees from '../../../hooks/state/pools/usePoolRedeemFees';
import useApprove, { ApprovalState } from '../../../hooks/callbacks/useApprove';
import useRedeemableBalances from '../../../hooks/state/pools/useRedeemableBalances';
import useCollateralPoolPrice from '../../../hooks/state/pools/useCollateralPoolPrice';
import useCollectRedemption from '../../../hooks/callbacks/pools/useCollectRedemption';

interface IProps {
  setType: (type: 'mint' | 'redeem') => void;
}

const RedeemTabContent = (props: WithSnackbarProps & IProps) => {
  const [arthValue, setArthValue] = useState<string>('0');
  const [arthxValue, setArthxValue] = useState<string>('0');
  const [collateralValue, setCollateralValue] = useState<string>('0');

  const [openModal, setOpenModal] = useState<0 | 1 | 2>(0);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [isInputFieldError, setIsInputFieldError] = useState<boolean>(false);
  const [successCollectModal, setSuccessCollectModal] = useState<boolean>(false);

  const redeemCR = BigNumber.from(11e5);

  const core = useCore();
  const { account, connect } = useWallet();
  const collateralTypes = useMemo(() => core.getCollateralTypes(), [core]);
  const [selectedCollateral, setSelectedReceiveRedeemCoin] = useState(
    core.getDefaultCollateral(),
  );
  const collateralPool = core.getCollatearalPool(selectedCollateral);

  const arthxRatio = useMemo(() => {
    return redeemCR.sub(BigNumber.from(1e6));
  }, [redeemCR]);

  const arthRatio = useMemo(() => {
    return BigNumber.from(1e6).sub(arthxRatio)
  }, [arthxRatio]);

 
  const {isLoading: isARTHBalanceLoading, value: arthBalance} = useTokenBalance(core.ARTH);
  const {isLoading: isARTHXBalanceLoading, value: arthxBalance} = useTokenBalance(core.ARTHX);
 
  const tokenDecimals = useTokenDecimals(selectedCollateral);
  const {isLoading: isRedeemableBalancesLoading, value: redeemableBalances} = useRedeemableBalances(selectedCollateral);
  const {isLoading: isCollateralBalanceLoading, value: collateralBalance} = useTokenBalance(core.tokens[selectedCollateral]);
  const {isLoading: isRedeemFeeLoading, value: redeemFee} = usePoolRedeemFees(selectedCollateral);
  const {isLoading: isStabilityFeeLoading, value: stabilityFee} = useStabilityFee();
  const {isLoading: isCollateralPriceLoading, value: collateralToGMUPrice} = useCollateralPoolPrice(selectedCollateral);
  const {isLoading: isARTHXLoading, value: arthxPrice} = useARTHXPrice();

  const [mahaApproveStatus, approveMAHA] = useApprove(core.MAHA, collateralPool.address);
  const [arthxApproveStatus, approveARTHX] = useApprove(core.ARTHX, collateralPool.address);
  const [arthApproveStatus, approveCollat] = useApprove(core.ARTH, collateralPool.address);

  const collectRedeemption = useCollectRedemption(selectedCollateral);

  useEffect(() => window.scrollTo(0, 0), []);

  const collateralOutMinAfterFee = useMemo(() => {
    if (isRedeemFeeLoading) return BigNumber.from(parseUnits(`${collateralValue}`, tokenDecimals));
    const feePrecision = BigNumber.from(1e6);

    return BigNumber
      .from(parseUnits(`${collateralValue}`, tokenDecimals))
      .mul(feePrecision.sub(redeemFee))
      .div(feePrecision);
  }, [redeemFee, collateralValue, tokenDecimals, isRedeemFeeLoading]);

  const [tradingFeeIsLoading, tradingFee] = useMemo(() => {
    if (isRedeemFeeLoading) return [true, BigNumber.from(0)]
    return [
      false,
      BigNumber
        .from(parseUnits(`${collateralValue}`, tokenDecimals))
        .sub(collateralOutMinAfterFee)
    ]
  }, [collateralValue, tokenDecimals, collateralOutMinAfterFee, isRedeemFeeLoading]);

  const redeemARTH = useRedeemARTH(
    selectedCollateral,
    BigNumber.from(parseUnits(`${arthValue}`, 18)),
    BigNumber.from(parseUnits(`${arthxValue}`, 18)),
    collateralOutMinAfterFee
  );

  const stabilityFeeAmount = useMemo(() => {
    return BigNumber
      .from(parseUnits(`${arthValue}`, 18))
      .mul(stabilityFee)
      .div(1e6);
  }, [arthValue, stabilityFee]);

  const handleRedeem = () => {
    redeemARTH(() => {
      setOpenModal(2);
      setSuccessModal(true);
    });
  };

  const isWalletConnected = !!account;
  const isMAHAApproving = mahaApproveStatus === ApprovalState.PENDING;
  const isMAHAApproved = mahaApproveStatus === ApprovalState.APPROVED;

  const isArthApproved = arthApproveStatus === ApprovalState.APPROVED;
  const isArthApproving = arthApproveStatus === ApprovalState.PENDING;

  const isArthxApproved = arthxApproveStatus === ApprovalState.APPROVED;
  const isArthxApproving = arthxApproveStatus === ApprovalState.PENDING;

  const isArthMahaArthxApproved = useMemo(() => {
    if (stabilityFeeAmount.lte(0) && Number(arthValue) && Number(arthxValue)) 
      return !!account && isArthApproved && isArthxApproved;
    if (stabilityFeeAmount.gt(0) && !Number(arthValue) && Number(arthxValue)) 
      return !!account && isArthApproved && isArthxApproved;
    if (stabilityFeeAmount.gt(0) && Number(arthValue) && !Number(arthxValue))
      return !!account && isArthApproved && isArthApproved;

    return isArthApproved && isMAHAApproved && isArthxApproved && !!account;
  }, [
    account,
    isMAHAApproved,
    isArthApproved,
    stabilityFeeAmount,
    arthValue,
    isArthxApproved,
    arthxValue
  ]);

  const onCollateralValueChange = async (val: string) => {
    if (val === '' || arthxPrice.lte(0) || isCollateralPriceLoading || isARTHXLoading) {
      setCollateralValue('0');
      setArthValue('0');
      setArthxValue('0');
      return;
    }

    const check: boolean = ValidateNumber(val);
    setCollateralValue(check ? val : String(Number(val)));
    if (!check) return;
    const valueInNumber: number = Number(val);
    if (!valueInNumber) return;

    const bnCollateralAmount = BigNumber.from(
      parseUnits(`${valueInNumber}`, tokenDecimals)
    );
    const bnMissingDecimals = BigNumber.from(10).pow(18 - tokenDecimals);

    const totalCollateralValue = collateralToGMUPrice
      .mul(bnCollateralAmount)
      .mul(bnMissingDecimals)
      .div(1e6);

    const finalArthValue = totalCollateralValue
      .mul(arthRatio)
      .div(1e6)

    const finalArthxValue = totalCollateralValue
      .mul(arthxRatio)
      .mul(1e6)
      .div(1e6)
      .div(arthxPrice);

    setArthValue(getDisplayBalance(finalArthValue, 18, tokenDecimals));
    setArthxValue(getDisplayBalance(finalArthxValue, 18, tokenDecimals));
  };

  const onARTHValueChange = async (val: string) => {
    if (val === '' || arthxPrice.lte(0) || arthRatio.lte(0) || collateralToGMUPrice.lte(0) || isCollateralPriceLoading || isARTHXLoading) {
      setCollateralValue('0');
      setArthValue('0');
      setArthxValue('0');
      return;
    }

    let check: boolean = ValidateNumber(val);
    setArthValue(check ? val : String(Number(val)));
    if (!check) return;
    const valueInNumber: number = Number(val);
    if (!valueInNumber) return;

    const bnArthValue = BigNumber.from(parseUnits(`${valueInNumber}`, 18));
    const bnMissingDecimals = BigNumber.from(10).pow(18 - tokenDecimals);

    const finalCollateralValueD18 = bnArthValue
      .mul(1e6)
      .div(arthRatio);

    const finalArthxValue = finalCollateralValueD18
      .sub(bnArthValue)
      .mul(1e6)
      .div(arthxPrice);

    const finalCollateralValue = finalCollateralValueD18
      .mul(1e6)
      .div(collateralToGMUPrice)
      .div(bnMissingDecimals);

    setArthxValue(getDisplayBalance(finalArthxValue, 18, tokenDecimals));
    setCollateralValue(getDisplayBalance(finalCollateralValue, tokenDecimals, tokenDecimals));
  };

  const onARTHXValueChange = async (val: string) => {
    if (val === '' || arthxRatio.lte(0) || collateralToGMUPrice.lte(0) || isCollateralPriceLoading || isARTHXLoading) {
      setCollateralValue('0');
      setArthValue('0');
      setArthxValue('0');
      return;
    }

    let check: boolean = ValidateNumber(val);
    setArthxValue(check ? val : String(Number(val)));
    if (!check) return;
    const valueInNumber: number = Number(val);
    if (!valueInNumber) return;

    const bnArthxValue = BigNumber.from(parseUnits(`${valueInNumber}`, 18));
    const bnMissingDecimals = BigNumber.from(10).pow(18 - tokenDecimals);
    const bnARTHXGMUValue = bnArthxValue.mul(arthxPrice).div(1e6);

    const finalCollateralValueD18 = bnARTHXGMUValue
      .mul(1e6)
      .div(arthxRatio);

    const finalArthValue = finalCollateralValueD18.sub(bnARTHXGMUValue)

    const finalCollateralValue = finalCollateralValueD18
      .mul(1e6)
      .div(collateralToGMUPrice)
      .div(bnMissingDecimals);

    setArthValue(getDisplayBalance(finalArthValue, 18, tokenDecimals));
    setCollateralValue(getDisplayBalance(finalCollateralValue, tokenDecimals, tokenDecimals));
  };

  return (
    <>
      <CustomModal
        closeButton
        handleClose={() => setOpenModal(0)}
        open={openModal === 1}
        modalTitleStyle={{}}
        modalContainerStyle={{}}
        modalBodyStyle={{}}
        title={`Confirm Redeem ARTH`}
      >
        <>
          <TransparentInfoDiv
            labelData={`Your ARTH redeem amount`}
            rightLabelUnit={'ARTH'}
            rightLabelValue={Number(arthValue).toLocaleString()}
          />

          <TransparentInfoDiv
            labelData={`Your ARTHX redeem amount`}
            rightLabelUnit={'ARTHX'}
            rightLabelValue={Number(arthxValue).toLocaleString()}
          />

          <TransparentInfoDiv
            labelData={`Trading Fee`}
            rightLabelUnit={selectedCollateral}
            rightLabelValue={
              Number(getDisplayBalance(tradingFee, tokenDecimals))
                .toLocaleString('en-US', { maximumFractionDigits: tokenDecimals })
            }
          />

          <TransparentInfoDiv
            labelData={`Stability Fee`}
            rightLabelUnit={'MAHA'}
            rightLabelValue={
              Number(getDisplayBalance(stabilityFeeAmount, 18, 3))
                .toLocaleString('en-US', { maximumFractionDigits: 2 })
            }
          />

          <Divider
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              margin: '15px 0px',
            }}
          />

          <TransparentInfoDiv
            labelData={`You will receive collateral`}
            labelToolTipData={'testing'}
            rightLabelUnit={selectedCollateral}
            rightLabelValue={Number(collateralValue).toLocaleString()}
          />

          <div
            style={{
              flexDirection: 'column-reverse',
              display: 'flex',
              width: '100%',
              marginTop: '10%',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <div style={{ flex: 1, width: '100%', marginTop: 10 }}>
              <Button
                variant={'transparent'}
                text="Cancel"
                size={'lg'}
                onClick={() => {
                  setOpenModal(0);
                  let options = {
                    content: () =>
                      CustomSnack({
                        onClose: props.closeSnackbar,
                        type: 'red',
                        data1: `Redeeming ${Number(arthValue).toLocaleString()} ARTH cancelled`,
                      }),
                  };
                  props.enqueueSnackbar('timepass', options);
                }}
              />
            </div>
            <div style={{ width: '100%' }}>
              <Button
                disabled={
                  redeemCR.lte(1e6) ||
                  isInputFieldError ||
                  !isArthMahaArthxApproved ||
                  !Number(collateralValue) ||
                  !Number(arthValue)
                }
                text={'Redeem ARTH'}
                size={'lg'}
                onClick={handleRedeem}
              />
            </div>
          </div>
        </>
      </CustomModal>
      <Grid container style={{ marginTop: '24px' }} spacing={2}>
        <Grid item lg={1} />
        <Grid item lg={5} md={12} sm={12} xs={12}>
          <LeftTopCard className={'custom-mahadao-container'}>
            <LeftTopCardHeader className={'custom-mahadao-container-header'}>
              <div style={{ display: 'flex' }}>
                <TabContainer onClick={() => props.setType('mint')}>
                  <TabText>Mint</TabText>
                </TabContainer>
                <TabContainer onClick={() => props.setType('redeem')}>
                  <ActiveTab />
                  <TabTextActive>Redeem</TabTextActive>
                </TabContainer>
              </div>
              <SlippageContainer />
            </LeftTopCardHeader>
            <LeftTopCardContainer className={'custom-mahadao-container-content'}>
              <CustomInputContainer
                ILabelValue={'Enter Redeem Amount'}
                IBalanceValue={`${getDisplayBalance(arthBalance)}`}
                isBalanceLoading={isARTHBalanceLoading}
                ILabelInfoValue={''}
                DefaultValue={arthValue.toString()}
                LogoSymbol={'ARTH'}
                disabled={redeemCR.lte(1e6) || isARTHBalanceLoading}
                hasDropDown={false}
                SymbolText={'ARTH'}
                inputMode={'decimal'}
                setText={onARTHValueChange}
                tagText={'MAX'}
                errorCallback={(flag: boolean) => { setIsInputFieldError(flag) }}
                DisableMsg={
                  redeemCR.lte(1e6)
                    ? 'Currently Redeem Collateral ratio is not 100%'
                    : ''
                }
                tokenDecimals={18}
              />
              <PlusMinusArrow>
                <img src={plusSign} alt="plus" />
              </PlusMinusArrow>
              <CustomInputContainer
                ILabelValue={'Enter ARTHX Amount'}
                IBalanceValue={`${getDisplayBalance(arthxBalance)}`}
                isBalanceLoading={isARTHXBalanceLoading}
                ILabelInfoValue={''}
                DefaultValue={arthxValue.toString()}
                LogoSymbol={'ARTHX'}
                disabled={redeemCR.lte(1e6) || isARTHXBalanceLoading || isARTHXLoading}
                hasDropDown={false}
                SymbolText={'ARTHX'}
                inputMode={'decimal'}
                setText={onARTHXValueChange}
                tagText={'MAX'}
                errorCallback={(flag: boolean) => { setIsInputFieldError(flag) }}
                DisableMsg={
                  redeemCR.lte(1e6)
                    ? 'Currently Redeem Collateral ratio is not 100%'
                    : ''
                }
                tokenDecimals={18}
              />
              <PlusMinusArrow>
                <img src={arrowDown} alt="arrow" />
              </PlusMinusArrow>
              <CustomInputContainer
                ILabelValue={'You receive'}
                IBalanceValue={`${getDisplayBalance(collateralBalance, tokenDecimals)}`}
                isBalanceLoading={isCollateralBalanceLoading}
                DefaultValue={collateralValue.toString()}
                LogoSymbol={selectedCollateral}
                hasDropDown={true}
                setText={onCollateralValueChange}
                dropDownValues={collateralTypes}
                ondropDownValueChange={(data) => {
                  setSelectedReceiveRedeemCoin(data);
                  // setTimeout(() => {
                  //   onCollateralValueChange(collateralValue.toString());
                  // }, 1000);
                }}
                disabled={redeemCR.lte(1e6) || isCollateralBalanceLoading || isCollateralPriceLoading}
                SymbolText={selectedCollateral}
                DisableMsg={
                  redeemCR.lte(1e6)
                    ? 'Currently Redeem Collateral ratio is not 100%'
                    : ''
                }
                tokenDecimals={tokenDecimals}
              />
              <div>
                <OneLineInputwomargin>
                  <div style={{ flex: 1, marginTop: 10 }}>
                    <TextWithIcon>Trading Fee</TextWithIcon>
                  </div>
                  <OneLineInputwomargin>
                    <BeforeChip>
                      {
                        tradingFeeIsLoading
                          ? <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
                          : Number(getDisplayBalance(tradingFee, tokenDecimals))
                            .toLocaleString('en-US', { maximumFractionDigits: tokenDecimals })
                      }
                    </BeforeChip>
                    <TagChips>{selectedCollateral}</TagChips>
                  </OneLineInputwomargin>
                </OneLineInputwomargin>

                <OneLineInput>
                  <div style={{ flex: 1 }}>
                    <TextWithIcon>
                      Stability Fee
                    </TextWithIcon>
                  </div>
                  <OneLineInput>
                    <BeforeChip>
                      {
                        Number(getDisplayBalance(stabilityFeeAmount, 18, 3))
                          .toLocaleString('en-US', { maximumFractionDigits: 2 })
                      }
                    </BeforeChip>
                    <TagChips>MAHA</TagChips>
                  </OneLineInput>
                </OneLineInput>
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
                    <ApproveButtonContainer>
                      <Button
                        text={
                          isArthApproved
                            ? `Approved ARTH`
                            : !isArthApproving
                              ? `Approve ARTH`
                              : 'Approving...'
                        }
                        size={'lg'}
                        disabled={
                          redeemCR.lte(1e6) ||
                          isInputFieldError ||
                          isArthApproved ||
                          !Number(arthValue)
                        }
                        onClick={approveCollat}
                        loading={isArthApproving}
                      />
                      <div style={{ padding: 5 }} />
                      <Button
                        text={
                          isMAHAApproved
                            ? 'Approved MAHA'
                            : !isMAHAApproving
                              ? `Approve MAHA`
                              : 'Approving...'
                        }
                        size={'lg'}
                        disabled={
                          redeemCR.lte(1e6) ||
                          isInputFieldError ||
                          isMAHAApproved ||
                          stabilityFeeAmount.lte(0)
                        }
                        onClick={approveMAHA}
                        loading={isMAHAApproving}
                      />
                    </ApproveButtonContainer>
                    <br />
                    <ApproveButtonContainer>
                      <Button
                        text={
                          isArthxApproved
                            ? `Approved ARTHX`
                            : !isArthxApproving
                              ? `Approve ARTHX`
                              : 'Approving...'
                        }
                        size={'lg'}
                        disabled={
                          redeemCR.lte(1e6) ||
                          isInputFieldError ||
                          isArthxApproved ||
                          !Number(arthxValue)
                        }
                        onClick={approveARTHX}
                        loading={isArthxApproving}
                      />
                      <div style={{ padding: 5 }} />
                      <Button
                        text={'Request Redeem'}
                        size={'lg'}
                        variant={'default'}
                        disabled={
                          redeemCR.lte(1e6) ||
                          isInputFieldError ||
                          !isArthMahaArthxApproved ||
                          !Number(collateralValue) ||
                          !Number(arthValue)
                        }
                        onClick={() => setOpenModal(1)}
                      />
                    </ApproveButtonContainer>
                    <br />
                    <Button
                      loading={isRedeemableBalancesLoading}
                      disabled={redeemableBalances[0].lte(0) && redeemableBalances[1].lte(0)}
                      text={'Redeem'}
                      size={'lg'}
                      variant={'default'}
                        onClick={() => collectRedeemption(() => {
                          onARTHXValueChange('');
                          setSuccessCollectModal(true)
                        })}
                    />
                  </>
                )}
              </div>
            </LeftTopCardContainer>
          </LeftTopCard>
        </Grid>
        <Grid item lg={5} md={12} sm={12} xs={12}>
          <PoolInfo selectedCollateralCoin={selectedCollateral} />
        </Grid>
        <Grid item lg={1} />
      </Grid>
      <CustomSuccessModal
        modalOpen={successModal}
        setModalOpen={() => setSuccessModal(false)}
        title={'Redeeming ARTH successful!'}
        subTitle={''}
        subsubTitle={'Your ARTH has now been redeemed for its underlying collateral'}
      />
      <CustomSuccessModal
        modalOpen={successCollectModal}
        setModalOpen={() => setSuccessCollectModal(false)}
        title={'Collecting redeemed collateral successful!'}
        subTitle={''}
        subsubTitle={'Your redeemed amount has now being collected'}
      />
    </>
  );
};

const OneLineInputwomargin = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
`;

const LeftTopCard = styled.div``;

const LeftTopCardHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LeftTopCardContainer = styled.div``;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 12px;
  width: 100px;
  height: 80px;
  z-index: 1;
  cursor: pointer;
`;

const TabText = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.88);
`;
const TabTextActive = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.88);
`;

const ActiveTab = styled.div`
  position: absolute;
  width: 100px;
  padding: 32px 12px;
  background: linear-gradient(180deg, rgba(244, 127, 87, 0) 0%, #fd565620);
  height: 80px;
  z-index: 0;
  border-bottom: 2px solid #fd5656;
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

const OneLineInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
  margin: 5px 0 10px 0;
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

const ApproveButtonContainer = styled.div`
  display: flex;
`;

export default withSnackbar(RedeemTabContent);
