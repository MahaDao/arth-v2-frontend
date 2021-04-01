import React from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Container from '../../../components/Container';
import PageHeader from '../../../components/PageHeader';
import useBasisCash from '../../../hooks/useBasisCash';
import BoardroomStaked from './components/BoardroomStaked';
import HarvestMaha from './components/HarvestMaha';
import HarvestArthSnapshot from './components/HarvestArthSnapshot';
import HarvestArth from './components/HarvestArth';
import { Vaults } from '../../../basis-cash/config';

const Boardroom = () => {
  const { bankId } = useParams<{ bankId: Vaults }>();
  const basisCash = useBasisCash();
  const vault = basisCash.getBoardroomVault(bankId);

  return (
    <>
      <PageHeader
        title={`${vault.depositTokenName}`}
        subtitle={`Deposit ${vault.depositTokenName} tokens and earn inflationary rewards from an increase in ${vault.depositTokenName} supply.`}
        parentLink="../"
        parentLinkTitle="ARTH-MAHA Distribution"
      // showEpoch
      />
      <Container size="lg">
        <Grid container spacing={2} justify="center">
          <Grid container item xs={12} md={6} lg={4} xl={4}>
            <BoardroomStaked vault={vault} />
          </Grid>
          <Grid container item xs={12} md={6} lg={4} xl={4}>
            <HarvestArth vault={vault} />
          </Grid>
          <HarvestArthSnapshot vault={vault} />
          <Grid container item xs={12} md={6} lg={4} xl={4}>
            <HarvestMaha vault={vault} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Boardroom;
