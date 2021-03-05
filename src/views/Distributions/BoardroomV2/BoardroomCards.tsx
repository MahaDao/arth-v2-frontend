import React from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Container from '../../../components/Container';
import PageHeader from '../../../components/PageHeader';
import useBasisCash from '../../../hooks/useBasisCash';
import BoardroomStaked from './components/BoardroomStaked';
import HarvestMaha from './components/HarvestMaha';
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
            <HarvestArth boardroomId={vault.arthBoardroom} />
          </Grid>
          <Grid container item xs={12} md={6} lg={4} xl={4}>
            <HarvestMaha boardroomId={vault.mahaBoardroom} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Boardroom;
