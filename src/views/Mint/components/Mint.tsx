import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import useBasisCash from '../../../hooks/useBasisCash';
import Grid from '@material-ui/core/Grid';
import Button from '../../../components/Button';
import arrowDown from '../../../assets/svg/arrowDown.svg';
import plus from '../../../assets/svg/plus.svg';
import {
    Checkbox,
    CheckboxProps,
    createStyles,
    Divider,
    FormControlLabel,
    makeStyles,
    Slider,
    Theme,
    withStyles,
} from '@material-ui/core';
import TransparentInfoDiv from './InfoDiv';
import CheckIcon from '@material-ui/icons/Check';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CustomInputContainer from '../../../components/CustomInputContainer';
import CustomModal from '../../../components/CustomModal';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { CustomSnack } from '../../../components/SnackBar';
import CustomToolTip from '../../../components/CustomTooltip';
import CustomSuccessModal from '../../../components/CustomSuccesModal';


const OrangeCheckBox = withStyles({
    root: {
        color: 'rgba(255, 255, 255, 0.32)',
        '&$checked': {
            color: '#FF7F57',
        },
    },
    checked: {
        color: 'white',
    },
})((props: CheckboxProps) => <Checkbox {...props} />);

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
        // height: '3px',
        // width: '3px',
        // borderRadius: '50%',
        color: 'transparent',
    },
})(Slider);
const DEFAULT_CALC = 1440;

interface IProps {
    setType: (type: 'Mint' | 'Redeem') => void;
}
const MintTabContent = (props: WithSnackbarProps & IProps) => {
    useEffect(() => window.scrollTo(0, 0), []);
    const basisCash = useBasisCash();
    const colletralRatio = 86;
    const [mintColl, setCollateralValue] = useState<string>('0');
    const [mintArthxShare, setArthxShare] = useState<string>('0');
    const [balance, setBalance] = useState<string>('0');
    const [mintReceive, setReceive] = useState<string>('0');
    const [calcDuration, setDuration] = useState<number>(DEFAULT_CALC);
    const [currentCounter, setCurrentCounter] = useState<number>(1000);
    const type = 'Mint'
    const [openModal, setOpenModal] = useState<0 | 1 | 2>(0);
    const [checked, setChecked] = React.useState(false);
    const sliderClasses = useSliderStyles();
    const [sliderValue, setSliderValue] = React.useState(1);
    const [successModal, setSuccessModal] = useState<boolean>(false);
    const collateralTypes = useMemo(() => basisCash.getCollateralTypes(), [basisCash]);
    const [selectedCollateralCoin, setSelectedCollateralCoin] = useState(
        basisCash.getDefaultCollateral(),
    );
    const onBuyColletralValueChange = async (val: string) => {
        if (val === '') {
            setReceive('0');
        }
        setCollateralValue(val);
        const valueInNumber = Number(val);
        if (valueInNumber) {
            let arthxShareTemp =
                (await ((100 * valueInNumber) / colletralRatio)) * ((100 - colletralRatio) / 100);
            setArthxShare(arthxShareTemp.toString());
            setReceive(String(arthxShareTemp + valueInNumber));
            console.log(arthxShareTemp.toString(), String(arthxShareTemp + valueInNumber))
        }
    };

    const onARTHXValueChange = async (val: string) => {
        if (val === '') {
            setReceive('0');
        }
        setArthxShare(val);
        const valueInNumber = Number(val);
        if (valueInNumber) {
            let colletralTemp =
                (await ((100 * valueInNumber) / (100 - colletralRatio))) * (colletralRatio / 100);
            setCollateralValue(colletralTemp.toString());
            setReceive(String(colletralTemp + valueInNumber));
            console.log(colletralTemp.toString(), String(colletralTemp + valueInNumber))
        }
    };

    const handleCheck = (event: any) => {
        // console.log('check trig', event.target.checked)
        setChecked(event.target.checked);
    };

    const handleSliderChange = (event: any, value: any) => {
        console.log('check trig', value);
        setSliderValue(value);
        setDuration(DEFAULT_CALC - value * value);
    };
    return (
        <>
            <CustomModal
                closeButton
                handleClose={() => setOpenModal(0)}
                open={openModal === 1}
                modalTitleStyle={{}}
                modalContainerStyle={{}}
                modalBodyStyle={{}}
                title={`Confirm Mint ARTH`}
            >
                <>
                    <TransparentInfoDiv
                        labelData={`Your collateral supply`}
                        rightLabelUnit={'USDT'}
                        rightLabelValue={mintColl.toString()}
                    />

                    <TransparentInfoDiv
                        labelData={`Your share supply`}
                        // labelToolTipData={'testing'}
                        rightLabelUnit={'ARTHX'}
                        rightLabelValue={mintArthxShare.toString()}
                    />

                    <TransparentInfoDiv
                        labelData={`Trading Fee`}
                        labelToolTipData={'testing'}
                        rightLabelUnit={'USDT'}
                        rightLabelValue={'0.05'}
                    />

                    <Divider
                        style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            margin: '15px 0px',
                        }}
                    // variant={'middle'}
                    />

                    <TransparentInfoDiv
                        labelData={`You receive`}
                        // labelToolTipData={'testing'}
                        rightLabelUnit={'ARTH'}
                        rightLabelValue={'1000.00'}
                    />

                    <CheckboxDiv>
                        <FormControlLabel
                            value=""
                            checked={checked}
                            control={
                                <OrangeCheckBox
                                    icon={<CheckBoxOutlineBlankIcon fontSize={'inherit'} />}
                                    checkedIcon={
                                        <CheckIcon
                                            style={{
                                                background: '#FF7F57',
                                                color: 'white',
                                                borderRadius: '6px',
                                            }}
                                            fontSize={'inherit'}
                                        />
                                    }
                                    size={'medium'}
                                />
                            }
                            label="Deposit $ARTH in staking pool to earn reward APY"
                            labelPlacement="end"
                            onChange={handleCheck}
                        />
                    </CheckboxDiv>
                    {checked && (
                        <StakingDiv>
                            <div>
                                <OneLineInput style={{margin: '0px'}}>
                                    <div>
                                        <InputLabel style={{marginTop: '12px'}}>Select how long would you like to stake</InputLabel>
                                    </div>
                                    <InputNoDisplay>
                                        <InternalSpan>{sliderValue} months</InternalSpan>
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
                                    marginTop: '5px'
                                }}
                            >
                                <div className={sliderClasses.root}>
                                    <PrettoRestrictSlider
                                        // defaultValue={sliderValue ?? 1}
                                        // onChange={handleSliderChange}
                                        // // valueLabelFormat={valueLabelFormat}
                                        // getAriaValueText={valuetext}
                                        // aria-labelledby="discrete-slider-small-steps"
                                        // step={1}
                                        // min={1}
                                        // max={36}
                                        // valueLabelDisplay="on"
                                        // // marks={marks}
                                        // ValueLabelComponent={"strong"}
                                        defaultValue={1}
                                        getAriaValueText={valuetext}
                                        valueLabelFormat={valuetext}
                                        // ValueLabelComponent={'span'}
                                        // value={sliderValue}
                                        onChange={handleSliderChange}
                                        aria-label="pretto slider"
                                        step={1}
                                        marks
                                        min={1}
                                        max={36}
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
                                        <TimeSpan>1 month</TimeSpan>
                                        <TimeSpan>3 Years</TimeSpan>
                                    </div>
                                </div>
                            </div>
                            <TransparentInfoDiv
                                labelData={`Estimated earning`}
                                // labelToolTipData={'testing'}
                                rightLabelUnit={'MAHA'}
                                rightLabelValue={'~100.0'}
                                countUp
                                cEnd={9999}
                                cDuration={calcDuration}
                                cStart={currentCounter}
                            // updateCounter={(val: number)=>{
                            //   setCurrentCounter(val)
                            // }}
                            />

                            <TransparentInfoDiv
                                labelData={`ROR`}
                                // labelToolTipData={'testing'}
                                // rightLabelUnit={''}
                                rightLabelValue={String(10 * sliderValue) + '%'}
                            />

                            <TransparentInfoDiv
                                labelData={`APY`}
                                // labelToolTipData={'testing'}
                                // rightLabelUnit={'MAHA'}
                                rightLabelValue={String(10 * sliderValue) + '%'}
                            />
                        </StakingDiv>
                    )}
                    <div
                        style={{
                            flexDirection: 'column-reverse',
                            display: 'flex',
                            width: '100%',
                            marginTop: '10%',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 8,
                        }}
                    >
                        <div style={{ flex: 1, width: '100%', marginTop: 10 }}>
                            <Button
                                variant={'transparent'}
                                text="Cancel"
                                size={'lg'}
                                onClick={() => {
                                    setOpenModal(0);
                                    let options = {
                                        content: () =>
                                            CustomSnack({
                                                onClose: props.closeSnackbar,
                                                type: 'red',
                                                data1: `Minting ${mintColl} ARTH cancelled`,
                                            }),
                                    };
                                    props.enqueueSnackbar('timepass', options);
                                }}
                            />
                        </div>
                        <div style={{ width: '100%' }}>
                            <Button
                                text={checked ? 'Confirm Mint and Stake' : 'Confirm Mint'}
                                // textStyles={{ color: '#F5F5F5' }}
                                size={'lg'}
                                onClick={() => {
                                    setOpenModal(2);
                                    let options = {
                                        content: () =>
                                            CustomSnack({
                                                onClose: props.closeSnackbar,
                                                type: 'green',
                                                data1: `Minting ${mintColl} ARTH`,
                                            }),
                                    };
                                    props.enqueueSnackbar('timepass', options);
                                    setTimeout(() => {
                                        setSuccessModal(true);
                                    }, 3000);
                                }}
                            />
                        </div>
                    </div>
                </>
            </CustomModal>
            <Grid container style={{ marginTop: '24px' }} spacing={2}>
                <Grid item lg={1} />
                <Grid item lg={5} md={12} sm={12} xs={12}>
                    <LeftTopCard className={'custom-mahadao-container'}>
                        <LeftTopCardHeader className={'custom-mahadao-container-header'}>
                            <ActiveTab />
                            <TabContainer onClick={() => props.setType('Redeem')}>
                                <TabText>Mint</TabText>
                            </TabContainer>
                            <TabContainer onClick={() => props.setType('Redeem')}>
                                <TabText>Redeem</TabText>
                            </TabContainer>
                        </LeftTopCardHeader>
                        <LeftTopCardContainer className={'custom-mahadao-container-content'}>
                            <CustomInputContainer
                                ILabelValue={'Enter Collateral'}
                                IBalanceValue={`Balance ${balance}`}
                                ILabelInfoValue={''}
                                // value={mintColl.toString()}
                                DefaultValue={mintColl.toString()}
                                LogoSymbol={selectedCollateralCoin}
                                hasDropDown={true}
                                dropDownValues={collateralTypes}
                                ondropDownValueChange={(data: string) => {
                                    setSelectedCollateralCoin(data);
                                }}
                                SymbolText={selectedCollateralCoin}
                                inputMode={'numeric'}
                                setText={(val: string) => {
                                    onBuyColletralValueChange(val);
                                }}
                            />
                            <PlusMinusArrow>
                                <img src={plus} />
                            </PlusMinusArrow>
                            <CustomInputContainer
                                ILabelValue={'Enter ARTHX'}
                                IBalanceValue={`Balance ${balance}`}
                                ILabelInfoValue={'How can i get it?'}
                                href={'https://www.google.com/'}
                                DefaultValue={mintArthxShare.toString()}
                                // ILabelInfoValue={'How can i get it?'}
                                // DefaultValue={'0'}
                                LogoSymbol={'ARTHX'}
                                hasDropDown={false}
                                SymbolText={'ARTHX'}
                                inputMode={'decimal'}
                                setText={(val: string) => {
                                    onARTHXValueChange(val);
                                }}
                            />
                            <PlusMinusArrow>
                                <img src={arrowDown} />
                            </PlusMinusArrow>
                            <CustomInputContainer
                                ILabelValue={'You will receive'}
                                IBalanceValue={`Balance ${balance}`}
                                DefaultValue={mintReceive.toString()}
                                ILabelInfoValue={''}
                                // DefaultValue={'0'}
                                LogoSymbol={'ARTH'}
                                hasDropDown={false}
                                SymbolText={'ARTH'}
                            />
                            <div>
                                <TcContainer>
                                    <OneLineInputwomargin>
                                        <div style={{ flex: 1 }}>
                                            <TextWithIcon>
                                                Trading Fee
                        {/*{*<InfoIcon fontSize="default" style={{ transform: 'scale(0.6)' }} />*}*/}
                                            </TextWithIcon>
                                        </div>
                                        <OneLineInputwomargin>
                                            <BeforeChip>0.5</BeforeChip>
                                            <TagChips>ARTH/ETH</TagChips>
                                        </OneLineInputwomargin>
                                    </OneLineInputwomargin>
                                </TcContainer>
                                <div style={{marginTop: '32px'}}>
                                  <Button
                                    text={'Mint'}
                                    size={'lg'}
                                    variant={'default'}
                                    disabled={false}
                                    onClick={() => setOpenModal(1)}
                                  />
                                </div>

                            </div>
                        </LeftTopCardContainer>
                    </LeftTopCard>
                </Grid>
                <Grid item lg={5} md={12} sm={12} xs={12}>
                    <RightTopCard className={'custom-mahadao-box'}>
                        <div style={{ marginBottom: '12px' }}>
                            <OneLineInput>
                                <div style={{ flex: 1 }}>
                                    <TextForInfoTitle>ARTHX Price</TextForInfoTitle>
                                </div>
                                <InputLabelSpanRight>$5.4</InputLabelSpanRight>
                            </OneLineInput>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <OneLineInput>
                                <div style={{ flex: 1 }}>
                                    <TextForInfoTitle>
                                        Collateral Ratio
                    <CustomToolTip />
                                    </TextForInfoTitle>
                                </div>
                                <InputLabelSpanRight>86%</InputLabelSpanRight>
                            </OneLineInput>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <OneLineInput>
                                <div style={{ flex: 1 }}>
                                    <TextForInfoTitle>Pool Balance</TextForInfoTitle>
                                </div>
                                <InputLabelSpanRight>154.6M</InputLabelSpanRight>
                            </OneLineInput>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <OneLineInput>
                                <div style={{ flex: 1 }}>
                                    <TextForInfoTitle>Available to Mint</TextForInfoTitle>
                                </div>
                                <InputLabelSpanRight>$54.7M</InputLabelSpanRight>
                            </OneLineInput>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <OneLineInput>
                                <div style={{ flex: 1 }}>
                                    <TextForInfoTitle>
                                        Stability Fee
                    <CustomToolTip />
                                    </TextForInfoTitle>
                                </div>
                                <InputLabelSpanRight>2%</InputLabelSpanRight>
                            </OneLineInput>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <OneLineInput>
                                <div style={{ flex: 1 }}>
                                    <TextForInfoTitle>
                                        Trading Fee
                    <CustomToolTip />
                                    </TextForInfoTitle>
                                </div>
                                <InputLabelSpanRight>2%</InputLabelSpanRight>
                            </OneLineInput>
                        </div>
                    </RightTopCard>
                    <RightBottomCard className={'custom-mahadao-box'}>
                        <RightBottomCardTitle>
                            Farming pools are great way to earn higher APY by staking your $ARTH
            </RightBottomCardTitle>
                        <Grid container style={{ marginTop: '16px' }}>
                            <Grid item lg={4}>
                                <Button text={'Earn Rewards'} size={'sm'} to={'farming'} />
                            </Grid>
                        </Grid>
                    </RightBottomCard>
                </Grid>
                <Grid item lg={1} />
            </Grid>
            <CustomSuccessModal
                modalOpen={successModal}
                setModalOpen={() => setSuccessModal(false)}
                title={'Minting ARTH successful!'}
                subTitle={'View Transaction'}
                subsubTitle={'You should consider stake your ARTH to earn higher APY'}
                buttonText={'Stake your ARTH'}
                buttonType={'default'}
                redirectTo={'/farming'}
            />
        </>
    );
};

export default withSnackbar(MintTabContent)

const TcContainer = styled.div`
  margin-top: 24px;
`;

const OneLineInputwomargin = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
`;

const LeftTopCard = styled.div``;

const RightTopCard = styled.div``;

const RightBottomCard = styled.div`
  margin-top: 24px;
`;

const RightBottomCardTitle = styled.div`
  padding: 0;
  margin: 0;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: rgba(255, 255, 255, 0.88);
`;

const LeftTopCardHeader = styled.div`
  display: flex;
  flex-direction: row;
`;
const LeftTopCardContainer = styled.div``;
const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 12px;
  width: 100px;
  height: 80px;
  z-index: 1;
  cursor: pointer;
`;

const TabText = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.88);
`;
const StakingDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 0 0 0;
`;

const ActiveTab = styled.div`
  position: absolute;
  width: 100px;
  padding: 32px 12px;
  background: linear-gradient(180deg, rgba(244, 127, 87, 0) 0%, #fd565620);
  height: 80px;
  z-index: 0;
  border-bottom: 2px solid #fd5656;
`;

const PlusMinusArrow = styled.div`
  width: 100%;
  border-radius: 1.33px;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  font-size: 20px;
  margin: 12px 0;
`;

const OneLineInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
  margin: 5px 0 10px 0;
`;

const TextWithIcon = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.88);
`;

const TextForInfoTitle = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  color: #ffffff;
  opacity: 0.64;
`;

const BeforeChip = styled.span`
  ont-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.64);
  margin-right: 5px;
`;

const TagChips = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 2px 8px;
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.64);
`;

const InputLabelSpanRight = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.88);
  margin-right: 5px;
`;

const InputLabel = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.64);
  margin: 0px;
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

const TimeSpan = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.88);
`;

const CheckboxDiv = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 5px 0px 0px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.88);
  margin: 15px 0px 0px 0px;
`;
