import React from 'react';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import Button from '../../Button/Button';
import ButtonColored from '../../Button/';
import AccountModal from './AccountModal';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
interface AccountButtonProps {}

const truncateMiddle = function (fullStr: string, strLen: number, separator: string) {
  if (fullStr.length <= strLen) return fullStr;

  separator = separator || '...';

  var sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
};

const AccountButton: React.FC<AccountButtonProps> = (props) => {
  const [showModal, toggleModal] = React.useState(false);

  const { account, connect } = useWallet();

  return (
    <>
      {showModal && <AccountModal onCancel={() => toggleModal(false)} />}
      <StyledAccountButton>
        {!account ? (
          <Button variant='transparent' onClick={() => connect('injected')} size="sm" text="Connect" />
        ) : (
          <ButtonColored
            onClick={() => toggleModal(true)}
            size="sm"
            text={truncateMiddle(account, 15, '.....')}
          >
            <AccountBalanceWalletOutlinedIcon className="margin-right-10 font20" />
          </ButtonColored>
        )}
      </StyledAccountButton>
    </>
  );
};

const StyledAccountButton = styled.div``;

export default AccountButton;
