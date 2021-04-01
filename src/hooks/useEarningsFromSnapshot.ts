import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useBasisCash from './useBasisCash';
import config from '../config';
import { VaultInfo } from '../basis-cash/types';

type Return = [BigNumber, BigNumber, () => Promise<void>, () => Promise<void>]
const useEarningsFromSnapshot = (vault: VaultInfo): Return => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const [contractBalance, setContractBalance] = useState(BigNumber.from(0));
  const basisCash = useBasisCash();

  const fetchBalance = useCallback(async () => {
    setContractBalance(await basisCash.ARTH.balanceOf(vault.arthSnapshotBoardroom.address));
    setBalance(await vault.arthSnapshotBoardroom.earned(basisCash.myAccount));
  }, [basisCash.ARTH, basisCash.myAccount, vault.arthSnapshotBoardroom]);

  const claimRewards = useCallback(async () => {
    await vault.arthSnapshotBoardroom.claimReward()
  }, [vault.arthSnapshotBoardroom])

  const reinvestRewards = useCallback(async () => {
    const reinvestVault = basisCash.getBoardroomVault(vault.reinvestVault)
    await vault.arthSnapshotBoardroom.claimAndReinvestReward(reinvestVault.contract.address)
  }, [basisCash, vault.arthSnapshotBoardroom, vault.reinvestVault])

  useEffect(() => {
    if (basisCash.isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));
      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [setBalance, basisCash.isUnlocked, fetchBalance]);

  return [balance, contractBalance, claimRewards, reinvestRewards];
};

export default useEarningsFromSnapshot;
