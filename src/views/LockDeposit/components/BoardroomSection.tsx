import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';

import Button from '../../../components/Button';
import DepositModal from './DepositModal';
import useCore from '../../../hooks/useCore';
import useApprove, { ApprovalState } from '../../../hooks/callbacks/useApprove';
import useBoardroomBalance from '../../../hooks/state/debtBoardroom/useBoardroomBalance';
import { getDisplayBalanceToken } from '../../../utils/formatBalance';
import useBoardroomSupply from '../../../hooks/state/debtBoardroom/useBoardroomSupply';
import prettyNumber from '../../../components/PrettyNumber';

interface IProps {
  title: string
  text1: string
  price: number
  text2: string
  symbol: 'ARTH' | 'ARTHX'
}

const BoardroomSection = (props: IProps) => {
  const { account, connect } = useWallet();

  const core = useCore()
  const [openModal, setOpenModal] = useState(false);
  const currentToken = core.tokens[props.symbol]
  const pool = props.symbol === 'ARTH' ? core.contracts.ARTHDebtBoardroom : core.contracts.ARTHXDebtBoardroom
  const [approveStatus, approve] = useApprove(currentToken, pool.address);

  const balance = useBoardroomBalance(props.symbol)
  const supply = useBoardroomSupply(props.symbol)

  const isApproved = approveStatus === ApprovalState.APPROVED;
  const isApproving = approveStatus === ApprovalState.PENDING;


  return (
    <>
      <CustomInfoCard className={'custom-mahadao-box'}>
        <CustomInfoCardDetails>
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <CardTitle>
                {props.title}
              </CardTitle>
              <TextWithIcon>
                {props.text1}
              </TextWithIcon>
              <br />
              <TextWithIcon>
                {props.text2}
              </TextWithIcon>
              <br />
              <TextWithIcon>
                You have deposited {prettyNumber(getDisplayBalanceToken(balance.value, currentToken))} {props.symbol} worth a
                debt of {prettyNumber(getDisplayBalanceToken(balance.value.mul(Math.floor(props.price * 100000)).div(100000), currentToken))}$ to you from the
                protocol.
              </TextWithIcon>
              <br />
              <TextWithIcon>
                Over {prettyNumber(getDisplayBalanceToken(supply.value, currentToken))} {props.symbol} have been deposited in this pool
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
                  !isApproved ? (
                    <Button
                      text={!isApproving ? `Approve ${props.symbol}` : 'Approving...'}
                      size={'sm'}
                      disabled={isApproving || props.symbol === 'ARTH'}
                      onClick={approve}
                      loading={isApproving}
                    />
                  ) : (
                    <Button
                      disabled={props.symbol === 'ARTH'}
                      text={`Deposit ${props.symbol}`} size={'sm'} onClick={() => {
                        setOpenModal(true);
                      }} />
                  )
                )}
              </ButtonConatiner>
            </Grid>
          </Grid>
        </CustomInfoCardDetails>
      </CustomInfoCard>

      {openModal &&
        (<DepositModal
          onCancel={() => {
            setOpenModal(false);
          }}
          onDeposit={() => { }}
          symbol={props.symbol}
        />)
      }
    </>
  )
}

export default BoardroomSection;

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
