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
import TransparentInfoDiv from '../../components/CustomTransparentInfoDiv/InfoDiv';

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
      <GradientDiv />
      <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '80px 0px',
        }}>
        <PageHeading>{'GENESIS IS OVER'}</PageHeading>
      </div>
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
