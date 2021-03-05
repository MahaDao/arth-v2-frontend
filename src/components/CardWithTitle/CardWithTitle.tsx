import React, { ReactElement } from 'react';
import styled from 'styled-components';

interface CardProps {
  title?: string;
  titleComponent?: boolean;
  fullWidth?: boolean;
}

const Card: React.FC<CardProps> = ({ title, titleComponent, fullWidth, children }) => (
  <StyledCard style={fullWidth ? {width: "100%"} : {}}>
    <StyledHeader>
      {titleComponent && ((children as ReactElement[])[0])}
      {title && <StyledHeaderText>{title}</StyledHeaderText>}    
    </StyledHeader>
    { titleComponent ? ((children as ReactElement[])[1]) : children }
  </StyledCard>
);

const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgb(255, 255, 255, 0.02);
  border-radius: 12px;
  border-top: 1px solid rgba(255, 116, 38, 0.1);
  border-left: 1px solid rgba(255, 116, 38, 0.08);
  border-right: 1px solid rgba(255, 116, 38, 0.08);
  border-bottom: 1px solid rgba(255, 116, 38, 0.01);
  backdrop-filter: blur(70px);
`;

const StyledHeader = styled.header`
  border-bottom: 1px solid ${(props) => props.theme.color.alpha[8]};
  padding: 20px 24px;
  margin-bottom: 10px;
`;

const StyledHeaderText = styled.h6`
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => props.theme.color.grey[300]};
  margin: 0;
`;

export default Card;
