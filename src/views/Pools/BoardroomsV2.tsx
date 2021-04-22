import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Container from '../../components/Container';
import useBasisCash from '../../hooks/useBasisCash';
import Grid from '@material-ui/core/Grid';
import uniswapLogo from '../../assets/svg/uniswapLogo.svg'
import shushiswap from '../../assets/svg/sushiswapLogo.svg'
import Button from '../../components/Button';
import TokenSymbol from '../../components/TokenSymbol';
import arrowDown from '../../assets/svg/arrowDown2.svg'
import arrowUp from '../../assets/svg/arrowUp.svg'
import TransparentInfoDiv from './components/InfoDiv';
import { useMediaQuery } from 'react-responsive';
import OpenableCard from './components/OpenableCard';
import ImportPool from './components/ImportPool';
import RemovePool from './components/RemovePool';
import AddLiquidity from './components/AddLiquidity';
import { withSnackbar, WithSnackbarProps } from 'notistack';


const Boardrooms = (props: WithSnackbarProps) => {
  useEffect(() => window.scrollTo(0, 0), []);
  const basisCash = useBasisCash();
  const [action, setAction] = useState<'Details' | 'Import' | 'Add' | 'Remove'>('Details')
  const [selectedSwap, setSelectedSwap] = useState<'Uniswap' | 'Sushiswap'>('Uniswap');
  const [noLiquidity, setNoLiquidity] = useState<boolean>(false);
  const [remove, setRemove] = useState<boolean>(false);
  const [deposit, setDeposit] = useState<boolean>(false);
  const liquidityPairs = [
    {
      liquidity: {
        id: 1,
        symbol1: 'ARTH',
        symbol2: 'ETH',
        pairName: 'ARTH-ETH'
      },
      pool: {
        total: '1500.00',
        arth: '1500.00',
        share: '0.06',
        eth: '1500.00'
      }
    },
    {
      liquidity: {
        id: 1,
        symbol1: 'ARTH',
        symbol2: 'MAHA',
        pairName: 'ARTH-MAHA'
      },
      pool: {
        total: '1500.00',
        arth: '1500.00',
        share: '0.06',
        eth: '1500.00'
      }
    }
  ]
  const [cardOpen, setCardOpen] = useState<boolean>(false)
  const [selectedPair, setSelectedPair] = useState({
    liquidity: {
      id: 1,
      symbol1: 'ARTH',
      symbol2: 'ETH',
      pairName: 'ARTH-ETH'
    },
    pool: {
      total: '1500.00',
      arth: '1500.00',
      share: '0.06',
      eth: '1500.00'
    }
  })
  const isMobile = useMediaQuery({ query: '(max-device-width: 1284px)' })
  const [removeType, setRemoveType] = useState<'S' | 'D'>('S')
  // const isLaunched = Date.now() >= config.boardroomLaunchesAt.getTime();
  if (!basisCash) return <div />;

  const NoLiquidityFound = () => {
    return (
      <RightTopCard className={"custom-mahadao-box"}>
        <NlfSpan>No Liquidity Found</NlfSpan>
      </RightTopCard>
    )
  }


  const MainGrid = () => {
    return (
      <>
        <YourLiquidityHeader>
          <HeaderLabel>Your Liquidity</HeaderLabel>
          <div style={{ flex: 0.5 }}>
            <Button text={'Add Liquidity'} onClick={() => setAction('Add')} />
          </div>
        </YourLiquidityHeader>
        {
          noLiquidity ?
            NoLiquidityFound()
            :
            liquidityPairs.map(pair =>
              <OpenableCard
                liquidityPair={pair.liquidity}
                poolData={pair.pool}
                setSelected={(val: any) => {
                  setSelectedPair(val)
                }}
                setRemove={(val: boolean) => {
                  setAction('Remove')
                }}
                setDeposit={(val: boolean) => {
                  setDeposit(val)
                }}
              />)
        }
        <FeesSpan>Account Analytics and Accured Fees</FeesSpan>
        <ImportIt onClick={() => { setAction('Import') }}>
          Don't see a pool you joined? <span style={{ color: '#F7653B' }}>Import it.</span>
        </ImportIt>
      </>
    )
  }
  return (
    <>
      <GradientDiv />
      <Container size="lg">
        <div>
          <PageHeading>
            Pool
          </PageHeading>
          <PageSubHeading>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </PageSubHeading>
        </div>
        <Grid container>
          <Grid item lg={3}></Grid>
          <Grid item lg={6} md={12} sm={12} xs={12} >
            <RadioSelectionConatiner>
              <RadioSubConatiner onClick={() => {
                if (selectedSwap === 'Sushiswap') {
                  setSelectedSwap('Uniswap')
                }
              }}>
                {selectedSwap === 'Uniswap' && <ActiveRadio />}
                <RadioText>
                  <RadioLogo>
                    <img src={uniswapLogo} style={{ marginTop: '-6px' }} />
                  </RadioLogo>
                  Uniswap
                </RadioText>
              </RadioSubConatiner>
              <RadioSubConatiner onClick={() => {
                if (selectedSwap === 'Uniswap') {
                  setSelectedSwap('Sushiswap')
                }
              }}>
                {selectedSwap === 'Sushiswap' && <ActiveRadio />}
                <RadioText>
                  <RadioLogo>
                    <img src={shushiswap} />
                  </RadioLogo>
                  Sushiswap
                </RadioText>
              </RadioSubConatiner>
            </RadioSelectionConatiner>
          </Grid>
          <Grid item lg={3}></Grid>
        </Grid>
        <Grid container>
          <Grid item lg={3}></Grid>
          <Grid item lg={6} md={12} sm={12} xs={12} >
            {action === 'Details' &&
              <MainGrid />
            }
            {action === 'Remove' &&
              <RemovePool
                selectedPair={selectedPair}
                onBack={() => {
                  setAction('Details');
                }}
              />
            }
            {action === 'Add' &&
              <AddLiquidity
                onBack={() => {
                  setAction('Details');
                }}
              />
            }
            {action === 'Import' &&
              <ImportPool
                onBack={() => {
                  setAction('Details');
                }}
              />
            }
          </Grid>
          <Grid item lg={3}></Grid>
        </Grid>
      </Container>
    </>
  );
}

const GradientDiv = styled.div`
  background: linear-gradient(180deg, #2A2827 0%, rgba(42, 40, 39, 0) 100%);
  height: 270px;
  position: absolute;
  // border: 1px solid;
  width: 100rem;
  z-index: -5;
`;

const PageHeading = styled.p`
  font-family: Syne;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 29px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-align: center;
  color: #FFFFFF;
  margin-top: 40px;
`

const PageSubHeading = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.64);
  text-align: center;
  margin-bottom: 40px;

`

const RadioSelectionConatiner = styled.div`
  background: #2A2827;
  border-radius: 8px;
  padding: 6px;
  display: flex;
  flex-direction: row;
`
const RadioSubConatiner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  z-index: 1;
  cursor: pointer;
  flex: 0.5;
  position: relative;
`

const RadioText = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.88);
  z-index: 1;
`

const RadioLogo = styled.span`
  margin-left: 5px;
  margin-right: 5px;
`

const ActiveRadio = styled.div`
  position: absolute;
  width: 100%;
  height: 40px;
  background: #423B38;
  border-radius: 4px;
  z-index: 0;
`

const YourLiquidityHeader = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  width: 100%;
  // background: lightgreen;
  padding: 0px 5px;
  align-items: center;
  margin: 25px 0px;
`;

const HeaderLabel = styled.span`
font-family: Inter;
font-style: normal;
font-weight: 600;
font-size: 18px;
line-height: 24px;
color: rgba(255, 255, 255, 0.88);
flex: 1
`;

const RightTopCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  // backdrop-filter: blur(21px);
  border-radius: 12px;
  padding: 32px;
  align-items: center;
  justify-content: center;
  // text-align: center;
`

const NlfSpan = styled.div`
font-family: Inter;
font-style: normal;
font-weight: 300;
font-size: 18px;
line-height: 135%;
text-align: center;
color: #FFFFFF;
`;

const FeesSpan = styled.div`
font-family: Inter;
font-style: normal;
font-weight: 600;
font-size: 14px;
line-height: 20px;
color: #F7653B;
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
  cursor: pointer;
`;

const MainOpenableCard = styled.div`
display: flex;
flex-direction: column;
justify-content: space-between;
align-items: center;
padding: 20px 32px;
background: linear-gradient(180deg, #48423E 0%, #373030 100%);
border-radius: 12px;
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
color: #FFFFFF;
opacity: 0.88;
margin: 0px 0px 0px 16px;
`;

const Manage = styled.div`
font-family: Inter;
font-style: normal;
font-weight: 600;
font-size: 14px;
line-height: 20px;
color: #F7653B;
display: flex;
flex-direction: row;
align-items: center;
`;

export default withSnackbar(Boardrooms);
