import React from 'react';
import styled from 'styled-components';

import Button from '../../../../components/Button';
import CardContent from '../../../../components/CardContent';
import CardIcon from '../../../../components/CardIcon';
import { AddIcon, RemoveIcon } from '../../../../components/icons';
import IconButton from '../../../../components/IconButton';
import useApprove, { ApprovalState } from '../../../../hooks/useApprove';
import useModal from '../../../../hooks/useModal';
import useTokenBalance from '../../../../hooks/useTokenBalance';
 import { getDisplayBalance } from '../../../../utils/formatBalance';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import useBasisCash from '../../../../hooks/useBasisCash';
import useStakedBalanceOnBoardroom from '../../../../hooks/useStakedBalanceOnBoardroom';
import TokenSymbol from '../../../../components/TokenSymbol';
import useStakeToBoardroom from '../../../../hooks/useStakeToBoardroom';
import withdrawShareFromBoardroomV1 from '../../../../hooks/withdrawShareFromBoardroom';

import { BoardroomInfo } from '../../../../basis-cash';

const Stake = ({ boardroom }: { boardroom: BoardroomInfo }) => {
  const basisCash = useBasisCash();
  const stakingToken =
    boardroom.depositTokenName === 'MAHA'
      ? basisCash.MAHA
      : boardroom.depositTokenName === 'ARTH'
      ? basisCash.ARTH
      : basisCash.externalTokens[boardroom.depositTokenName];

  const [approveStatus, approve] = useApprove(
    stakingToken,
    basisCash.currentBoardroom(boardroom.kind, 'v1')?.address,
  );

  const tokenBalance = useTokenBalance(stakingToken);

  const stakedBalance = useStakedBalanceOnBoardroom(boardroom.kind, 'v1');

  const { onStake } = useStakeToBoardroom(boardroom, 'v1');
  const { onWithdraw } = withdrawShareFromBoardroomV1(boardroom);

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={(value) => {
        onStake(value);
        onDismissDeposit();
      }}
      tokenName={boardroom.depositTokenName}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={(value) => {
        onWithdraw(value);
        onDismissWithdraw();
      }}
      tokenName={boardroom.depositTokenName}
    />,
  );

  // const [depositDate, endDate] = useBoardroomDepositDate(boardroom, stakedBalance);

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyleLabel>{`${boardroom.depositTokenName} Bonded`} </StyleLabel>
          <StyledCardHeader>
            <CardIcon>
              <TokenSymbol symbol={boardroom.depositTokenName} />
            </CardIcon>
            <StyledValue>{getDisplayBalance(stakedBalance)}</StyledValue>
            <StyledCardActions>
              {approveStatus !== ApprovalState.APPROVED ? (
                <Button
                  // disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                  onClick={approve}
                  text={`Approve`}
                />
              ) : (
                <>
                  <IconButton onClick={() => onPresentWithdraw()}>
                    <RemoveIcon />
                  </IconButton>
                  <StyledActionSpacer />
                  <div style={{ opacity: 0.1 }}>
                    <IconButton disabled={true} onClick={() => onPresentDeposit()}>
                      <AddIcon />
                    </IconButton>
                  </div>
                </>
              )}
            </StyledCardActions>
          </StyledCardHeader>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  );
};
const StyleLabel = styled.div`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 10px;
  align-self: start;
  line-height: 24px;
  color: #ffffff;
  opacity: 0.64;
`;
const StyledValue = styled.div`
  color: rgba(255, 255, 255, 0.88);
  font-size: 24px;
  margin-left: 20px;
  font-weight: bold;
`;
const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  width: 100%;
  flex-direction: row;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-left: ${(props) => props.theme.spacing[4]}px;
  width: 100%;
`;

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Card = styled.div`
  background: rgba(255, 255, 255, 0.02);
  // backdrop-filter: blur(21px);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
`;
export default Stake;
