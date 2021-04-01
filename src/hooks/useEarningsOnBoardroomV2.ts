import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useBasisCash from './useBasisCash';
import config from '../config';
import { VaultInfo } from '../basis-cash/types';
import { BoardroomsV2 } from '../basis-cash/config';

type Return = [BigNumber, BigNumber, () => Promise<void>, () => Promise<void>]
const useEarningsOnBoardroomV2 = (vault: VaultInfo, boardroom: BoardroomsV2): Return => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const [contractBalance, setContractBalance] = useState(BigNumber.from(0));
  const basisCash = useBasisCash();

  const fetchBalance = useCallback(async () => {
    const { contract } = basisCash.getBoardroomV2(boardroom)
    setContractBalance(await basisCash.ARTH.balanceOf(contract.address));
    setBalance(await contract.earned(basisCash.myAccount));
  }, [basisCash, boardroom]);

  const claimRewards = useCallback(async () => {
    const { contract } = basisCash.getBoardroomV2(boardroom)
    await contract.claimReward()
  }, [basisCash, boardroom])

  const reinvestRewards = useCallback(async () => {
    const reinvestVault = basisCash.getBoardroomVault(vault.reinvestVault)
    const { contract } = basisCash.getBoardroomV2(boardroom)
    await contract.claimAndReinvestReward(reinvestVault.contract.address)
  }, [basisCash, boardroom, vault.reinvestVault])

  useEffect(() => {
    if (basisCash.isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));
      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [setBalance, basisCash.isUnlocked, fetchBalance]);

  return [balance, contractBalance, claimRewards, reinvestRewards];
};

export default useEarningsOnBoardroomV2;


// import { useCallback, useEffect, useState } from 'react';
// import { BigNumber } from 'ethers';
// import useBasisCash from './useBasisCash';
// import config from '../config';
// import { Boardrooms, BoardroomVersion } from '../basis-cash/config';

// const useEarningsOnBoardroomV2 = (kind: Boardrooms, version: BoardroomVersion) => {
//   const [balance, setBalance] = useState(BigNumber.from(0));
//   const basisCash = useBasisCash();

//   const fetchBalance = useCallback(async () => {
//     setBalance(await basisCash.getEarningsOnBoardroom(kind, version));
//   }, [basisCash, kind, version]);

//   useEffect(() => {
//     if (basisCash.isUnlocked) {
//       fetchBalance().catch((err) => console.error(err.stack));
//       const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
//       return () => clearInterval(refreshBalance);
//     }
//   }, [basisCash.isUnlocked, fetchBalance]);

//   return balance;
// };

// export default useEarningsOnBoardroomV2;
