import React from 'react';
import CountUp from 'react-countup';
import styled from 'styled-components';
import InfoIcon from '@material-ui/icons/Info';

interface IProps {
  labelData: string;
  labelToolTipData?: string;
  rightLabelValue?: string;
  rightLabelUnit?: string;
  countUp?: boolean;
  cStart?: number;
  cEnd?: number;
  cDuration?: number;
  cDelay?: number;
}

const TransparentInfoDiv = (props: IProps) => {
  return (
    <TransInfoDiv>
      <InfoSpan>
        {props.labelData}
        {props.labelToolTipData && (
          <InfoIcon
            fontSize="small"
            style={{ marginLeft: 2, marginTop: -2, transform: 'scale(0.8)' }}
          />
        )}
      </InfoSpan>
      <LabelInfoData>
        {props.rightLabelValue && (
          <LabelInfoText>
            {props.countUp ? (
              <CountUp
                start={props?.cStart}
                end={props.cEnd}
                delay={0}
                duration={props.cDuration}
                preserveValue={true}
                onUpdate={() => {}}
              />
            ) : (
              props.rightLabelValue
            )}
          </LabelInfoText>
        )}
        {props.rightLabelUnit && (
          <LabelInfoDataChip>
            <LabelInfoDataChipText>{props.rightLabelUnit}</LabelInfoDataChipText>
          </LabelInfoDataChip>
        )}
      </LabelInfoData>
    </TransInfoDiv>
  );
};

const InfoSpan = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.64);
  text-align: center;
`;

const LabelInfoText = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: right;
  color: rgba(255, 255, 255, 0.88);
`;

const LabelInfoData = styled.div`
  padding: 3px 4px;
  width: fit-content;
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.88);
`;

const LabelInfoDataChip = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 3px 4px;
  height: fit-content;
  display: flex;
  align-items: center;
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 130%;
  margin: 0px 2px;
  color: rgba(255, 255, 255, 0.64);
`;

const LabelInfoDataChipText = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.64);
`;

const TransInfoDiv = styled.div`
  height: fit-content;
  justify-content: space-between;
  display: flex;
  align-items: center;
`;

export default TransparentInfoDiv;
