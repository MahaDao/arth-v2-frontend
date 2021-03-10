import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import Container from '../../components/Container';
import BankPage from '../Bank';
import BankCards from './BankCardsV2';
import StakingIcon from '../../assets/svg/Staking.svg';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';

const Banks: React.FC = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Page>
        <Route exact path={path}>
          <PageHeader
            icon={<img alt="staking" src={StakingIcon} width="200px" />}
            title="Farm and Earn Rewards"
            subtitle="Earn ARTH by providing liquidity."
            learnMoreLink="#"
          />
          <Container size="lg">
            <div className="border-bottom width-100 margin-bottom-20" />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <BankCards />
              </Grid>
              {/* <Grid item xs={12} sm={6} md={8} lg={8} xl={8}>
                <PriceInformation stat={cash} />
              </Grid> */}
            </Grid>
            {/* <BankCards /> */}
          </Container>
        </Route>
        <Route path={`${path}/:bankId`}>
          <BankPage />
        </Route>
      </Page>
    </Switch>
  );
};

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
export default Banks;
