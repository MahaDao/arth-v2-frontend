import React from 'react';
import styled from 'styled-components';
import Loader from 'react-spinners/BeatLoader';

import TokenSymbol from '../../../components/TokenSymbol';
import warningLogo from '../../../assets/svg/Icon-16.svg';
import CustomToolTip from '../../../components/CustomTooltip';

import useCore from '../../../hooks/useCore';
import prettyNumber from '../../../components/PrettyNumber';
import { getDisplayBalanceToken } from '../../../utils/formatBalance';
import useTotalFeeAllocated from '../../../hooks/state/debtBoardroom/useTotalFeeAllocated';

interface DeptCardProps {
  symbol: string;
};

const HomeCard: React.FC<DeptCardProps> = ({ symbol }) => {
  const core = useCore();
  const token = core.tokens[symbol];

  const feeAllocated = useTotalFeeAllocated();

  return (
    <Wrapper>
      <Card className={'custom-mahadao-box'}>
        <CardHeader>
          <TokenSymbol size={40} symbol={symbol} />
          <div
            className="margin-left-5"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'left' }}
          >
            <span className="margin-bottom-5">{`Collected Fees`}</span>
            <CustomToolTip toolTipText={'loreum ipsum'}/>
          </div>
        </CardHeader>
        <CardContent>
          <CardSection>
            <TextWithIcon>Total Fees</TextWithIcon>
            <StyledValue>
              {
                feeAllocated.isLoading
                  ? <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
                  : prettyNumber(getDisplayBalanceToken(feeAllocated.value, token))
              } USDC
            </StyledValue>
          </CardSection>
          <CustomBadgeAlert>
            <Logo src={warningLogo} alt='waring' />
            <Text>
              {'You will earn rewards in USDC until the debt is paid off.'}
            </Text>
          </CustomBadgeAlert>
        </CardContent>
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
    min-height: auto;
  }
`;

const CardContent = styled.div`
  display: flex;
  padding: 0px 32px 32px 32px;
  align-items: self-start;
  flex-direction: column;
  margin-top: 24px;
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
  border-bottom: 1px solid #FFFFFF20;
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
  min-height: 500px;
  @media (max-width: 768px) {
    min-height: auto;
  }
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

const InfoMsg = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 140%;
  color: #FFFFFF;
  opacity: 0.64;
  margin-top: 20px;
`;

const CustomBadgeAlert = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.88);
  box-sizing: border-box;
  border-radius: 4px;
  padding: 8px;
  display: flex;
  align-items: flex-start;
  margin-top: 24px;
  position: absolute;
  bottom: 0;
  width: calc(100% - 64px);
  margin-bottom: 32px;
  @media(max-width: 600px) {
    position: static;
    width: 100%;
    margin-bottom: 0;
  }
`;

const Logo = styled.img`
  width: 13.33px;
  height: 13.33px;
  margin-top: 2px;
`;

const Text = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.88);
  flex: 1;
  padding-left: 10px;
  margin-bottom: 0;
`;

export default HomeCard;