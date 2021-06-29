import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Countdown from 'react-countdown';
import Grid from '@material-ui/core/Grid';
import {
  Checkbox,
  CheckboxProps,
  createStyles,
  LinearProgress,
  makeStyles,
  Slider,
  Theme,
  withStyles,
} from '@material-ui/core';
import { BigNumber } from '@ethersproject/bignumber';
import { withSnackbar, WithSnackbarProps } from 'notistack';

import Container from '../../components/Container';
import prettyNumber from '../../components/PrettyNumber';
import UnderstandMore from './components/UnderstandMore';
import CustomToolTip from '../../components/CustomTooltip';
import { WalletAutoConnect } from '../../components/WalletAutoConnect';

import { getDisplayBalance } from '../../utils/formatBalance';
import useARTHCirculatingSupply from '../../hooks/state/useARTHCirculatingSupply';
import useGlobalCollateralValue from '../../hooks/state/useGlobalCollateralValue';
import usePercentageCompleted from '../../hooks/state/controller/usePercentageCompleted';
import Loader from 'react-spinners/BeatLoader';
import usePrizes from '../../hooks/state/usePrizes';

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
  const { isLoading: isPercLoading, value: percentageCompleted } = usePercentageCompleted();
  const {
    isLoading: isGlobalCollateralLoading,
    value: committedCollateral,
  } = useGlobalCollateralValue();
  const {
    isLoading: isARTHCirculatingLoading,
    value: arthCirculatingSupply,
  } = useARTHCirculatingSupply();

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
      const temp = 100 - (totalCollateralCommitted.value / totalArthsupply.value) * 100;
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

  WalletAutoConnect();

  const rebasePercentage = useMemo(() => {
    const percentScale = BigNumber.from(10).pow(18);

    return percentageCompleted.gt(percentScale)
      ? BigNumber.from(0)
      : percentScale.sub(percentageCompleted);
  }, [percentageCompleted]);

  const understandMore = [
    'A Rebase is a last resort mechanism where the circulating supply of a token is adjusted so that it forces the current market price to meet the target price. The first rebase token that was introduced was Ampleforth.',
    "Rebase tokens work by changing the balance of a user's wallet so that the amount in the user's wallet changes but the net value stays the same.",
    'Rebase in the ARTH protocol is a one-time event. After the Genesis rebase, there will be no more rebase done in the future.',
  ];

  return (
    <>
      <GradientDiv />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px 0px',
        }}
      >
        <PageHeading>{'REBASE'}</PageHeading>
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <PageSubHeading>
            <StartsIn>Starts in</StartsIn>
            <Countdown
              date={new Date('2 Jul 2021 15:00:00 GMT')}
              renderer={({ days, hours, minutes, seconds, completed }) => {
                return (
                  <HeaderSpan>
                    {days}d : {hours}h : {minutes}m : {seconds}s
                  </HeaderSpan>
                );
              }}
            />
          </PageSubHeading>
        </div>
        <PageSubHeading>
          <div style={{}}>
            <BorderLinearProgress
              variant="determinate"
              /*value={
                rebasePercentage.gt(BigNumber.from(10).pow(18))
                  ? 100
                  : Number(getDisplayBalance(rebasePercentage, 16, 3))
              }*/
              value={totalPercentageCompleted.value}
            />
          </div>
          <HeaderSpan>
            {/*{Number(getDisplayBalance(rebasePercentage, 16, 3)).toLocaleString('en-US', {
              maximumFractionDigits: 2,
            })}*/}
            {totalPercentageCompleted.totalPercentageCompletedLoading ? (
              <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
            ) : (
              totalPercentageCompleted.value.toLocaleString('en-US', {
                maximumFractionDigits: 2,
              })
            )}
            % Rebase
          </HeaderSpan>
        </PageSubHeading>
        <PageSubSubHeading>For 100 ARTH it would value 80 ARTH at 20% rebase</PageSubSubHeading>
      </div>
      <Container size="lg">
        <Grid container>
          <Grid item lg={3} />
          <Grid item lg={6} md={12} sm={12} xs={12}>
            <CustomInfoCard className={'custom-mahadao-box'}>
              <CustomInfoCardDetails>
                <OneLineInputwomargin style={{ marginBottom: '20px' }}>
                  <TextForInfoTitle>
                    Remaining Amount To Be Raised
                    <CustomToolTip
                      toolTipText={
                        '$GMU worth of collateral yet to be raised for the protocol to reach the desired collateral ratio.'
                      }
                    />
                  </TextForInfoTitle>
                  <BeforeChipDark>
                    {/*{isARTHCirculatingLoading && isGlobalCollateralLoading ? (
                      <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
                    ) : (
                      prettyNumber(
                        getDisplayBalance(
                          arthCirculatingSupply.lt(committedCollateral)
                            ? BigNumber.from(0)
                            : arthCirculatingSupply.sub(committedCollateral),
                        ),
                      )
                    )}*/}

                    {totalPercentageCompleted.totalPercentageCompletedLoading ? (
                      <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
                    ) : (
                      prettyNumber(totalArthsupply.value - totalCollateralCommitted.value)
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
                    {/*{isGlobalCollateralLoading ? (
                      <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
                    ) : (
                      prettyNumber(getDisplayBalance(committedCollateral, 18))
                    )}*/}
                    {totalCollateralCommitted.totalCollateralCommittedLoading ? (
                      <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
                    ) : (
                      prettyNumber(totalCollateralCommitted.value)
                    )}
                  </BeforeChipDark>
                </OneLineInputwomargin>
              </CustomInfoCardDetails>
            </CustomInfoCard>
            <UnderstandMore dataObj={understandMore} />
          </Grid>
          <Grid item lg={3} />
        </Grid>
      </Container>
    </>
  );
};

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

const StyledNavLink = styled(Link)`
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
  margin-bottom: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const PageSubSubHeading = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 130%;
  text-align: center;
  color: rgba(255, 255, 255, 0.88);
  margin-bottom: 20px;
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

const ToolTipFont = styled.p`
  padding: 0;
  margin: 0;
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

export default withSnackbar(Genesis);
