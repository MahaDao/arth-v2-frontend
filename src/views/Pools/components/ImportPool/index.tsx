import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'
import TokenSymbol from '../../../../components/TokenSymbol';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import plus from '../../../../assets/svg/plus.svg';
import CustomImportPoolDropDown from './components/CustomImportPoolDropDown';

type props = {
  onBack: () => void;
};

const ImportPool: React.FC<props> = (props) => {
  const { onBack } = props;
  const [dropDownNo, setDropDownNo] = useState<number>(0);

  const defaultDropdownValues = ['MAHA', 'ARTH', 'USDT', 'USDC', 'ETH', 'WBTC'];

  const [firstCoin, setFirstCoin] = useState<string>('Select Token');
  const [secondCoin, setSecondCoin] = useState<string>('Select Token');

  const [firstCoinDropDown, setFirstCoinDropDown] = useState<string[]>([]);
  const [secondCoinDropDown, setSecondCoinDropDown] = useState<string[]>([]);

  useEffect(() => {
    let arr: string[];
    arr = defaultDropdownValues.filter(e => {
      return (![firstCoin, secondCoin].includes(e))
    });
    setFirstCoinDropDown(arr);

    let arr2: string[];
    arr2 = defaultDropdownValues.filter(e => {
      return (![firstCoin, secondCoin].includes(e))
    });
    setSecondCoinDropDown(arr2);
  }, [firstCoin, secondCoin])

  return (
    <div>
      <CustomCard className={"custom-mahadao-container"}>
        <CustomCardHeader className={"custom-mahadao-container-header"}>
          <EachElementBack> <ArrowBackIos onClick={() => onBack()} fontSize="default" color={'inherit'} htmlColor={'#ffffff'}/> </EachElementBack>
          <EachElementTitle> <CardTitle> Import Pool </CardTitle></EachElementTitle>
        </CustomCardHeader>
        <CustomCardContainer className={"custom-mahadao-container-content"}>
          <CoinSelection onClick={() => {
            if (dropDownNo === 1){
              setDropDownNo(0)
            } else {
              setDropDownNo(1)
            }
          }}>
            <TokenConatiner>
              {firstCoin !== 'Select Token' && <TokenSymbol symbol={firstCoin} size={25} />}
              <TokenText>{firstCoin}</TokenText>
            </TokenConatiner>
            <KeyboardArrowDown fontSize={'default'} htmlColor={'#fffff80'} />
            {dropDownNo === 1 && <CustomImportPoolDropDown
              dropDownValues={firstCoinDropDown}
              ondropDownValueChange={(data) => {
                if (data !== secondCoin) {
                  setFirstCoin(data);
                }
              }}
            />}
          </CoinSelection>
          <PlusMinusArrow>
            <img src={plus}  alt={''}/>
          </PlusMinusArrow>
          <CoinSelection onClick={() => {
            if (dropDownNo === 2){
              setDropDownNo(0)
            } else {
              setDropDownNo(2)
            }
          }}>
            <TokenConatiner>
              {secondCoin !== 'Select Token' && <TokenSymbol symbol={secondCoin} size={25} />}
              <TokenText>{secondCoin}</TokenText>
            </TokenConatiner>
            <KeyboardArrowDown fontSize={'default'} htmlColor={'#fffff80'} />
            {dropDownNo === 2 && <CustomImportPoolDropDown
              dropDownValues={secondCoinDropDown}
              ondropDownValueChange={(data) => {
                if(data !== firstCoin) {
                  setSecondCoin(data);
                }
              }}
            />}
          </CoinSelection>
          <div style={{marginTop: '24px'}}>
            <InfoMessage>
              Select a token to find your liquidity.
            </InfoMessage>
            <ActionMessage>
              Add liquidity
            </ActionMessage>
          </div>
        </CustomCardContainer>
      </CustomCard>
      <CustomInfoCard className={"custom-mahadao-box"}>
        <CustomInfoCardHeader>
          Your Position
        </CustomInfoCardHeader>
        <CustomInfoCardDetails>
          <OneLine>
            <div style={{ flex: 1 }}>
              <TextWithIcon> Your total pool tokens </TextWithIcon>
            </div>
            <OneLine>
              <BeforeChip>1000.00</BeforeChip>
              <TagChips>ARTH / ETH </TagChips>
            </OneLine>
          </OneLine>
          <OneLine>
            <div style={{ flex: 1 }}>
              <TextWithIcon> Pooled ARTH </TextWithIcon>
            </div>
            <OneLine>
              <BeforeChip>1500.00</BeforeChip>
              <TagChips>ARTH</TagChips>
            </OneLine>
          </OneLine>
          <OneLine>
            <div style={{ flex: 1 }}>
              <TextWithIcon>Pooled ETH</TextWithIcon>
            </div>
            <OneLine>
              <BeforeChip>1500.00</BeforeChip>
              <TagChips>ETH</TagChips>
            </OneLine>
          </OneLine>
          <OneLine>
            <div style={{ flex: 1 }}>
              <TextWithIcon>Your pool share</TextWithIcon>
            </div>
            <OneLine>
              <BeforeChip>1.08</BeforeChip>
              <TagChips>0.06%</TagChips>
            </OneLine>
          </OneLine>
        </CustomInfoCardDetails>
      </CustomInfoCard>
    </div>
  )
}

export default ImportPool

const CustomCard = styled.div`
  margin-top: 12px;
`

const CustomCardHeader = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 28px;
  padding-bottom: 28px;
  align-items: center;
  align-content: center;
`

const EachElementBack = styled.div`
  flex: 0.25;
  cursor: pointer;
`

const EachElementTitle = styled.div`
  flex: 0.5;
`

const CustomCardContainer = styled.div`
  
`
const CardTitle = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: rgba(255, 255, 255);
  margin: 0;
`

const CoinSelection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #1F1E1E;
  border-radius: 6px;
  position: relative;
  cursor: pointer;
`
const TokenConatiner = styled.div`
  flex: 1;
`
const TokenText = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.64);
  margin-left: 10px;
`
const PlusMinusArrow = styled.div`
  width: 100%;
  height: 40px;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  font-size: 20px;
`

const InfoMessage = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  margin-bottom: 4px;
  color: white;
`
const ActionMessage = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #F7653B;
  margin: 0;
  cursor: pointer;
`

const CustomInfoCard = styled.div`
  margin-top: 20px;
`
const CustomInfoCardHeader = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255);
  margin: 0;
`

const CustomInfoCardDetails = styled.div`
  margin: 10px 0;
`

const OneLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
  margin: 5px 0;
`

const TextWithIcon = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.64);

`
const BeforeChip = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.64);
  margin-right: 5px;
`

const TagChips = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 2px 8px;
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.64);
`
