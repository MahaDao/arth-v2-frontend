import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

interface props {
  isMainnet: boolean;
}

const Nav = (props: props) => {
  return (
    <StyledNav>
      {/* <StyledLink
        exact
        activeClassName="active"
        to="/stats"
      >
        Analytics
      </StyledLink> */}

      <StyledLink exact activeClassName="active" to="/lock-deposit">
        Debt pool
      </StyledLink>
      {/* <StyledLink exact activeClassName="active" to="/mint/mint">
        Mint/Redeem
      </StyledLink> */}
      {/* <StyledLink exact activeClassName="active" to="/stabilize/recollateralize">
        Stabilize
      </StyledLink> */}
      <StyledLink exact activeClassName="active" to="/farming">
        Farming
      </StyledLink>
      {/* <StyledLink exact activeClassName="active" to="/rebase">
        Rebase
      </StyledLink> */}
      {/* <StyledLink exact activeClassName="active" to="/lottery">
        Lottery
      </StyledLink> */}
      {/* <StyledLink exact activeClassName="active" to="/trade">
        Trade
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/pools">
        Pools
      </StyledLink> */}
      {/* <StyledLink exact activeClassName="active" to="/trade">
        Trade
      </StyledLink> */}
      {/* {
        !props.isMainnet && (
          <StyledLink exact activeClassName="active" to="/faucet">
            Faucet
          </StyledLink>
        )
      } */}
      {/*<StyledLink exact activeClassName="active" to="/pools">
        Pools
      </StyledLink>*/}
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
