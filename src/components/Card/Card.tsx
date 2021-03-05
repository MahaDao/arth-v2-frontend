import React from 'react';
import styled from 'styled-components';

const Card: React.FC = ({ children }) => <StyledCard>{children}</StyledCard>;

const StyledCard = styled.div`
  background: ${(props) => props.theme.color.gradients.dark_linear};
  border-radius: 12px;
  box-shadow: 0px 12px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export default Card;
