import { BigNumber } from 'ethers';
import { AppState } from '../state';
import { Vaults } from '../basis-cash/config';
import { useSelector } from 'react-redux';

const useStakedBalanceOnVault = (kind: Vaults) => {
  const balance = useSelector<AppState, BigNumber>(state => state.vault.vaults[kind])
  return balance;
};

export default useStakedBalanceOnVault;
