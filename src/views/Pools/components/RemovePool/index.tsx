import React, { useState } from 'react';
import styled from 'styled-components';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';

import { ICards, IPoolData } from '../OpenableCard';
import {
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Slider,
  Theme,
  withStyles,
} from '@material-ui/core';
import arrowDown from '../../../../assets/svg/arrowDown.svg';
import plus from '../../../../assets/svg/plus.svg';
import Button from '../../../../components/Button';
import { useMediaQuery } from 'react-responsive';
import CustomInputContainer from '../../../../components/CustomInputContainer';
import CustomModal from '../../../../components/CustomModal';
import TransparentInfoDiv from '../InfoDiv';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { CustomSnack } from '../../../../components/SnackBar';
import useCore from '../../../../hooks/useCore';
import { ValidateNumber } from '../../../../components/CustomInputContainer/RegexValidation';

type props = {
  selectedPair: {
    liquidity: ICards;
    pool: IPoolData;
  };
  onBack: () => void;
};

const useSliderStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      // color: 'white'
    },
    margin: {
      height: theme.spacing(3),
    },
  }),
);

function valuetext(value: number) {
  return `${value}`;
}

// function valueLabelFormat(value: number) {
//   return marks.findIndex((mark: any) => mark.value === value) + 1;
// }

const PrettoRestrictSlider = withStyles({
  root: {
    // color: 'white',
    height: 15,
    width: '95%',
  },
  thumb: {
    height: 10,
    width: 10,
    // backgroundColor: '#fff',
    border: '2px solid currentColor',
    color: '#FFA981',
    marginTop: -3.5,
    marginLeft: -3,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-100% - 5px)',
    // color: '#FF7F57',
  },
  marked: {
    color: 'red',
  },
  markLabel: {
    // color: 'green'
  },
  track: {
    height: 3,
    borderRadius: 3,
    color: '#FFA981',
    // top: '2%'
  },
  rail: {
    height: 3,
    borderRadius: 3,
    color: '#D74D26',
    // background:'red'
    // border: '1px solid'
  },
  markLabelActive: {
    fontStyle: 'normal',
    fontWeight: 300,
    fontSize: '12px',
    lineHeight: '130%',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.88)',
  },
  mark: {
    color: 'transparent',
  },
})(Slider);

const RemovePool = (props: props & WithSnackbarProps) => {
  const { selectedPair, onBack } = props;

  const [simpleType, setType] = useState<boolean>(true);
  const core = useCore();
  const sliderClasses = useSliderStyles();
  const [sliderValue, setSliderValue] = React.useState(30);
  const isMobile = useMediaQuery({ query: '(max-device-width: 1284px)' });
  const defaultDropdownValues = core.getCollateralTypes();
  const [balance, setBalance] = useState<number>(500.0);
  const [firstCoin, setFirstCoin] = useState<string>('ARTH');
  const [secondCoin, setSecondCoin] = useState<string>('ETH');
  const [firstCoinAmount, setFirstCoinAmount] = useState<string>('0.0');
  const [secondCoinAmount, setSecondCoinAmount] = useState<string>('0.0');
  const [secondCoinDropDown, setSecondCoinDropDown] = useState<string[]>(defaultDropdownValues);
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const handleSliderChange = (event: any, value: any) => {
    setSliderValue(value);
  };
  const simple = () => {
    return (
      <div>
        <div>
          <OneLineInput>
            <div>
              <InputLabel>How much liquidity you want to remove?</InputLabel>
            </div>
            <InputNoDisplay>
              <InternalSpan>{sliderValue}%</InternalSpan>
            </InputNoDisplay>
          </OneLineInput>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: 'white',
            flexDirection: 'row',
            width: '100%',
            paddingLeft: '16px',
            // marginTop: '10px'
          }}
        >
          <div className={sliderClasses.root}>
            <PrettoRestrictSlider
              defaultValue={30}
              getAriaValueText={valuetext}
              valueLabelFormat={valuetext}
              // ValueLabelComponent={'span'}
              // value={sliderValue}
              onChange={handleSliderChange}
              aria-label="pretto slider"
              step={1}
              // marks
              min={0}
              max={100}
              valueLabelDisplay="off"
            />
            <div
              style={{
                marginTop: -15,
                marginLeft: -15,
                marginBottom: 15,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <TimeSpan>0%</TimeSpan>
              <TimeSpan>100%</TimeSpan>
            </div>
          </div>
        </div>
        <PlusMinusArrow>
          <img src={arrowDown} alt="arrow-down" />
        </PlusMinusArrow>
        <PrimaryText>You receive</PrimaryText>
        <ReYouReceiveContain>
          <OneLineInputwomargin style={{ marginBottom: '10px' }}>
            <PrimaryText>ARTH</PrimaryText>
            <OneLineInputwomargin>
              <BeforeHardChip>150.00</BeforeHardChip>
              <HardChip>ARTH</HardChip>
            </OneLineInputwomargin>
          </OneLineInputwomargin>
          <OneLineInputwomargin style={{ marginBottom: '5px' }}>
            <PrimaryText>ETH</PrimaryText>
            <OneLineInputwomargin>
              <BeforeHardChip>200.00</BeforeHardChip>
              <HardChip>MAHA</HardChip>
            </OneLineInputwomargin>
          </OneLineInputwomargin>
        </ReYouReceiveContain>
        <OneLine style={{ marginTop: '15px' }}>
          <div style={{ flex: 1 }}>
            <TextWithIcon>Price</TextWithIcon>
          </div>
          <OneLine>
            <BeforeChip>0.05</BeforeChip>
            <TagChips style={{ marginRight: '5px' }}>ARTH</TagChips>
            <BeforeChip>per</BeforeChip>
            <TagChips>ETH</TagChips>
          </OneLine>
        </OneLine>
      </div>
    );
  };

  const detailed = () => {
    return (
      <div>
        <div>
          <OneLineInput>
            <div>
              <InputLabel>How much liquidity you want to remove?</InputLabel>
            </div>
          </OneLineInput>
        </div>
        <CustomInputContainer
          ILabelValue={'Enter Token Amount'}
          IBalanceValue={`Balance ${balance}`}
          // ILabelInfoValue={'How can i get it?'}
          DefaultValue={firstCoinAmount.toString()}
          LogoSymbol={firstCoin}
          hasDropDown={false}
          multiIcons
          // symbol1={selectedPair?.liquidity?.symbol1}
          // symbol2={selectedPair?.liquidity?.symbol2}
          // dropDownValues={firstCoinDropDown}
          // ondropDownValueChange={(data) => {
          //   if (data !== secondCoin) {
          //     setFirstCoin(data);
          //   }
          // }}
          SymbolText={selectedPair?.liquidity?.pairName}
          inputMode={'decimal'}
          setText={(val: string) =>
            setFirstCoinAmount(ValidateNumber(val) ? val : String(Number(val)))
          }
          tagText={'MAX'}
        />
        <PlusMinusArrow>
          <img src={arrowDown} alt="arrow-down" />
        </PlusMinusArrow>
        <CustomInputContainer
          ILabelValue={'You Receive'}
          IBalanceValue={`Balance ${balance}`}
          // ILabelInfoValue={'How can i get it?'}
          DefaultValue={secondCoinAmount.toString()}
          LogoSymbol={secondCoin}
          hasDropDown={true}
          dropDownValues={secondCoinDropDown}
          ondropDownValueChange={(data) => {
            if (firstCoin !== data) {
              setSecondCoin(data);
            }
          }}
          SymbolText={secondCoin}
          inputMode={'decimal'}
          setText={(val: string) =>
            setSecondCoinAmount(ValidateNumber(val) ? val : String(Number(val)))
          }
          tagText={'MAX'}
        />
        <PlusMinusArrow>
          <img src={plus} alt="plus" />
        </PlusMinusArrow>
        <CustomInputContainer
          ILabelValue={'You Receive'}
          IBalanceValue={`Balance ${balance}`}
          // ILabelInfoValue={'How can i get it?'}
          DefaultValue={secondCoinAmount.toString()}
          LogoSymbol={secondCoin}
          hasDropDown={true}
          dropDownValues={secondCoinDropDown}
          ondropDownValueChange={(data) => {
            if (firstCoin !== data) {
              setSecondCoin(data);
            }
          }}
          SymbolText={secondCoin}
          inputMode={'decimal'}
          setText={(val: string) =>
            setSecondCoinAmount(ValidateNumber(val) ? val : String(Number(val)))
          }
          tagText={'MAX'}
        />
        <OneLine style={{ marginTop: '15px' }}>
          <div style={{ flex: 1 }}>
            <TextWithIcon>Price</TextWithIcon>
          </div>
          <OneLine>
            <BeforeChip>0.05</BeforeChip>
            <TagChips style={{ marginRight: '5px' }}>{firstCoin}</TagChips>
            <BeforeChip>per</BeforeChip>
            <TagChips>{secondCoin}</TagChips>
          </OneLine>
        </OneLine>
      </div>
    );
  };

  return (
    <div>
      <CustomModal
        closeButton
        handleClose={() => setConfirmModal(false)}
        open={confirmModal}
        modalTitleStyle={{}}
        modalContainerStyle={{}}
        modalBodyStyle={{}}
        title={`Confirm Remove Liquidity`}
      >
        <>
          <TransparentInfoDiv
            labelData={`You will receive ARTH`}
            rightLabelUnit={firstCoin}
            rightLabelValue={firstCoinAmount.toString()}
          />
          <TransparentInfoDiv
            labelData={`You will receive ETH`}
            rightLabelUnit={secondCoin}
            rightLabelValue={secondCoinAmount.toString()}
          />
          <Divider style={{ background: 'rgba(255, 255, 255, 0.08)', margin: '15px 0px' }} />

          <TransparentInfoDiv
            labelData={`UNI ARTH/ETH Burned`}
            rightLabelUnit={`${firstCoin}/${secondCoin}`}
            rightLabelValue={'1000.00'}
          />
          <Grid container spacing={2} style={{ marginTop: '32px' }}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Button
                variant={'transparent'}
                text="Cancel"
                size={'lg'}
                onClick={() => {
                  setConfirmModal(false);
                  let options = {
                    content: () =>
                      CustomSnack({
                        onClose: props.closeSnackbar,
                        type: 'red',
                        data1: `Remove-Liquidity order for ${123} ARTH cancelled`,
                      }),
                  };
                  props.enqueueSnackbar('timepass', options);
                }}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Button
                text={'Remove Liquidity'}
                size={'lg'}
                onClick={() => {
                  setConfirmModal(false);
                  let options = {
                    content: () =>
                      CustomSnack({
                        onClose: props.closeSnackbar,
                        type: 'green',
                        data1: `Removing Liquidity for ${123} ARTH`,
                      }),
                  };
                  props.enqueueSnackbar('timepass', options);
                }}
              />
            </Grid>
          </Grid>
        </>
      </CustomModal>
      <CustomCard className={'custom-mahadao-container'}>
        <CustomCardHeader className={'custom-mahadao-container-header'}>
          <EachElement>
            {' '}
            <ArrowBackIos
              onClick={() => onBack()}
              fontSize="default"
              color={'inherit'}
              htmlColor={'#ffffff'}
            />{' '}
          </EachElement>
          <EachElement>
            {' '}
            <CardTitle>Remove Liquidity</CardTitle>
          </EachElement>
          <EachElement>
            {' '}
            <Detailed onClick={() => setType(!simpleType)}>
              {simpleType ? 'Detailed' : 'Simple'}
            </Detailed>
          </EachElement>
        </CustomCardHeader>
        <CustomCardContainer className={'custom-mahadao-container-content'}>
          {/* <div> */}
          {simpleType ? simple() : detailed()}
          <ButtonContainer>
            <div style={isMobile ? {} : { marginRight: 5, width: '100%' }}>
              <Button
                text={'Approve'}
                size={'lg'}
                onClick={() => {
                  setConfirmModal(true);
                }}
              />
            </div>
            <div style={isMobile ? { marginTop: 5 } : { marginLeft: 5, width: '100%' }}>
              <Button text={'Remove Liquidity'} size={'lg'} disabled />
            </div>
          </ButtonContainer>
          {/* </div> */}
        </CustomCardContainer>
      </CustomCard>
      <CustomInfoCard className={'custom-mahadao-box'}>
        <CustomInfoCardHeader>Your Position</CustomInfoCardHeader>
        <CustomInfoCardDetails>
          <OneLine>
            <div style={{ flex: 1 }}>
              <TextWithIcon> Your total pool tokens </TextWithIcon>
            </div>
            <OneLine>
              <BeforeChip>{selectedPair?.pool?.total}</BeforeChip>
              <TagChips>ARTH / ETH </TagChips>
            </OneLine>
          </OneLine>
          <OneLine>
            <div style={{ flex: 1 }}>
              <TextWithIcon> Pooled ARTH </TextWithIcon>
            </div>
            <OneLine>
              <BeforeChip>{selectedPair?.pool?.arth}</BeforeChip>
              <TagChips>ARTH</TagChips>
            </OneLine>
          </OneLine>
          <OneLine>
            <div style={{ flex: 1 }}>
              <TextWithIcon>Pooled ETH</TextWithIcon>
            </div>
            <OneLine>
              <BeforeChip>{selectedPair?.pool?.eth}</BeforeChip>
              <TagChips>ETH</TagChips>
            </OneLine>
          </OneLine>
          <OneLine>
            <div style={{ flex: 1 }}>
              <TextWithIcon>Your pool share</TextWithIcon>
            </div>
            <OneLine>
              <BeforeChip>{selectedPair?.pool?.share}%</BeforeChip>
              {/* <TagChips>0.06%</TagChips> */}
            </OneLine>
          </OneLine>
        </CustomInfoCardDetails>
      </CustomInfoCard>
    </div>
  );
};

export default withSnackbar(RemovePool);

const CustomCard = styled.div`
  background: linear-gradient(180deg, #48423e 0%, #373030 100%);
  border-radius: 12px;
  margin-top: 12px;
`;

const CustomCardHeader = styled.div`
  display: flex;
  flex-direction: row;
  padding: 24px 32px;
  align-items: center;
  align-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  @media (max-width: 600px) {
    padding: 12px 16px;
  }
`;

const EachElement = styled.div`
  flex: 0.3333;
  cursor: pointer;
`;

const TimeSpan = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.88);
`;

const OneLineInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
  margin: 0px 0px 10px 0px;
`;
const InternalSpan = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ffffff;
`;

const InputNoDisplay = styled.span`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 2px 10px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px 0px 0px 8px;
`;

const InputLabel = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.64);
  margin: 0px;
`;

const Detailed = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: right;
  color: #f7653b;
`;

const CustomCardContainer = styled.div`
  padding: 32px 32px;
  @media (max-width: 600px) {
    padding: 16px 16px;
  }
`;
const ButtonContainer = styled.div`
  margin: 15px 0px 0px 0px;
  display: flex;
  flex-direction: row;
  @media (max-width: 600px) {
    flex-direction: column;
  }
  justify-content: space-between;
`;
const CardTitle = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: rgba(255, 255, 255);
  margin: 0px;
`;

const PrimaryText = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.64);
  margin: 0px;
  flex: 1;
`;

const BeforeHardChip = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: right;
  color: rgba(255, 255, 255, 0.88);
`;
const HardChip = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 2px 8px;
  font-family: Inter;
  font-style: normal;
  color: rgba(255, 255, 255, 0.64);
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  margin-left: 10px;
  margin-right: 10px;
`;
const OneLineInputwomargin = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
`;

const ReYouReceiveContain = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 10px;
  margin: 10px 0px;
`;

const PlusMinusArrow = styled.div`
  width: 100%;
  height: 30px;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  font-size: 20px;
`;

const CustomInfoCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(21px);
  border-radius: 12px;
  padding: 32px;
  margin-top: 20px;
  @media (max-width: 600px) {
    padding: 16px;
  }
`;
const CustomInfoCardHeader = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.88);
  margin: 0;
`;

const CustomInfoCardDetails = styled.div`
  margin: 10px 0;
`;

const OneLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.64);
  margin: 5px 0;
`;

const TextWithIcon = styled.div`
  ont-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.64);
`;
const BeforeChip = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: right;
  color: rgba(255, 255, 255, 0.88);
  margin-right: 5px;
`;

const TagChips = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 2px 8px;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.64);
`;
