import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Countdown from 'react-countdown';

import DepositModal from './components/DepositModal';
import BoardroomSection from './components/BoardroomSection';
import styled from 'styled-components';

const LockDeposit = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [symbolSelected, setSymbolSelected] = useState<'ARTH' | 'ARTHX' | ''>('')

  return (
    <div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '80px 0px 0',
      }}>
        <PageHeading>{'DEPT POOL'}</PageHeading>
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <PageSubHeading>
            <StartsIn>Closes in</StartsIn>
            <Countdown
              date={new Date('2021-07-04T15:00:00Z')}
              renderer={({ days, hours, minutes, seconds, completed }) => {
                return (
                  <HeaderSpan>
                    {days}d : {hours}h : {minutes}m : {seconds}s
                  </HeaderSpan>
                );
              }}
            />
          </PageSubHeading>
        </div>
      </div>
      <Grid container spacing={2}>
        <Grid item lg={3} md={3} sm={12} xs={12}>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <BoardroomSection
            price={0.012}
            title={"Convert ARTHX into Debt"}
            text1={"This debt pool allows users to convert their ARTHX token into debt to the protocol. The protocol promises to pay all holders of this pool their ARTHX (polygon) tokens at a price of 0.012$."}
            text2={"Once your deposit your tokens; You will not be able to withdraw them from this pool. You will earn rewards in USDC until the debt is paid off."}
            symbol="ARTHX"
          />
          <BoardroomSection
            price={1}
            title={"Convert ARTH into Debt"}
            text1={"This debt pool allows users to convert their ARTH token into debt to the protocol. The protocol promises to pay all holders of this pool their ARTH (polygon) tokens at a price of 1$."}
            text2={"Once your deposit your tokens; You will not be able to withdraw them from this pool. You will earn rewards in USDC until the debt is paid off."}
            symbol="ARTH"
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

const PageHeading = styled.p`
  font-family: Syne;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 29px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-align: center;
  color: #ffffff;
`;

const PageSubHeading = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.64);
  text-align: center;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StartsIn = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.88);
  opacity: 0.64;
`;

const HeaderSpan = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  display: flex;
  margin: 0 0 0 8px;
  color: #ffffff;
`;
