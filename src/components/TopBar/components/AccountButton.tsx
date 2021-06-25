import React from 'react';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import Button from '../../Button/Button';
import AccountModal from './AccountModal';
import walletIcon from '../../../assets/svg/wallet-24.svg';
import CustomModal from '../../CustomModal';
import Loader from 'react-spinners/PulseLoader';
import { Mixpanel } from '../../../analytics/Mixpanel';

interface AccountButtonProps { }

const truncateMiddle = function (fullStr: string, strLen: number, separator: string) {
  if (fullStr.length <= strLen) return fullStr;

  separator = separator || '...';

  var sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
};

const AccountButton: React.FC<AccountButtonProps> = () => {
  const [showModal, toggleModal] = React.useState(false);
  const { account, connect } = useWallet();

  return (
    <>
      {showModal && <AccountModal onClose={() => toggleModal(!showModal)} />}
      <StyledAccountButton>
        {!account ? (
          <Button
            variant="transparent"
            onClick={() => {
              connect('injected').then(() => {
                // Mixpanel.identify(account);
                localStorage.removeItem('disconnectWallet')
              })
            }}
            size="sm"
            text="Connect"
            tracking_id={'connect_wallet'}
          />
        ) : (
          <Button
            onClick={() => toggleModal(true)}
            size="sm"
            variant={'transparent'}
            text={truncateMiddle(account, 11, '.....')}
          >
            <img alt="wallet" src={walletIcon} className="margin-right-10" onClick={() => toggleModal(true)} />
          </Button>
        )}
      </StyledAccountButton>
    </>
  );
};

const StyledAccountButton = styled.div``;
const ModalSpan = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.88);
  margin: 15px 0px 0px 0px;
`;
export default AccountButton;
