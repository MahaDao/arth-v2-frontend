import React, { useMemo } from 'react';
import styled from 'styled-components';

import LinkButton from '../../../../components/Button/LinkButton';
import Button from '../../../../components/Button';
import CardWithTitle from '../../../../components/CardWithTitle';
import useModal from '../../../../hooks/useModal';
import useTokenBalance from '../../../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../../../utils/formatBalance';
import BondModal from './BondModal';
import useBasisCash from '../../../../hooks/useBasisCash';
import { VaultInfo } from '../../../../basis-cash/types';
import useStakedBalanceOnVault from '../../../../hooks/useStakedBalanceOnVault';
import TokenSymbol from '../../../../components/TokenSymbol';
import useStakeToVault from '../../../../hooks/useBondToVault';
import WithdrawShareFromVault from '../../../../hooks/withdrawShareFromVault';
import useBoardroomUnbondingDetails from '../../../../hooks/useBoardroomUnbondingDetails';
import ProgressCountdown from './ProgressCountdown';
import UnbondModal from './UnBondModal';
import useUnbondFromVault from '../../../../hooks/useUnbondFromVault';
import { Grid } from '@material-ui/core';
import { CallMade } from '@material-ui/icons';
import useApprove, { ApprovalState } from '../../../../hooks/useApprove';


const Stake = ({ vault }: { vault: VaultInfo }) => {
  const basisCash = useBasisCash();

  const stakingToken =
    vault.depositTokenName === 'MAHA' ? basisCash.MAHA
      : vault.depositTokenName === 'ARTH' ? basisCash.ARTH
        : vault.depositTokenName === 'ARTH_DAI-MLP-LPv1' ? basisCash.arthDai
          : vault.depositTokenName === 'ARTH_ETH-MLP-LPv1' ? basisCash.arthEth
            : basisCash.externalTokens[vault.depositTokenName];

  const logos = [];

  if (vault.depositTokenName === 'ARTH_DAI-UNI-LPv2') logos.push('ARTH', 'DAI');
  else if (vault.depositTokenName === 'ARTH_ETH-MLP-LPv1') logos.push('ARTH', 'ETH');
  else if (vault.depositTokenName === 'ARTH_DAI-MLP-LPv1') logos.push('ARTH', 'DAI');
  else if (vault.depositTokenName === 'MAHA_ETH-UNI-LPv2') logos.push('MAHA', 'ETH');
  else if (vault.depositTokenName === 'ARTH_DAI-MAHA-LP') logos.push('ARTH', 'DAI');
  else logos.push(stakingToken.symbol);


  const finalDepositTokenName = useMemo(() => {
    const depositTokenName = vault.depositTokenName.startsWith('ARTH_DAI') ? 'ARTH-DAI' : vault.depositTokenName

    const pool = vault.depositTokenName.includes('MLP') ? 'MahaSwap LP' :
      vault.depositTokenName.includes('UNI') ? "Uniswap LP" : ""

    return `${depositTokenName} ${pool}`
  }, [vault.depositTokenName])

  const [approveStatus, approve] = useApprove(
    stakingToken,
    vault.contract.address,
  );

  const tokenBalance = useTokenBalance(stakingToken);
  const stakedBalance = useStakedBalanceOnVault(vault.kind);

  const { onBond } = useStakeToVault(vault);
  const { onWithdraw } = WithdrawShareFromVault(vault);
  const { onUnbond } = useUnbondFromVault(vault);

  const [onPresentBond, onDismissBond] = useModal(
    <BondModal
      max={tokenBalance}
      onConfirm={(value) => {
        onBond(value);
        onDismissBond();
      }}
      onCancel={() => onDismissBond()}
      tokenName={vault.depositTokenName}
    />,
  );

  const [onPresentUnBond, onDismissUnbond] = useModal(
    <UnbondModal
      max={stakedBalance}
      onConfirm={(value) => {
        onUnbond(value);
        onDismissUnbond();
      }}
      onCancel={() => onDismissUnbond()}
      tokenName={vault.depositTokenName}
    />,
  );

  const [depositDate, endDate, unbondedAmount] = useBoardroomUnbondingDetails(
    vault,
    stakedBalance,
  );

  return (
    <CardWithTitle titleComponent fullWidth>
      <StyledCardHeader>
        <StyledCardIcon>
          {logos && logos.length > 0 && (
            <LogoContainer>
              {logos.map((l: any, idx: number) => <TokenSymbol symbol={l} size={36} left={idx > 0 ? -5 : 0} />)}
            </LogoContainer>
          )}
        </StyledCardIcon>
        <StyleLabel>{`${finalDepositTokenName} Staked`} </StyleLabel>
      </StyledCardHeader>
      <StyledCardContent>
        <StyledCardContentInner>
          <StyledFieldLabel>Your Staked balance</StyledFieldLabel>
          <StyledValue>
            <Bolded>
              {getDisplayBalance(stakedBalance)}
            </Bolded>
            <Darked>{vault.depositTokenName}</Darked>
          </StyledValue>

          {/* TODO */}
          {/* <StyledFieldLabel>
            {`${tokenBalance} ${logos[0]} + 0 DAI `} Staked
          </StyledFieldLabel> */}

          {
            vault.depositTokenName === 'ARTH_DAI-MLP-LPv1' && (
              <StyledRow>
                <LinkButton href={'https://mahaswap.com/#/add/0x0E3cC2c4FB9252d17d07C67135E48536071735D9/0x6B175474E89094C44Da98b954EedeAC495271d0F'} variant="rounded">
                  Earn LP tokens from MahaSwap
                  <CallMade fontSize='small' style={{ transform: "scale(0.7)", marginLeft: 3 }} />
                </LinkButton>
              </StyledRow>
            )
          }
          {
            vault.depositTokenName === 'ARTH_ETH-MLP-LPv1' && (
              <StyledRow>
                <LinkButton href={'https://mahaswap.com/#/add/0x0E3cC2c4FB9252d17d07C67135E48536071735D9/eth'} variant="rounded">
                  Earn LP tokens from MahaSwap
                  <CallMade fontSize='small' style={{ transform: "scale(0.7)", marginLeft: 3 }} />
                </LinkButton>
              </StyledRow>
            )
          }
        </StyledCardContentInner>


        {
          unbondedAmount.gt(0) && (
            <>
              <StyledValue>
                <ProgressCountdown
                  base={depositDate}
                  deadline={endDate}
                  description={`Withdraw Period`}
                  tooltip="Withdraw Period Tooltip"
                />
              </StyledValue>
              <p style={{ color: '#fff9', fontSize: 13, fontWeight: 300, textAlign: 'center' }}>
                {getDisplayBalance(unbondedAmount)} {finalDepositTokenName} requested for withdraw
              </p>
            </>
          )
        }

        {
          unbondedAmount.gt(0) && (
            <Grid item md={12}>
              <Button
                onClick={onWithdraw}
                variant="outlined"
                disabled={endDate.getTime() > Date.now()}
                text={
                  "Process Withdrawal"
                }
              />
              <br />
            </Grid>
          )
        }

        {approveStatus !== ApprovalState.APPROVED ? (
          <Button
            // disabled={approveStatus !== ApprovalState.NOT_APPROVED}
            onClick={approve}
            text={`Approve`}
          />
        ) : (
          <Grid container spacing={2} justify="center">
            <Grid item md={6} lg={6}>
              <Button
                onClick={onPresentUnBond}
                variant="outlined"
                // disabled={endDate.getTime() > Date.now()}
                text="Withdraw"
              />
            </Grid>
            <Grid item md={6} lg={6}>
              <Button
                // disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                onClick={onPresentBond}
                text="Deposit"
              />
            </Grid>

          </Grid>
        )}
      </StyledCardContent>
    </CardWithTitle>
  );
};


const StyledRow = styled.div`
  margin: 20px 0;
`;

const StyledValue = styled.div`
  color: rgba(255, 255, 255, 0.64);
  font-size: 18px;
  font-weight: 600;
  margin: 10 0px;
`;

const Bolded = styled.span`
  color: white;
  margin-right: 10px;
`;

const Darked = styled.span`
  color: rgba(255, 255, 255, 0.4);
`;

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  width: 100%;
  flex-direction: row;
`;
const StyledCardIcon = styled.div`
  background-color: ${(props) => props.theme.color.grey[900]};
  // width: 72px;
  height: 36px;
  border-radius: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyleLabel = styled.div`
  font-weight: 600;
  font-size: 16px;
  margin-left: 20px;
  color: #ffffff;
`;

const StyledFieldLabel = styled.div`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.64);
`;

// const StyledActionSpacer = styled.div`
//   height: ${(props) => props.theme.spacing[4]}px;
//   width: ${(props) => props.theme.spacing[4]}px;
// `;

const StyledCardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: ${props => props.theme.spacing[4]}px;
  width: 100%;
  // height: 400px;
`

const StyledCardContentInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex: 1;
`;

// const StyledDesc = styled.span`
//   color: ${(props) => props.theme.color.grey[500]};
//   font-weight: 400;
//   font-size: 12px;
//   text-align: center;
// `;

export default Stake;
