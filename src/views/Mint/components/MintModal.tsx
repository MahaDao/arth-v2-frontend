import styled from 'styled-components';
import { useWallet } from 'use-wallet';
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
import { parseUnits } from 'ethers/lib/utils';
import CheckIcon from '@material-ui/icons/Check';
import { BigNumber } from '@ethersproject/bignumber';
import React, { useEffect, useMemo, useState } from 'react';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

import TransparentInfoDiv from './InfoDiv';
import useCore from '../../../hooks/useCore';
import Button from '../../../components/Button';
import CustomModal from '../../../components/CustomModal';
import { CustomSnack } from '../../../components/SnackBar';
import useTokenDecimals from '../../../hooks/useTokenDecimals';
import { getDisplayBalance } from '../../../utils/formatBalance';
import useMintARTH from '../../../hooks/callbacks/pools/useMintARTH';
import CustomSuccessModal from '../../../components/CustomSuccesModal';
import useApprove, { ApprovalState } from '../../../hooks/callbacks/useApprove';

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
  isInputFieldError: boolean;
  collateralValue: string;
  openModal: boolean;
  onClose: () => void;
  selectedCollateralCoin: string;
  arthValue: string;
  mintCR: BigNumber;
  tradingFee: BigNumber;
  arthxValue: string;
  onSuccess: () => void;
}

const MintModal = (props: WithSnackbarProps & IProps) => {
  const {
    isInputFieldError,
    openModal,
    onClose,
    collateralValue,
    arthValue,
    selectedCollateralCoin,
    mintCR,
    tradingFee,
    arthxValue,
    onSuccess,
  } = props;

  const [calcDuration, setDuration] = useState<number>(DEFAULT_CALC);
  const [checked, setChecked] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState(1);
  const [successModal, setSuccessModal] = useState<boolean>(false);

  const core = useCore();
  const sliderClasses = useSliderStyles();
  const tokenDecimals = useTokenDecimals(selectedCollateralCoin);
  const collateralPool = core.getCollatearalPool(selectedCollateralCoin);
  const [collatApproveStatus, ] = useApprove(
    core.tokens[selectedCollateralCoin],
    collateralPool.address,
  );

  const isCollatApproved = collatApproveStatus === ApprovalState.APPROVED;

  useEffect(() => window.scrollTo(0, 0), []);

  const handleSliderChange = (event: any, value: any) => {
    setSliderValue(value);
    setDuration(DEFAULT_CALC - value * value);
  };

  const handleMint = () => {
    mintARTH(() => {
      onSuccess();
      setSuccessModal(true);
    });
  };

  const arthOutMinAfterFee = useMemo(() => {
    return BigNumber
      .from(parseUnits(`${arthValue}`, 18))
      .sub(tradingFee);
  }, [arthValue, tradingFee]);

  const mintARTH = useMintARTH(
    selectedCollateralCoin,
    BigNumber.from(parseUnits(`${collateralValue}`, tokenDecimals)),
    arthOutMinAfterFee,
    BigNumber.from(parseUnits(`${arthxValue}`, 18)),
  );

  return (
    <>
      <CustomModal
        closeButton
        handleClose={onClose}
        open={openModal}
        modalTitleStyle={{}}
        modalContainerStyle={{}}
        modalBodyStyle={{}}
        title={`Confirm Mint`}
      >
        <>
          <TransparentInfoDiv
            labelData={`Your collateral supply`}
            rightLabelUnit={selectedCollateralCoin}
            rightLabelValue={Number(collateralValue).toLocaleString()}
          />
          <TransparentInfoDiv
            labelData={`Trading Fee`}
            rightLabelUnit={'ARTH'}
            rightLabelValue={
              Number(getDisplayBalance(tradingFee, 18, 6))
                .toLocaleString('en-US', { maximumFractionDigits: 6 })
            }
          />
          <Divider
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              margin: '15px 0px',
            }}
          />
          <TransparentInfoDiv
            labelData={`You will mint`}
            rightLabelUnit={'ARTH'}
            rightLabelValue={Number(arthValue).toLocaleString()}
          />
          <TransparentInfoDiv
            labelData={`You will mint`}
            rightLabelUnit={'ARTHX'}
            rightLabelValue={Number(arthxValue).toLocaleString()}
          />
          {
            /* <CheckboxDiv>
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
                label="Stake $ARTH and earn more rewards"
                labelPlacement="end"
                onChange={handleCheck}
              />
            </CheckboxDiv> */
          }
          {
            checked && (
              <StakingDiv>
                <div>
                  <OneLineInput style={{ margin: '0px' }}>
                    <div>
                      <InputLabel style={{ marginTop: '12px' }}>
                        Select how long would you like to stake
                      </InputLabel>
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
                    marginTop: '5px',
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
                  labelData={`Realtime earning`}
                  // labelToolTipData={'testing'}
                  rightLabelUnit={'MAHA'}
                  rightLabelValue={'~100.0'}
                  countUp
                  cEnd={10}
                  cDuration={calcDuration}
                  cStart={0}
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
            )
          }
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
                  onClose();
                  let options = {
                    content: () =>
                      CustomSnack({
                        onClose: props.closeSnackbar,
                        type: 'red',
                        data1: `Minting ${Number(collateralValue).toLocaleString()} ARTH cancelled`,
                      }),
                  };
                  props.enqueueSnackbar('timepass', options);
                }}
              />
            </div>
            <div style={{ width: '100%' }}>
              <Button
                disabled={
                  mintCR.lt(1e6) ||
                  isInputFieldError ||
                  !Number(arthValue) ||
                  !isCollatApproved ||
                  !(Number(collateralValue))
                }
                text={checked ? 'Confirm Mint and Stake' : 'Confirm Mint'}
                size={'lg'}
                onClick={handleMint}
              />
            </div>
          </div>
        </>
      </CustomModal>

      <CustomSuccessModal
        modalOpen={successModal}
        setModalOpen={() => setSuccessModal(false)}
        title={'Minting ARTH successful!'}
        // subTitle={'View Transaction'}
        subsubTitle={
          'Your transaction is now being minted on the blockchain. You should consider staking your tokens to earn extra rewards!'
        }
        buttonText={'Stake your ARTH'}
        buttonType={'default'}
        buttonTo={'/farming'}
      />
    </>
  );
};

const StakingDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 0 0 0;
`;

const OneLineInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
  margin: 5px 0 10px 0;
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

export default withSnackbar(MintModal);
