import React from 'react';
import styled from 'styled-components';
import InfoIcon from '@material-ui/icons/Info';

import HtmlTooltip from '../../../components/HtmlTooltip';

import { getDisplayBalance } from '../../../utils/formatBalance';
import useRecollateralizationDiscount from '../../../hooks/state/controller/useRecollateralizationDiscount';
import Loader from 'react-spinners/BeatLoader';

type props = {
  stats?: boolean;
};

const BondingDiscount: React.FC<props> = () => {
  const { isLoading: isDiscountLoading, value: discount } = useRecollateralizationDiscount();

  return (
    <CustomInfoCard className={'custom-mahadao-box'}>
      <CustomInfoCardHeader>Bonding Curve Discount on ARTHX</CustomInfoCardHeader>
      <CustomInfoCardDetails>
        <OneLine>
          <div style={{ flex: 1 }}>
            <TextWithIcon>
              Current Discount
              <HtmlTooltip
                title={
                  <React.Fragment>
                    <ToolTipFont>The current % of reward given for committing collateral during genesis.</ToolTipFont>
                  </React.Fragment>
                }>
                <InfoIcon fontSize="default" style={{ transform: 'scale(0.6)', marginBottom: '4px' }} />
              </HtmlTooltip>
            </TextWithIcon>
          </div>
          <OneLine>
            <BeforeChip>
              {isDiscountLoading
                ? <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
                : Number(getDisplayBalance(discount, 4, 4))
                  .toLocaleString('en-US', { maximumFractionDigits: 4 })
              }%
            </BeforeChip>
          </OneLine>
        </OneLine>
        <OneLine>
          <div style={{ flex: 1 }}>
            <TextWithIcon>Minimum Discount</TextWithIcon>
          </div>
          <OneLine>
            <BeforeChip>0.075%</BeforeChip>
          </OneLine>
        </OneLine>
        <OneLine>
          <div style={{ flex: 1 }}>
            <TextWithIcon>Maximum Discount</TextWithIcon>
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
  // min-height: 262px;
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
const ToolTipFont = styled.p`
  padding: 0;
  margin: 0;
`;

export default BondingDiscount;
