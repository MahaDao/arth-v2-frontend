import React from 'react';
import styled from 'styled-components';
import Button from '../../../components/Button/Button';
import { withStyles, Theme } from '@material-ui/core/styles';
import InfoIcon from '../../../assets/img/ToolTipColored.svg';
import Tooltip from '@material-ui/core/Tooltip';
import { BigNumber } from 'ethers';
import { getDisplayBalance } from '../../../utils/formatBalance';


const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: '#2A2827',
    color: 'white',
    fontWeight: 300,
    fontSize: '13px',
    borderRadius: '6px',
    padding: '10px',
    maxWidth: '100vw'
  },
}))(Tooltip);
interface StatProps {
  timeRemaining?: string;
  priceToCompare12Twap?: BigNumber;
  priceToCompare1Twap?: BigNumber;
  timeRemainingToolTip?: string;
  title: string;
  price: BigNumber;
  isPurchase: boolean;
  toolTipTitle?: string;
  percenTageIncreaseText?: string;
  cardType?: '1hr' | '12hr';
}

const PurchaseCard: React.FC<StatProps> = ({
  isPurchase,
  timeRemaining,
  price,
  priceToCompare12Twap,
  priceToCompare1Twap,
  percenTageIncreaseText,
  title,
  toolTipTitle,
  timeRemainingToolTip,
  cardType
}) => {
  let buttonText = 'Purchase ARTHB at 20% Discount';
  let buttonTopDesc = 'ARTH Bonds ($ARTHB) can be purchased at 20% discount';
  let buttonBottomDesc = 'Enable until 12hr TWAP < $0.95 ';
  let buttonDisabled = false;

  const cents95 = BigNumber.from(95);

  if (isPurchase) {
    if (priceToCompare12Twap.lt(cents95)) {
      buttonText = 'Purchase ARTHB at 20% Discount';
      buttonTopDesc = 'ARTH Bonds ($ARTHB) can be purchased at 20% discount';
      buttonBottomDesc = 'Enable until 12hr TWAP < $0.95';
      buttonDisabled = false;
    } else if (Number(getDisplayBalance(priceToCompare12Twap)) > 1.05) {
      buttonText = 'Claim ARTH Distribution';
      buttonDisabled = false;
      buttonTopDesc =
        'New $ARTH seigniorage is minted and distributed into the system if 12HR TWAP > $1.05';
      buttonBottomDesc = 'Enable until 12hr TWAP > $1.05';
    } else if (Number(getDisplayBalance(priceToCompare12Twap)) > 1.0) {
      buttonText = 'Approve ARTH ';
      buttonTopDesc = 'Bond issuance is now available';
      buttonBottomDesc = '[Amount] of $ARTH seigniorage distributed';
      buttonDisabled = false;
    } else if (Number(getDisplayBalance(priceToCompare1Twap)) > 0.95 && Number(getDisplayBalance(priceToCompare1Twap)) < 1) {
      buttonText = 'Approve ARTH ';
      buttonTopDesc = 'Neither new $ARTH seigniorage is minted, nor can $ARTH be purchased';
      buttonBottomDesc = '[Amount] of $ARTH seigniorage distributed';
      buttonDisabled = true;
    } else if (Number(getDisplayBalance(priceToCompare1Twap)) > 1) {
      buttonText = 'Claim ARTH Distribution';
      buttonTopDesc =
        'New $ARTH seigniorage is minted and distributed into the system if 12HR TWAP > $1.05';
      buttonBottomDesc = '[Amount] of $ARTH seigniorage distributed';
      buttonDisabled = false;
    } else if (Number(getDisplayBalance(priceToCompare1Twap)) < 1) {
      buttonText = 'Claim ARTH Distribution';
      buttonTopDesc =
        'New $ARTH seigniorage is minted and distributed into the system if 12HR TWAP > $1.05';
      buttonBottomDesc = '[Amount] of $ARTH seigniorage distributed';
      buttonDisabled = false;
    }
  } else {
    if (Number(getDisplayBalance(priceToCompare12Twap)) < 0.95) {
      buttonText = 'Redeem Bond';
      buttonTopDesc = 'Bond redemption avaialble 123.22 ARTHB available to redeem';
      buttonBottomDesc = 'Enable until 1hr TWAP > $1.00 ';
      buttonDisabled = false;
    } else if (Number(getDisplayBalance(priceToCompare12Twap)) > 1.05) {
      buttonText = 'Redeem Bond';
      buttonTopDesc = 'Bond redemption avaialble 123.22 ARTHB available to redeem';
      buttonBottomDesc = 'Enable until 1hr TWAP > $1.00 ';
      buttonDisabled = true;
    } else if (Number(getDisplayBalance(priceToCompare12Twap)) > 1.0) {
      buttonText = 'Redeem Bond';
      buttonTopDesc = 'Bond redemption avaialble 123.22 ARTHB available to redeem';
      buttonBottomDesc = 'Enable until 1hr TWAP > $1.00 ';
      buttonDisabled = true;
    } else if (Number(getDisplayBalance(priceToCompare1Twap)) > 0.95 && Number(getDisplayBalance(priceToCompare1Twap)) < 1) {
      buttonText = 'Redeem Bond';
      buttonTopDesc = 'Bond redemption avaialble 123.22 ARTHB available to redeem';
      buttonBottomDesc = 'Enable until 1hr TWAP > $1.00 ';
      buttonDisabled = true;
    } else if (Number(getDisplayBalance(priceToCompare1Twap)) > 1) {
      buttonText = 'Redeem Bond';
      buttonTopDesc = 'Bond redemption avaialble 123.22 ARTHB available to redeem';
      buttonBottomDesc = 'Enable until 1hr TWAP > $1.00 ';
      buttonDisabled = false;
    } else if (Number(getDisplayBalance(priceToCompare1Twap)) < 1) {
      buttonText = 'Redeem Bond';
      buttonTopDesc = 'Bond redemption avaialble 123.22 ARTHB available to redeem';
      buttonBottomDesc = 'Enable until 1hr TWAP > $1.00 ';
      buttonDisabled = true;
    }
  }

  const getToolTipTitle = () => {
    if (cardType === '1hr')
      return (
        <p>
          <text>Bond Redeemption happens when   1hr TWAP {<text color={'yellow'}>{'>'}</text>} $1.00 </text><br />
          <span>Bond Purchase when              1hr TWAP {<text color={'yellow'}>{'<'}</text>} $0.95 </span>
        </p>
      )
    else
      return (
        <p>
          <span>Expansion happens when          12hr TWAP {<text color={'yellow'}>{'>'}</text>} $1.05 </span><br />
          <span>Contraction happens when        12hr TWAP {<text color={'yellow'}>{'<'}</text>} $0.95 </span><br />
          <span>Bond Issuance happens when      12hr TWAP {<text color={'yellow'}>{'>'}</text>} $1.00 </span>
        </p>
      )
  }

  return (
    <PurChaseCardPadding isPurchase={isPurchase}>
      <InfoContent>
        <div>
          <StyledTitle>
            {title}
            <HtmlTooltip enterTouchDelay={0} title={getToolTipTitle()}>
              <img src={InfoIcon} alt="Inof" width="16px" className="margin-left-5" />
            </HtmlTooltip>
          </StyledTitle>
          <TitleBold>{getDisplayBalance(price)}</TitleBold>
          <IncreasedText>{percenTageIncreaseText}</IncreasedText>
        </div>
        <div className="dialog-class">
          <TimeComponent>{timeRemaining}</TimeComponent>
          <HtmlTooltip enterTouchDelay={0} title={<span>{timeRemainingToolTip}</span>}>
            <img src={InfoIcon} alt="Inof" width="16px" />
          </HtmlTooltip>
        </div>
      </InfoContent>
      <StyledDesc>{buttonTopDesc}</StyledDesc>
      <Button disabled={buttonDisabled} text={buttonText} />
      <ConditionText>{buttonBottomDesc}</ConditionText>
    </PurChaseCardPadding>
  );
};


const PurChaseCardPadding = styled.div<{ isPurchase: boolean }>`
  padding: 30px;
`;

const StyledTitle = styled.div`
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  color: #ffffff;
  opacity: 0.64;
  flex-direction: row;
`;
const TimeComponent = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-weight: 600;
  margin-right: 10px;
  font-size: 12px;
  color: #ffffff;
  opacity: 0.6;
  padding: 5px 10px;
`;
const IncreasedText = styled.div`
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 130%;
  color: #178a50;
`;
const TitleBold = styled.div`
  font-style: normal;
  margin-top: 13px;
  font-weight: bold;
  font-size: 24px;
  line-height: 32px;
  color: #ffffff;
`;
const InfoContent = styled.div`
  flex: 1 1;
  display: flex !important;
  align-items: end;
  justify-content: space-between;
`;
const StyledDesc = styled.div`
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 140%;
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
  color: #ffffff;
  opacity: 0.88;
  line-clamp: 3;
  height: 50px
`;
const ConditionText = styled.div`
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: #ffffff;
  opacity: 0.6;
  margin-top: 15px;
`;
export default PurchaseCard;