import { AppState } from '../../state';
import { BigNumber } from 'ethers';
import { commify } from 'ethers/lib/utils';
import { getDisplayBalance } from '../../utils/formatBalance';
import { OverviewData } from './types';
import { useSelector } from 'react-redux';
import Container from '../../components/Container';
import DistributonSection from './components/DistributonSection';
import EpochTimer from './components/EpochTimer';
import FAQCard from './components/FAQCard';
import Grid from '@material-ui/core/Grid';
import HomeCard from './components/HomeCard';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import PriceInformation from './components/PriceInformation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import StatCard from './components/StatCard';
import styled from 'styled-components';
import useBasisCash from '../../hooks/useBasisCash';
import useFundAmount from '../../hooks/useFundAmount';


const FaqData = [
  {
    question: 'Do I need $MAHA to buy/redeem ARTH bonds?',
    answer:
      'Although, you don’t need $MAHA to buy ARTH Bonds, while redeeming ARTH Bonds, a 1% fee is charged in MAHA. Thus, you will need MAHA to redeem bonds.',
  },
  {
    question: 'Do I need to buy ARTH Bonds or they are rewarded if I hold ARTH?',
    answer: 'ARTH Bonds are not rewarded but need to be bought. They can be bought here',
  },
  {
    question: 'When is the 12-hour TWAP updated?',
    answer: 'The 12-hour TWAP is updated at every epoch.',
  },
  {
    question: 'When is the 1-hour TWAP updated?',
    answer: 'The 1-hour TWAP is updated every hour',
  },
  {
    question: 'Can ARTHB expire?',
    answer:
      'No, ARTH Bonds never expire. You can redeem them whenever you like until the 12-hr TWAP & 1 hr TWAP is more than the target price (currently $1).',
  },
];


const Home: React.FC = () => {
  const basisCash = useBasisCash();

  const [{ cash, bond, share }, setStats] = useState<OverviewData>({});
  const fetchStats = useCallback(async () => {
    const [cash, bond, share] = await Promise.all([
      basisCash.getCashStat(),
      basisCash.getBondStat(),
      basisCash.getShareStat(),
    ]);

    setStats({ cash, bond, share });
  }, [basisCash, setStats]);

  useEffect(() => {
    if (basisCash) {
      fetchStats().catch((err) => console.error(err.stack));
    }
  }, [basisCash, fetchStats]);

  const accumulatedSeigniorage = useSelector<AppState, BigNumber>(s => s.treasury.coreState.accumulatedSeigniorage)
  const cashToBondConversionLimit = useSelector<AppState, BigNumber>(s => s.treasury.coreState.cashToBondConversionLimit)
  const bondCirculatingSupply = useSelector<AppState, BigNumber>(s => s.treasury.bondCirculatingSupply)

  const cashAddr = useMemo(() => basisCash.ARTH.address, [basisCash]);
  const shareAddr = useMemo(() => basisCash.MAHA.address, [basisCash]);
  const bondAddr = useMemo(() => basisCash.ARTHB.address, [basisCash]);

  const ecosystemFund = useFundAmount('ecosystem');
  const rainyDayFund = useFundAmount('ecosystem');

  return (
    <Page>
      <PageHeader
        icon={<div style={{ width: '200px', height: '200px' }} />}
        subtitle="View information about the current ARTH protocol"
        title="Statistics" />
      <Container size="lg">
        <div className="border-bottom width-100 margin-bottom-20" />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <EpochTimer />
          </Grid>
          <Grid item xs={12} sm={6} md={8} lg={8} xl={8}>
            <PriceInformation stat={cash} />
          </Grid>
        </Grid>
        <div className="margin-top-bottom-20">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <DistributonSection />
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <StatCard
                statData={[
                  {
                    title: `${getDisplayBalance(cashToBondConversionLimit)} ARTH`,
                    subTitle: 'Debt Available for Purchase',
                    tooltipHtml:
                      'The amount of debt issued by the protocol that is available for purchase.',
                  },
                  {
                    title: `${getDisplayBalance(accumulatedSeigniorage)} ARTH`,
                    subTitle: 'Redeemable Debt',
                    tooltipHtml:
                      'The amount of debt that can currently be paid off by the protocol. This is redeemable by ARTHB holders at a 1:1 ratio.',
                  },
                  {
                    title: `${getDisplayBalance(bondCirculatingSupply)} ARTHB`,
                    subTitle: 'Outstanding Debt',
                    tooltipHtml:
                      'The amount of debt that the protocol has to pay off.',
                  },
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <StatCard
                    statData={[
                      {
                        title: rainyDayFund
                          ? `${commify(getDisplayBalance(rainyDayFund, 18, 0))} ARTH`
                          : '-',
                        subTitle: 'Rainy Day Fund',
                        tooltipHtml:
                          'A fund that\'ll be used during a black friday event. When new ARTH is minted during an expansion phase, 2% of minted ARTH is deposited to the rainy day fund. ',
                      },
                      {
                        title: ecosystemFund
                          ? `${commify(getDisplayBalance(ecosystemFund, 18, 0))} ARTH`
                          : '-',
                        subTitle: 'Ecosystem Fund',
                        tooltipHtml:
                          'A fund that’ll be used purely for ecosystem development. When new ARTH is minted during an expansion phase, 2% of minted ARTH is deposited to this fund.',
                      },
                      {
                        title: 'Stability Fees'
                          // ? `${commify(getDisplayBalance(ecosystemFund, 18, 0))} ARTH`
                          ? `1 %`
                          : '-',
                        subTitle: 'Stability Fees',
                        tooltipHtml:
                          'Stability Fees',
                      },
                    ]}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <HomeCard
              title="MAHA"
              uniswapInputAddress={basisCash.MAHA.address}
              symbol="MAHA"
              liquidity="$87,783,601"
              supplyLabel="Circulating Supply"
              address={shareAddr}
              stat={share}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <HomeCard
              title="ARTH"
              symbol="ARTH"
              liquidity="$2,462,492"
              uniswapInputAddress={basisCash.ARTH.address}
              supplyLabel="Circulating Supply"
              address={cashAddr}
              stat={cash}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <HomeCard
              title="ARTH Bond"
              symbol="ARTHB"
              liquidity="$2,462,492"
              uniswapInputAddress={basisCash.ARTHB.address}
              address={bondAddr}
              stat={bond}
            />
          </Grid>
        </Grid>
        <FaqTitle>FAQs</FaqTitle>
        {FaqData && FaqData.map((eachFaq) => <FAQCard key={eachFaq.question} {...eachFaq} />)}
      </Container>
    </Page>
  );
};
const FaqTitle = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  line-height: 44px;
  color: #ffffff;
  opacity: 0.88;
  margin-top: 40px;
  margin-bottom: 20px;
`;

export default Home;
