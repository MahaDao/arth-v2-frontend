import React from 'react';
import styled from 'styled-components';
import ArrowRight from '../../assets/img/ArrowRight.svg';
import Button from '../../components/Button';

import { Bank } from '../../basis-cash';
import { useWallet } from 'use-wallet';
import TokenSymbol from '../../components/TokenSymbol';
import { Grid } from '@material-ui/core';
import { useMediaQuery } from 'react-responsive';

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
  console.log('bank', bank)
  const apy: any = APY[bank?.contract];
  const { account, connect } = useWallet();

  const isDesktopOrLaptop = useMediaQuery({ query: '(min-device-width: 1284px)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-device-width: 1284px)' })
  const logos = [bank?.earnTokenName];

  if (bank?.depositTokenName === 'ARTH_DAI-UNI-LPv2') logos.push('ARTH', 'DAI');
  else if (bank?.depositTokenName === 'ARTH_DAI-MAHA-LPv1') logos.push('ARTH', 'DAI');
  else if (bank?.depositTokenName === 'MAHA_ETH-UNI-LPv2') logos.push('MAHA', 'ETH');
  else if (bank?.depositTokenName === 'ARTH_DAI-MAHA-LP') logos.push('ARTH', 'DAI');
  else logos.push(bank?.depositTokenName);

  return (
    <OuterCard>
      <OuterCardHeader>
        <HeaderIcon>
          <TokenSymbol symbol={logos[1]} size={44} style={{}} />
        </HeaderIcon>
        <HeaderTitle>
          Yearn Finance
        </HeaderTitle>
      </OuterCardHeader>
      <OuterCardDesc>
        <span>This is a big line description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placerat et turpis vitae tellus.</span>
      </OuterCardDesc>
      <Grid alignItems={'center'} style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'center',
        width: isDesktopOrLaptop ? '80%' : '98%',
        position: 'relative',
        background: 'linear-gradient(180deg, #48423E 0%, #373030 100%)',
        // box-shadow: 0px 12px 24px -4px rgba(0, 0, 0, 0.12), 0px 16px 20px rgba(0, 0, 0, 0.25);
        borderRadius: '12px',
        marginTop: '10%'
      }}>
        {logos && logos.length > 0 && (
          <div style={{
            flexDirection: 'row',
            display: 'flex',
            width: '20%',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            top: -25,
            left: '35%',
          }}>
            {/* {logos.slice(1).map((logo) => (
            <TokenSymbol symbol={logo} size={54} />
          ))} */}

            <div style={{ zIndex: 5 }}>
              <TokenSymbol symbol={logos[1]} size={44} style={{}} />
            </div>
            <div style={{
              zIndex: 4,
              position: 'absolute',
              left: isTabletOrMobile? 45 : 60
            }}>
              <TokenSymbol symbol={logos[2]} size={44} style={{}} />
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
          <PoolTitle>{bank?.name}</PoolTitle>
        </div>

        <Grid container direction="row" alignItems={'center'} style={{ marginTop: '10px', width: '80%' }}>
          <Grid xs={5} sm={5} md={5} lg={5} xl={5} >
            <div style={{ flexDirection: 'column', display: 'flex' }}>
              <span className="bold-200"
                style={{
                  textAlign: 'center',
                  // fontFamily: 
                  fontWeight: 600,
                  fontSize: 13,
                  lineHeight: '150%',
                  letterSpacing: '0.08em',
                  textTransform: 'capitalize',
                  color: 'rgba(255, 255, 255, 0.32)',
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
                {bank?.poolRewards} {bank?.earnTokenName} </span>

            </div>
          </Grid>
          <Grid xs={2} sm={2} md={2} lg={2} xl={2} style={{
            position: 'relative',
            border: '0.5px solid rgba(255, 255, 255, 0.08)',
            transform: 'rotate(90deg)',
            // background: 'yellow'
          }}>
          </Grid>
          <Grid xs={5} sm={5} md={5} lg={5} xl={5}>
            <div style={{ flexDirection: 'column', display: 'flex' }}>
              <span className="bold-200"
                style={{
                  textAlign: 'center',
                  // fontFamily: 
                  fontWeight: 600,
                  fontSize: 13,
                  lineHeight: '150%',
                  letterSpacing: '0.08em',
                  textTransform: 'capitalize',
                  color: 'rgba(255, 255, 255, 0.32)',
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
                {bank?.poolDurationInDays} days </span>

            </div>
          </Grid>
        </Grid>
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
          bank?.finished && (
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
          true && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              width: '85%',
              alignItems: 'center',
              background: '#363130',
              borderRadius: '8px',
              marginTop: '3%'
            }}>
              <span style={{
                // background: 'green',
                textAlign: 'center',
                padding: 10
              }}>
                APY
                  </span>
              <DiscountDivContainer>
                <DiscountDiv>
                  <TitleText>{`1%`}</TitleText>
                  <TitleText>{`Daily`}</TitleText>
                </DiscountDiv>
                <DiscountDiv>
                  <TitleText>{`7%`}</TitleText>
                  <TitleText>{`Weekly`}</TitleText>
                </DiscountDiv>
                <DiscountDiv>
                  <TitleText>{`40%`}</TitleText>
                  <TitleText>{`Yearly`}</TitleText>
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

        <div style={{ width: '90%', marginBottom: '20px', marginTop: '20px', display: 'flex', flexDirection: 'column' }}>
          <span style={{ textAlign: 'center', alignItems: 'center' }}>Please note that APYs update every hour.</span>
          {!!account ? (
            <Button text="Select" to={`/staking/${bank?.contract}`} />
          ) : (
              <Button onClick={() => connect('injected')} text="Unlock Wallet" />
            )}
        </div>
      </Grid>

    </OuterCard>
  );
};


const OuterCard = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
  border-width: 2px;
  background: rgba(255, 255, 255, 0.02);
  // box-shadow: 0px 12px 24px -4px rgba(0, 0, 0, 0.12), 0px 16px 20px rgba(0, 0, 0, 0.25);
  
  border-radius: 12px;
  padding: 2% 4% 4% 3%;
  // backdrop-filter: blur(70px);
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 80%;
  position: relative;
  background:  linear-gradient(180deg, #48423E 0%, #373030 100%);
  // box-shadow: 0px 12px 24px -4px rgba(0, 0, 0, 0.12), 0px 16px 20px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
`;

const OuterCardHeader = styled.div`
font-weight: 600;
font-size: 18px;
text-align: center;
padding: 15px 5px 5px 7px;
color: #ffffff;
display: flex;
flex-direction: row;
align-items: center;
align-self: flex-start
`;

const HeaderIcon = styled.div`
display: flex;
justify-content: center;
// position: absolute;
align-items: center;
`;

const HeaderTitle = styled.div`
font-family: Inter;
font-style: normal;
font-weight: 600;
font-size: 18px;
line-height: 24px;
padding: 15px;
color: #FFFFFF;
opacity: 0.88;
`;

const OuterCardDesc = styled.div`
font-family: Inter;
font-style: normal;
font-weight: 300;
font-size: 16px;
line-height: 150%;
color: rgba(255, 255, 255, 0.88);
padding: 3px 5px 7px 7px;
`;

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

const DiscountDivContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  // background: yellow;
  border-radius: 8px;
  width: 100%;
  padding: 0px 5px 10px 5px;
`;

const DiscountDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  text-align: center;
  font-size: 12px;
  flex: 0.9;
  font-weight: 300;
  color: #ffffff;
  padding: 10px 15px 10px 15px;
  margin: 0px 3px 0px 3px;
  min-width: 30%;
  height: 45px;
  justify-content: center;
`;

const TitleText = styled.div`
  font-size: 12px;
  // margin-right: 5px;
  font-weight: bold;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  // line-height: 20px;
  text-align: center;
  align-items: center;
  color: #FFFFFF;
`;
export default StakingCard;
