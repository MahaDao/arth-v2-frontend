import { createStyles, makeStyles, Slider, Theme, withStyles } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import TransparentInfoDiv from '../CustomTransparentInfoDiv/InfoDiv';

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
    height: 15,
    width: '95%',
  },
  thumb: {
    height: 10,
    width: 10,
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
  },
  marked: {
    color: 'red',
  },
  markLabel: {},
  track: {
    height: 3,
    borderRadius: 3,
    color: '#FFA981',
  },
  rail: {
    height: 3,
    borderRadius: 3,
    color: '#D74D26',
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
const DEFAULT_CALC = 1440;

interface IProps {
  onSliderChange: (val: any) => void;
  sliderLabel?: string;
}

export default (props: IProps) => {
  const [sliderValue, setSliderValue] = React.useState(1);
  const [calcDuration, setDuration] = useState<number>(DEFAULT_CALC);
  const sliderClasses = useSliderStyles();
  const [currentCounter, setCurrentCounter] = useState<number>(1000);

  const handleSliderChange = (event: any, value: any) => {
    setSliderValue(value);
    props?.onSliderChange(value);
    setDuration(DEFAULT_CALC - value * value);
  };

  return (
    <StakingDiv>
      <div>
        <OneLineInput style={{ margin: '0px' }}>
          <div>
            <InputLabel style={{ marginTop: '12px' }}>
              {props?.sliderLabel || 'Select how long would you like to stake'}
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
            defaultValue={1}
            getAriaValueText={valuetext}
            valueLabelFormat={valuetext}
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
        rightLabelUnit={'MAHA'}
        rightLabelValue={'~100.0'}
        countUp
        cEnd={9999}
        cDuration={calcDuration}
        cStart={currentCounter}
      />

      <TransparentInfoDiv labelData={`ROR`} rightLabelValue={String(10 * sliderValue) + '%'} />

      <TransparentInfoDiv labelData={`APY`} rightLabelValue={String(10 * sliderValue) + '%'} />
    </StakingDiv>
  );
};

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

const RightTopCard = styled.div`
  @media (max-width: 600px) {
    margin-top: 8px;
  }
`;

const RightBottomCard = styled.div`
  margin-top: 16px;
  @media (max-width: 600px) {
    margin-top: 24px;
  }
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
  align-items: center;
  justify-content: space-between;
`;
const LeftTopCardContainer = styled.div``;
const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
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
  color: rgba(255, 255, 255, 0.64);
`;
const TabTextActive = styled.span`
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
