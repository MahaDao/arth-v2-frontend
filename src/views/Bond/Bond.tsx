import { getDisplayBalance } from '../../utils/formatBalance';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useTransactionAdder } from '../../state/transactions/hooks';
import BondsIcon from '../../assets/svg/Bond.svg';
import Chart from './components/Chart';
import config from '../../config';
import Container from '../../components/Container';
import ExchangeStat from './components/ExchangeStat';
import Grid from '@material-ui/core/Grid';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import PurchaseBonds from './components/Purchase';
import React, { useCallback, useMemo } from 'react';
import RedeemBonds from './components/Redeem';
import styled from 'styled-components';
import useBasisCash from '../../hooks/useBasisCash';
import useCashAvailableToConvert from '../../hooks/useCashAvailableToConvert';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import useCashTargetPrice from '../../hooks/useCashTargetPrice';
import useTokenBalance from '../../hooks/useTokenBalance';
import useBondOraclePriceInLastTWAP from '../../hooks/useBondOraclePriceInLastTWAP';

import useTreasuryAmount from '../../hooks/useTreasuryAmount';

const Bond: React.FC = () => {
  const { path } = useRouteMatch();
  const basisCash = useBasisCash();
  const addTransaction = useTransactionAdder();
  // const bondStat = useBondStats();
  const cash1hrPrice = useBondOraclePriceInLastTWAP();
  const targetPrice = useCashTargetPrice();
  const cashe12hrPrice = useCashPriceInLastTWAP();
  const cashAvailableToConvert = useCashAvailableToConvert();
  const treasuryAmount = useTreasuryAmount();
  const bondsAvailableForPurchase = useMemo(() => cashAvailableToConvert.mul(120).div(100), [
    cashAvailableToConvert,
  ]);

  const bondBalance = useTokenBalance(basisCash.ARTHB);

  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await basisCash.buyBonds(amount);

      addTransaction(tx, {
        summary: `Buy ARTHB with ${amount} DAI`,
      });
    },
    [basisCash, addTransaction],
  );

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await basisCash.redeemBonds(amount);
      addTransaction(tx, { summary: `Redeem ${amount} ARTHB` });
    },
    [basisCash, addTransaction],
  );

  const isBondRedeemable = useMemo(() => cash1hrPrice.gt(targetPrice), [
    cash1hrPrice,
    targetPrice,
  ]);

  const isBondPurchasable = useMemo(() => {
    // 95 % of target price
    const cond1 = cash1hrPrice.lt(targetPrice.mul(95).div(100));
    return cond1 && cond1;
  }, [cash1hrPrice, targetPrice]);

  const isLaunched = Date.now() >= config.bondLaunchesAt.getTime();
  if (!isLaunched) {
    return (
      <Switch>
        <Page>
          <PageHeader
            icon={<img alt="bonds" src={BondsIcon} width="200px" />}
            title="Buy &amp; Redeem Bonds"
            subtitle="Purchasing ARTH Bonds has a direct impact on Uniswap price and is used to help bring the price of ARTH back to its target price"
          />
        </Page>
      </Switch>
    );
  }

  if (!basisCash) return <div />;

  return (
    <Switch>
      <Page>
        <>
          <Route exact path={path}>
            <PageHeader
              icon={<img alt="bonds" src={BondsIcon} width="250px" />}
              title="Buy & Redeem Bonds"
              subtitle="Bonds can be bought when ARTH is trading below its target price and can be redeemed at a premium when ARTH is trading above its target price."
            />
          </Route>
          <Container size="lg">
            <div className="border-bottom width-100 margin-bottom-20" />
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={8} xl={8}>
                {false && (
                  <ChartContainer>
                    <p className="white font20 bold-600 margin-left-15">ARTH Price</p>
                    <Chart />
                  </ChartContainer>
                )}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={6} xl={6}>
                    <PurchaseBonds
                      action="Purchase ARTHB"
                      fromToken={basisCash.DAI}
                      fromTokenName="DAI"
                      toToken={basisCash.ARTHB}
                      toTokenName="ARTHB"
                      addOnTokeName="ARTH"
                      addOnToken="ARTH"
                      priceDesc={
                        !isBondPurchasable
                          ? 'ARTH is over its target price'
                          : cashAvailableToConvert.eq(0)
                            ? `ARTH is below its target price. However there is no ARTHB available for purchase.`
                            : null
                      }
                      disabledDescription={
                        !isBondPurchasable
                          ? 'Enabled when 1hr TWAP < 0.95$'
                          : cashAvailableToConvert.eq(0)
                            ? `No ARTHB Allocated. Wait for next epoch`
                            : null
                      }
                      onExchange={handleBuyBonds}
                      disabled={!isBondPurchasable || cashAvailableToConvert.eq(0)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} xl={6}>
                    <RedeemBonds
                      action="Redeem ARTHB"
                      fromToken={basisCash.ARTHB}
                      fromTokenName="ARTHB"
                      toToken={basisCash.DAI}
                      toTokenName="DAI"
                      addOnTokeName="ARTH"
                      addOnToken={basisCash.ARTH}
                      onExchange={handleRedeemBonds}
                      disabled={!isBondRedeemable || treasuryAmount.lte(0)}
                      priceDesc={
                        !isBondRedeemable
                          ? `Enabled when 1hr TWAP > $${getDisplayBalance(targetPrice)}`
                          : cashAvailableToConvert.eq(0)
                            ? `1hr TWAP is above the bond redeemtion price. However there is no ARTH available to be redeemed.`
                            : `${getDisplayBalance(bondBalance)} ARTHB Available`
                      }
                      disabledDescription={
                        !isBondRedeemable
                          ? `Enabled when 1hr TWAP > $${getDisplayBalance(targetPrice)}`
                          : treasuryAmount.lte(0)
                            ? 'No ARTH available. Wait for next Epoch'
                            : null
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={2} item xs={12} md={12} lg={12} xl={12}>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                  <ExchangeStat
                    title={`ARTH: $${getDisplayBalance(cash1hrPrice, 18, 2)}`}
                    description="1hr TWAP Price"
                    toolTipTitle="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                  <ExchangeStat
                    title={`ARTH: $${getDisplayBalance(cashe12hrPrice, 18, 3)}`}
                    description="12hr TWAP Price"
                    toolTipTitle="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                  <ExchangeStat
                    title={`Target: $${getDisplayBalance(targetPrice, 18, 2)}`}
                    description="Target Price"
                    toolTipTitle="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                  <ExchangeStat
                    title={`ARTHB: $${getDisplayBalance(cash1hrPrice.mul(80).div(100), 18, 2)}`}
                    description="Bond Price"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                  <ExchangeStat title={`20%`} description="Bond Discount" />
                </Grid>

                <Grid item xs={12} md={6} lg={6} xl={6}>
                  <ExchangeStat
                    title={`12hr TWAP < $0.95`}
                    description="ARTHB Allocated When"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                  <ExchangeStat title={`1hr TWAP < $0.95`} description="ARTHB Sold When" />
                </Grid>

                <Grid item xs={12} md={6} lg={6} xl={6}>
                  <ExchangeStat title={`1hr TWAP >= $1.00`} description="ARTHB Redeemed When" />
                </Grid>

                <Grid item xs={12} md={6} lg={6} xl={6}>
                  <ExchangeStat
                    title={`${getDisplayBalance(bondsAvailableForPurchase, 18, 0)} ARTHB`}
                    description="ARTHB allocated for purchase"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                  <ExchangeStat
                    title={treasuryAmount ? `${getDisplayBalance(treasuryAmount)} ARTHB` : '-'}
                    description="ARTHB available for redeemtion"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </>
      </Page>
    </Switch>
  );
};


const ChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.02);
  // backdrop-filter: blur(70px);
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  margin-bottom: 30px;
`;

export default Bond;
