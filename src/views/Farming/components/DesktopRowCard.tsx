import styled from 'styled-components';
import React, { useMemo } from 'react';
import { useWallet } from 'use-wallet';
import Grid from '@material-ui/core/Grid';
import Loader from 'react-spinners/BeatLoader';
import Countdown from 'react-countdown';
import { BigNumber } from '@ethersproject/bignumber';

import Button from '../../../components/Button';
import TokenSymbol from '../../../components/TokenSymbol';

import dfyn from '../../../assets/img/DFYN.png';
import uniswap from '../../../assets/svg/UniswapWhite.svg';
import sushiswap from '../../../assets/svg/SushiswapWhite.svg';

import useCore from '../../../hooks/useCore';
import { platformURL } from '../../../config';
import { StakingContract } from '../../../basis-cash';
import useTokenDecimals from '../../../hooks/useTokenDecimals';
import { getDisplayBalance, getDisplayBalanceToken } from '../../../utils/formatBalance';
import useTokenBalance from '../../../hooks/state/useTokenBalance';
import config from '../../../config';

type IProps = {
  pool: StakingContract;
  stakedBalance: BigNumber;
  claimableBalance: BigNumber;
  rates: {
    maha: BigNumber;
    arthx: BigNumber;
  };
  apyState: {
    isLoading: boolean;
    apy: string;
  };
  onDepositClick: () => void;
  onWithdrawClick: () => void;
  onClaimClick: () => void;
  onExitClick: () => void;
};

export default (props: IProps) => {
  const core = useCore();
  const { account, connect } = useWallet();

  const depositTokenContract = core.tokens[props.pool.depositToken];
  const tokenDecimals = useTokenDecimals(props.pool.depositToken);
  const { isLoading: isTokenBalanceLoading, value: tokenBalance } = useTokenBalance(
    depositTokenContract,
  );

  const tokens = props.pool.depositTokenSymbols.map((p) => core.tokens[p]);
  const tokenAddresses = tokens.map((t) => (t.symbol === 'WMATIC' ? 'ETH' : t.address));
  const uniswapLink = `${platformURL[props.pool.platform]?.addLiquidityUrl || 'https:app.uniswap.org/swap'
    }/${tokenAddresses.join('/')}`;
  const etherscan = `${config.etherscanUrl}/address/${tokenAddresses[0]}`;
  const isWalletConnected = !!account;

  const pow = BigNumber.from(10).pow(18);

  const initEarnedARTHX = useMemo(() => {
    if (props.pool.rewardTokenKind === 'pool-token') {
      return Number(
        getDisplayBalanceToken(
          props?.claimableBalance?.mul(props?.rates?.arthx).div(pow),
          core.tokens.ARTHX,
          6,
        ),
      );
    }

    if (props.pool.rewardTokenKind === 'single') {
      return Number(getDisplayBalanceToken(props?.claimableBalance, core.tokens.ARTHX, 6));
    }
  }, [props, pow, core.tokens.ARTHX]);

  const initEarnedMAHA = useMemo(() => {
    if (props.pool.rewardTokenKind === 'pool-token') {
      return Number(
        getDisplayBalanceToken(
          props?.claimableBalance?.mul(props?.rates?.maha).div(pow),
          core.tokens.MAHA,
          6,
        ),
      );
    }

    if (props.pool.rewardTokenKind === 'single') {
      return Number(getDisplayBalanceToken(props?.claimableBalance, core.tokens.MAHA, 6));
    }
  }, [props, pow, core.tokens.MAHA]);

  const getImage = (platform: string) => {
    if (platform === 'sushiswap') return sushiswap;
    if (platform === 'dfyn') return dfyn;
    return uniswap;
  };

  return (
    <CustomCardGrid>
      <Grid
        container
        style={{ padding: '32px 32px', position: 'relative' }}
        alignItems={'center'}
      >
        {props.pool.platform && <CardIcon src={getImage(props.pool.platform)} height={32} />}
        <Grid item lg={3} style={{ display: 'flex' }}>
          <div>
            {props.pool.depositTokenSymbols.map((token, index) => (
              <TokenSymbol
                symbol={token}
                size={44}
                style={index === 1 ? { marginLeft: '-6px' } : {}}
              />
            ))}
          </div>
          <div style={{ marginLeft: '16px' }}>
            <TableMainTextStyle>{props.pool.name}</TableMainTextStyle>
            {props.pool.platform ? (
              <AddLiquidityButton onClick={() => window.open(uniswapLink, '_blank')}>
                Add Liquidity
              </AddLiquidityButton>
            ) : (
              <AddLiquidityButton onClick={() => window.open(etherscan, '_blank')}>
                View on Explorer
              </AddLiquidityButton>
            )}
          </div>
        </Grid>
        <Grid item lg={2}>
          <TableMainTextStyle>
            {isTokenBalanceLoading ? (
              <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
            ) : (
              Number(getDisplayBalance(tokenBalance, tokenDecimals, 3)).toLocaleString()
            )}
          </TableMainTextStyle>
        </Grid>
        <Grid item lg={1}>
          <TableMainTextStyle>
            {props?.apyState?.isLoading ? (
              <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
            ) : (
              props?.apyState?.apy
            )}
          </TableMainTextStyle>
        </Grid>
        <Grid item lg={2}>
          <TableMainTextStyle>
            <Countdown
              date={props.pool.endDate}
              renderer={({ days, hours, minutes, seconds, completed }) => {
                return (
                  `${days}d : ${hours}h : ${minutes}m : ${seconds}s`
                );
              }}
            />
          </TableMainTextStyle>
        </Grid>
        <Grid item lg={2}>
          <TableMainTextStyle>
            {props.pool.rewardTokenKind === 'pool-token' && 'ARTHX + '}
            MAHA
          </TableMainTextStyle>
        </Grid>
        <Grid item lg={2}>
          {!isWalletConnected ? (
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
            <Button
              disabled={tokenBalance.lte(0)}
              text="Deposit"
              size={'sm'}
              onClick={props.onDepositClick}
            />
          )}
        </Grid>
      </Grid>
      {props.stakedBalance.gt(0) && (
        <DepositInfoContainer>
          <div style={{ display: 'flex' }}>
            Your Locked stake:
            <TableMainTextStyle style={{ marginLeft: '10px' }}>
              {Number(
                getDisplayBalance(props.stakedBalance, tokenDecimals, 3),
              ).toLocaleString()}
            </TableMainTextStyle>
            <WithdrawClaimButton onClick={props.onWithdrawClick}>Withdraw</WithdrawClaimButton>
          </div>
          <div style={{ display: 'flex' }}>
            <WithdrawClaimButton onClick={props.onExitClick}>
              Withdraw & Claim
            </WithdrawClaimButton>
          </div>
          <div style={{ display: 'flex' }}>
            <>
              Earned:
              <TableMainTextStyle style={{ marginLeft: '10px' }}>
                {props.pool.rewardTokenKind === 'pool-token' && (
                  <span>
                    {Number(initEarnedARTHX).toLocaleString('en-US', {
                      maximumFractionDigits: 6,
                    })}
                  </span>
                )}
                {props.pool.rewardTokenKind === 'pool-token' && ' ARTHX + '}
                <span>
                  {Number(initEarnedMAHA).toLocaleString('en-US', { maximumFractionDigits: 6 })}
                </span>{' '}
                MAHA
              </TableMainTextStyle>
              <WithdrawClaimButton onClick={props.onClaimClick}>
                Claim Rewards
              </WithdrawClaimButton>
            </>
          </div>
        </DepositInfoContainer>
      )}
    </CustomCardGrid>
  );
};

const CustomCardGrid = styled.div`
  background: linear-gradient(180deg, #48423e 0%, #373030 100%);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-sizing: border-box;
  border-radius: 12px;
  margin: 8px 0;
  position: relative;
`;

const TableMainTextStyle = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  opacity: 0.88;
  margin: 0;
`;

const AddLiquidityButton = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 140%;
  color: #ff7f57;
  margin: 0;
  cursor: pointer;
`;

const DepositInfoContainer = styled.div`
  background: #423b38;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  box-sizing: border-box;
  border-radius: 0 0 12px 12px;
  padding: 20px 32px;
  display: flex;
  justify-content: space-between;
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 140%;
  color: rgba(255, 255, 255, 0.64);
  opacity: 0.88;
`;

const WithdrawClaimButton = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #ff7f57;
  margin: 0 0 0 10px;
  cursor: pointer;
`;

const CardIcon = styled.img`
  transform: translate(-50%, -50%);
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 10;
`;
