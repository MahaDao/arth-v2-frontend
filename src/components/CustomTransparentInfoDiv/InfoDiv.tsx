import React from 'react';
import styled from 'styled-components';

import CustomToolTip from '../CustomTooltip/index';
import Loader from 'react-spinners/BeatLoader';

interface IProps {
  labelData: string;
  labelToolTipData?: string;
  rightLabelValue?: string;
  rightLabelUnit?: string;
  isLoadingData?:boolean;
}

const TransparentInfoDiv = (props: IProps) => {
  const {isLoadingData = false} = props
  return (
    <TransInfoDiv>
      <InfoSpan>
        {props.labelData}
        {props.labelToolTipData && (
          <CustomToolTip toolTipText={props.labelToolTipData} />
        )}
      </InfoSpan>
      <LabelInfoData>
        {props.rightLabelValue &&
          isLoadingData
          ? <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
          : <LabelInfoText>{props.rightLabelValue}</LabelInfoText>}
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
  width: 100%;
`;

export default TransparentInfoDiv;
