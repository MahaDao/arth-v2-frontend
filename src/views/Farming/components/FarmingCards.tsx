import styled from 'styled-components';
import React, { useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import { useMediaQuery } from 'react-responsive';
import { withSnackbar, WithSnackbarProps } from 'notistack';

import { ModeProps } from '../index';
import FarmingCard from './FarmingCard';

import { stakingContracts } from '../../../config';

interface IProps {
  mode?: ModeProps;
}

const BankCardsV2 = (props: WithSnackbarProps & IProps) => {
  const isMobile = useMediaQuery({ maxWidth: '600px' });

  const data = useMemo(() => {
    if (props?.mode?.id === 'all') return stakingContracts;
    return stakingContracts.filter((obj) => obj.categories.includes(props?.mode?.id));
  }, [props]);

  return (
    <DataContainer className={'custom-mahadao-box'}>
      {!isMobile && (
        <Grid container style={{ padding: '0px 32px ', marginBottom: '16px' }}>
          <Grid item lg={3}>
            <CustomTableHeading>Pair</CustomTableHeading>
          </Grid>
          <Grid item lg={2}>
            <CustomTableHeading>Wallet</CustomTableHeading>
          </Grid>
          <Grid item lg={1}>
            <CustomTableHeading>APY</CustomTableHeading>
          </Grid>
          <Grid item lg={2}>
            <CustomTableHeading>Ends In</CustomTableHeading>
          </Grid>
          <Grid item lg={2}>
            <CustomTableHeading>Reward</CustomTableHeading>
          </Grid>
          <Grid item lg={2} />
        </Grid>
      )}

      <div>
        {data.map((cardData) => (
          <FarmingCard cardData={cardData} mode={props.mode} />
        ))}
      </div>
    </DataContainer>
  );
};

const DataContainer = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(70px);
  border-radius: 12px;
  padding: 24px 32px;
  @media (max-width: 600px) {
    background: transparent;
    backdrop-filter: none;
    border-radius: 12px;
    padding: 0;
  }
`;

const CustomTableHeading = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.32);
  opacity: 0.64;
  text-align: left;
`;

export default withSnackbar(BankCardsV2);
