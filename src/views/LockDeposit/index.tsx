import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';

import Button from '../../components/Button';
import DepositModal from './components/DepositModal';
import BoardroomSection from './components/BoardroomSection';

const LockDeposit = () => {
  const { account, connect } = useWallet();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [symbolSelected, setSymbolSelected] = useState<'ARTH' | 'ARTHX' | ''>('')

  return (
    <div>
      <Grid container spacing={2} style={{ marginTop: '32px' }}>
        <Grid item lg={3} md={3} sm={12} xs={12}>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <BoardroomSection
            price={1}
            title={"Convert ARTH into Debt"}
            text1={"This debt pool allows users to convert their ARTH token into debt to the protocol. The protocol promises to pay all holders of this pool their ARTH (polygon) tokens at a price of 1$."}
            text2={"Once your deposit your tokens; You will not be able to withdraw them from this pool. You will earn rewards in USDC until the debt is paid off."}
            symbol="ARTH"
          />
          <BoardroomSection
            price={0.012}
            title={"Convert ARTHX into Debt"}
            text1={"This debt pool allows users to convert their ARTHX token into debt to the protocol. The protocol promises to pay all holders of this pool their ARTHX (polygon) tokens at a price of 0.012$."}
            text2={"Once your deposit your tokens; You will not be able to withdraw them from this pool. You will earn rewards in USDC until the debt is paid off."}
            symbol="ARTHX"
          />
        </Grid>
        <Grid item lg={3} md={3} sm={12} xs={12}>
        </Grid>
      </Grid>
      {openModal && symbolSelected !== '' &&
        (<DepositModal
          onCancel={() => {
            setOpenModal(false);
            setSymbolSelected('');
          }}
          onDeposit={() => { }}
          symbol={symbolSelected}
        />)
      }
    </div>
  )
}

export default LockDeposit;

const ButtonConatiner = styled.div`
  margin-top: 20px;
  @media (max-width: 600px) {
    margin-top: 24px;
  }
`;

const CustomInfoCard = styled.div`
  margin-top: 16px;
  @media (max-width: 600px) {
    margin-top: 24px;
  }
`;

const CustomInfoCardDetails = styled.div`
  margin: 10px 0;
`;

const TextWithIcon = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.88);
  opacity: 0.64;
  vertical-align: center;
`;

const CardTitle = styled.div`
  padding: 0;
  margin: 0;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: rgba(255, 255, 255, 0.88);
`;
