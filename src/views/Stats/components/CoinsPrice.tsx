import React from 'react';
import styled from 'styled-components';
import Loader from 'react-spinners/BeatLoader';

import { getDisplayBalance } from '../../../utils/formatBalance';
import useMAHAOraclePrice from '../../../hooks/state/controller/useMAHAPrice';
import useARTHXOraclePrice from '../../../hooks/state/controller/useARTHXPrice';
import useARTHPrice from '../../../hooks/state/controller/useARTHPrice';


const CoinsPrice: React.FC = () => {
  const { isLoading: isMAHAPriceLoading, value: mahaPrice } = useMAHAOraclePrice();
  const { isLoading: isARTHXPriceLoading, value: arthxPrice } = useARTHXOraclePrice();
  const { isLoading: isARTHPriceLoading, value: arthPrice } = useARTHPrice();

  return (
    <CustomInfoCard className={'custom-mahadao-box'}>
      <CustomInfoCardDetails>
        <OneLine style={{ marginTop: '0px' }}>
          <div>
            <TextWithIcon>ARTH 1hr TWAP Price</TextWithIcon>
            <TargetPriceTag>Target Price: $2.00</TargetPriceTag>
          </div>
          <div>
            <BeforeChip>
              {isARTHPriceLoading ? (
                <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
              ) : (
                Number(getDisplayBalance(arthPrice, 6, 6)).toLocaleString('en-US', {
                  maximumFractionDigits: 6,
                })
              )}{' '}
              USDC
            </BeforeChip>
          </div>
        </OneLine>
        <OneLine>
          <div>
            <TextWithIcon>ARTHX 1hr TWAP Price</TextWithIcon>
          </div>
          <div>
            <BeforeChip>
              {isARTHXPriceLoading ? (
                <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
              ) : (
                Number(getDisplayBalance(arthxPrice, 6, 6)).toLocaleString('en-US', {
                  maximumFractionDigits: 6,
                })
              )}{' '}
              ARTH
            </BeforeChip>
          </div>
        </OneLine>
        <OneLine>
          <div>
            <TextWithIcon>MAHA 1hr TWAP Price</TextWithIcon>
          </div>
          <div>
            <BeforeChip>
              {isMAHAPriceLoading ? (
                <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
              ) : (
                Number(getDisplayBalance(mahaPrice, 6, 6)).toLocaleString('en-US', {
                  maximumFractionDigits: 6,
                })
              )}{' '}
              ARTH
            </BeforeChip>
          </div>
        </OneLine>
      </CustomInfoCardDetails>
    </CustomInfoCard>
  );
};

const CustomInfoCard = styled.div`
  @media (max-width: 600px) {
    margin-top: 8px;
  }
`;

const CustomInfoCardDetails = styled.div`
  margin: 10px 0;
`;

const OneLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 40px;
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
  font-weight: bold;
  font-size: 24px;
  line-height: 32px;
  text-align: right;
  color: #ffffff;
`;

const TargetPriceTag = styled.p`
  background: #423b38;
  border-radius: 4px;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 140%;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fcb400;
  margin: 0;
  padding: 2px 4px;
`;

export default CoinsPrice;
