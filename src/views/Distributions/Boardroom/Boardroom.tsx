import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Container from '../../../components/Container';
import PageHeader from '../../../components/PageHeader';
import Button from '../../../components/Button/Button';
import useBasisCash from '../../../hooks/useBasisCash';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import DistributionIcon from '../distribution.png';
import { Boardrooms } from '../../../basis-cash/config';
import useExitFromBoardroom from '../../../hooks/useExitFromBoardroom';

const Boardroom = () => {
  const { bankId } = useParams<{ bankId: Boardrooms }>();
  const basisCash = useBasisCash();
  const boardroom = basisCash.getBoardroom(bankId, 'v1');

  const { onRedeem } = useExitFromBoardroom(boardroom);

  return (
    <>
      <PageHeader
        title="ARTH Distribution"
        icon={<img alt="distribution" src={DistributionIcon} width="200px" />}
        subtitle={`Deposit ${boardroom.depositTokenName} tokens and earn inflationary rewards from an increase in $ARTH supply.`}
        // showEpoch
      />
      <Container size="lg">
        <div className="border-bottom width-100 margin-bottom-20" />
        {/* // eslint-disable-next-line jsx-a11y/accessible-emoji */}
        <Notice>
          New Upgraded Distribution contracts are coming soon and will replace this contract!
          <span role="img" aria-label="Rocket">🚀🚀</span>These contracts will stop receiving rewards.
        </Notice>
        <Notice>
          You are advised to withdraw funds from these contracts and deposit into new ones when
          they go live.
        </Notice>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12} md={8} lg={8} xl={8}>
            <Grid container spacing={2} justify="center">
              <Grid container item xs={12} md={12} lg={6} xl={6}>
                <Stake boardroom={boardroom} />
              </Grid>
              <Grid container item xs={12} md={12} lg={6} xl={6}>
                <Harvest boardroom={boardroom} />
              </Grid>
            </Grid>
            <div style={{ marginTop: '20px', maxWidth: '200px' }}>
              <Button variant='transparent' onClick={onRedeem} size="sm" text="Settle & Withdraw" />
            </div>
          </Grid>
          {/* <Grid container item xs={12} md={4} lg={4} xl={4}>
            <Grid container spacing={3} justify="center">
              <Grid container item xs={12} md={12} lg={12} xl={12}>
                <ExchangeStat description="MAHA Price(TWAP)" title="$1.150" />
              </Grid>
              <Grid container item xs={12} md={12} lg={12} xl={12}>
                <ExchangeStat description="Scaling Factor" title="5x" />
              </Grid>
              <Grid container item xs={12} md={12} lg={12} xl={12}>
                <ExchangeStat description="Treasury Amount" title="~$5" />
              </Grid>
            </Grid>
          </Grid> */}
        </Grid>
        {/* {(bankId === 'arthUniLiquidity' || bankId === 'arthMlpLiquidity') && <LPTokenHelpText boardroom={boardroom} />} */}
      </Container>
    </>
  );
};


const Notice = styled.p`
  font-size: 18;
  text-align: center;
  color: #fff;
  max-width: 400px;
  margin: 15px auto;
  // text-decoration: none;
  // color: ${(props) => props.theme.color.primary.main};
`;

export default Boardroom;
