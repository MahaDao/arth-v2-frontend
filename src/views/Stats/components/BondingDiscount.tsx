import React from 'react';
import styled from 'styled-components';
import InfoIcon from '@material-ui/icons/Info';

import HtmlTooltip from '../../../components/HtmlTooltip';

import { getDisplayBalance } from '../../../utils/formatBalance';
import useRecollateralizationDiscount from '../../../hooks/state/controller/useRecollateralizationDiscount';

type props = {
  stats?: boolean;
};

const BondingDiscount: React.FC<props> = (props: props) => {
  const discount = useRecollateralizationDiscount();

  return (
    <CustomInfoCard className={'custom-mahadao-box'}>
      <CustomInfoCardHeader>Bonding Curve Discount on ARTHX</CustomInfoCardHeader>
      <CustomInfoCardDetails>
        <OneLine>
          <div style={{ flex: 1 }}>
            <TextWithIcon>
              Current discount
              <HtmlTooltip
                title={
                  <React.Fragment>
                    <ToolTipFont>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled</ToolTipFont>
                  </React.Fragment>
                }>
                <InfoIcon fontSize="default" style={{ transform: 'scale(0.6)', marginBottom: '4px'}} />
              </HtmlTooltip>
            </TextWithIcon>
          </div>
          <OneLine>
            <BeforeChip>
              {
                Number(getDisplayBalance(discount, 4, 4))
                  .toLocaleString('en-US', {maximumFractionDigits: 4})
              }%
            </BeforeChip>
          </OneLine>
        </OneLine>
        <OneLine>
          <div style={{ flex: 1 }}>
            <TextWithIcon>Minimum discount</TextWithIcon>
          </div>
          <OneLine>
            <BeforeChip>0.075%</BeforeChip>
          </OneLine>
        </OneLine>
        <OneLine>
          <div style={{ flex: 1 }}>
            <TextWithIcon>Maximum discount</TextWithIcon>
          </div>
          <OneLine>
            <BeforeChip>30%</BeforeChip>
          </OneLine>
        </OneLine>
      </CustomInfoCardDetails>
    </CustomInfoCard>
  );
};

const CustomInfoCard = styled.div`
  min-height: 262px;
  @media (max-width: 600px) {
    margin-top: 8px;
  }
`;

const CustomInfoCardHeader = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  margin-bottom: 24px;
`;

const CustomStatsInfoCardHeader = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.88);
`;

const CustomInfoCardDetails = styled.div`
  margin: 10px 0;
`;

const OneLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
  margin: 4px 0;
`;

const TextWithIcon = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.88);
  opacity: 0.64;
  vertical-align: center;
`;

const BeforeChip = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
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

const ToolTipFont = styled.p`
  padding: 0px;
  margin: 0px;
`;

export default BondingDiscount;
