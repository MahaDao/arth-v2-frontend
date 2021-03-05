import React from 'react';
import styled from 'styled-components';

import TokenSymbol from '../../../../components/TokenSymbol';
import CardContent from '../../../../components/CardContent';
import CardIcon from '../../../../components/CardIcon';
import useEarningsOnBoardroom from '../../../../hooks/useEarningsOnBoardroom';
import { getDisplayBalance } from '../../../../utils/formatBalance';
import { BoardroomInfo } from '../../../../basis-cash';

const Harvest = ({ boardroom }: { boardroom: BoardroomInfo }) => {
  // const { onReward } = useHarvestFromBoardroom(boardroom);
  const earnings = useEarningsOnBoardroom(boardroom.kind, 'v1');

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
            {/* <StyledCardActions>
              <Button onClick={onReward} text="Claim Reward" disabled={earnings.eq(0)} />
            </StyledCardActions> */}
          </StyledCardHeader>
        </StyledCardContentInner>
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


const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Card = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(21px);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
`;
export default Harvest;
