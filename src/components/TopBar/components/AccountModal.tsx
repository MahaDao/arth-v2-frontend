import React, { useMemo } from 'react';
import styled from 'styled-components';
import useTokenBalance from '../../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../../utils/formatBalance';
import Modal from '../../NewModal/index';
import Label from '../../Label';
import useBasisCash from '../../../hooks/useBasisCash';
import TokenSymbol from '../../TokenSymbol';
import { IconButton } from '@material-ui/core';
import metamask from '../../../assets/svg/metamask.svg';
import copy from '../../../assets/svg/copy.svg';
import Container from '../../Container';
import Button from '../../Button';

interface props {
  walletData?: {
    accountNumber: string;
    mahaTokens: number;
    mahaDollars: number;
    arthTokens: number;
    arthDollars: number;
    arthxTokens: number;
    arthxDollars: number;
  }
  onClose: () => void;
}

const AccountModal: React.FC<props> = (props) => {
  const basisCash = useBasisCash();

  const bacBalance = useTokenBalance(basisCash.ARTH);
  const displayBacBalance = useMemo(() => getDisplayBalance(bacBalance), [bacBalance]);

  const basBalance = useTokenBalance(basisCash.MAHA);
  const displayBasBalance = useMemo(() => getDisplayBalance(basBalance), [basBalance]);

  const babBalance = useTokenBalance(basisCash.ARTHB);
  const displayBabBalance = useMemo(() => getDisplayBalance(babBalance), [babBalance]);

  const truncateMiddle = function (fullStr: string = '12345678922500025', strLen: number, separator?: string) {
    if (fullStr.length <= strLen) return fullStr;

    separator = separator || '...';

    var sepLen = separator.length,
      charsToShow = strLen - sepLen,
      frontChars = Math.ceil(charsToShow / 3),
      backChars = Math.floor(charsToShow / 3);

    return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
  };
  // const handleClose = () => {
  //   onCancel();
  // };
  return (
    /*<Modal title="My Wallet" open handleClose={handleClose}>
      <div
      // className="dialog-class display-flex-column margin-left-right-20 margin-bottom-20 border-bottom"
      // style={{ minWidth: '300px' }}
      >
        {/!* <div className="dialog-class-1 width-100">
          <span className="white font18">Connected with Metamask</span>
          {false && (
            <div style={{ maxWidth: '200px' }}>
              <TextButton>Change</TextButton>
            </div>
          )}
        </div> *!/}
        {/!* <WalletDetils>
          <img src={metaMaskIcon} alt="Metamask" width="30px" />
          <CopyToClipboard text="0xf7dDfwefbefbefbfkaD62">
            <div className="dialog-class margin-left-20">
              <span className="white font18 margin-right-5">{`${walletAddress.substring(
                0,
                4,
              )}...${walletAddress.substring(walletAddress.length - 4)}`}</span>
              <img src={copyIcon} className="pointer" width="24px" />
            </div>
          </CopyToClipboard>
        </WalletDetils> *!/}
      </div>
      <Balances>
        <StyledBalanceWrapper>
          <TokenSymbol symbol="MAHA" />
          <Label text="MAHA" color="rgba(255, 255, 255, 0.64)" />
          <StyledBalance>
            <StyledValue>{displayBasBalance}</StyledValue>
            {/!* <Label text="0.01 MAHA" color="rgba(255, 255, 255, 0.64)" /> *!/}
          </StyledBalance>
        </StyledBalanceWrapper>

        <StyledBalanceWrapper>
          <TokenSymbol symbol="ARTH" />
          <Label text="ARTH" color="rgba(255, 255, 255, 0.64)" />
          <StyledBalance>
            <StyledValue>{displayBacBalance}</StyledValue>
            {/!* <Label text="0.01 MAHA" color="rgba(255, 255, 255, 0.64)" /> *!/}
          </StyledBalance>
        </StyledBalanceWrapper>

        <StyledBalanceWrapper>
          <TokenSymbol symbol="ARTHB" />
          <Label text="ARTHB" color="rgba(255, 255, 255, 0.64)" />
          <StyledBalance>
            <StyledValue>{displayBabBalance}</StyledValue>
            {/!* <Label text="0.01 MAHA" color="rgba(255, 255, 255, 0.64)" /> *!/}
          </StyledBalance>
        </StyledBalanceWrapper>
      </Balances>
    </Modal>*/
  <MainDiv onClick={() => props.onClose()}>
    <PositionDiv>
      <WalletDiv>

        <StyledLink>
          <span>
              Your Account
          </span>
          <AccountDetails>
            <IconButton>
              <img height={32} src={metamask} />
            </IconButton>
            <span>{truncateMiddle(props?.walletData?.accountNumber, 15)}</span>
            <IconButton>
              <img height={24} src={copy} />
            </IconButton>
          </AccountDetails>
        </StyledLink>

        <StyledRows>
          <RowName>
            <IconButton>
              <TokenSymbol symbol={'MAHA'} size={44} />
            </IconButton>
            <span>{props?.walletData?.mahaTokens} MAHA</span>
          </RowName>
          <DollarValue>
            ${props?.walletData?.mahaDollars}
          </DollarValue>
        </StyledRows>

        <StyledRows>
          <RowName>
            <IconButton>
              <TokenSymbol symbol={'ARTH'} size={44} />
            </IconButton>
            <span>{props?.walletData?.arthTokens} ARTH</span>
          </RowName>
          <DollarValue>
            ${props?.walletData?.arthDollars}
          </DollarValue>
        </StyledRows>

        <StyledRows>
          <RowName>
            <IconButton>
              <TokenSymbol symbol={'MAHA'} size={44} />
            </IconButton>
            <span>{props?.walletData?.arthxTokens} ARTHX</span>
          </RowName>
          <DollarValue>
            ${props?.walletData?.arthxDollars}
          </DollarValue>
        </StyledRows>

        <StyledRows style={{marginBottom: '20px'}}>
          <Button text={'Disconnect'} size={'lg'} variant={'transparent'}/>
        </StyledRows>
      </WalletDiv>
    </PositionDiv>
  </MainDiv>

  );
};

const MainDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
  width: 100vw;
  height: 100vh;
  z-index: 0;
`

const PositionDiv = styled.div`
  box-sizing: border-box;
  margin: 0px auto;
  max-width: 1200px;
  padding: 0px 24px;
  width: 100%;
  position: relative;
`

const WalletDiv = styled.div`
  position: absolute;
  background: linear-gradient(
    180deg
    ,#48423E 0%,#373030 100%);
  border-radius: 12px;
  right: 22px;
  top: 72px;
  width: 380px;
  z-index: 10;
  transition: 1s ease-in-out;
`

const StyledLink = styled.div`
  padding: 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    &:hover {
        color: rgba(255, 255, 255, 0.64);
        background: rgba(255, 255, 255, 0.04);
        backdrop-filter: blur(70px);
    }
    &.active {
        color: rgba(255, 255, 255, 0.88);
    }
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #FFFFFF;
    cursor: pointer;
`;

const AccountDetails = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

const StyledRows = styled.div`
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0px 24px;
`;

const RowName = styled.div`
    display: flex;
    align-items: center;
    justify-content: baseline;
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: rgba(255, 255, 255, 0.88);
    // border: 1px solid;
    margin-left: -15px;
`;

const DollarValue = styled.div`
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    text-align: right;
    color: rgba(255, 255, 255, 0.64);
    display: flex;
    align-items: center;
`;

export default AccountModal;
