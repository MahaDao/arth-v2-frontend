import React from 'react';
import styled from 'styled-components';

import PieChart from '../components/PieChart';
import InfoIcon from '../../../assets/img/ToolTipColored.svg';
import HtmlTooltip from '../../../components/HtmlTooltip';


const DistributonSection: React.FC = () => {
  return (
    <Card>
      <TitleString>
        ARTH Seigniorage Distribution
        <HtmlTooltip
          enterTouchDelay={0}
          title={
            <span>
              When the system is in expansion mode (12hr TWAP price above $1.05), new
              ARTH coins are minted as seigniorage and are added back into the
              circulation as a way of increasing the coin supply. What you see below
              is the seigniorage distribution for various pools.
                      </span>
          }
        >
          <img src={InfoIcon} alt="Inof" width="16px" className="margin-left-5" />
        </HtmlTooltip>
      </TitleString>
      <PieChartCard>
        <PieChart />
        <div className="margin-left-20">
          <PieChartLables>
            <ChartIconColor color="#178A50" />
            <div>
              <ChartLabelTitle>ARTH-DAI MahaSwap LP</ChartLabelTitle>
              <ChartLabelTitleBold>70% (65,0000 ARTH)</ChartLabelTitleBold>
            </div>
          </PieChartLables>
          <PieChartLables>
            <ChartIconColor color="#178A50" />
            <div>
              <ChartLabelTitle>ARTH-ETH MahaSwap LP</ChartLabelTitle>
              <ChartLabelTitleBold>10% (65,0000 ARTH)</ChartLabelTitleBold>
            </div>
          </PieChartLables>
          <PieChartLables>
            <ChartIconColor color="#20C974" />
            <div>
              <ChartLabelTitle>ARTH</ChartLabelTitle>
              <ChartLabelTitleBold>20% (20,000 ARTH)</ChartLabelTitleBold>
            </div>
          </PieChartLables>
          <PieChartLables>
            <ChartIconColor color="#C4F7DD" />
            <div>
              <ChartLabelTitle>MAHA</ChartLabelTitle>
              <ChartLabelTitleBold>20% (10,000 MAHA)</ChartLabelTitleBold>
            </div>
          </PieChartLables>

        </div>
      </PieChartCard>
    </Card>
  );
};

const PieChartCard = styled.div`
  display: flex;
  align-items: center;
  margin-top: 25px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;


const TitleString = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: #ffffff;
  opacity: 0.88;
`;
const Card = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(70px);
  border-radius: 12px;
  padding: 20px;
  height: 100%;
`;

const ChartLabelTitle = styled.div`
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  color: #ffffff;
  opacity: 0.64;
`;
const ChartLabelTitleBold = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
`;
const PieChartLables = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 12px;
`;
const ChartIconColor = styled.div`
  width: 14px;
  margin-right: 10px;
  height: 14px;
  border-radius: 50%;
  background: ${(props) => (props.color ? props.color : '#ffffff')};
`;

export default DistributonSection;
