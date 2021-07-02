import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import MintTabContent from './components/Mint';
import Container from '../../components/Container';
import RedeemTabContent from './components/Redeem';
import { WalletAutoConnect } from '../../components/WalletAutoConnect';

const Boardrooms = ( ) => {
  // @ts-ignore
  const { paramType } = useParams();
  const [type, setType] = useState<'mint' | 'redeem'>(paramType || 'mint');

  useEffect(() => window.scrollTo(0, 0), []);
  WalletAutoConnect();

  return (
    <>
      <GradientDiv />
      <Container size="lg">
        {type === 'mint' && (
          <MintTabContent setType={(type: 'mint' | 'redeem') => setType(type)} />
        )}
        {type === 'redeem' && (
          <RedeemTabContent setType={(type: 'mint' | 'redeem') => setType(type)} />
        )}
      </Container>
    </>
  );
};

const GradientDiv = styled.div`
  background: linear-gradient(180deg, #2a2827 0%, rgba(42, 40, 39, 0) 100%);
  height: 270px;
  position: absolute;
  width: 100%;
  z-index: -5;
`;

export default Boardrooms;
