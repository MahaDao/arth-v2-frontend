import React from 'react';
import styled from 'styled-components';
import Card from '../../../components/InfoCard';
import InfoIcon from '../../../assets/img/InfoWarning.svg';
import HtmlTooltip from '../../../components/HtmlTooltip';
interface StatProps {
  icon?: string;
  title: string;
  description: string;
  toolTipTitle?: string;
  toolTipLink?: string;
}

const Stat: React.FC<StatProps> = ({ icon, title, description, toolTipTitle, toolTipLink }) => {
  return (
    <Card>
      <StyledCardContentInner>
        {icon && <StyledIcon>{icon}</StyledIcon>}
        <StyledTextWrapper>
          <StyledDesc>
            <StyledLink href={toolTipLink} target="_blank">
              {description}
            </StyledLink>
            <HtmlTooltip enterTouchDelay={0} title={<span>{toolTipTitle}</span>}>
              <img src={InfoIcon} alt="Inof" width="16px" className="margin-left-5" />
            </HtmlTooltip>
          </StyledDesc>
          <StyledCardTitle>{title}</StyledCardTitle>
        </StyledTextWrapper>
      </StyledCardContentInner>
    </Card>
  );
};

const StyledCardTitle = styled.div`
  color: ${(props) => props.theme.color.grey[200]};
  font-size: 18px;
  font-weight: 700;
`;
const StyledLink = styled.a`
  color: ${(props) => props.theme.color.grey[400]};
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
const StyledDesc = styled.span`
  color: ${(props) => props.theme.color.grey[400]};
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const StyledIcon = styled.span`
  font-size: 28px;
  margin-right: 10px;
`;

const StyledTextWrapper = styled.span`
  display: flex;
  flex-direction: column;
`;

const StyledCardContentInner = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: ${(props) => props.theme.spacing[2]}px; ${(props) => props.theme.spacing[4]}px;
`;

export default Stat;
