import React, { useState } from 'react';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import styled from 'styled-components';
import MenuIcon from '@material-ui/icons/Menu';
import InputBase from '@material-ui/core/InputBase';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Container from '../Container';
import Logo from '../Logo';
import { useWallet } from 'use-wallet';
import AccountButton from './components/AccountButton';
import Nav from './components/Nav';
import MobileNav from './components/MobileNav';
import TxButton from './components/TxButton';
import CloseIcon from '../../assets/img/CloseIcon.svg';
import InfoIcon from '../../assets/img/InfoIcon.svg';
import ExpandMore from '../../assets/img/ExpandMore.svg';
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

const TopBar: React.FC = () => {
  const { account } = useWallet();
  const [netWrokType, setNetworkType] = React.useState('mainnet');
  const [showWarning, toggleWarning] = useState(false);
  const [showMobileMenu, toggleMobileMenu] = useState(false);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setNetworkType(event.target.value as string);
  };

  return (
    <>
      <StyledTopBar>
        <Container size="lg">
          <StyledTopBarInner>
            <div className="dialog-class">
              <Logo />
              <HideonPhone>
                <Nav />
              </HideonPhone>
            </div>
            <HideonPhone>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <TxButton />
                {false && (
                  <Select
                    labelId="demo-customized-select-label"
                    id="demo-customized-select"
                    value={netWrokType}
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
                )}
                <AccountButton />
              </div>
            </HideonPhone>
            <HideOnBigScreen>
              <div className="dialog-class">
                {!!account && (
                  <div style={{ maxWidth: '340px', width: '100%', margin: '0px 15px' }}>
                    <TxButton />
                  </div>
                )}
                {!showMobileMenu ? (
                  <MenuIcon
                    style={{ color: 'white' }}
                    className="pointer"
                    onClick={() => toggleMobileMenu(true)}
                  />
                ) : (
                    <img
                      src={CloseIcon}
                      width="24px"
                      alt=""
                      className="pointer"
                      onClick={() => toggleMobileMenu(false)}
                    />
                  )}
              </div>
            </HideOnBigScreen>
            {showMobileMenu && <MobileNav />}
          </StyledTopBarInner>
        </Container>
      </StyledTopBar>
      {showWarning && (
        <ShowWarning>
          <ShowWarningInner>
            <img src={InfoIcon} alt="" width="24px" className="margin-right-5" />
            Please make sure that you are connected to matic mumbai TESTnet.
            <img
              src={CloseIcon}
              width="24px"
              alt=""
              className="pointer"
              onClick={() => toggleWarning(false)}
            />
          </ShowWarningInner>
        </ShowWarning>
      )}
    </>
  );
};
const HideonPhone = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    display: none;
  } ;
`;
const HideOnBigScreen = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
  } ;
`;
const StyledTopBar = styled.div`
  position: fixed;
  width: 100%;
  z-index: 2;
  background: #151414;
`;
const ShowWarningInner = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  margin: 0px 20px;
  color: rgba(255, 255, 255, 0.88);
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 800px;
  position: relative;
`;
const ShowWarning = styled.div`
  background: #ba1e38;
  padding: 10px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const StyledTopBarInner = styled.div`
  align-items: center;
  display: flex;
  height: ${(props) => props.theme.topBarSize}px;
  justify-content: space-between;
  max-width: ${(props) => props.theme.siteWidth}px;
  width: 100%;
  flex-wrap: wrap;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;
const ColorIcon = styled.div`
  background: ${(colorProps: { colorCode: string }) => colorProps.colorCode};
  width: 10px;
  border-radius: 50%;
  height: 10px;
  margin-right: 5px;
  margin-left: -10px;
`;
export default TopBar;
