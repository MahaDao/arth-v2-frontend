import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Container from '../../../components/Container';
import useCore from '../../../hooks/useCore';
import Grid from '@material-ui/core/Grid';
import uniswapLogo from '../../assets/svg/uniswapLogo.svg';
import shushiswap from '../../assets/svg/sushiswapLogo.svg';
import Button from '../../../components/Button';
import TokenSymbol from '../../../components/TokenSymbol';
import arrowDown from '../../../assets/svg/arrowDown2.svg';
import arrowUp from '../../../assets/svg/arrowUp.svg';
import TransparentInfoDiv from './InfoDiv';
import { useMediaQuery } from 'react-responsive';

export interface ICards {
  id: number;
  symbol1: string;
  symbol2: string;
  pairName: string;
}
export interface IPoolData {
  total: string;
  arth: string;
  eth: string;
  share: string;
}
interface IProps {
  liquidityPair: ICards;
  poolData: IPoolData;
  setSelected: (val: any) => void;
  setRemove: (val: boolean) => void;
  setDeposit: (val: boolean) => void;
}

export default (props: IProps) => {
  const { liquidityPair, poolData, setSelected, setDeposit, setRemove } = props;
  const [cardOpen, setCardOpen] = useState<boolean>(false);

  const onClick = () => {
    setCardOpen(!cardOpen);
  };
  const isMobile = useMediaQuery({ query: '(max-device-width: 1284px)' });

  return (
    <MainOpenableCard>
      <div
        style={{
          flexDirection: 'row',
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <LLabel>
          <TokenSymbol symbol={liquidityPair.symbol1} size={50} style={{ zIndex: 2 }} />
          <TokenSymbol
            symbol={liquidityPair.symbol2}
            size={50}
            style={{ zIndex: 1, marginLeft: -5 }}
          />
          <LPairLabel>{liquidityPair.pairName}</LPairLabel>
        </LLabel>
        <Manage onClick={onClick}>
          Manage
          <img src={cardOpen ? arrowUp : arrowDown} height={8} style={{ marginLeft: 6 }} />
        </Manage>
      </div>
      {cardOpen && (
        <>
          <div style={{ height: '20px' }} />
          <TransparentInfoDiv
            labelData={'Your total pool tokens'}
            rightLabelValue={poolData.total}
            rightLabelUnit={'ARTH/ETH'}
          />

          <TransparentInfoDiv
            labelData={'Pooled ARTH'}
            rightLabelValue={poolData.arth}
            rightLabelUnit={'ARTH'}
          />

          <TransparentInfoDiv
            labelData={'Pooled ETH'}
            rightLabelValue={poolData.eth}
            rightLabelUnit={'ETH'}
          />

          <TransparentInfoDiv
            labelData={'Your pool share'}
            rightLabelValue={`${poolData.share}%`}
            // rightLabelUnit={'ETH'}
          />
          <div
            style={{
              marginTop: 32,
              width: '100%',
              display: 'flex',
              flexDirection: isMobile ? 'column-reverse' : 'row',
              justifyContent: 'space-evenly',
            }}
          >
            <div
              style={{
                marginRight: !isMobile ? 5 : undefined,
                width: '100%',
                marginTop: isMobile ? 5 : undefined,
              }}
            >
              <Button
                text={'Remove'}
                variant={'transparent'}
                onClick={() => {
                  setSelected({ liquidity: liquidityPair, pool: poolData });
                  setDeposit(false);
                  setRemove(true);
                }}
              />
            </div>
            <div style={{ marginLeft: !isMobile ? 5 : undefined, width: '100%' }}>
              <Button
                text={'Add Liquidity'}
                onClick={() => {
                  setSelected({ liquidity: liquidityPair, pool: poolData });
                  setRemove(false);
                  setDeposit(true);
                }}
              />
            </div>
          </div>
        </>
      )}
    </MainOpenableCard>
  );
};

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
