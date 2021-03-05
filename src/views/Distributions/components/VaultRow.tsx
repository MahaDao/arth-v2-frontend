import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import TokenSymbol from '../../../components/TokenSymbol';
import useBasisCash from '../../../hooks/useBasisCash';
import InfoIcon from '../../../assets/img/InfoIcon.svg';
import { Vaults } from '../../../basis-cash/config';
import Grid from '@material-ui/core/Grid';
import HtmlTooltip from '../../../components/HtmlTooltip';

interface BoardroomProps {
  vault: Vaults;
  toolTipTitle?: string;
  history?: any;
}

interface StyledCardProps {
  hasDetail?: boolean;
}

const VaultRow: React.FC<BoardroomProps> = (props) => {
  const basisCash = useBasisCash();
  const history = useHistory();

  const vault = basisCash.getBoardroomVault(props.vault);
  const hasDetail = vault.depositTokenName === "ARTH";
  const handleCardClick = () => {
    history.push(`/distribution/v2/${vault.kind}`)
  }

  return (
    <StyledCardWrapper hasDetail={hasDetail}>
      <StyledCard onClick={handleCardClick}>
        <StyledCardContent>
          <Grid container justify="space-between" alignItems="center">
            <Grid container item alignItems="center" direction="row" lg={4} style={{ height: 'fitContent' }}>
              <Grid item>
                {vault.depositTokenName.split("_").map((token, idx) => (
                  <TokenSymbol key={idx} symbol={token} size={36} left={idx > 0 ? -5 : 0} />
                ))}
              </Grid>
              <span style={{ width: 10 }} />
              <Grid container item xs={8} lg={9}>
                <Grid item xs={12}>
                  <StyledTitle>Deposit {vault.depositTokenName.replace("_", "+")}</StyledTitle>
                </Grid>
                {/* <Grid item xs={12}>
                  <StyledTitleSmall>EARN {vault.d}</StyledTitleSmall>
                </Grid> */}
              </Grid>
            </Grid>
            <Grid item xs={6} lg={2} style={{ height: 'fitContent' }}>
              <StyledCell>
                {vault.depositTokenName === "ARTH+DAI" && (
                  <>
                    <TokenSymbol symbol={"MahaSwap"} size={36} />
                    <span style={{ width: 10 }} />
                  </>
                )}
                <StyledTitleSmall>{vault.depositTokenName === "ARTH+DAI" ? "MahaSwap" : "-"}</StyledTitleSmall>
              </StyledCell>
            </Grid>
            <Grid item xs={6} lg={2} style={{ height: 'fitContent' }}>
              <StyledCell>
                <BoldText>{vault.seionrageSupplyPercentage}%</BoldText>
                {props.toolTipTitle && (
                  <HtmlTooltip enterTouchDelay={0} title={<span>{props.toolTipTitle}</span>}>
                    <img src={InfoIcon} alt="Inof" width="24px" className="margin-left-5" />
                  </HtmlTooltip>
                )}
              </StyledCell>
            </Grid>

            {/* <Grid item xs={6} lg={2} style={{ height: 'fitContent' }}>
              <StyledCellLeft>
                <BoldText>{vault.history7dayAPY}% Yearly</BoldText>
                {props.toolTipTitle && (
                  <HtmlTooltip enterTouchDelay={0} title={<span>{props.toolTipTitle}</span>}>
                    <img src={InfoIcon} alt="Inof" width="24px" className="margin-left-5" />
                  </HtmlTooltip>
                )}
              </StyledCellLeft>
            </Grid> */}

            <Grid item xs={6} lg={2}>
              <StyledCellRight>
                <SlotTitle>{vault.lockInPeriodDays} day</SlotTitle>
              </StyledCellRight>
            </Grid>
          </Grid>
        </StyledCardContent>

        {false && hasDetail &&
          <StyledCardDetail>
            <Grid container justify="space-between" alignItems="center">
              <StyledText>500.086 MAHASWAP L2-V1</StyledText>
              <StyledText>5000 ARTH Reward Earned</StyledText>
            </Grid>
          </StyledCardDetail>
        }
      </StyledCard>
    </StyledCardWrapper>
  );
};



const StyledCardWrapper = styled.div<StyledCardProps>`
  display: flex;
  position: relative;
  margin: 0px 20px;
  height: ${props => props.hasDetail ? 165 : 115}px;
`;

const StyledCard = styled.div`
  background: ${(props) => props.theme.color.gradients.dark_linear};
  border-radius: 12px;
  box-shadow: 0px 12px 20px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-left: 1px solid rgba(255, 255, 255, 0.16);
  display: flex;
  flex: 1;
  flex-direction: column;
  height: fit-content;
  padding-left: 3px;
  cursor: pointer;
  &:hover {
    border-left: 4px solid #FD5656;
    padding-left: 0px;
  }
`;

const StyledCellRight = styled.div`
  margin-left: 32px;
`;

const SlotTitle = styled.span`
  color: ${(props) => props.theme.color.white};
  font-weight: 600;
  font-size: 14px;
`;
const StyledText = styled.span`
  text-align: center;
  font-weight: 300;
  font-size: 12px;
  color: ${(props) => props.theme.color.grey[500]};
  margin-left: 0px;
`;
const BoldText = styled.span`
  font-weight: 600;
  font-size: 14px;
  margin-right: 5px;
  color: ${(props) => props.theme.color.white};
`;
const StyledCell = styled.div`
  text-align: center;
  height: fit-content;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const StyledCellLeft = styled.div`
  margin-left: 40px;
  height: fit-content;
`;

const StyledTitle = styled.span`
  color: ${(props) => props.theme.color.white};
  font-size: 14px;
  font-weight: 700;
  text-align: center;
`;

const StyledTitleSmall = styled.span`
  color: ${(props) => props.theme.color.grey[500]};
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`;

const StyledCardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: ${props => props.theme.spacing[4]}px;
`

const StyledCardDetail = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: ${props => props.theme.spacing[3]}px ${props => props.theme.spacing[4]}px;
  border-top: 1px solid gray;
`

export default VaultRow;
