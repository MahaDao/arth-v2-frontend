import React from 'react';
import styled from 'styled-components';

import Button from '../../../../components/Button';
import TokenSymbol from '../../../../components/TokenSymbol';
import CardContent from '../../../../components/CardContent';
import CardIcon from '../../../../components/CardIcon';
import useEarningsOnBoardroomV2 from '../../../../hooks/useEarningsOnBoardroomV2';
import { getDisplayBalance } from '../../../../utils/formatBalance';
import { VaultInfo } from '../../../../basis-cash/types';

const HarvestArth = ({ vault }: { vault: VaultInfo }) => {
  const [earnings, contractBalance, claimRewards, reinvestRewards] =
    useEarningsOnBoardroomV2(vault, vault.arthBoardroom);

  const canClaim = earnings.lte(contractBalance) && !earnings.eq(0)

  // if (earnings.eq(0)) return <div />

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyleLabel>ARTH Earned </StyleLabel>
          <StyledCardHeader>
            <CardIcon>
              <TokenSymbol symbol="ARTH" />
            </CardIcon>
            <StyledValue>{getDisplayBalance(earnings)}</StyledValue>
          </StyledCardHeader>
        </StyledCardContentInner>
        <p style={{ color: '#fff9' }}>
          You earn ARTH rewards when the protocol is in expansion
        </p>
        {
          earnings.gt(contractBalance) && earnings.gt(0) && (
            <p style={{ color: '#fff9' }}>
              However the contract's claimable balance
                is {getDisplayBalance(contractBalance)} ARTH. Which
                is not sufficient for your rewards to get claimed.
                By the next epoch rewards will be allocated for you to claim.
            </p>
          )
        }
        <StyledCardActions>
          <Button onClick={reinvestRewards} text={`Compound Rewards to ARTH Pool`} disabled={!canClaim} />
        </StyledCardActions>
        <br />
        <StyledCardActions>
          <Button onClick={claimRewards} text={`Claim ARTH Rewards`} disabled={!canClaim} />
        </StyledCardActions>
      </CardContent>
    </Card>
  );
};
const StyledValue = styled.div`
  color: rgba(255, 255, 255, 0.95);
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
export default HarvestArth;
