import React from 'react';
import styled from 'styled-components';

import Button from '../../../../components/Button';
import TokenSymbol from '../../../../components/TokenSymbol';
import CardContent from '../../../../components/CardContent';
import CardIcon from '../../../../components/CardIcon';
import useEarningsOnBoardroomV2 from '../../../../hooks/useEarningsOnBoardroomV2';
import { getDisplayBalance } from '../../../../utils/formatBalance';
import { VaultInfo } from '../../../../basis-cash/types';

const HarvestMaha = ({ vault }: { vault: VaultInfo }) => {
  const [earnings, contractBalance, claimRewards, reinvestRewards] =
    useEarningsOnBoardroomV2(vault, vault.arthBoardroom);

  const canClaim = false // earnings.lte(contractBalance) && !earnings.eq(0)

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyleLabel>MAHA Earned </StyleLabel>
          <StyledCardHeader>
            <CardIcon>
              <TokenSymbol symbol="MAHA" />
            </CardIcon>
            {/* <StyledValue>{getDisplayBalance(earnings)}</StyledValue> */}
            <StyledValue>0.00</StyledValue>
          </StyledCardHeader>
        </StyledCardContentInner>
        <p style={{ color: '#fff9' }}>
          You earn MAHA rewards when the protocol is in contraction.
        </p>
        {/* <p style={{ color: '#fff9' }}>
          Your rewards are vested linearly across 8 hours from the last epoch.
          If you claim your rewards now you will be able to claim {getDisplayBalance(claimable)} MAHA
        </p> */}
        {/* <br /> */}
        <StyledCardActions>
          <Button onClick={reinvestRewards} text={`Compound Rewards to MAHA Pool`} disabled={!canClaim} />
        </StyledCardActions>
        <br />
        <StyledCardActions>
          {/* <Button onClick={onReward} text={`Claim ${getDisplayBalance(claimable)} MAHA`} disabled={earnings.eq(0)} /> */}
          {/* <Button onClick={onReward} text={`Claim   MAHA`} disabled={earnings.eq(0)} /> */}
          <Button text={`Claim MAHA Rewards`} disabled={true} />
        </StyledCardActions>
      </CardContent>
    </Card>
  );
};
const StyledValue = styled.div`
  color: rgba(255, 255, 255, 0.88);
  font-size: 24px;
  margin-left: 20px;
  font-weight: bold;
`;
const StyleLabel = styled.div`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 10px;
  align-self: start;
  line-height: 24px;
  color: #ffffff;
  opacity: 0.64;
`;
const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  width: 100%;
  flex-direction: row;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;

  width: 100%;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Card = styled.div`
  background: rgba(255, 255, 255, 0.02);
  // backdrop-filter: blur(21px);
  border-radius: 12px;
  display: flex;
  width: 100%;
  max-width: 500px;
  flex-direction: column;
`;
export default HarvestMaha;
