import React from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { useMediaQuery } from 'react-responsive';
import { BigNumber } from '@ethersproject/bignumber';
import { createStyles, LinearProgress, Theme, withStyles } from '@material-ui/core';

import CustomToolTip from '../../../components/CustomTooltip';

import { getDisplayBalance } from '../../../utils/formatBalance';
import useGlobalCollateralRatio from '../../../hooks/state/controller/useGlobalCollateralRatio';

const BorderLinearProgress = withStyles(() =>
  createStyles({
    root: {
      height: 25,
      borderRadius: 12.5,
      width: '85%',
    },
    colorPrimary: {
      backgroundColor: '#D9D5D3',
    },
    bar: {
      borderRadius: 0,
      backgroundColor: '#F7653B',
    },
  }),
)(LinearProgress);

const CollateralRatio: React.FC = () => {
  const isMobile = useMediaQuery({ maxWidth: '600px' });
  const {isLoading: isCollateralRatioLoading, value: globalCR} = useGlobalCollateralRatio();

  const CollateralRatioPercentage = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '12px',
            alignItems: 'center',
          }}
        >
          <TextForInfoTitle>
            Collateral Ratio
            <CustomToolTip />
          </TextForInfoTitle>
          <PercentNumber style={!isMobile ? { margin: '5px 0px 0px 10px' } : { margin: '6px' }}>
            {
              Number(getDisplayBalance(globalCR, 4, 4))
                .toLocaleString('en-US', {maximumFractionDigits: 4})
            }%
          </PercentNumber>
        </div>
        <BorderLinearProgress
          variant="determinate"
          value={Number(getDisplayBalance(globalCR, 4, 4))}
        />
      </div>
    );
  };

  return (
    <Grid
      item
      sm={12}
      md={12}
      lg={12}
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        paddingBottom: '24px',
      }}
    >
      <Grid item sm={12} md={6} lg={6}>
        {
          CollateralRatioPercentage()
        }
      </Grid>
      <Grid item style={{ width: '100%' }} sm={12} md={6} lg={6}>
        <PercentCard>
          <PercentCardInfo style={{ marginTop: 15 }}>
            <PercentCardLabel>
              <div
                style={{
                  height: 14,
                  width: 14,
                  background: '#F7653B',
                  borderRadius: 7,
                }}
              />
              <OpacitySpan>Collateral</OpacitySpan>
            </PercentCardLabel>
            <PercentCardValue>
              {
                Number(getDisplayBalance(globalCR, 4, 4))
                  .toLocaleString('en-US', {maximumFractionDigits: 4})
              }
            %</PercentCardValue>
          </PercentCardInfo>

          <PercentCardInfo>
            <PercentCardLabel>
              <div
                style={{
                  height: 14,
                  width: 14,
                  background: '#D9D5D3',
                  borderRadius: 7,
                }}
              />
              <OpacitySpan>ARTHX</OpacitySpan>
            </PercentCardLabel>
            <PercentCardValue>
              {
                Number(
                  getDisplayBalance(BigNumber.from(1000000).sub(globalCR), 4, 2)
                )
                  .toLocaleString('en-US', { maximumFractionDigits: 4 })
              }%
            </PercentCardValue>
          </PercentCardInfo>
        </PercentCard>
      </Grid>
    </Grid>
  );
};

const PercentCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  height: fit-content;
`;

const PercentCardInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin: 6px;
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

export default CollateralRatio;
