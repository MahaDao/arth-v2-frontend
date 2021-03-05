import React from 'react';
import styled from 'styled-components';
import ArrowRight from '../../assets/img/ArrowRight.svg';
import Button from '../../components/Button';

import { Bank } from '../../basis-cash';
import { useWallet } from 'use-wallet';
import TokenSymbol from '../../components/TokenSymbol';

const APY = require('./apy.json');


interface AccountButtonProps {
  bank?: Bank;
  title?: string;
  logo?: Array<string>;
  subtitle?: string;
  poolSize?: string;
  description?: string;
  toolTipDesciption?: string;
  buttonText?: string;
  percentage?: number;
  appyPercentage?: string;
  contract?: string;
}

interface ImageConTainerProps {
  marginLeft: number;
  zIndex: number;
}

const StakingCard: React.FC<AccountButtonProps> = ({ bank }) => {
  const apy: any = APY[bank.contract];
  const { account, connect } = useWallet();

  const logos = [bank.earnTokenName];

  if (bank.depositTokenName === 'ARTH_DAI-UNI-LPv2') logos.push('ARTH', 'DAI');
  else if (bank.depositTokenName === 'ARTH_DAI-MAHA-LPv1') logos.push('ARTH', 'DAI');
  else if (bank.depositTokenName === 'MAHA_ETH-UNI-LPv2') logos.push('MAHA', 'ETH');
  else if (bank.depositTokenName === 'ARTH_DAI-MAHA-LP') logos.push('ARTH', 'DAI');
  else logos.push(bank.depositTokenName);

  return (
    <CardContainer>
      {logos && logos.length > 0 && (
        <div style={{
          flexDirection: 'row',
          display: 'flex',
          width: '20%',
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          top: -25,
          left: '33%',
        }}>
          {/* {logos.slice(1).map((logo) => (
            <TokenSymbol symbol={logo} size={54} />
          ))} */}

          <div style={{ zIndex: 5 }}>
            <TokenSymbol symbol={logos[1]} size={54} style={{}} />
          </div>
          <div style={{
            zIndex: 4,
            position: 'absolute',
            left: 50
          }}>
            <TokenSymbol symbol={logos[2]} size={54} style={{}} />
          </div>

          {/* <img
            style={{ marginRight: 15, marginLeft: 15 }}
            src={ArrowRight}
            alt=""
            width="24px"
          />

          <ImageConTainer marginLeft={0} zIndex={logos.length + 1}>
            <TokenSymbol symbol={logos[0]} size={54} />
          </ImageConTainer> */}
        </div>
      )
      }
      <div style={{ paddingTop: 30 }}>
        <PoolTitle>{bank.name}</PoolTitle>
      </div>
      <div style={{ flexDirection: 'column', display: 'flex' }}>
        <span className="font16 bold-200"
          style={{
            textAlign: 'center',
            // fontFamily: 
            fontWeight: 600,
            fontSize: 12,
            lineHeight: '150%',
            letterSpacing: '0.08em',
            textTransform: 'capitalize'
          }}>
          REWARD AMOUNT
      </span>
        <span className="white font16 bold-200 margin-bottom-15"
          style={{
            textAlign: 'center',
            // fontFamily: 
            fontWeight: 600,
            fontSize: 14,
            lineHeight: '20px',
            letterSpacing: '0.08em',
            textTransform: 'capitalize'
          }}
        >
          {bank.poolRewards} {bank.earnTokenName} </span>

      </div>

      <div style={{ flexDirection: 'column', display: 'flex' }}>
        <span className="font16 bold-200"
          style={{
            textAlign: 'center',
            // fontFamily: 
            fontWeight: 600,
            fontSize: 12,
            lineHeight: '150%',
            letterSpacing: '0.08em',
            textTransform: 'capitalize'
          }}>
          POOL DURATION
      </span>
        <span className="white font16 bold-200 margin-bottom-15"
          style={{
            textAlign: 'center',
            // fontFamily: 
            fontWeight: 600,
            fontSize: 14,
            lineHeight: '20px',
            letterSpacing: '0.08em',
            textTransform: 'capitalize'
          }}
        >
          {bank.poolDurationInDays} days </span>

      </div>
      {/* {subtitle && <span className="white font16 bold-600 margin-bottom-15">{subtitle}</span>}
      {description && (
        <span
          className="white font16 bold-200 margin-bottom-15"
          style={{ textAlign: 'center' }}
        >
          {description}
        </span>
      )} */}

      {
        bank.finished && (
          <span
            className="white font16 bold-200 margin-bottom-15"
            style={{ textAlign: 'center' }}
          >
            Pool is now closed, please withdraw your funds
          </span>
        )
      }
      {/* <Apy>Daily {apy.dailyAPY.toFixed(2)}%</Apy>
                      <Apy>Weekly {apy.weeklyAPY.toFixed(2)}%</Apy>
                      <Apy>Annual {apy.yearlyAPY.toFixed(2)}%</Apy> */}
      {
        apy && true && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '85%',
            alignItems: 'center',
            background: '#363130',
            borderRadius: '8px'
          }}>
            <span style={{
              margin: '0px',
              // background: 'green',
              textAlign: 'center',
              padding: 10
            }}>
              APY
            </span>
            <DiscountDivContainer>
              <DiscountDiv>
                <TitleText>{`${apy.dailyAPY.toFixed(2)}%`}</TitleText>
                {`Daily`}
              </DiscountDiv>
              <DiscountDiv>
                <TitleText>{`${apy.weeklyAPY.toFixed(2)}%`}</TitleText>
                {`Weekly`}
              </DiscountDiv>
              <DiscountDiv>
                <TitleText>{`${apy.yearlyAPY.toFixed(2)}%`}</TitleText>
                {`Yearly`}
              </DiscountDiv>
            </DiscountDivContainer>
          </div>
        )
      }

      {/* {toolTipDesciption && (
          <HtmlTooltip enterTouchDelay={0} title={<span>{toolTipDesciption}</span>}>
            <img src={InfoIcon} alt="Inof" width="16px" className="margin-left-5" />
          </HtmlTooltip>
        )} */}
      <PoolSizeDiv>
        {/* <div className="dialog-class margin-top-20">
          {bank.poolSize === Infinity ? 'No-Limit' : 'Pool Size'} <PoolTitle>{bank.poolSize}</PoolTitle>
        </div> */}
        {/* <ProgressCountdown percentage={bank.poolSize} description="Next Epoch" /> */}
      </PoolSizeDiv>
      {/* <span style={{ textAlign: 'center', alignItems: 'center', marginTop: 10 }}>Please note that APYs update every hour.</span> */}

      <div style={{ width: '300px', marginBottom: '20px', marginTop: '20px', display: 'flex', flexDirection:'column' }}>
        <span style={{ textAlign: 'center', alignItems: 'center' }}>Please note that APYs update every hour.</span>
        {!!account ? (
          <Button text="Select" to={`/staking/${bank.contract}`} />
        ) : (
            <Button onClick={() => connect('injected')} text="Unlock Wallet" />
          )}
      </div>
    </CardContainer >
  );
};
const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  // position: absolute;
  align-items: center;
`;
const PoolSizeDiv = styled.div`
  background: #363130;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-weight: 300;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: #ffffff;
`;
const PoolTitle = styled.div`
  font-weight: 600;
  font-size: 18px;
  text-align: center;
  padding: 15px;
  color: #ffffff;
`;
const ImageConTainer = styled.div`
  border: 2px solid #363130;
  margin-left: ${(p: ImageConTainerProps) => `${p.marginLeft}px`};
  z-index: ${(p: ImageConTainerProps) => p.zIndex};
  width: 56px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  height: 56px;
  margin-top: 20px;
  margin-bottom: 20px;
`;
const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
  background: ${(props) => props.theme.color.gradients.dark_linear};
  box-shadow: 0px 12px 24px -4px rgba(0, 0, 0, 0.12), 0px 16px 20px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
`;

const DiscountDivContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #363130;
  border-radius: 8px;
  width: 90%;
  padding-bottom: 10px;
`;

const DiscountDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  text-align: center;
  font-size: 12px;
  // flex: 0.9;
  font-weight: 300;
  color: #ffffff;
  // margin-vertical: 10px;
  padding: 10px 15px 10px 15px;
  margin: 5px;
  min-width: 30%;
  height: 60px
`;

const TitleText = styled.div`
  font-size: 12px;
  margin-right: 5px;
  font-weight: bold;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  text-align: center;
  align-items: center;
  color: #FFFFFF;
`;
export default StakingCard;
