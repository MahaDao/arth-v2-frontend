import { Dispatch } from '@reduxjs/toolkit'
import { BasisCash } from '../../basis-cash/BasisCash'
import * as Actions from './actions'
import { IMulticallInput } from '../../basis-cash/Mulitcall'
import { Contract } from 'ethers'


export const init = (account: string, basisCash: BasisCash, dispatch: Dispatch) => {
  const registerVariableBN = (contract: Contract, fn: string, addr: string, reduxAction: any) => {
    const key = `${contract.address}:${fn}`
    const input: IMulticallInput = {
      key,
      target: contract.address,
      call: [fn, addr],
      convertResult: val => val
    }

    basisCash.multicall.removeCall(key)
    basisCash.multicall.on(input.key, val => dispatch(reduxAction(val)))

    return input
  }

  const contracts = basisCash.contracts

  const calls = [
    registerVariableBN(contracts.VaultArth, 'balanceWithoutBonded(address)(uint256)', account, Actions.updateVaultArthBalance),
    registerVariableBN(contracts.VaultArthDaiMlp, 'balanceWithoutBonded(address)(uint256)', account, Actions.updateVaultArthDaiBalance),
    registerVariableBN(contracts.VaultMaha, 'balanceWithoutBonded(address)(uint256)', account, Actions.updateVaultMahaBalance),
    registerVariableBN(contracts.VaultArthEthMlp, 'balanceWithoutBonded(address)(uint256)', account, Actions.updateVaultArthEthBalance),

    registerVariableBN(contracts.ArthArthBoardroomV2, 'earned(address)(uint256)', account, Actions.updateArthArthEarnings),
    registerVariableBN(contracts.ArthArthDaiLiquidityBoardroomV2, 'earned(address)(uint256)', account, Actions.updateArthArthMLPEarnings),
    registerVariableBN(contracts.ArthMahaBoardroomV2, 'earned(address)(uint256)', account, Actions.updateArthMahaEarnings),
    registerVariableBN(contracts.ArthMahaBoardroomV2, 'earned(address)(uint256)', account, Actions.updateArthMahaEarnings),
    // registerVariableBN(contracts.VaultMaha, 'balanceWithoutBonded(address)(uint256)', account, Actions.updateVaultMahaBalance),
    // registerVariableBN(contracts.VaultMaha, 'balanceWithoutBonded(address)(uint256)', account, Actions.updateVaultMahaBalance),
    // registerVariableBN(contracts.VaultMaha, 'balanceWithoutBonded(address)(uint256)', account, Actions.updateVaultMahaBalance),
  ]

  basisCash.multicall.addCalls(calls)
}
