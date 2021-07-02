import React from 'react';
import styled from 'styled-components';
import CallMadeIcon from '@material-ui/icons/CallMade';

import TokenSymbol from '../../../components/TokenSymbol';

import config, { platformURL } from '../../../config';
import useTotalSupply from '../../../hooks/useTotalSupply';
import prettyNumber from '../../../components/PrettyNumber';
import { getDisplayBalance } from '../../../utils/formatBalance';
import useUniswapLiquidity from '../../../hooks/useUniswapLiquidity';
import useCirculatingSupply from '../../../hooks/useCirculatingSupply';
import Loader from 'react-spinners/BeatLoader';

interface HomeCardProps {
  title: string;
  symbol: string;
  address: string;
  uniswapInputAddress: string;
}

const HomeCard: React.FC<HomeCardProps> = ({ title, symbol, address }) => {
  const { isLoading: isTotalSupplyLoading, value: totalSupply } = useTotalSupply(symbol);
  const { isLoading: isLiquidityLoading, value: liquidity } = useUniswapLiquidity(symbol);
  const {
    isLoading: isCirculatingSupplyLoading,
    value: circulatingSupply,
  } = useCirculatingSupply(symbol);

  const tokenUrl = `${config.etherscanUrl}/address/${address}`;

  return (
    <Wrapper>
      <Card className={'custom-mahadao-box'}>
        <CardHeader>
          <TokenSymbol size={60} symbol={symbol} />
          <div
            className="margin-left-20"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline' }}
          >
            <span className="margin-bottom-5">{title}</span>
            <SubTitle target="_blank" href={tokenUrl}>{`${title} on Explorer`}</SubTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardSection>
            <TextWithIcon>Liquidity</TextWithIcon>
            <StyledValue>
              {isLiquidityLoading ? (
                <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
              ) : (
                prettyNumber(getDisplayBalance(liquidity))
              )}
            </StyledValue>
          </CardSection>
          <CardSection>
            <StyledSupplyLabel href={tokenUrl} target="_blank" color={'#ffffff99'}>
              Circulating Supply
            </StyledSupplyLabel>
            <StyledValue>
              {isCirculatingSupplyLoading ? (
                <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
              ) : (
                prettyNumber(getDisplayBalance(circulatingSupply))
              )}
            </StyledValue>
          </CardSection>
          <CardSection>
            <StyledSupplyLabel href={tokenUrl} target="_blank" color={'#ffffff99'}>
              Total Supply
            </StyledSupplyLabel>
            <StyledValue>
              {isTotalSupplyLoading ? (
                <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
              ) : (
                prettyNumber(getDisplayBalance(totalSupply))
              )}
            </StyledValue>
          </CardSection>
        </CardContent>
        <UniswapLink
          target="_blank"
          href={
            platformURL[config.platform] && platformURL[config.platform].swapUrl
              ? `${platformURL[config.platform]?.swapUrl}?inputCurrency=${address}`
              : `https://app.uniswap.org/#/swap?outputCurrency=${address}`
          }
          id={`buy_${symbol}_from_${config.platform[0].toUpperCase() + config.platform.slice(1).toLowerCase()}`}
        >
          <LinkText>
            Buy {symbol} from{' '}
            {config.platform[0].toUpperCase() + config.platform.slice(1).toLowerCase()}{' '}
            <CallMadeIcon style={{ fontSize: 15 }} />
          </LinkText>
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
    margin-bottom: 8px;
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
  padding: 0px 32px 32px 32px;
  align-items: self-start;
  flex-direction: column;
  @media (max-width: 600px) {
    padding: 0px 16px 16px 16px;
  }
`;

const CardHeader = styled.h2`
  color: #fff;
  display: flex;
  font-weight: 600;
  font-size: 18px;
  justify-content: start;
  align-items: center;
  text-align: center;
  padding: 32px;
  @media (max-width: 600px) {
    padding: 16px;
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
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.64);
  margin: 5px 0;
  display: block;
  &:hover {
    color: #f7653b;
  }
`;

const Card = styled.div`
  padding: 5px 0;
  color: #eee;
  position: relative;
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

const SubTitle = styled.a`
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.64);
`;

const TextWithIcon = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.64);
  margin: 5px 0;
`;

export default HomeCard;
