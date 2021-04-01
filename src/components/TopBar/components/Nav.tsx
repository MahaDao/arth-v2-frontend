import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const Nav: React.FC = () => {
  return (
    <StyledNav>
      {/* <StyledLink exact activeClassName="active" to="/">
        Home
      </StyledLink> */}
      {/*<StyledLink exact activeClassName="active" to="/supply">
        Supply
      </StyledLink> */}
      {/* <StyledLink exact activeClassName="active" to="/stats">
        Stats
      </StyledLink> */}
      <StyledLink exact activeClassName="active" to="/distribution">
        Distribution
      </StyledLink>
      {/* <StyledLink exact activeClassName="active" to="/bonds">
        Bonds
      </StyledLink> */}
      <StyledLink exact activeClassName="active" to="/farming">
        Farming
      </StyledLink>

      <StyledALink target="_blank" href="https://mahaswap.com/">
        Trade
      </StyledALink>
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`;

const StyledLink = styled(NavLink)`
  color: ${(props) => props.theme.color.grey[400]};
  height: 69px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  &:hover {
    color: #fff;
    background: linear-gradient(180deg, rgba(244, 127, 87, 0) 0%, rgba(253, 86, 86, 0.1) 100%);
    border-bottom: 2px solid rgba(253, 86, 86, 0.3);
    text-decoration: none;
  }
  &.active {
    border-bottom: 2px solid #f47f57;
    background: linear-gradient(180deg, rgba(244, 127, 87, 0) 0%, rgba(253, 86, 86, 0.1) 100%);
    color: #fff;
  }
`;

const StyledALink = styled.a`
  color: ${(props) => props.theme.color.grey[400]};
  height: 69px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  &:hover {
    color: #fff;
    background: linear-gradient(180deg, rgba(244, 127, 87, 0) 0%, rgba(253, 86, 86, 0.1) 100%);
    border-bottom: 2px solid rgba(253, 86, 86, 0.3);
    text-decoration: none;
  }
  &.active {
    border-bottom: 2px solid #f47f57;
    background: linear-gradient(180deg, rgba(244, 127, 87, 0) 0%, rgba(253, 86, 86, 0.1) 100%);
    color: #fff;
  }
`;

export default Nav;
