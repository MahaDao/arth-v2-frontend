import React, { useMemo } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import styled from 'styled-components';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import useTreasuryAllocationTimes from '../../../hooks/useTreasuryAllocationTimes';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import moment from 'moment';
import Button from '../../../components/Button/TransperantButton';
import useAdvanceEpoch from '../../../hooks/useAdvanceEpoch';
import { useWallet } from 'use-wallet';
import { Description, DescriptionRounded } from '@material-ui/icons';
import { Text } from 'recharts';

const useStylesFacebook = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
    },
    bottom: {
      color: '#D74D26',
      opacity: 0.32,
    },
    top: {
      color: '#F7653B',
      position: 'absolute',
      left: 0,
    },
    circle: {
      strokeLinecap: 'round',
    },
    description: {
      // paddingTop: 15,
      fontSize: 14,
      color: '#D9D5D3',
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: 300,
      lineHeight: '140%'
    }
  }),
);

const EpochTimer: React.FC = () => {
  const classes = useStylesFacebook();
  const { prevAllocation, nextAllocation, currentEpoch } = useTreasuryAllocationTimes();
  const { account, connect } = useWallet();

  const prevEpoch = useMemo(
    () =>
      nextAllocation.getTime() <= Date.now()
        ? moment().utc().startOf('day').toDate()
        : prevAllocation,
    [prevAllocation, nextAllocation],
  );

  const nextEpoch = useMemo(() => moment(nextAllocation).toDate(), [nextAllocation]);

  const percentage =
    Date.now() >= nextEpoch.getTime()
      ? 100
      : ((Date.now() - prevEpoch.getTime()) / (nextEpoch.getTime() - prevEpoch.getTime())) *
      100;

  const countdownRenderer = (countdownProps: CountdownRenderProps) => {
    const { days, hours, minutes, seconds } = countdownProps;
    const h = String(days * 24 + hours);
    const m = String(minutes);
    const s = String(seconds);
    return (
      <CurrenTimeTitle>
        {h.padStart(2, '0')}:{m.padStart(2, '0')}:{s.padStart(2, '0')}
      </CurrenTimeTitle>
    );
  };

  const advanceEpoch = useAdvanceEpoch()

  return (
    <Card>
      <div
        className="margin-bottom-20"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <TitleString>Next Epoch</TitleString>
        <CurrentEpoch>{`Current Epoch: ${currentEpoch.toFixed(0)}`}</CurrentEpoch>
      </div>
      <Text className={classes.description}>
        Based on the 1hr TWAP price, the protocol will not do anything as price is within the safe range (0.95$-1$).
      </Text>
      <br />
      <Text className={classes.description}>
        Note that the 12hr TWAP is used to decide if the supply expands or contracts.
      </Text>
      <br />
      <LearnMore href="https://docs.arthcoin.com/arth-201/dynamic-epochs" target="">
        Learn more about Epoch
      </LearnMore>
      <div className="dialog-class margin-top-30">
        <div className={classes.root}>
          <Box position="relative" display="inline-flex">
            <CircularProgress
              variant="determinate"
              className={classes.bottom}
              size={130}
              thickness={1}
              value={100}
            />
            <CircularProgress
              variant="determinate"
              value={percentage}
              size={130}
              thickness={1}
              className={classes.top}
              classes={{
                circle: classes.circle,
              }}
            />
            <Box
              top={0}
              left={0}
              bottom={0}
              right={0}
              position="absolute"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Countdown date={nextEpoch} renderer={countdownRenderer} />
            </Box>
          </Box>
        </div>
      </div>
      <div className="dialog-class">
        <div className="margin-top-30" style={{ width: '170px' }}>
          {!account ? (
            <Button onClick={() => connect('injected')} size="sm" text="Connect Wallet" />
          ) : (
              <Button onClick={advanceEpoch} disabled={percentage < 100}>
                Advance Epoch
              </Button>
            )}
        </div>
      </div>
    </Card >
  );
};


// const Desc = styled.div`
//   font-style: normal;
//   font-weight: 300;
//   font-size: 14px;
//   line-height: 140%;
//   color: #d9d5d3;
//   opacity: 0.64;
//   margin-bottom: 5px;
// `;

const CurrentEpoch = styled.div`
  background: #423b38;
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;
  line-height: 140%;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fcb400;
  flex: none;
  order: 0;
  flex-grow: 0;
  padding: 3px 10px;
  margin: 0px 10px;
`;
const TitleString = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: #ffffff;
  opacity: 0.88;
`;
const Card = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(70px);
  border-radius: 12px;
  padding: 20px;
  height: 100%;
`;

const LearnMore = styled.a`
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 140%;
  margin-top: 10px;
  cursor: pointer;
  color: #f7653b;
  opacity: 0.88;
  &:hover {
    color: #f7653b;
    opacity: 0.88;
  }
`;

const CurrenTimeTitle = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 32px;
  text-align: center;
  color: #ffffff;
`;

export default EpochTimer;
