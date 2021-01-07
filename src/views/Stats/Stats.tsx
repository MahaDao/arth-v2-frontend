import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import Spacer from '../../components/Spacer';
import HomeCard from './components/HomeCard';
import { OverviewData } from './types';
import useBasisCash from '../../hooks/useBasisCash';
import config from '../../config';
import StastIcon from './stats.png';

import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useTreasuryAmount from '../../hooks/useTreasuryAmount';
import Humanize from 'humanize-plus';
import { getBalance, getDisplayBalance } from '../../utils/formatBalance';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useFundAmount from '../../hooks/useFundAmount';

import moment from 'moment';

import Stat from './components/Stat';
import ProgressCountdown from './components/ProgressCountdown';
import useCashTargetPrice from '../../hooks/useCashTargetPrice';
import useUniswapPrice from '../../hooks/useUniswapPrice';
import useUniswapLiquidity from '../../hooks/useUniswapLiquidity';
import { BigNumber } from 'ethers';

const Home: React.FC = () => {
  const basisCash = useBasisCash();

  const [{ cash, bond, share }, setStats] = useState<OverviewData>({});
  const fetchStats = useCallback(async () => {
    const [cash, bond, share] = await Promise.all([
      basisCash.getCashStatFromUniswap(),
      basisCash.getBondStat(),
      // basisCash.getShareStat(),
      basisCash.getBondStat(),
    ]);
    if (Date.now() < config.bondLaunchesAt.getTime()) {
      bond.priceInDAI = '-';
    }
    setStats({ cash, bond, share });
  }, [basisCash, setStats]);

  useEffect(() => {
    if (basisCash) {
      fetchStats().catch((err) => console.error(err.stack));
    }
  }, [basisCash, fetchStats]);

  const cashAddr = useMemo(() => basisCash.ARTH.address, [basisCash]);
  const shareAddr = useMemo(() => basisCash.MAHA.address, [basisCash]);
  const bondAddr = useMemo(() => basisCash.ARTHB.address, [basisCash]);

  const cashStat = useCashPriceInEstimatedTWAP();
  const treasuryAmount = useTreasuryAmount();
  const targetPrice = useCashTargetPrice();

  const ecosystemFund = useFundAmount('ecosystem');
  const cdpFund = useFundAmount('cdp');

  // const scalingFactor = useMemo(

  //   () => (cashStat ? Number(cashStat.priceInDAI).toFixed(2) : null),
  //   [cashStat],
  // );

  const { prevAllocation, nextAllocation, currentEpoch } = useTreasuryAllocationTimes();

  const prevEpoch = useMemo(
    () =>
      nextAllocation.getTime() <= Date.now()
        ? moment().utc().startOf('day').toDate()
        : prevAllocation,
    [prevAllocation, nextAllocation],
  );

  // useEffect(() => {
  //   let _tick = 0;
  //   const interval: NodeJS.Timeout = setInterval(() => setTick(_tick++), 1000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // });

  const arthPrice = useUniswapPrice(basisCash.DAI, basisCash.ARTH);
  const mahaPrice = useUniswapPrice(basisCash.DAI, basisCash.ARTH);
  const arthLiquidity = useUniswapLiquidity(basisCash.DAI, basisCash.ARTH);
  const nextEpoch = useMemo(() => moment(prevEpoch).add(10, 'minute').toDate(), [prevEpoch]);

  return (
    <Page>
      <PageHeader
        icon={<img alt="stats" src={StastIcon} />}
        subtitle="View information about the current ARTH market"
        title="Statistics"
      />

      <CardWrapper>
        <HomeCard
          title="ARTH"
          symbol="ARTH"
          color="#EEA7ED"
          supplyLabel="Circulating Supply"
          address={cashAddr}
          stat={cash}
        />
        <Spacer size="lg" />
        <HomeCard title="MAHA" symbol="MAHA" color="#E83725" address={shareAddr} stat={share} />
        <Spacer size="lg" />
        <HomeCard
          title="ARTH Bond"
          symbol="ARTHB"
          color="#ECF25C"
          address={bondAddr}
          stat={bond}
        />
      </CardWrapper>

      <Spacer size="md" />

      <StyledHeader>
        <ProgressCountdown base={prevEpoch} deadline={nextEpoch} description="Next Epoch" />
        <Stat title={currentEpoch.toFixed(0)} description="Current Epoch" />
        <Stat title={'23.3%'} description="Bond Premium" />
        <Stat title={`$${arthLiquidity}`} description="ARTH Liquidity" />
        {/* <Stat title={scalingFactor ? `x${scalingFactor}` : '-'} description="Scaling Factor" /> */}
      </StyledHeader>
      <StyledHeader>
        <Stat
          title={cashStat ? `$${cashStat.priceInDAI}` : '-'}
          description="ARTH Price (TWAP)"
        />
        <Stat title={cashStat ? `$${arthPrice}` : '-'} description="ARTH Price (Spot)" />
        <Stat
          title={cashStat ? `$${getDisplayBalance(targetPrice)}` : '-'}
          description="ARTH Price (Target)"
        />
      </StyledHeader>
      <StyledHeader>
        <Stat
          title={treasuryAmount ? `${getDisplayBalance(treasuryAmount)} ARTH` : '-'}
          description="Redeemable for Bonds"
        />
        <Stat
          title={ecosystemFund ? `${getDisplayBalance(ecosystemFund)} ARTH` : '-'}
          description="Ecosystem Fund"
        />
        <Stat
          title={cdpFund ? `${getDisplayBalance(cdpFund)} ARTH` : '-'}
          description="CDP Fund"
        />
      </StyledHeader>
    </Page>
  );
};

const CardWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 950px;

  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledHeader = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: row;
  margin-bottom: ${(props) => props.theme.spacing[5]}px;
  width: 960px;

  > * {
    flex: 1;
    height: 84px;
    margin: 0 ${(props) => props.theme.spacing[2]}px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

export default Home;
