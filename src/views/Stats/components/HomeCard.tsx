import React from 'react';
import styled from 'styled-components';
import UniswapArrowIcon from '../../../assets/img/uniswapArrow.svg';
import { TokenStat } from '../../../basis-cash/types';
import TokenSymbol from '../../../components/TokenSymbol';
import { commify } from 'ethers/lib/utils';
import config from '../../../config';
// import Card from '../../../components/InfoCard';
import Spacer from '../../../components/Spacer';
import { getDisplayBalance } from '../../../utils/formatBalance';
import CallMadeIcon from '@material-ui/icons/CallMade';

interface HomeCardProps {
  title: string;
  symbol: string;
  supplyLabel?: string;
  address: string;
  liquidity?: string;
  uniswapInputAddress: string;
  stat?: TokenStat;
}

const HomeCard: React.FC<HomeCardProps> = ({
  title,
  symbol,
  address,
  liquidity,
  supplyLabel = 'Total Supply',
  stat,
  uniswapInputAddress
}) => {
  const tokenUrl = `${config.etherscanUrl}/token/${address}`;
  return (
    <Wrapper>
      <Card>
        <CardHeader>
          <TokenSymbol size={60} symbol={symbol} />
          <div
            className="margin-left-20"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline' }}
          >
            <span className="margin-bottom-5">{title}</span>
            <SubTitle>{`${title} on Etherscan`}</SubTitle>
          </div>
        </CardHeader>

        <CardContent>
          <CardSection>
            <div style={{ color: 'rgba(255, 255, 255, 0.64)' }} className="font15">
              {title} Price
            </div>
            {stat ? (
              <StyledValue>
                {(stat.priceInDAI.eq(0) ? '-' : `$${getDisplayBalance(stat.priceInDAI)}`)}
              </StyledValue>
            ) : (
                '-'
              )}
          </CardSection>
          <CardSection>
            <div style={{ color: 'rgba(255, 255, 255, 0.64)' }} className="font15">
              {title} Liquidity
            </div>
            {liquidity ? <StyledValue>{liquidity}</StyledValue> : '-'}
          </CardSection>
          <CardSection>
            <StyledSupplyLabel href={tokenUrl} target="_blank" color={'#ffffff99'}>
              {supplyLabel}
            </StyledSupplyLabel>
            {stat ? <StyledValue>{commify(stat.totalSupply)}</StyledValue> : '-'}
          </CardSection>
        </CardContent>
        <UniswapLink
          target="_blank"
          href={`https://app.uniswap.org/#/swap?inputCurrency=${uniswapInputAddress}&outputCurrency=${address}`}
        >
          <LinkText>Buy {symbol} from MahaSwap <CallMadeIcon style={{ fontSize: 15 }} /></LinkText>
        </UniswapLink>
      </Card>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-width: 200px;
  width: 100%;
  border-radius: 12px;
  height: 100%;
  width: 100%;
  border: 1px solid;
  margin-bottom: ${(props) => props.theme.spacing[5]}px;
  border-image-source: linear-gradient(
    180deg,
    rgba(255, 116, 38, 0.1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  @media (max-width: 768px) {
    margin-top: 0px;
    margin-bottom: 15px;
  }
`;

const UniswapLink = styled.a`
  color: #fff;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
  display: flex;
  width: 100%;
  justify-content: center;
  text-decoration: none;
  padding: 20px;
`;

const LinkText = styled.span`
  text-align: center;
  margin: 0 15px 5px;
  color: #f7653b;
  font-size: 16px;
  padding: 20px;
  &:hover {
    background: #2a2827;
    border-radius: 6px;
    padding: 20px;
  }
  &:focus {
    background: #423b38;
    border-radius: 6px;
    padding: 20px;
  }
`;

const CardContent = styled.div`
  display: flex;
  padding: 0px 20px 20px 20px;
  align-items: self-start;
  margin: 0 15px 15px;
  flex-direction: column;
`;

const CardHeader = styled.h2`
  color: #fff;
  display: flex;
  font-weight: 600;
  font-size: 18px;
  justify-content: start;
  align-items: center;
  text-align: center;
  padding: 20px;
`;

const StyledCards = styled.div`
  padding: 5px 0;
  color: #fff;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledValue = styled.span`
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.88);
`;

const CardSection = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  &:last-child {
    margin-bottom: 0;
  }
  &.right {
    text-align: right;
  }
`;

const StyledSupplyLabel = styled.a`
  display: block;
  color: rgba(255, 255, 255, 0.64);
  font-size: 15px;
  &:hover {
    color: #f7653b;
  }
`;
const Card = styled.div`
  padding: 5px 0;
  color: #eee;
  position: relative; /*  */
  background-clip: padding-box;
  border: 1px solid;
  border-image-source: linear-gradient(
    180deg,
    rgba(255, 116, 38, 0.1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(70px);
  border-radius: 12px;
`;
const SubTitle = styled.div`
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.64);
`;
export default HomeCard;
