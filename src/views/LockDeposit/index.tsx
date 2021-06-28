import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';

import Button from '../../components/Button';
import DepositModal from './components/DepositModal';

const LockDeposit = () => {
  const { account, connect } = useWallet();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [symbolSelected, setSymbolSelected] = useState<'ARTH' | 'ARTHX' | ''>('')

  return(
    <div>
      <Grid container spacing={2} style={{ marginTop: '32px' }}>
        <Grid item lg={3} md={3} sm={12} xs={12}>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <CustomInfoCard className={'custom-mahadao-box'}>
            <CustomInfoCardDetails>
              <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <CardTitle>
                    Deposit ARTHX
                  </CardTitle>
                  <TextWithIcon>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                    when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    It has survived not only five centuries, but also the leap into electronic typesetting,
                    remaining essentially unchanged.
                  </TextWithIcon>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <ButtonConatiner>
                    {!!!account ? (
                      <Button
                        text={'Connect Wallet'}
                        size={'lg'}
                        onClick={() =>
                          connect('injected').then(() => {
                            localStorage.removeItem('disconnectWallet');
                          })
                        }
                      />
                    ) : (
                      <Button text={'Deposit ARTH'} size={'sm'} onClick={() => {
                      setSymbolSelected('ARTH');
                      setOpenModal(true);
                      }} />
                    )}
                  </ButtonConatiner>
                </Grid>
              </Grid>
            </CustomInfoCardDetails>
          </CustomInfoCard>
          <CustomInfoCard className={'custom-mahadao-box'} style={{marginTop: '24px'}}>
            <CustomInfoCardDetails>
              <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <CardTitle>
                    Deposit ARTHX
                  </CardTitle>
                  <TextWithIcon>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                    when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    It has survived not only five centuries, but also the leap into electronic typesetting,
                    remaining essentially unchanged.
                  </TextWithIcon>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <ButtonConatiner>
                    {!!!account ? (
                      <Button
                        text={'Connect Wallet'}
                        size={'lg'}
                        onClick={() =>
                          connect('injected').then(() => {
                            localStorage.removeItem('disconnectWallet');
                          })
                        }
                      />
                    ) : (
                      <Button text={'Deposit ARTHX'} size={'sm'} onClick={() => {
                        setSymbolSelected('ARTHX');
                        setOpenModal(true);
                      }}/>
                    )}

                  </ButtonConatiner>
                </Grid>
              </Grid>
            </CustomInfoCardDetails>
          </CustomInfoCard>
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
          onDeposit={() => {}}
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
