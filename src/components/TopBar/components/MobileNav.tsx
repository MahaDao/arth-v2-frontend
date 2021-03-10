import React from 'react';
import styled from 'styled-components';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { NavLink } from 'react-router-dom';
import AccountButton from './AccountButton';
import ExpandMore from '../../../assets/img/ExpandMore.svg';
const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      borderRadius: 8,
      color: 'white',
      border: '1px solid white',
      fontSize: 14,
      padding: '0px 15px',
      marginRight: '20px',
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      position: 'relative',
      backgroundColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:focus': {
        borderRadius: 8,
      },
    },
  }),
)(InputBase);
const MobileNav: React.FC = () => {
  const [netWrokType, setNetworkType] = React.useState('mainnet');
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setNetworkType(event.target.value as string);
  };
  return (
    <StyledNav>
      {/* <StyledLink exact activeClassName="active" to="/">
        Home
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/supply">
        Supply
      </StyledLink> */}
      <StyledLink exact activeClassName="active" to="/stats">
        Stats
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/staking">
        Staking
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/bonds">
        Bonds
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/distribution">
        Distribution
      </StyledLink>
      {false && (
        <StyledButton>
          <div style={{ maxWidth: '340px', width: '100%', margin: '0px 15px' }}>
            <Select
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              value={netWrokType}
              fullWidth
              label="Mainnet"
              onChange={handleChange}
              input={<BootstrapInput />}
              IconComponent={() => <img src={ExpandMore} width="24px" alt="" />}
            >
              <MenuItem value="mainnet">
                <ColorIcon colorCode="#11af60" />
                Mainnet
              </MenuItem>
              <MenuItem value="ropsten">
                <ColorIcon colorCode="#FA4C69" />
                Ropsten
              </MenuItem>
              <MenuItem value="kovan">
                <ColorIcon colorCode="#7A3CF6" />
                Kovan
              </MenuItem>
              <MenuItem value="rinkeby">
                <ColorIcon colorCode="#FCB400" />
                Rinkeby
              </MenuItem>
              <MenuItem value="goerli">
                <ColorIcon colorCode="#BD9CFF" />
                Goerli
              </MenuItem>
            </Select>
          </div>
        </StyledButton>
      )}
      <StyledButton>
        <div style={{ maxWidth: '340px', width: '100%', margin: '0px 15px' }}>
          <AccountButton />
        </div>
      </StyledButton>
      {/* <StyledLink2 href="https://snapshot.page/#/basiscash.eth" target="_blank">
        Vote
      </StyledLink2> */}
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  z-index: 100;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  top: 73px;
  width: 100%;
  left: 0px;
  background: #1f1d1d;
  // backdrop-filter: blur(70px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const StyledLink = styled(NavLink)`
  color: ${(props) => props.theme.color.grey[400]};
  height: 69px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.64);
  font-weight: 600;
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  &:hover {
    color: rgba(255, 255, 255, 0.64);
    background: rgba(255, 255, 255, 0.04);
    // backdrop-filter: blur(70px);
  }
  &.active {
    color: rgba(255, 255, 255, 0.88);
  }
`;
const StyledButton = styled.div`
  color: ${(props) => props.theme.color.grey[400]};
  height: 69px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.64);
  font-weight: 600;
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  &:hover {
    color: rgba(255, 255, 255, 0.64);
    background: rgba(255, 255, 255, 0.04);
    // backdrop-filter: blur(70px);
  }
  &.active {
    color: rgba(255, 255, 255, 0.88);
  }
`;
const ColorIcon = styled.div`
  background: ${(colorProps: { colorCode: string }) => colorProps.colorCode};
  width: 10px;
  border-radius: 50%;
  height: 10px;
  margin-right: 5px;
  margin-left: -10px;
`;
export default MobileNav;
