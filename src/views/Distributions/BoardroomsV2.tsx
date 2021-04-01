import React, { useEffect } from 'react';
import styled from 'styled-components';
import CardWithTitle from '../../components/CardWithTitle';
import PageHeader from '../../components/PageHeader';
import Container from '../../components/Container';
import useBasisCash from '../../hooks/useBasisCash';
import Boardroom from './components/VaultRow';
import Grid from '@material-ui/core/Grid';
import InfoIcon from '@material-ui/icons/Info';
import { Vaults } from '../../basis-cash/config';

const Boardrooms: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0));
  const basisCash = useBasisCash();


  // const isLaunched = Date.now() >= config.boardroomLaunchesAt.getTime();
  if (!basisCash) return <div />;

  return (
    <>
      <PageHeader

        title="ARTH Distribution"
        subtitle="Bond/Stake tokens and earn inflationary rewards when the ARTH supply expands. Rewards are redeemable only if the protocol is in expansion mode."
      />
      <Container size="lg">
        <CardWithTitle title="Bonding Pools">
          <Grid container>
            <Grid container item direction="row" justify="space-between" style={{ padding: 10 }}>
              <Grid item xs={12} lg={6}>
                <StyledTableHeaderTextLeft>PAIR</StyledTableHeaderTextLeft>
              </Grid>
              {/* <Grid item lg={2}>
                <StyledTableHeaderTextCenter>POOL</StyledTableHeaderTextCenter>
              </Grid> */}
              <Grid item lg={2}>
                <StyledTableHeaderTextRight>Seigniorage Supply</StyledTableHeaderTextRight>
              </Grid>
              {/* <Grid item lg={2}>
                <StyledTableHeaderText>APY</StyledTableHeaderText>
              </Grid> */}
              <Grid item lg={2}>
                <StyledTableHeaderTextRight>
                  Withdrawal Period
                  <InfoIcon fontSize="small" style={{ transform: 'scale(0.6)' }} />
                </StyledTableHeaderTextRight>
              </Grid>
            </Grid>

            <Grid container item direction="column" justify="space-around">
              {/* <Boardroom boardroom={"arthDai"}/>
              <Boardroom boardroom={"arth"}/>
              <Boardroom boardroom={"maha"}/> */}
              <Boardroom vault={Vaults.arthDaiLiquidity} />
              <Boardroom vault={Vaults.arthEthLiquidity} />
              <Boardroom vault={Vaults.arth} />
              <Boardroom vault={Vaults.maha} />
            </Grid>
          </Grid>
        </CardWithTitle>
      </Container>
    </>
  );
};


const StyledTableHeaderTextCenter = styled.h6`
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.theme.color.grey[600]};
  margin: 10px 30px;
  text-align: center;
`;

const StyledTableHeaderTextLeft = styled.h6`
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.theme.color.grey[600]};
  margin: 10px 40px;
`;

const StyledTableHeaderText = styled.h6`
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.theme.color.grey[600]};
  margin: 10px 30px;
`;

const StyledTableHeaderTextRight = styled.h6`
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.theme.color.grey[600]};
  margin: 10px 10px;
`;


export default Boardrooms;
