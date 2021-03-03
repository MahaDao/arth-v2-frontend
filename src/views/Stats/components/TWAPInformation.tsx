import React from 'react';
import Grid from '@material-ui/core/Grid';
import { getDisplayBalance } from '../../../utils/formatBalance';
import PurchacseCard from './PurchaseCard';
import { useSelector } from 'react-redux';
import { AppState } from '../../../state';
import { BigNumber } from 'ethers';
import { TokenStat } from '../../../basis-cash/types';


interface IProps {
  stat?: TokenStat;
}

const TWAPInformation: React.FC<IProps> = (props) => {
  const price1hr = useSelector<AppState, BigNumber>(s => s.treasury.get1hrTWAPOraclePrice)
  const price12hr = useSelector<AppState, BigNumber>(s => s.treasury.get12hrTWAPOraclePrice)

  return (
    <Grid container>
      <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className="dynamicStatBorder">
        <PurchacseCard
          title="12hr TWAP"
          isPurchase
          price={price12hr}
          priceToCompare12Twap={
            price12hr
          }
          priceToCompare1Twap={
            price1hr
          }
          timeRemaining="00:23:22"
          toolTipTitle="Test Tool Tip"
          percenTageIncreaseText="+0.15%"
          timeRemainingToolTip="Time left for next 12 hr twap updation."
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
        <PurchacseCard
          title="1hr TWAP"
          isPurchase={false}
          timeRemaining="00:23:22"
          price={price1hr}
          priceToCompare1Twap={price1hr}
          priceToCompare12Twap={price12hr}
          toolTipTitle="Test Tool Tip"
          percenTageIncreaseText="+0.15%"
          timeRemainingToolTip="Time left for next 1 hr twap updation."
        />
      </Grid>
    </Grid>
  );
};

export default TWAPInformation;
