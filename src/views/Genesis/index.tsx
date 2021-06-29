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

import ConnectionNotice from './ConnectionNotice';
import calendar from '../../assets/svg/calendar.svg';
import arrowDown from '../../assets/svg/arrowDown.svg';
import TicketGreen from '../../assets/svg/TicketGreen.svg';

import Button from '../../components/Button';
import Container from '../../components/Container';
import TransparentInfoDiv from './components/InfoDiv';
import CustomModal from '../../components/CustomModal';
import { CustomSnack } from '../../components/SnackBar';
import prettyNumber from '../../components/PrettyNumber';
import UnderstandMore from './components/UnderstandMore';
import CustomToolTip from '../../components/CustomTooltip';
import SlippageContainer from '../../components/SlippageContainer';
import CustomSuccessModal from '../../components/CustomSuccesModal';
import { WalletAutoConnect } from '../../components/WalletAutoConnect';
import CustomInputContainer from '../../components/CustomInputContainer';
import { ValidateNumber } from '../../components/CustomInputContainer/RegexValidation';

import useCore from '../../hooks/useCore';
import useTokenDecimals from '../../hooks/useTokenDecimals';
import { getDisplayBalance, getDisplayBalanceToken } from '../../utils/formatBalance';
import useTokenBalance from '../../hooks/state/useTokenBalance';
import useApprove, { ApprovalState } from '../../hooks/callbacks/useApprove';
import useARTHXOraclePrice from '../../hooks/state/controller/useARTHXPrice';
import useGlobalCollateralValue from '../../hooks/state/useGlobalCollateralValue';
import useARTHCirculatingSupply from '../../hooks/state/useARTHCirculatingSupply';
import useCollateralPoolPrice from '../../hooks/state/pools/useCollateralPoolPrice';
import usePerformRecollateralize from '../../hooks/callbacks/performRecollateralize';
import usePercentageCompleted from '../../hooks/state/controller/usePercentageCompleted';
import useRedeemAlgorithmicARTH from '../../hooks/callbacks/pools/useRedeemAlgorithmicARTH';
import useRecollateralizationDiscount from '../../hooks/state/controller/useRecollateralizationDiscount';
import config from '../../config';
import DepositModal from './components/DepositModal';
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

const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 10,
      borderRadius: 5,
      width: 200,
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
      borderRadius: 5,
      backgroundColor: '#F7653B',
    },
  }),
)(LinearProgress);

const Genesis = (props: WithSnackbarProps) => {
  const [depositModal, setdepositModal] = useState<boolean>(false);
  const [calendarLink, setLink] = useState('');
  const [arthValue, setArthValue] = useState<string>('0');
  const [openModal, setOpenModal] = useState<0 | 1 | 2>(0);
  const [type, setType] = useState<'Commit' | 'Swap'>('Commit');
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [collateralValue, setCollateralValue] = useState<string>('0');
  const [timerHeader, setHeader] = useState<boolean>(false);
  const [isInputFieldError, setIsInputFieldError] = useState<boolean>(false);
  const isMobile = useMediaQuery({ maxWidth: '600px' });

  const core = useCore();
  const { account, connect } = useWallet();
  const collateralTypes = useMemo(() => core.getCollateralTypes(), [core]);
  const [selectedCollateral, setSelectedCollateralCoin] = useState(core.getDefaultCollateral());
  const tokenDecimals = useTokenDecimals(selectedCollateral);
  const collateralGenesis = core.getCollatearalGenesis(selectedCollateral);

  const [totalArthsupply, setTotalArthsupply] = useState<{
    totalArthsupplyLoading: boolean;
    value: number;
  }>({
    totalArthsupplyLoading: true,
    value: 0,
  });
  const [totalCollateralCommitted, setTotalCollateralCommitted] = useState<{
    totalCollateralCommittedLoading: boolean;
    value: number;
  }>({
    totalCollateralCommittedLoading: true,
    value: 0,
  });
  const [totalPercentageCompleted, setTotalPercentageCompleted] = useState<{
    totalPercentageCompletedLoading: boolean;
    value: number;
  }>({
    totalPercentageCompletedLoading: true,
    value: 0,
  });

  const { isLoading: isARTHXPriceLoading, value: arthxPrice } = useARTHXOraclePrice();
  const {
    isLoading: isRecollateralizationDiscountLoading,
    value: recollateralizationDiscount,
  } = useRecollateralizationDiscount();
  const { isLoading: isARTHBalanceLoading, value: arthBalance } = useTokenBalance(core.ARTH);
  const {
    isLoading: isARTHCirculatingSupplyLoading,
    value: arthCirculatingSupply,
  } = useARTHCirculatingSupply();
  const { isLoading: isCollateralBalanceLoading, value: collateralBalnace } = useTokenBalance(
    core.tokens[selectedCollateral],
  );
  const {
    isLoading: isCommitedCollateralLoading,
    value: committedCollateral,
  } = useGlobalCollateralValue();
  const {
    isLoading: isPercentageCompletedLoading,
    value: percentageCompleted,
  } = usePercentageCompleted();
  const {
    isLoading: isCollateralPriceLoading,
    value: collateralGMUPrice,
  } = useCollateralPoolPrice(selectedCollateral);

  WalletAutoConnect();

  useEffect(() => {
    const onClick = () => {
      let event: TCalendarEvent = {
        name: 'ARTH-v2 Genesis',
        location: 'Online',
        details: 'Genesis',
        startsAt: new Date('1 may 2021 12:30:00').toString(),
        endsAt: new Date('1 may 2021 20:30:00').toString(),
      };
      setLink(makeUrls(event).google);
    };

    window.scrollTo(0, 0);
    onClick();
  }, []);

  useEffect(() => {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers':
        'access-control-allow-headers,access-control-allow-methods,access-control-allow-origin,content-type',
    };

    fetch('https://api.arthcoin.com/api/collateral/totalCollateral', { headers })
      .then((res: any) => res.json())
      .then((data: { collateralRaised: number }) => {
        setTotalCollateralCommitted({
          totalCollateralCommittedLoading: false,
          value: data.collateralRaised,
        });
      });

    fetch('https://api.arthcoin.com/api/collateral/arthsupply', { headers })
      .then((res: any) => res.json())
      .then((data: { arthsupply: number }) => {
        setTotalArthsupply({
          totalArthsupplyLoading: false,
          value: data.arthsupply,
        });
      });
  }, []);

  useEffect(() => {
    if (
      !totalArthsupply.totalArthsupplyLoading &&
      !totalCollateralCommitted.totalCollateralCommittedLoading &&
      totalArthsupply.value !== 0
    ) {
      const temp = (totalCollateralCommitted.value / totalArthsupply.value) * 100;
      setTotalPercentageCompleted({
        totalPercentageCompletedLoading: false,
        value: temp,
      });
    }
  }, [
    totalArthsupply.totalArthsupplyLoading,
    totalArthsupply.value,
    totalCollateralCommitted.totalCollateralCommittedLoading,
    totalCollateralCommitted.value,
  ]);

  const calcDiscountOnCommit = (amount: BigNumber, discount: BigNumber) =>
    amount.mul(discount).div(1e6);

  const calcExpectReceiveAmount = (
    inAssetPrice: BigNumber,
    outAssetprice: BigNumber,
    amount: number | string,
    inAssetDecimals: number,
    outAssetDecimals: number,
  ) =>
    inAssetPrice
      .mul(BigNumber.from(parseUnits(`${amount}`, inAssetDecimals)))
      .mul(BigNumber.from(10).pow(outAssetDecimals - inAssetDecimals))
      .div(outAssetprice);

  const arthxRecieve = useMemo(() => {
    if (isARTHXPriceLoading || isCollateralPriceLoading) return BigNumber.from(0);
    if (arthxPrice.lte(0)) return BigNumber.from(0);

    if (type === 'Commit' && Number(collateralValue))
      return calcExpectReceiveAmount(
        collateralGMUPrice,
        arthxPrice,
        collateralValue,
        tokenDecimals,
        18,
      );

    return calcExpectReceiveAmount(BigNumber.from(1e6), arthxPrice, Number(arthValue), 18, 18);
  }, [
    arthValue,
    collateralGMUPrice,
    arthxPrice,
    collateralValue,
    tokenDecimals,
    type,
    isCollateralPriceLoading,
    isARTHXPriceLoading,
  ]);

  const lotteryAmount = useMemo(() => {
    if (isCollateralPriceLoading) return BigNumber.from(0);
    if (!collateralValue || collateralGMUPrice.lte(0)) return BigNumber.from(0);
    const gmuCollateralValue = BigNumber.from(parseUnits(collateralValue, tokenDecimals));
    return gmuCollateralValue.mul(collateralGMUPrice).div(1000).div(1e6);
  }, [collateralValue, collateralGMUPrice, tokenDecimals, isCollateralPriceLoading]);

  const arthxDiscount = useMemo(() => {
    if (arthxPrice.lte(0)) return BigNumber.from(0);
    return calcDiscountOnCommit(arthxRecieve, recollateralizationDiscount);
  }, [arthxRecieve, arthxPrice, recollateralizationDiscount]);

  const totalArthxRecieve = useMemo(() => {
    return arthxRecieve.add(arthxDiscount);
  }, [arthxDiscount, arthxRecieve]);

  const currentCoin = type === 'Commit' ? selectedCollateral : 'ARTH';
  const currentToken = core.tokens[currentCoin];
  const currentValue = type === 'Commit' ? collateralValue : arthValue;

  const [approveStatus, approve] = useApprove(currentToken, collateralGenesis.address);

  const redeemARTH = useRedeemAlgorithmicARTH(
    selectedCollateral,
    BigNumber.from(parseUnits(`${arthValue}`, 18)),
    arthxRecieve,
  );

  const recollateralize = usePerformRecollateralize(
    selectedCollateral,
    BigNumber.from(parseUnits(collateralValue, tokenDecimals)),
    totalArthxRecieve,
  );

  const understandMore = [
    'Users can either commit collateral or swap ARTH to receive ARTHX.',
    'ARTHX is minted whenever a user deposits collateral to mint ARTH.',
    'ARTHX is burnt whenever a user redeems ARTH for the underlying collateral',
    'The discount follows a bonding curve and decreases over time as more collateral is committed.',
  ];

  const isApproved = approveStatus === ApprovalState.APPROVED;
  const isApproving = approveStatus === ApprovalState.PENDING;

  const showDepositWETH = config.blockchainToken === currentCoin.replace('W', '');

  return (
    <>
      <CustomSuccessModal
        modalOpen={openModal === 2}
        setModalOpen={() => setOpenModal(0)}
        title={type === 'Commit' ? 'Committing collateral!' : 'Swapping ARTH'}
        subsubTitle={
          'Your transaction is now being mined on the blockchain. You should consider adding collateral to earn NFT rewards.'
        }
      // buttonText={'Stake your ARTHX'}
      // buttonType={'default'}
      // buttonTo={'/farming'}
      />
      <CustomModal
        closeButton
        handleClose={() => setOpenModal(0)}
        open={openModal === 1}
        modalTitleStyle={{}}
        modalContainerStyle={{}}
        modalBodyStyle={{}}
        title={`Confirm ${type}`}
      >
        <>
          <TransparentInfoDiv
            labelData={`You will transfer`}
            rightLabelUnit={currentCoin}
            rightLabelValue={Number(currentValue).toLocaleString()}
          />
          <Divider style={{ background: 'rgba(255, 255, 255, 0.08)', margin: '15px 0px' }} />
          <TransparentInfoDiv
            labelData={`You will receive`}
            rightLabelUnit={'ARTHX'}
            rightLabelValue={Number(
              getDisplayBalance(type === 'Commit' ? totalArthxRecieve : arthxRecieve, 18, 3),
            ).toLocaleString()}
          />
          <Grid
            container
            spacing={2}
            style={{
              marginTop: '32px',
              display: 'flex',
              flexDirection: isMobile ? 'column-reverse' : 'row',
            }}
          >
            <Grid item lg={6} md={6} sm={12} xs={12}>
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
                        data1: `${type} ${Number(
                          currentValue,
                        ).toLocaleString()} ${currentCoin} cancelled`,
                      }),
                  };
                  props.enqueueSnackbar('timepass', options);
                }}
                tracking_id={
                  type === 'Commit' ? 'cancel_commit_collateral' : 'cancel_swap_arth'
                }
                value={
                  type === 'Commit'
                    ? { value: collateralValue, collateral: selectedCollateral }
                    : { value: arthValue, collateral: selectedCollateral }
                }
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Button
                disabled={
                  percentageCompleted.gt(BigNumber.from(10).pow(18)) ||
                  isInputFieldError ||
                  (type === 'Commit' ? !Number(collateralValue) : !Number(arthValue)) ||
                  !Number(currentValue) ||
                  (type === 'Commit' ? !Number(totalArthxRecieve) : !Number(arthxRecieve))
                }
                text={type === 'Commit' ? 'Commit Collateral' : 'Swap ARTH'}
                size={'lg'}
                onClick={() => {
                  if (type === 'Commit') recollateralize(() => setOpenModal(2));
                  else redeemARTH(() => setOpenModal(2));
                }}
                tracking_id={
                  type === 'Commit' ? 'confirm_commit_collateral' : 'confirm_swap_arth'
                }
                value={
                  type === 'Commit'
                    ? { value: collateralValue, collateral: selectedCollateral }
                    : { value: arthValue, collateral: selectedCollateral }
                }
              />
            </Grid>
          </Grid>
        </>
      </CustomModal>
      <GradientDiv />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 0px',
        }}
      >
        <PageHeading>{timerHeader ? 'JOIN THE GENESIS' : 'GENESIS'}</PageHeading>

        {!timerHeader ? (
          <PageSubHeading>
            {/* <div style={{}}>
            <BorderLinearProgress
              variant="determinate"
              value={
                percentageCompleted.gt(BigNumber.from(10).pow(18))
                  ? 100
                  : Number(getDisplayBalance(percentageCompleted, 16, 3))
              }
            />
          </div>
          <HeaderSpan>
            {isPercentageCompletedLoading ? <Loader color={'#ffffff'} loading={true} size={8} margin={2} /> : Number(getDisplayBalance(percentageCompleted, 16, 3)).toLocaleString('en-US', {
                maximumFractionDigits: 2,
              })}
            % Completed
          </HeaderSpan>*/}

            <div style={{}}>
              <BorderLinearProgress
                variant="determinate"
                value={totalPercentageCompleted.value}
              />
            </div>
            <HeaderSpan>
              {totalPercentageCompleted.totalPercentageCompletedLoading ? (
                <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
              ) : (
                totalPercentageCompleted.value.toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                })
              )}
              % Completed
            </HeaderSpan>
          </PageSubHeading>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <PageSubHeading>
              <StartsIn>Starts in</StartsIn>
              <Countdown
                date={new Date(config.genesisLaunchDate)}
                renderer={({ days, hours, minutes, seconds, completed }) => {
                  return (
                    <HeaderSpan>
                      {days}d : {hours}h : {minutes}m : {seconds}s
                    </HeaderSpan>
                  );
                }}
              />
            </PageSubHeading>
            {calendarLink && (
              <HeaderButton onClick={() => window.open(calendarLink, '_blank')}>
                <img src={calendar} alt="calendar" height={24} />
                <span style={{ marginLeft: 8 }}>Add to Calendar</span>
              </HeaderButton>
            )}
          </div>
        )}

        <br />

        {/* <ConnectionNote>Connect/Switch network popup here</ConnectionNote> */}
      </div>
      <Container size="lg">
        <Grid container style={{}} spacing={2}>
          <Grid item lg={1} />
          <Grid item lg={5} md={12} sm={12} xs={12}>
            <CustomInfoCard className={'custom-mahadao-box'}>
              <CustomInfoCardDetails>
                <OneLineInputwomargin style={{ marginBottom: '20px' }}>
                  <TextForInfoTitle>
                    ARTH Circulating Supply
                    <CustomToolTip toolTipText={'The amount of ARTH already in circulation.'} />
                  </TextForInfoTitle>
                  <BeforeChipDark>
                    {/*{isARTHCirculatingSupplyLoading ? <Loader color={'#ffffff'} loading={true} size={8} margin={2} /> : prettyNumber(getDisplayBalance(arthCirculatingSupply))}*/}
                    {totalArthsupply.totalArthsupplyLoading ? (
                      <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
                    ) : (
                      prettyNumber(totalArthsupply.value)
                    )}
                  </BeforeChipDark>
                </OneLineInputwomargin>
                <OneLineInputwomargin>
                  <TextForInfoTitle>
                    Committed Collateral
                    <CustomToolTip
                      toolTipText={'$GMU worth of collateral currently in the protocol.'}
                    />
                  </TextForInfoTitle>
                  <BeforeChipDark>
                    {/*{isCommitedCollateralLoading ? <Loader color={'#ffffff'} loading={true} size={8} margin={2} /> : prettyNumber(getDisplayBalance(committedCollateral, 18))}*/}
                    {totalCollateralCommitted.totalCollateralCommittedLoading ? (
                      <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
                    ) : (
                      prettyNumber(totalCollateralCommitted.value)
                    )}
                  </BeforeChipDark>
                </OneLineInputwomargin>
              </CustomInfoCardDetails>
            </CustomInfoCard>
            <LeftTopCard className={'custom-mahadao-container'}>
              <LeftTopCardHeader className={'custom-mahadao-container-header'}>
                <div style={{ display: 'flex', flex: '1' }}>
                  <TabContainer
                    onClick={() => {
                      if (type !== 'Commit') {
                        Mixpanel.track(`buttonClick:commitCollateral_tab`);
                        setType('Commit');
                      }
                    }}
                    id={'commitCollateral_tab'}
                  >
                    {type === 'Commit' && <ActiveTab />}
                    {type !== 'Commit' ? (
                      <TabText>Commit Collateral</TabText>
                    ) : (
                      <TabTextActive>Commit Collateral</TabTextActive>
                    )}
                  </TabContainer>
                  <TabContainer
                    onClick={() => {
                      if (type !== 'Swap') {
                        Mixpanel.track(`buttonClick:swap_tab`);
                        setType('Swap');
                      }
                    }}
                    id={'swap_tab'}
                  >
                    {type === 'Swap' && <ActiveTab />}
                    {type !== 'Swap' ? (
                      <TabText>Swap ARTH</TabText>
                    ) : (
                      <TabTextActive>Swap ARTH</TabTextActive>
                    )}
                  </TabContainer>
                  <SlippageContainer />
                </div>
              </LeftTopCardHeader>
              <LeftTopCardContainer className={'custom-mahadao-container-content'}>
                {type === 'Commit' ? (
                  <CustomInputContainer
                    ILabelValue={'Enter Collateral'}
                    IBalanceValue={getDisplayBalanceToken(collateralBalnace, currentToken)}
                    isBalanceLoading={isCollateralBalanceLoading}
                    ILabelInfoValue={''}
                    DefaultValue={collateralValue.toString()}
                    LogoSymbol={selectedCollateral}
                    hasDropDown={true}
                    dropDownValues={collateralTypes}
                    ondropDownValueChange={setSelectedCollateralCoin}
                    SymbolText={selectedCollateral}
                    inputMode={'numeric'}
                    disabled={
                      percentageCompleted.gt(BigNumber.from(10).pow(18)) ||
                      isCollateralBalanceLoading
                    }
                    setText={(val: string) => {
                      setCollateralValue(ValidateNumber(val) ? val : '0');
                    }}
                    tagText={'MAX'}
                    errorCallback={(flag: boolean) => {
                      setIsInputFieldError(flag);
                    }}
                    DisableMsg={
                      percentageCompleted.gt(BigNumber.from(10).pow(18))
                        ? 'Currently Genesis is 100% Completed'
                        : ''
                    }
                  />
                ) : (
                  <CustomInputContainer
                    ILabelValue={'Enter ARTH'}
                    IBalanceValue={getDisplayBalance(arthBalance)}
                    isBalanceLoading={isARTHBalanceLoading}
                    ILabelInfoValue={''}
                    DefaultValue={arthValue.toString()}
                    LogoSymbol={'ARTH'}
                    hasDropDown={false}
                    SymbolText={'ARTH'}
                    disabled={
                      percentageCompleted.gt(BigNumber.from(10).pow(18)) || isARTHBalanceLoading
                    }
                    inputMode={'numeric'}
                    setText={(val: string) => {
                      setArthValue(ValidateNumber(val) ? val : '0');
                    }}
                    tagText={'MAX'}
                    errorCallback={(flag: boolean) => {
                      setIsInputFieldError(flag);
                    }}
                    DisableMsg={
                      percentageCompleted.gt(BigNumber.from(10).pow(18))
                        ? 'Currently Genesis is 100% Completed'
                        : ''
                    }
                  />
                )}
                <PlusMinusArrow>
                  <img src={arrowDown} alt={'Arrow down'} />
                </PlusMinusArrow>
                <div style={{ marginBottom: '32px' }}>
                  <TextWithIcon style={{ marginBottom: '12px' }}>You Receive</TextWithIcon>
                  <ReceiveContainer>
                    <OneLineInputwomargin>
                      <div style={{ flex: 1 }}>
                        <TextWithIcon>
                          ARTHX
                          <CustomToolTip
                            toolTipText={'Amount of ARTHX received for commiting collateral.'}
                          />
                        </TextWithIcon>
                      </div>
                      <OneLineInputwomargin>
                        <BeforeChip className={'custom-mahadao-chip'}>
                          {Number(
                            getDisplayBalanceToken(arthxRecieve, core.ARTHX, 3),
                          ).toLocaleString()}
                        </BeforeChip>
                        <TagChips>ARTHX</TagChips>
                      </OneLineInputwomargin>
                    </OneLineInputwomargin>
                    {type === 'Commit' && (
                      <OneLineInputwomargin>
                        <div style={{ flex: 1 }}>
                          <TextWithIcon>
                            Bonus
                            <CustomToolTip
                              toolTipText={
                                'Extra ARTHX rewarded for committing collateral when the protocol is in genesis.'
                              }
                            />
                          </TextWithIcon>
                        </div>
                        <OneLineInputwomargin>
                          <BeforeChip className={'custom-mahadao-chip'}>
                            {Number(getDisplayBalance(arthxDiscount, 18, 3)).toLocaleString()}
                          </BeforeChip>
                          <TagChips>ARTHX</TagChips>
                        </OneLineInputwomargin>
                      </OneLineInputwomargin>
                    )}
                  </ReceiveContainer>
                </div>
                {type === 'Commit' && (
                  <CustomBadgeAlert>
                    <Logo src={TicketGreen} alt="TicketBg" />
                    <Text>
                      You will get{' '}
                      {Number(
                        getDisplayBalanceToken(lotteryAmount, currentToken, 0),
                      ).toLocaleString()}{' '}
                      lottery ticket(s) to win NFT prize(s).
                    </Text>
                  </CustomBadgeAlert>
                )}
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
                  <>
                    {showDepositWETH && (
                      <>
                        <Button
                          text={`Convert your ${config.blockchainToken} into ${currentCoin}`}
                          size={'lg'}
                          onClick={() => setdepositModal(true)}
                          tracking_id={'deposit_weth'}
                        />
                        <br />
                      </>
                    )}
                    {!isApproved ? (
                      <Button
                        text={!isApproving ? `Approve ${currentCoin}` : 'Approving...'}
                        size={'lg'}
                        disabled={
                          percentageCompleted.gt(BigNumber.from(10).pow(18)) ||
                          isInputFieldError ||
                          isApproving ||
                          (type === 'Commit' && Number(collateralValue) === 0) ||
                          (type === 'Commit' &&
                            percentageCompleted.gt(BigNumber.from(10).pow(18))) ||
                          (type === 'Swap' && Number(arthValue) === 0)
                        }
                        onClick={approve}
                        loading={isApproving}
                      />
                    ) : (
                      <Button
                        text={type === 'Commit' ? 'Commit Collateral' : 'Swap ARTH is disabled'}
                        size={'lg'}
                        variant={'default'}
                        disabled={
                          percentageCompleted.gt(BigNumber.from(10).pow(18)) ||
                          isInputFieldError ||
                          (type === 'Commit'
                            ? !Number(collateralValue) ||
                            percentageCompleted.gt(BigNumber.from(10).pow(18))
                            : true) ||
                          !isApproved
                        }
                        onClick={() => setOpenModal(1)}
                        tracking_id={type === 'Commit' ? 'commit_collateral' : 'swap_arth'}
                        value={
                          type === 'Commit'
                            ? { value: collateralValue, collateral: selectedCollateral }
                            : { value: arthValue, collateral: selectedCollateral }
                        }
                      />
                    )}
                  </>
                )}
              </LeftTopCardContainer>
            </LeftTopCard>
          </Grid>
          <Grid item lg={5} md={12} sm={12} xs={12}>
            <UnderstandMore dataObj={understandMore} />
            <LotteryBox className={'custom-mahadao-box'}>
              <LotteryBoxText>
                Genesis participants can issue lottery tickets to win exciting MAHA Prizes
              </LotteryBoxText>
              <LotteryBoxAction>
                <Button
                  text={'Learn More'}
                  size={'lg'}
                  variant={'transparent'}
                  to={'/lottery'}
                  tracking_id={'learn_more_genesis_to_lottery'}
                />
              </LotteryBoxAction>
            </LotteryBox>
          </Grid>
          <Grid item lg={1} />
        </Grid>
      </Container>

      {depositModal && (
        <DepositModal onCancel={() => setdepositModal(false)} onDeposit={() => { }} />
      )}

      <CustomSuccessModal
        modalOpen={successModal}
        setModalOpen={() => setSuccessModal(false)}
        title={'Minting ARTHX successful!'}
      // subsubTitle={'You should consider stake your ARTHX to earn higher APY'}
      // subTitleLink={'/#/farming'}
      // buttonText={'Stake your ARTHX'}
      // buttonType={'default'}
      // buttonHref={'/#/farming'}
      />
    </>
  );
};

const CustomBadgeAlert = styled.div`
  border: 1px solid #20c974;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 8px;
  display: flex;
  align-items: flex-start;
  margin-bottom: 32px;
`;

const Logo = styled.img`
  width: 16px;
  height: 16px;
`;

const Text = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 130%;
  color: #20c974;
  flex: 1;
  padding-left: 10px;
  margin-bottom: 0;
`;

const GradientDiv = styled.div`
  background: linear-gradient(180deg, #2a2827 0%, rgba(42, 40, 39, 0) 100%);
  height: 270px;
  position: absolute;
  width: 100%;
  z-index: -5;
`;

const CustomInfoCard = styled.div`
  margin-bottom: 16px;
  @media (max-width: 600px) {
    margin-bottom: 24px;
  }
`;

const CustomInfoCardDetails = styled.div``;

const PageHeading = styled.p`
  font-family: Syne;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 29px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-align: center;
  color: #ffffff;
`;

const HeaderSpan = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  display: flex;
  margin: 0 0 0 8px;
  color: #ffffff;
`;

const StartsIn = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.88);
  opacity: 0.64;
`;

const PageSubHeading = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.64);
  text-align: center;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const HeaderButton = styled.div`
  background: rgba(97, 134, 242, 0.32);
  border-radius: 8px;
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.88);
  display: flex;
  flex-direction: row;
  padding: 15px;
  align-items: center;
  justify-content: space-around;
  max-width: 200px;
  cursor: pointer;
`;

const OneLineInputwomargin = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const LeftTopCard = styled.div`
  @media (max-width: 600px) {
    margin-bottom: 8px;
  }
`;

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
  height: 80px;
  z-index: 1;
  cursor: pointer;
  flex: 0.5;
  position: relative;
`;

const TabText = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.64);
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
  padding: 32px 12px;
  background: linear-gradient(180deg, rgba(244, 127, 87, 0) 0%, #fd565620);
  height: 80px;
  z-index: 0;
  border-bottom: 2px solid #fd5656;
  width: 100%;
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

const ReceiveContainer = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
`;

const TextWithIcon = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.7);
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
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.64);
  margin-right: 5px;
`;

const BeforeChipDark = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: #ffffff;
`;

const TagChips = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.64);
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 2px 4px;
`;

const LotteryBox = styled.div`
  background: radial-gradient(
      145.27% 168.64% at 130.87% -118.64%,
      #ffffff 0%,
      rgba(255, 255, 255, 0) 100%
    ),
    linear-gradient(252.98deg, #e44d75 10.74%, #eb822c 87.31%);
  margin-top: 24px;
`;

const LotteryBoxText = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.88);
  margin-bottom: 12px;
`;

const LotteryBoxAction = styled.div`
  width: 50%;
`;

const ConnectionNote = styled.div`
  width: 60%;
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

export default withSnackbar(Genesis);
