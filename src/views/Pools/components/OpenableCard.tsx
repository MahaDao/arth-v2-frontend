import { useWallet } from 'use-wallet';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { BigNumber } from 'ethers/lib/ethers';
import { useMediaQuery } from 'react-responsive';
import React, { useState, useMemo } from 'react';

import Button from '../../../components/Button';
import TokenSymbol from '../../../components/TokenSymbol';

import arrowUp from '../../../assets/svg/arrowUp.svg';
import arrowDown from '../../../assets/svg/arrowDown2.svg';

import useCore from '../../../hooks/useCore';
import useTotalSupply from '../../../hooks/useTotalSupply';
import useTokenBalance from '../../../hooks/state/useTokenBalance';
import TransparentInfoDiv from '../../Stablize/components/InfoDiv';
import useTokenBalanceOf from '../../../hooks/state/useTokenBalanceOf';
import { getDisplayBalance, getDisplayBalanceToken } from '../../../utils/formatBalance';

export interface ICards {
  id: number;
  symbol1: string;
  symbol2: string;
  pairName: string;
  pairToken: string;
}

interface IProps {
  liquidityPair: ICards;
  setSelected: (val: any) => void;
  setChangeAction: (val: 'Add' | 'Remove') => void;
}

export default (props: IProps) => {
  const { liquidityPair, setSelected, setChangeAction } = props;
  const { account, connect } = useWallet();
  const [cardOpen, setCardOpen] = useState<boolean>(false);

  const onClick = () => { setCardOpen(!cardOpen); };
  const isMobile = useMediaQuery({ query: '(max-device-width: 1284px)' });

  const core = useCore();

  const { isLoading: isLPTotalSupplyLoading, value: lpTotalSupply } = useTotalSupply(
    liquidityPair.pairToken
  );
  const { isLoading: isLPBalanceLoading, value: lpBalance } = useTokenBalance(
    core.tokens[liquidityPair.pairToken]
  );
  const { isLoading: isToken1BalanceLoading, value: token1Balance } = useTokenBalanceOf(
    core.tokens[liquidityPair.symbol1],
    core.tokens[liquidityPair.pairToken].address
  );
  const { isLoading: isToken2BalanceLoading, value: token2Balance } = useTokenBalanceOf(
    core.tokens[liquidityPair.symbol2],
    core.tokens[liquidityPair.pairToken].address
  );

  const [isPercentOfPoolLoading, percentOfPool] = useMemo(() => {
    if (isLPBalanceLoading || isLPTotalSupplyLoading) return [true, BigNumber.from(0)];
    return [false, lpBalance.mul(1e6).div(lpTotalSupply)];
  }, [lpBalance, isLPBalanceLoading, isLPTotalSupplyLoading, lpTotalSupply]);

  return (
    <MainOpenableCard>
      <CardWO onClick={onClick}>
        <LLabel>
          <TokenSymbol symbol={liquidityPair.symbol1} size={50} style={{ zIndex: 2 }} />
          <TokenSymbol
            symbol={liquidityPair.symbol2}
            size={50}
            style={{ zIndex: 1, marginLeft: -15 }}
          />
          <LPairLabel>{liquidityPair.pairName}</LPairLabel>
        </LLabel>
        <Manage onClick={onClick}>
          {!isMobile && 'Manage'}
          <img alt='Arrow' src={cardOpen ? arrowUp : arrowDown} height={8} style={{ marginLeft: 6 }} />
        </Manage>
      </CardWO>
      {cardOpen && (
        <div style={{ marginTop: '20px', width: '100%' }}>
          <TransparentInfoDiv
            labelData={'Your total pool tokens'}
            rightLabelValue={Number(getDisplayBalanceToken(lpBalance, core.tokens[liquidityPair.pairToken])).toLocaleString('en-US', { maximumFractionDigits: 3 })}
            rightLabelUnit={`${liquidityPair.symbol1.toUpperCase()}/${liquidityPair.symbol2.toUpperCase()}`}
            isLoadingData={isLPBalanceLoading}
          />
          <TransparentInfoDiv
            labelData={`Pooled ${liquidityPair.symbol1.toUpperCase()}`}
            rightLabelValue={Number(getDisplayBalanceToken(token1Balance, core.tokens[liquidityPair.symbol1])).toLocaleString('en-US', { maximumFractionDigits: 3 })}
            rightLabelUnit={`${liquidityPair.symbol1.toUpperCase()}`}
            isLoadingData={isToken1BalanceLoading}
          />
          <TransparentInfoDiv
            labelData={`Pooled ${liquidityPair.symbol2.toUpperCase()}`}
            rightLabelValue={Number(getDisplayBalanceToken(token2Balance, core.tokens[liquidityPair.symbol2])).toLocaleString('en-US', { maximumFractionDigits: 3 })}
            rightLabelUnit={`${liquidityPair.symbol2.toUpperCase()}`}
            isLoadingData={isToken2BalanceLoading}
          />
          <TransparentInfoDiv
            labelData={'Your pool share'}
            rightLabelValue={Number(getDisplayBalance(percentOfPool, 4)).toLocaleString('en-US', { maximumFractionDigits: 3 }) + '%'}
            isLoadingData={isPercentOfPoolLoading}
          />
          <div style={{ marginTop: '32px' }}>
            <Grid container style={{ marginBottom: '8px' }}>
              {!!!account && (
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Button
                    text={'Connect Wallet'}
                    size={'lg'}
                    onClick={() =>
                      connect('injected').then(() => {
                        localStorage.removeItem('disconnectWallet');
                      })
                    }
                  />
                </Grid>
              )}
            </Grid>
            <Grid container spacing={2}>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Button
                  text={'Remove'}
                  variant={'transparent'}
                  onClick={() => {
                    setSelected({ liquidity: liquidityPair });
                    setChangeAction('Remove')
                  }}
                  disabled={!account}
                />
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Button
                  text={'Add Liquidity'}
                  onClick={() => {
                    setSelected({ liquidity: liquidityPair });
                    setChangeAction('Add');
                  }}
                  disabled={!account}
                />
              </Grid>
            </Grid>
          </div>
        </div>
      )}
    </MainOpenableCard>
  );
}

const FeesSpan = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #f7653b;
  text-align: center;
  margin: 20px 0px 0px 0px;
`;

const ImportIt = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.88);
  text-align: center;
  margin: 5px 0px 0px 0px;
`;

const MainOpenableCard = styled.div`
  display: flex;
  margin: 5px 0px;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  background: linear-gradient(180deg, #48423e 0%, #373030 100%);
  border-radius: 12px;
  @media (max-width: 600px) {
    padding: 20px 24px;
  }
`;

const CardWO = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
`

const LLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LPairLabel = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: #ffffff;
  opacity: 0.88;
  margin: 0px 0px 0px 16px;
`;

const Manage = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #f7653b;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;
