import React, { useState } from 'react';
import styled from 'styled-components';
import TokenSymbol from '../../../components/TokenSymbol';
import Grid from '@material-ui/core/Grid';
import Button from '../../../components/Button';
import useCore from '../../../hooks/useCore';
import { TradingPairs } from '../../../basis-cash/types';

import config, { platformURL } from '../../../config';

interface IProps {
  info: TradingPairs;
}

const CustomRowCard = (props: IProps) => {
  const core = useCore();

  const token1 = core.tokens[props.info.tokens[0]];
  const token2 = core.tokens[props.info.tokens[1]];

  const address1 = token1.symbol === 'WMATIC' ? 'ETH' : token1.address;
  const address2 = token2.symbol === 'WMATIC' ? 'ETH' : token2.address;

  const link =
    platformURL[config.platform] && platformURL[config.platform].addLiquidityUrl
      ? `${platformURL[config.platform].addLiquidityUrl}/${address1}/${address2}`
      : `https://app.uniswap.org/#/add/v2/${address1}/${address2}`;

  const tradelink =
    platformURL[config.platform] && platformURL[config.platform].swapUrl
      ? `${platformURL[config.platform].swapUrl
      }?inputCurrency=${address2}&outputCurrency=${address1}`
      : `https://app.uniswap.org/#/swap?inputCurrency=${address2}&outputCurrency=${address1}&use=V2`;

  return (
    <CustomCardGrid>
      <Grid
        container
        style={{ padding: '32px 32px', position: 'relative' }}
        alignItems={'center'}
      >
        {/* <CardIcon src={farmingSVG} height={32} /> */}
        <Grid item lg={3} style={{ display: 'flex' }}>
          <div>
            <TokenSymbol symbol={props?.info.tokens[0]} size={45} />
            <TokenSymbol
              symbol={props?.info.tokens[1]}
              size={45}
              style={{ marginLeft: '-12px' }}
            />
          </div>
          <div style={{ marginLeft: '16px' }}>
            <TableMainTextStyle>{`${props?.info.tokens[0]} - ${props?.info.tokens[1]}`}</TableMainTextStyle>
            <AddLiquidityButton
              onClick={() => {
                window.open(link, '_blank');
              }}
            >
              Add Liquidity
            </AddLiquidityButton>
          </div>
        </Grid>
        <Grid item lg={3}>
          {/* <TableMainTextStyle>{props?.liquidity}</TableMainTextStyle> */}
        </Grid>
        <Grid item lg={3}>
          {/* <TableMainTextStyle>{props?.volume}</TableMainTextStyle> */}
        </Grid>
        <Grid item lg={1} />
        <Grid item lg={2}>
          <Button
            text="Trade"
            size={'sm'}
            onClick={() => {
              window.open(tradelink, '_blank');
            }}
            tracking_id={`trade_${props?.info.tokens[0]}_${props?.info.tokens[1]}`}
          />
        </Grid>
      </Grid>
    </CustomCardGrid>
  );
};

const CustomCardGrid = styled.div`
  background: linear-gradient(180deg, #48423e 0%, #373030 100%);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-sizing: border-box;
  border-radius: 12px;
  margin: 8px 0px;
  position: relative;
`;

const TableMainTextStyle = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  opacity: 0.88;
  margin: 0;
`;

const AddLiquidityButton = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 140%;
  color: #ff7f57;
  cursor: pointer;
  margin: 0;
`;

export default CustomRowCard;
