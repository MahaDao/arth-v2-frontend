import { BigNumber } from 'ethers';
import { TokenStat } from '../../basis-cash/types';

export interface OverviewData {
  cash?: TokenStat;
  bond?: TokenStat;
  share?: TokenStat;
  targetPrice?: BigNumber
}
