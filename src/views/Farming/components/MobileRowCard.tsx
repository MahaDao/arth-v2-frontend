import React, { useMemo } from 'react';
import { useWallet } from 'use-wallet';
import styled from 'styled-components';
import Loader from 'react-spinners/BeatLoader';
import { Grid, Divider } from '@material-ui/core';
import { BigNumber } from '@ethersproject/bignumber';

import dfyn from '../../../assets/img/DFYN.png';
import uniswap from '../../../assets/svg/UniswapWhite.svg';
import sushiswap from '../../../assets/svg/SushiswapWhite.svg';

import Card from '../../../components/Card';
import Button from '../../../components/Button';
import CardContent from '../../../components/CardContent';
import TokenSymbol from '../../../components/TokenSymbol';

import config, { platformURL } from '../../../config';
import useCore from '../../../hooks/useCore';
import { StakingContract } from '../../../basis-cash';
import useTokenDecimals from '../../../hooks/useTokenDecimals';
import useTokenBalance from '../../../hooks/state/useTokenBalance';
import { getDisplayBalance, getDisplayBalanceToken } from '../../../utils/formatBalance';

interface IProps {
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
  onExitClick: () => void;
  onDepositClick: () => void;
  onWithdrawClick: () => void;
  onClaimClick: () => void;
  onButtonClick?: (data: 'Deposit' | 'Withdraw' | 'Claim' | '') => void;
}

export const MobileFarm = (props: IProps) => {
  const core = useCore();
  const { account, connect } = useWallet();

  const depositTokenContract = core.tokens[props.pool.depositToken];
  const { isLoading: isTokenBalanceLoading, value: tokenBalance } = useTokenBalance(depositTokenContract);
  const tokenDecimals = useTokenDecimals(props.pool.depositToken);

  const tokens = props.pool.depositTokenSymbols.map((p) => core.tokens[p]);
  const tokenAddresses = tokens.map((t) => (t.symbol === 'WMATIC' ? 'ETH' : t.address));
  const uniswapLink = `${platformURL[props.pool.platform]?.addLiquidityUrl || 'https:app.uniswap.org/swap'}/${tokenAddresses.join('/')}`;
  const etherscan = `${config.etherscanUrl}/address/${tokenAddresses[0]}`
  const pow = BigNumber.from(10).pow(18);

  const initEarnedARTHX = useMemo(() => {
    if (props.pool.rewardTokenKind === 'pool-token') {
      return Number(getDisplayBalanceToken(
        props?.claimableBalance?.mul(props?.rates?.arthx).div(pow),
        core.tokens.ARTHX,
        6
      ))
    }

    if (props.pool.rewardTokenKind === 'single') {
      return Number(getDisplayBalanceToken(props?.claimableBalance, core.tokens.ARTHX, 6))
    }
  }, [props, pow, core.tokens.ARTHX]);

  const initEarnedMAHA = useMemo(() => {
    if (props.pool.rewardTokenKind === 'pool-token') {
      return Number(getDisplayBalanceToken(
        props?.claimableBalance?.mul(props?.rates?.maha).div(pow),
        core.tokens.MAHA,
        6
      ))
    }

    if (props.pool.rewardTokenKind === 'single') {
      return Number(getDisplayBalanceToken(props?.claimableBalance, core.tokens.MAHA, 6))
    }
  }, [props, pow, core.tokens.MAHA]);

  const isWalletConnected = !!account;

  const getImage = (platform: string) => {
    if (platform === 'sushiswap') return sushiswap;
    if (platform === 'dfyn') return dfyn;
    return uniswap;
  }

  return (
    <StyledCardWrapper>
      {
        props.pool.platform && (
          <CardIcon>
            <div style={{ zIndex: 15, background: '#2A2827', borderRadius: 36 }}>
              <img src={getImage(props.pool.platform)} alt="Uniswap logo" height={32} />
            </div>
          </CardIcon>
        )
      }
      <Card>
        <CardContent>
          <StyledContent>
            <div style={{ marginTop: 10 }} />
            <CardHeaderDiv>
              <div
                style={{
                  flexDirection: 'row',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <div style={{ zIndex: 15, background: '#2A2827', borderRadius: 36 }}>
                  <TokenSymbol
                    symbol={props.pool.depositTokenSymbols[0]}
                    size={44}
                    style={{}}
                  />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: 30,
                    background: '#2A2827',
                    borderRadius: 36,
                  }}
                >
                  <TokenSymbol
                    symbol={props.pool.depositTokenSymbols[1]}
                    size={44}
                    style={{}}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 40 }}>
                <StyledTitle>{props.pool.depositTokenSymbols.join('-')}</StyledTitle>
                {
                  props.pool.platform
                    ? (
                      <StyledSubTitle onClick={() => window.open(uniswapLink, '_blank')}>
                        Add Liquidity
                      </StyledSubTitle>
                    ) : (
                      <StyledSubTitle onClick={() => window.open(etherscan, '_blank')}>
                        View on Explorer
                      </StyledSubTitle>
                    )
                }
              </div>
            </CardHeaderDiv>
            <Grid
              container
              style={{ display: 'flex', width: '100%', height: 'fit-content', marginTop: 20 }}
            >
              <Grid
                item
                xs={12}
                direction={'row'}
                justify={'space-between'}
                style={{ display: 'flex', marginTop: 5 }}
              >
                <DescriptionDiv>
                  Wallet
                </DescriptionDiv>
                <div style={{ flexDirection: 'column', display: 'flex' }}>
                  <MainSpan>
                    {
                      isTokenBalanceLoading
                        ? <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
                        : Number(getDisplayBalance(tokenBalance, tokenDecimals, 3)).toLocaleString()
                    }
                  </MainSpan>
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                direction={'row'}
                justify={'space-between'}
                style={{ display: 'flex', marginTop: 5 }}
              >
                <DescriptionDiv>
                  APY
                </DescriptionDiv>
                <div style={{ flexDirection: 'column', display: 'flex' }}>
                  <MainSpan>
                    {
                      props?.apyState?.isLoading
                        ? <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
                        : props?.apyState?.apy
                    }
                  </MainSpan>
                </div>
              </Grid>
            </Grid>
            <ButtonContainer>
              <div style={{ marginTop: 15 }}>
                {!isWalletConnected ? (
                  <Button
                    text={'Connect Wallet'}
                    size={'lg'}
                    onClick={() =>
                      connect('injected').then(() => {
                        localStorage.removeItem('disconnectWallet')
                      })}
                  />
                ) : (
                  <Button
                    disabled={tokenBalance.lte(0)}
                    text="Deposit"
                    size={'sm'}
                    onClick={props.onDepositClick}
                  />
                )}
              </div>
            </ButtonContainer>
          </StyledContent>
        </CardContent>
        {
          props.stakedBalance.gt(0)
            ? (
              <OpenableDiv>
                <InfoDiv>
                  <div>
                    <InfoDivLeftSpan>Your Locked stake: </InfoDivLeftSpan>
                    <InfoDivRightSpan>
                      {Number(getDisplayBalance(props.stakedBalance, tokenDecimals, 3)).toLocaleString()}
                      {' ' + props.pool.depositTokenSymbols.join('-')}
                    </InfoDivRightSpan>
                  </div>
                  <Withdraw onClick={props.onWithdrawClick}>Withdraw</Withdraw>
                </InfoDiv>
                <Divider
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    margin: '15px 0px',
                  }}
                  variant={'middle'}
                />
                <InfoDiv>
                  <div>
                    <InfoDivLeftSpan>Unclaimed Rewards:</InfoDivLeftSpan>
                    {
                      props.pool.rewardTokenKind === 'pool-token' && (
                        <InfoDivRightSpan>
                          <span>{Number(initEarnedARTHX).toLocaleString('en-US', { maximumFractionDigits: 6 })}</span> ARTHX
                        </InfoDivRightSpan>
                      )
                    }
                    {
                      props.pool.rewardTokenKind === 'pool-token' && (
                        <InfoDivLeftSpan>+ </InfoDivLeftSpan>
                      )
                    }
                    <InfoDivRightSpan>
                      <span>{Number(initEarnedMAHA).toLocaleString('en-US', { maximumFractionDigits: 6 })}</span>
                      {' '}
                      MAHA
                    </InfoDivRightSpan>
                    <Withdraw
                      onClick={props.onClaimClick}
                    >
                      Claim
                    </Withdraw>
                  </div>
                </InfoDiv>
                <Divider
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    margin: '15px 0px',
                  }}
                  variant={'middle'}
                />
                <InfoDiv>
                  <div>
                    <Withdraw
                      onClick={props.onExitClick}
                    >
                      Claim and Withdraw
                    </Withdraw>
                  </div>
                </InfoDiv>
              </OpenableDiv>
            )
            : (
              <></>
            )
        }
      </Card>
    </StyledCardWrapper>
  );
};

const DescriptionDiv = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.32);
  flex-direction: row;
`;

const MainSpan = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: right;
  color: #ffffff;
  opacity: 0.88;
`;

const ButtonContainer = styled.div`
  width: 100%;
  margin-top: 10px;
  flex-direction: column;
`;

const OpenableDiv = styled.div`
  background: #423b38;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-sizing: border-box;
  border-radius: 0 0 12px 12px;
  display: flex;
  width: 100%;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  padding: 20px 0;
`;

const InfoDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0 0 0;
  text-align: center;
  align-items: center;
`;

const Withdraw = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #ff7f57;
  margin: 8px 0 0 0;
`;

const InfoDivLeftSpan = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: rgba(255, 255, 255, 0.64);
`;

const InfoDivRightSpan = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.88);
`;

const StyledCardWrapper = styled.div`
  display: flex;
  margin-bottom: 24px;
  width: 100%;
  position: relative;
`;

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  justify-content: space-between;
`;

const StyledTitle = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  opacity: 0.88;
`;

const CardHeaderDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CardIcon = styled.div`
  position: absolute;
  margin: -16px 0 0 0;
  left: 45%;
`;

const StyledSubTitle = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 140%;
  color: #ff7f57;
  opacity: 0.88;
`;

export default MobileFarm;
