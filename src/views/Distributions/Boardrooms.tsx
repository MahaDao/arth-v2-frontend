import React, { useEffect } from 'react';
import PageHeader from '../../components/PageHeader';

import Boardroom from './components/Vault';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Container from '../../components/Container';
import useBasisCash from '../../hooks/useBasisCash';
import DistributionIcon from '../../assets/svg/Boardroom.svg';
import { Vaults } from '../../basis-cash/config';

const Boardrooms: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0));
  const basisCash = useBasisCash();

  if (!basisCash) return <div />;

  const OldBalance = (
    <div style={{
      color: '#fff',
      fontSize: 14,
      backgroundColor: '#fff2', padding: 15, textAlign: 'center', borderRadius: 3, marginBottom: 15
    }}>
      <p>
        If have deposits in the old distribution contracts. Please withdraw your funds
        and deposit them into the new distribution contracts.
      </p>

      <ul>
        <li><Link style={{ color: 'aqua', textDecoration: 'underline' }} to="/distribution/v1/arth">View Old ARTH Distribution contract</Link></li>
        <li><Link style={{ color: 'aqua', textDecoration: 'underline' }} to="/distribution/v1/arthLiquidity">View Old ARTH/DAI UNI-LP Distribution contract</Link></li>
        <li><Link style={{ color: 'aqua', textDecoration: 'underline' }} to="/distribution/v1/mahaLiquidity">View Old MAHA/ETH UNI-LP Distribution contract</Link></li>
      </ul>
    </div>
  )

  return (
    <>
      <PageHeader
        icon={<img alt="distribution" src={DistributionIcon} width="200px" />}
        title="ARTH/MAHA Distribution"
        subtitle="Deposit tokens and earn rewards when the protocol supply expands/contracts. You will earn ARTH rewards when the protocol expands and MAHA rewards when the protocol contracts"
      />
      <Container size="lg">
        {/* <div className="border-bottom width-100 margin-bottom-20" /> */}
        <Grid container spacing={5} justify="center" alignItems="stretch">
          <Grid container item xs={12} md={4} lg={4} xl={4}>
            <Boardroom
              vault={Vaults.arthEthLiquidity}
            // toolTipTitle="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            />
          </Grid>
          <Grid container item xs={12} md={4} lg={4} xl={4}>
            <Boardroom
              vault={Vaults.arthDaiLiquidity}
            // toolTipTitle="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            />
          </Grid>
          <Grid container item xs={12} md={4} lg={4} xl={4}>
            <Boardroom
              vault={Vaults.arth}
            // toolTipTitle="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            />
          </Grid>

          <Grid container item xs={12} md={4} lg={4} xl={4}>
            <Boardroom vault={Vaults.maha} />
          </Grid>
        </Grid>

        {OldBalance}
      </Container>
    </>
  );
};

export default Boardrooms;
