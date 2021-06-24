import React from 'react';
import styled from 'styled-components';
import { format } from 'timeago.js';

import { TransactionDetails } from '../../../state/transactions/reducer';
import SuccessIcon from '../../../assets/svg/SuccessTransaction.svg';
import FailedIcon from '../../../assets/svg/failedTransaction.svg';
import PendingIcon from '../../../assets/svg/pendingTransaction.svg';
import config from '../../../config';

const TransactionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TransactionStatusText = styled.div`
  display: flex;
  align-items: center;
  :hover {
    text-decoration: underline;
  }
`;

const TransactionState = styled.a<{ pending: boolean; success?: boolean }>`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none !important;
  border-radius: 0.5rem;
  padding: 0.25rem 0rem;
  font-weight: 500;
  font-size: 0.825rem;
  color: ${(props) => props.theme.color.grey[400]};
`;

const IconWrapper = styled.div<{ pending: boolean; success?: boolean }>`
  color: ${({ pending, success, theme }) =>
    pending ? theme.primary1 : success ? theme.green1 : theme.red1};
`;

const StateWrapper = styled.div<{ pending: boolean; success?: boolean }>`
  color: ${({ pending, success, theme }) =>
    pending ? '#FCB400' : success ? '#00000000' : '#FA4C69'};
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 130%;
`;

interface TransactionProps {
  tx: TransactionDetails;
}

const Transaction: React.FC<TransactionProps> = ({ tx }) => {
  const summary = tx.summary;
  const pending = !tx.receipt;
  const success =
    !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined');
  const date = tx?.confirmedTime || tx?.addedTime

  return (
    <TransactionWrapper>
      <IconWrapper pending={pending} success={success}>
        {pending ? (
          <img src={PendingIcon} alt="arrow" />
          // <MiniLoader stroke='white' />
        ) : success ? (
          <img src={SuccessIcon} alt="arrow" />
          // <CheckCircle size="16" />
        ) : (
          <img src={FailedIcon} alt="arrow" />
          // <Triangle size="16" />
        )}
      </IconWrapper>
      <InfoSection>
        <Title
          href={`${config.etherscanUrl}/tx/${tx.hash}`}
          target="_blank">
          {summary ?? tx.hash}
        </Title>
        <Date>{format(date)}</Date>
      </InfoSection>
      <StateWrapper pending={pending} success={success}>
        {pending ? 'Pending' : success ? '' : 'Failed'}
      </StateWrapper>
    </TransactionWrapper>
  );
};

const InfoSection = styled.div`
  flex: 1;
  text-align: left;
  margin-bottom: 16px;
  margin-left: 14px;
`

const Title = styled.a`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.88);
  margin-bottom: 4px;
  cursor: pointer;
  &:hover {
    color: rgba(255, 255, 255, 0.88);
  }

`

const Date = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.64);
  margin-bottom: 0;


`

export default Transaction;
