import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { useMediaQuery } from 'react-responsive';
import FadeLoader from 'react-spinners/FadeLoader';

import Page from '../../components/Page';
import HomeCard from './components/HomeCard';
import PieChart from './components/PieChart';
import FeeRates from './components/FeeRates';
import StakeBox from './components/StakeBox';
import BasicInfo from './components/BasicInfo';
import CoinsPrice from './components/CoinsPrice';
import Container from '../../components/Container';
import PageHeader from '../../components/PageHeader';
import prettyNumber from '../../components/PrettyNumber';
import BondingDiscount from './components/BondingDiscount';
import CustomToolTip from '../../components/CustomTooltip';
import { WalletAutoConnect } from '../../components/WalletAutoConnect';

import { colors } from './types';
import useCore from '../../hooks/useCore';
import { getDisplayBalance } from '../../utils/formatBalance';
import useGlobalCollateralValue from '../../hooks/state/useGlobalCollateralValue';
import useAllPoolCollateralValue from '../../hooks/state/pools/useAllPoolCollateralValue';

const Home: React.FC = () => {
  const isMobile = useMediaQuery({ maxWidth: '600px' });

  const core = useCore();
  const { isLoading: isPoolsValueLoading, value: allPoolsValue } = useAllPoolCollateralValue();
  const { isLoading: isGlobalCollateralValueLoading, value: globalCollateralValue } = useGlobalCollateralValue();

  WalletAutoConnect();

  const arthAddress = useMemo(() => core.ARTH.address, [core]);
  const mahaAddress = useMemo(() => core.MAHA.address, [core]);
  const arthxAddress = useMemo(() => core.ARTHX.address, [core]);

  const [isFormattedPoolValuesLoading, formattedPoolValues] = useMemo(() => {
    if (isPoolsValueLoading || isGlobalCollateralValueLoading) return [true, []];
    if (globalCollateralValue.eq(0)) return [false, []];

    return [
      false,
      allPoolsValue.map(p => ({
        name: p.poolToken,
        amount: Number(getDisplayBalance(p.value)),
        percentage: Number(getDisplayBalance(p.value.mul(1e8).div(globalCollateralValue), 6)),
      }))
    ]
  }, [allPoolsValue, globalCollateralValue, isGlobalCollateralValueLoading, isPoolsValueLoading]);

  return (
    <Page>
      <PageHeader
        subtitle="View information about the current ARTH protocol"
        title="Analytics"
      />
      <Container size="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <Card className={'custom-mahadao-box'}>
              <Grid item sm={12} md={12} lg={12} direction={'column'}>
                <Grid item sm={12} md={12} lg={12} style={{ padding: '0 0 0 0' }}>
                  <TitleString style={{ textAlign: isMobile ? 'center' : 'left' }}>
                    Collateral Breakdown
                    <CustomToolTip toolTipText={'$GMU worth of collateral currently present in each individual pool of the protocol.'} />
                  </TitleString>
                  <Grid container style={{}} direction={isMobile ? 'column' : 'row'}>
                    {
                      isFormattedPoolValuesLoading
                        ? (
                          <Grid item sm={12} md={12} lg={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '210px' }}>
                            <FadeLoader color={'#ffffff'} loading={true} margin={2} />
                          </Grid>
                        )
                        : (
                          <Grid item sm={12} md={12} lg={12} style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: isMobile ? 'column' : 'row',
                          }}>
                            <Grid item sm={12} md={6} lg={6}>
                              <PieChart balances={formattedPoolValues} />
                            </Grid>
                            <Grid item style={{ width: '100%' }} sm={12} md={6} lg={6}>
                              <PercentCard>
                                {
                                  formattedPoolValues.map((b, i) => (
                                    <PercentCardInfo key={b.name}>
                                      <PercentCardLabel>
                                        <div
                                          style={{
                                            height: 14,
                                            width: 14,
                                            background: colors[i],
                                            borderRadius: 7,
                                          }}
                                        />
                                        <OpacitySpan>{b.name}</OpacitySpan>
                                      </PercentCardLabel>
                                      <PercentCardValue>
                                        ${
                                          prettyNumber(b.amount)
                                        } - {
                                          Number(b.percentage).toLocaleString('en-US', { maximumFractionDigits: 2 })
                                        }%
                                      </PercentCardValue>
                                    </PercentCardInfo>
                                  ))
                                }
                              </PercentCard>
                            </Grid>
                          </Grid>
                        )
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Card>
            <BasicInfo
              globalCollateralValue={globalCollateralValue}
              isGlobalCollateralValueLoading={isGlobalCollateralValueLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <CoinsPrice />
            <StakeBox />
          </Grid>
        </Grid>
        <Grid container spacing={2} style={{ marginTop: '8px' }}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <BondingDiscount stats />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <FeeRates />
          </Grid>
        </Grid>
        <Grid container spacing={2} style={{ marginTop: '8px' }}>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <HomeCard
              title="MAHA"
              uniswapInputAddress={mahaAddress}
              symbol="MAHA"
              address={mahaAddress}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <HomeCard
              title="ARTH"
              symbol="ARTH"
              uniswapInputAddress={arthAddress}
              address={arthAddress}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <HomeCard
              title="ARTHX"
              symbol="ARTHX"
              uniswapInputAddress={arthxAddress}
              address={arthxAddress}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

const ToLink = styled(Link)`
  z-index: 1;
`;

const GradientDiv = styled.div`
  background: linear-gradient(180deg, #2a2827 0%, rgba(42, 40, 39, 0) 100%);
  height: 270px;
  position: absolute;
  width: 100%;
  z-index: -50;
`;

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

const Card = styled.div``;
const PercentCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  height: fit-content;
`;

const PercentCardInfo = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 6px;
`;

const InfoDiv = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: rgba(255, 255, 255, 0.64);
  margin: 12px 0px 0px 0px;
  text-align: center;
`;

const PercentCardLabel = styled.div`
  display: flex;
  flex-direction: row;
  width: fit-content;
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  color: #ffffff;
  align-items: center;
`;

const OpacitySpan = styled.span`
  opacity: 0.64;
  padding: 0 8px;
`;

const PercentCardValue = styled.div`
  display: flex;
  flex-direction: row;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
`;

const TextForInfoTitle = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.88);
  opacity: 0.64;
  text-align: center;
`;

const PercentNumber = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 32px;
  text-align: right;
  display: flex;
  align-items: center;
  flex: 1;
  color: rgba(255, 255, 255, 0.88);
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
  margin: 12px 0px 22px 0px;
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
  margin-left: 10px;
  margin-right: 10px;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
  align-items: center;
`;

const IconButtons = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;

const ButtonText = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`;

const TitleString = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  color: #ffffff;
  opacity: 0.88;
`;

export default Home;
