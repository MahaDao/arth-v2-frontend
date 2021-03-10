import { AppState } from '../../../state';
import { BigNumber } from 'ethers';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import { getDisplayBalance } from '../../../utils/formatBalance';
import { useSelector } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TokenStat } from '../../../basis-cash/types';
import UpTriangle from '../../../assets/svg/UpTriangle.svg';
import theme from '../../../theme';
import useBasisCash from '../../../hooks/useBasisCash';

const BorderLinearProgress = withStyles((theme1: Theme) =>
  createStyles({
    root: {
      height: 4,
      borderRadius: 2,
      minWidth: 220,
      margin: '0px 10px',
      '@media (max-width: 768px)': {
        minWidth: 190,
        margin: '0px 5px',
      },
    },
    colorPrimary: {
      backgroundColor: theme.color.dark[200],
    },
    bar: {
      borderRadius: 2,
      backgroundColor: '#FFA981',
    },
  }),
)(LinearProgress);


interface IProps {
  stat?: TokenStat
}

const PriceLine: React.FC<IProps> = (props) => {
  const basisCash = useBasisCash();

  const [targetPrice, setTargetPrice] = useState<BigNumber>(useSelector<AppState, BigNumber>(s => s.treasury.coreState.cashTargetPrice))
  useEffect(() => {
    if (basisCash) {
      basisCash.getTargetPrice().then(setTargetPrice)
      // basisCash.getCashPriceInLastTWAP().then(res => console.log('await', getDisplayBalance(res)))
    }
  }, [basisCash])
  const arthPrice = props.stat?.priceInDAI

  return (
    <StatContainer>
      <div style={{ padding: '30px' }}>
        <StyledTitle>ARTH Price</StyledTitle>
        <TitleBold>{arthPrice && arthPrice.gt(0) ? `$${getDisplayBalance(arthPrice)}` : '-'}</TitleBold>
        {/* <IncreasedText>+0.15%</IncreasedText> */}
      </div>
      {true && (<LinearProgressDiv>
        <TimeComponent>24 h</TimeComponent>
        {/* <ResponsiveLabelContainer> */}
        <LabelComponentLite noMargin>Low</LabelComponentLite>
        <LabelComponentBold>$0.96</LabelComponentBold>
        {/* </ResponsiveLabelContainer> */}
        <div style={{ position: 'relative' }}>
          <div className="dialog-class margin-bottom-10">
            <LabelComponentLite>Target Price</LabelComponentLite>
            <LabelComponentBold>${getDisplayBalance(targetPrice)}</LabelComponentBold>
          </div>
          <BorderLinearProgress variant="determinate" value={50} />
          <div className="dialog-class margin-top-10">
            {/* <ResponsiveLabelContainer> */}
              {/* <img src={UpTriangle} height="5" style={{ marginTop: -3 }} /> */}
              {/* <div> */}
                <LabelComponentLite>Current Price</LabelComponentLite>
                <LabelComponentBold color="#F7653B">${'0.98'}</LabelComponentBold>
              {/* </div> */}
            {/* </ResponsiveLabelContainer> */}
          </div>
        </div>
        {/* <ResponsiveLabelContainer> */}
        <LabelComponentLite noMargin>High</LabelComponentLite>
        <LabelComponentBold>$1.6</LabelComponentBold>
        {/* </ResponsiveLabelContainer> */}
      </LinearProgressDiv>)}
    </StatContainer>
  );
};

const ResponsiveLabelContainer = styled.div`
  @media (max-width: 768px) {
    flex-direction: column;
    // width: 50%
    // background: red
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const StyledTitle = styled.div`
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  color: #ffffff;
  opacity: 0.64;
`;

const TitleBold = styled.div`
  font-style: normal;
  margin-top: 13px;
  font-weight: bold;
  font-size: 24px;
  line-height: 32px;
  color: #ffffff;
`;

const LinearProgressDiv = styled.div`
  display: flex !important;
  align-items: center;
  justify-content: center;
  padding-right: 50px;
  @media (max-width: 768px) {
    padding-bottom: 30px;
  }
`;

const StatContainer = styled.div`
  flex: 1 1;
  display: flex !important;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    align-items: flex-start;
  }
`;

const TimeComponent = styled.div`
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-weight: 600;
  margin-right: 10px;
  font-size: 12px;
  color: #ffffff;
  opacity: 0.6;
  padding: 2px 5px;
  margin: 0px 10px;
`;

const LabelComponentLite = styled.div`
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  margin-right: 5px;
  line-height: 140%;
  text-align: center;
  color: #ffffff;
  opacity: 0.6;
  @media (max-width: 768px) {
    margin-right: ${(props: { noMargin?: boolean }) => (props.noMargin ? '0px' : '5px')};
  }
`;

const LabelComponentBold = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: ${(props) => (props.color ? props.color : '#ffffff')};
`;
export default PriceLine;
