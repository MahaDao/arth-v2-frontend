import React, { useState } from 'react';
import styled from 'styled-components';
import TokenSymbol from '../../../components/TokenSymbol';
import Grid from '@material-ui/core/Grid';
import Button from '../../../components/Button';

type props = {
  pair: [string, string];
  wallet: string;
  apy: string;
  poolDuration: string;
  days: number;
  deposited: boolean;
  lockedState?: string;
  earned?: string;
};

const CustomRowCard: React.FC<props> = (props) => {

  return (
    <CustomCardGrid>
      <Grid container style={{padding: '32px 32px'}} alignItems={'center'}>
        <Grid item lg={3} style={{ display: 'flex' }}>
          <div>
            <TokenSymbol symbol={props.pair[0]} size={45}/>
            <TokenSymbol symbol={props.pair[1]} size={45} style={{marginLeft: '-12px'}}/>
          </div>
          <div style={{marginLeft: '16px'}}>
            <TableMainTextStyle>
              {`${props.pair[0]} - ${props.pair[1]}`}
            </TableMainTextStyle>
            <AddLiquidityButton>
              Add Liquidity
            </AddLiquidityButton>
          </div>
        </Grid>
        <Grid item lg={3}>
          <TableMainTextStyle>
            {props.wallet}
          </TableMainTextStyle>
        </Grid>
        <Grid item lg={1}>
          <TableMainTextStyle>
            {props.apy}
          </TableMainTextStyle>
        </Grid>
        <Grid item lg={3}>
          <TableMainTextStyle>
            {props.poolDuration}
          </TableMainTextStyle>
          <DayText>
            {props.days}
          </DayText>
        </Grid>
        <Grid item lg={2}>
          <Button
            text="Deposit"
            size={'sm'}
          />
        </Grid>
      </Grid>
      {props.deposited && <DepositInfoContainer>
        <div style={{ display: 'flex' }}>
          Your Locked state
          <TableMainTextStyle style={{ marginLeft: '10px' }}>
            {props.lockedState}
          </TableMainTextStyle>
          <WithdrawClaimButton>
            Withdraw
          </WithdrawClaimButton>
        </div>
        <div style={{ display: 'flex' }}>
          Earned:
          <TableMainTextStyle style={{ marginLeft: '10px' }}>
            {props.earned}
          </TableMainTextStyle>
          <WithdrawClaimButton>
            Claim MAHA
          </WithdrawClaimButton>
        </div>
      </DepositInfoContainer>}
    </CustomCardGrid>
  )
}

const CustomCardGrid = styled.div`
  background: linear-gradient(180deg, #48423E 0%, #373030 100%);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-sizing: border-box;
  border-radius: 12px;
  margin: 8px 0px;
`

const TableMainTextStyle = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #FFFFFF;
  opacity: 0.88;
  margin: 0;
`

const AddLiquidityButton = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 140%;
  color: #FF7F57;
  margin: 0;
`

const DayText = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 140%;
  color: rgba(255, 255, 255, 0.64);
  opacity: 0.88;
  margin: 0;
`

const DepositInfoContainer = styled.div`
  background: #423B38;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  box-sizing: border-box;
  border-radius: 0 0 12px 12px;
  padding: 20px 32px;
  display: flex;
  justify-content: space-between;
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 140%;
  color: rgba(255, 255, 255, 0.64);
  opacity: 0.88;
`

const WithdrawClaimButton = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #FF7F57;
  margin: 0 0 0 10px;
  cursor: pointer;

`

export default CustomRowCard;

