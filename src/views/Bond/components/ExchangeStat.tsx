import React from 'react';
import styled from 'styled-components';
import InfoCard from '../../../components/InfoCard';
import InfoIcon from '../../../assets/img/InfoWarning.svg';
import HtmlTooltip from '../../../components/HtmlTooltip';

interface ExchangeStatProps {
  title: string;
  description: string;
  toolTipTitle?: string;
}

const ExchangeStat: React.FC<ExchangeStatProps> = ({ title, description, toolTipTitle }) => {
  return (
    <InfoCard>
      <StyledCardContentInner>
        <StyledDesc>
          {description}
          {toolTipTitle && (
            <HtmlTooltip enterTouchDelay={0} title={<span>{toolTipTitle}</span>}>
              <img src={InfoIcon} alt="Inof" width="16px" className="margin-left-5" />
            </HtmlTooltip>
          )}
        </StyledDesc>
        <StyledCardTitle>{title}</StyledCardTitle>
      </StyledCardContentInner>
    </InfoCard>
  );
};

const StyledCardTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  text-align: left;
  color: #ffffff;
  opacity: 0.88;
  margin-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const StyledDesc = styled.span`
  color: #ffffff;
  opacity: 0.64;
  text-align: left;
  margin-bottom: 10px;
  font-size: 12px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const StyledCardContentInner = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  // align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 10px 20px;
`;

export default ExchangeStat;
