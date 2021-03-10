import React from 'react';
import styled from 'styled-components';

import Button from '../../../components/Button';
import Card from '../../../components/Card';
import CardContent from '../../../components/CardContent';
import TokenSymbol from '../../../components/TokenSymbol';
import { useWallet } from 'use-wallet';
import useBasisCash from '../../../hooks/useBasisCash';
import InfoIcon from '../../../assets/img/InfoIcon.svg';
import { Vaults } from '../../../basis-cash/config';
import HtmlTooltip from '../../../components/HtmlTooltip';
import { Grid } from '@material-ui/core';


interface BoardroomProps {
  vault: Vaults
  toolTipTitle?: string;
}

const Vault: React.FC<BoardroomProps> = (props) => {
  const { account, connect } = useWallet();
  const basisCash = useBasisCash();

  const boardroom = basisCash.getBoardroomVault(props.vault);
  // const logos = [bank.earnTokenName];
  // if (bank.depositTokenName === 'ARTH_DAI-UNI-LPv2') logos.push('ARTH', 'DAI');
  // else if (bank.depositTokenName === 'ARTH_DAI-MAHA-LPv1') logos.push('ARTH', 'DAI');
  // else if (bank.depositTokenName === 'MAHA_ETH-UNI-LPv2') logos.push('MAHA', 'ETH');
  // else if (bank.depositTokenName === 'ARTH_DAI-MAHA-LP') logos.push('ARTH', 'DAI');
  // else logos.push(bank.depositTokenName);
  return (
    <StyledCardWrapper>
      <Card>
        <CardContent>
          <StyledContent>
            {/* <CardIcon> */}
            {/* // <TokenSymbol symbol={boardroom.depositTokenName} size={54} /> */}
            {/* </CardIcon> */}
            <div style={{
              flexDirection: 'row',
              display: 'flex',
              width: '20%',
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              top: -50,
              left: '33%',
              marginBottom: 15,
            }}>
              <div style={{ zIndex: 5, background: '#2A2827', borderRadius: 36 }}>
                <TokenSymbol symbol={boardroom.depositTokenName} size={54} style={{}} />
              </div>
              <div style={{
                zIndex: 4,
                position: 'absolute',
                left: 50,
                background: '#2A2827',
                borderRadius: 36
              }}>
                <TokenSymbol symbol={boardroom.depositTokenName} size={54} style={{}} />
              </div>
            </div>
            <div style={{ marginTop: 10 }} />
            <StyledTitle>
              Deposit {boardroom.depositTokenName.includes('ARTH_DAI') ?
                `ARTH + DAI` :
                boardroom.depositTokenName.includes('ARTH_ETH') ? `ARTH + ETH` :
                  boardroom.depositTokenName
              }
            </StyledTitle>
            <StyledSubTitle>
              Earn ARTH
            </StyledSubTitle>
            <Grid container direction="row" alignItems={'center'} style={{ marginTop: '20px' }}>
              <Grid xs={5} sm={5} md={5} lg={5} xl={5} >
                <div style={{ flexDirection: 'column', display: 'flex' }}>
                  <span className="font16 bold-200"
                    style={{
                      textAlign: 'center',
                      // fontFamily: 
                      fontWeight: 600,
                      fontSize: 12,
                      lineHeight: '150%',
                      letterSpacing: '0.08em',
                      textTransform: 'capitalize',
                      color: 'rgba(255, 255, 255, 0.32)',
                    }}>
                    Seigniorage Supply
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
                    50% </span>

                </div>
              </Grid>
              <Grid xs={2} sm={2} md={2} lg={2} xl={2} style={{
                position: 'relative',
                border: '0.5px solid rgba(255, 255, 255, 0.08)',
                transform: 'rotate(90deg)'
              }}>
                {/* <div style={{
                  position: 'absolute',
                  width: '2px',
                  height: '60px',
                  // left: '198px',
                  // top: '550px',

                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  Hii there
                </div> */}
              </Grid>
              <Grid xs={5} sm={5} md={5} lg={5} xl={5}>
                <div style={{ flexDirection: 'column', display: 'flex' }}>
                  <span className="font16 bold-200"
                    style={{
                      textAlign: 'center',
                      // fontFamily: 
                      fontWeight: 600,
                      fontSize: 12,
                      lineHeight: '150%',
                      letterSpacing: '0.08em',
                      textTransform: 'capitalize',
                      color: 'rgba(255, 255, 255, 0.32)',
                    }}>
                    Withdrawal Period
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
                    8 Hours </span>

                </div>
              </Grid>
            </Grid>
            {/* <LockinDiv>
              <StyledInfoSlot>
                <SlotTitle>{boardroom.lockInPeriodDays} day lock-in period</SlotTitle>
              </StyledInfoSlot>
            </LockinDiv> */}
            {/* <StyledInfoSlots>
              <PercentageContainer>
                <PercentageTilte>
                  <BoldText>{boardroom.seionrageSupplyPercentage}% </BoldText>Seigniorage Supply
                  {props.toolTipTitle && (
                    <HtmlTooltip enterTouchDelay={0} title={<span>{props.toolTipTitle}</span>}>
                      <img src={InfoIcon} alt="Inof" width="24px" className="margin-left-5" />
                    </HtmlTooltip>
                  )}
                </PercentageTilte>
              </PercentageContainer>
            </StyledInfoSlots> */}
            {
              true && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  alignItems: 'center',
                  background: '#363130',
                  borderRadius: '8px'
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
            <div className="border-bottom width-100 margin-top-10 margin-bottom-10" />
            <StyledInfoSlots>500.086 MAHASWAP L2-V1</StyledInfoSlots>
            <StyledInfoSlots>5000 ARTH Reward Earned</StyledInfoSlots>
            <ButtonContainer>
              {!!account ? (
                <Button text="Select" to={`/distribution/v2/${boardroom.kind}`} />
              ) : (
                  <Button onClick={() => connect('injected')} text="Unlock Wallet" />
                )}
            </ButtonContainer>
          </StyledContent>
        </CardContent>
      </Card>
    </StyledCardWrapper >
  );
};

// const CardIcon = styled.div`
//   background-color: ${(props) => props.theme.color.grey[900]};
//   width: 72px;
//   height: 72px;
//   border-radius: 36px;
//   // display: flex;
//   // align-items: center;
//   postition: absolute;
//   // justify-content: center;
//   top: -100px;
//   margin-bottom: ${(props) => props.theme.spacing[2]}px;
// `;
const ButtonContainer = styled.div`
  max-width: 300px;
  width: 100%;
  margin-top: 10px
`;
const StyledCardWrapper = styled.div`
  display: flex;
  margin-bottom: 25px;
  max-width: 500px;
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
  // background: red
`;

const StyledInfoSlots = styled.div`
  display: flex;
  text-align: center;
  padding-top: 5px;
  padding-bottom: 5px;
`;
const LockinDiv = styled.div`
  display: flex;
  text-align: center;
  padding-bottom: 3px;
  padding-top: 35px;
`;
const StyledInfoSlot = styled.div`
  padding-left: 5px;
  padding-right: 5px;
`;

const SlotTitle = styled.div`
  color: #fff;
  font-weight: 300;
  font-size: 16px;
`;
const PercentageTilte = styled.span`
  text-align: center;
  font-weight: 300;
  font-size: 16px;
  color: #ffffff;
`;
const BoldText = styled.span`
  font-weight: 600;
  font-size: 18px;
  margin-right: 5px;
`;
const PercentageContainer = styled.div`
  background: rgba(255, 255, 255, 0.16);
  border-radius: 60px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 13px 15px;
`;

const StyledTitle = styled.h3`
  color: ${(props) => props.theme.color.grey[200]};
  margin-top: 10px;
  padding: 0;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #FFFFFF;
  opacity: 0.88;
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

const StyledSubTitle = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: #FFFFFF;
  opacity: 0.88;
`;

export default Vault;
