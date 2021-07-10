import React from 'react';
import Grid from '@material-ui/core/Grid';

import styled from 'styled-components';
import DeptCard from './components/DeptCard';
import Container from '../../components/Container';
import CollectedDetailsCard from './components/CollectedDetailsCard';

const LockDeposit = () => {
  return (
    <Container size="lg">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '80px 0px 0',
      }}>
        <PageHeading>{'DEBT POOL'}</PageHeading>
      </div>

      <Grid container spacing={2}>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <DeptCard price={1} symbol={'ARTH'} />
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <DeptCard price={0.012} symbol={'ARTHX'} />
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <CollectedDetailsCard symbol={'USDC'} />
        </Grid>
      </Grid>
    </Container>
  )
}

export default LockDeposit;

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
