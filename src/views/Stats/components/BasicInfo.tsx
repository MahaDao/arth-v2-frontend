import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { BigNumber } from '@ethersproject/bignumber';

import prettyNumber from '../../../components/PrettyNumber';
import CustomToolTip from '../../../components/CustomTooltip';

import arrowRightWhite from '../../../assets/svg/arrowRightWhite.svg';

import { getDisplayBalance } from '../../../utils/formatBalance';
import useAllPoolAvailableToMint from '../../../hooks/state/pools/useAllPoolAvailableToMint';
import Loader from 'react-spinners/BeatLoader';

type props = {
  globalCollateralValue: BigNumber;
  isGlobalCollateralValueLoading: boolean;
};

const BasicInfo: React.FC<props> = (props) => {
  const { isLoading: isAvailabelToMintLoading, value: totalAvailableToMint } = useAllPoolAvailableToMint();

  return (
    <CustomInfoCard className={'custom-mahadao-box'}>
      <CustomInfoCardDetails>
        <OneCardLeft>
          <OneLine>
            <div>
              <TextWithIcon>
                Available To Mint
                <CustomToolTip toolTipText={'Amount of ARTH available to mint across all pools.'} />
              </TextWithIcon>
              <BeforeChip>
                {
                  isAvailabelToMintLoading
                    ? <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
                    : prettyNumber(getDisplayBalance(totalAvailableToMint, 18, 6))
                } ARTH
              </BeforeChip>
            </div>
            <ToLink to={'/mint/mint'}>
              <img src={arrowRightWhite} alt="arrow" style={{ cursor: 'pointer' }} />
            </ToLink>
          </OneLine>
        </OneCardLeft>
        <OneCardRight>
          <OneLine>
            <div>
              <TextWithIcon>
                Total Collateral Value
                <CustomToolTip toolTipText={'$GMU worth of collateral currently in the protocol.'} />
              </TextWithIcon>
              <BeforeChip>
                {'$ '}
                {
                  props.isGlobalCollateralValueLoading
                    ? <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
                    : prettyNumber(getDisplayBalance(props.globalCollateralValue))
                }
              </BeforeChip>
            </div>
            <ToLink to={'/mint/mint'}>
              <img src={arrowRightWhite} alt="arrow" style={{ cursor: 'pointer' }} />
            </ToLink>
          </OneLine>
        </OneCardRight>
      </CustomInfoCardDetails>
    </CustomInfoCard>
  );
};

const ToLink = styled(Link)`
  z-index: 1;
`

const CustomInfoCard = styled.div`
  padding: 0 !important;
  margin-top: 16px;
  @media(max-width: 600px) {
    margin-top: 24px;
  }
`;

const CustomInfoCardDetails = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const OneLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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

const OneCardRight = styled.div`
  flex: 0.5;
  padding: 32px 32px;
  @media (max-width: 600px) {
    padding: 32px 24px;
  }
`;

const OneCardLeft = styled.div`
  flex: 0.5;
  border-right: 0.5px solid #ffffff50;
  border-bottom: 0 solid #ffffff50;
  margin: 32px 0;
  padding: 0 32px;
  @media (max-width: 600px) {
    border-right: 0 solid #ffffff50;
    border-bottom: 0.5px solid #ffffff50;
    padding: 32px 0;
    margin: 0 24px;
  }
`;

export default BasicInfo;
