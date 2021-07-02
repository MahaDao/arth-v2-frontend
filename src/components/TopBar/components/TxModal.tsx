import styled from 'styled-components';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom'

import Label from '../../Label';
import Button from '../../Button';
import Spacer from '../../Spacer';
import Transaction from './Transaction';
import { TransactionDetails } from '../../../state/transactions/reducer';
import {
  isTransactionRecent,
  useAllTransactions,
  useClearAllTransactions,
} from '../../../state/transactions/hooks';
import CloseIcon from '../../../assets/img/CloseIcon.svg';
import IconButton from '@material-ui/core/IconButton';


const MAX_TRANSACTION_HISTORY = 10;

interface props {
  onDismiss?: Function;
}

const TxModal: React.FC<props> = ({ onDismiss }) => {
  const [openModal, toggleModal] = useState(true);

  const allTransactions = useAllTransactions();
  const { clearAllTransactions } = useClearAllTransactions();

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt);
  const confirmed = sortedRecentTransactions
    .filter((tx) => tx.receipt)
    .slice(0, MAX_TRANSACTION_HISTORY);

  const handleClose = () => {
    toggleModal(false);
    onDismiss();
  };

  return (
    <MainDiv>
      <BackgroundAbsolute onClick={() => handleClose()} />
      <PositionDiv>
        <WalletDiv>
          <ModalHeader>
            <Title>Recent Transactions</Title>
            <RightSubHeader>
              {sortedRecentTransactions.length > 0 && (
                <ClearAll onClick={clearAllTransactions}>Clear all</ClearAll>
              )}
              <CrossIcon>
                <IconButton aria-label="close" onClick={() => handleClose()}>
                  <img src={CloseIcon} width="24px" alt="" />
                </IconButton>
              </CrossIcon>
            </RightSubHeader>
          </ModalHeader>
          <ModalBody>
            {sortedRecentTransactions.length === 0 && (
              <div>
                <NoTransaction>You haven’t done any transaction yet.</NoTransaction>
                <CallToAction to={'/farming'} onClick={() => handleClose()}>Farm and earn rewards</CallToAction>
              </div>
            )}
            <StyledTransactionList>
              {sortedRecentTransactions.map((tx) => (
                <Transaction key={tx.hash} tx={tx} />
              ))}
            </StyledTransactionList>
            <Spacer size="sm" />
            {/*{
              pending?.length > 0
                ? (

                ) : (
                  <div className="margin-top-bottom-20">
                    <Label text="No pending transactions." color="#777" />
                  </div>
                )
            }
            {
              confirmed?.length > 0
                ? (
                  <>
                    <Divider
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        margin: '15px 0px',
                      }}
                    />
                    <StyledTitleArea style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                      <Label text="Recent transactions" />
                      {"  "}
                      <StyledClearIconWrapper>
                        <Trash onClick={clearAllTransactions} size="16" />
                      </StyledClearIconWrapper>
                    </StyledTitleArea>
                    <StyledTransactionList>
                      {confirmed.map((tx) => (
                        <Transaction key={tx.hash} tx={tx} />
                      ))}
                    </StyledTransactionList>
                  </>
                )
                : (
                  <div className="margin-top-bottom-20">
                    <Label text="No recent transactions." color="#777" />
                  </div>
                )
            }*/}
          </ModalBody>
        </WalletDiv>
      </PositionDiv>
    </MainDiv>
  );
};

const BackgroundAbsolute = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
  width: 100vw;
  height: 100vh;
  z-index: 1;
`;

const MainDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
  width: 100vw;
  height: 100vh;
`;

const PositionDiv = styled.div`
  box-sizing: border-box;
  margin: 0px auto;
  padding: 0px 24px;
  width: 100%;
  position: relative;
`;

const WalletDiv = styled.div`
  position: absolute;
  background: linear-gradient(180deg, #48423e 0%, #373030 100%);
  border-radius: 12px;
  right: 22px;
  top: 72px;
  width: 380px;
  z-index: 10;
  transition: 1s ease-in-out;
  @media (max-width: 600px) {
    width: 100vw;
    left: 0;
    right: 0;
  }
`;

const ModalHeader = styled.div`
  margin: 12px 24px 0 24px;
  padding: 0 0 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
`


const Title = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #FFFFFF;
  margin-bottom: 0;
`

const RightSubHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ClearAll = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.32);
  cursor: pointer;
  margin-bottom: 0;
`

const CrossIcon = styled.div`
  margin-right: -12px;
`

const StyledTitleArea = styled.div`
  display: flex;
  align-items: center;
`;

const ModalBody = styled.div`
  padding: 24px;
  overflow-y: scroll;
  max-height: calc(360px - 72px);
`

const NoTransaction = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.88);
  margin-bottom: 8px;
  padding: 0 12px;
  text-align: center;
`

const CallToAction = styled(Link)`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 150%;
  color: #F7653B;
  text-align: center;
  width: 100%;
  display: block;
  &:hover {
    color: #F7653B;
  }


`

const StyledClearIconWrapper = styled.div`
  color: ${({ theme }) => theme.color.grey[300]};
`;

const StyledTransactionList = styled.div`
  display: flex;
  flex-direction: column;
`;

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime;
}

export default TxModal;
