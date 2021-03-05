import React from 'react';
import { useWallet } from 'use-wallet';

import styled from 'styled-components';
import useBasisCash from '../../../hooks/useBasisCash';

import Button from '../../../components/Button';
import BoardroomCards from './BoardroomCards';

const Boardroom = () => {
  const { account } = useWallet();
  const basisCash = useBasisCash();

  if (!!!account || !basisCash) return <UnlockWallet />;

  return <BoardroomCards />;
};

const UnlockWallet = () => {
  const { connect } = useWallet();
  return (
    <Center>
      <Button onClick={() => connect('injected')} text="Unlock Wallet" />
    </Center>
  );
};

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default Boardroom;
