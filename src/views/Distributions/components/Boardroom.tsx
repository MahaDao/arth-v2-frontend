import React from 'react';
import styled from 'styled-components';

import Button from '../../../components/Button';
import Card from '../../../components/Card';
import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import TokenSymbol from '../../../components/TokenSymbol';
import { useWallet } from 'use-wallet';
import useBasisCash from '../../../hooks/useBasisCash';
import InfoIcon from '../../../assets/img/InfoIcon.svg';
import { Boardrooms } from '../../../basis-cash/config';
import HtmlTooltip from '../../../components/HtmlTooltip';


interface BoardroomProps {
  boardroom: Boardrooms
  version: 'v1' | 'v2'
  toolTipTitle?: string;
}

const ArthBoardroom: React.FC<BoardroomProps> = (props) => {
  const { account, connect } = useWallet();
  const basisCash = useBasisCash();

  const boardroom = basisCash.getBoardroom(props.boardroom, props.version);

  return (
    <StyledCardWrapper>
      <Card>
        <CardContent>
          <StyledContent>
            <CardIcon>
              <TokenSymbol symbol={boardroom.depositTokenName} size={54} />
            </CardIcon>
            <StyledTitle>
              Bond {boardroom.depositTokenName}
            </StyledTitle>
            <LockinDiv>
              <StyledInfoSlot>
                <SlotTitle>{boardroom.lockInPeriodDays} day lock-in period</SlotTitle>
              </StyledInfoSlot>
            </LockinDiv>
            <StyledInfoSlots>
              <PercentageContainer>
                <PercentageTilte>
                  <BoldText>{boardroom.seionrageSupplyPercentage}% </BoldText>Seigniorage Supply
                  {props.toolTipTitle && (
                    <HtmlTooltip enterTouchDelay={0} title={<span>{props.toolTipTitle}</span>}>
                      <img src={InfoIcon} alt="Inof" width="24px" className="margin-left-5" />
                    </HtmlTooltip>
                  )}
                </PercentageTilte>
              </PercentageContainer>
            </StyledInfoSlots>
            <StyledInfoSlots></StyledInfoSlots>
            <ButtonContainer>
              {!!account ? (
                <Button text="Select" to={`/distribution/${props.version}/${boardroom.kind}`} />
              ) : (
                <Button onClick={() => connect('injected')} text="Unlock Wallet" />
              )}
            </ButtonContainer>
          </StyledContent>
        </CardContent>
      </Card>
    </StyledCardWrapper>
  );
};
const ButtonContainer = styled.div`
  max-width: 300px;
  width: 100%;
`;
const StyledCardWrapper = styled.div`
  display: flex;
  margin-bottom: 25px;
  max-width: 500px;
  width: 100%;
  position: relative;
`;

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`;

const StyledInfoSlots = styled.div`
  display: flex;
  text-align: center;

  padding-top: 5px;
  padding-bottom: 15px;
`;
const LockinDiv = styled.div`
  display: flex;
  text-align: center;
  padding-bottom: 3px;
  padding-top: 35px;
`;
const StyledInfoSlot = styled.div`
  padding-left: 5px;
  padding-right: 5px;
`;

const SlotTitle = styled.div`
  color: #fff;
  font-weight: 300;
  font-size: 16px;
`;
const PercentageTilte = styled.span`
  text-align: center;
  font-weight: 300;
  font-size: 16px;
  color: #ffffff;
`;
const BoldText = styled.span`
  font-weight: 600;
  font-size: 18px;
  margin-right: 5px;
`;
const PercentageContainer = styled.div`
  background: rgba(255, 255, 255, 0.16);
  border-radius: 60px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 13px 15px;
`;

const StyledTitle = styled.h3`
  color: ${(props) => props.theme.color.grey[200]};
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-top: 20px;
  padding: 0;
`;

export default ArthBoardroom;
