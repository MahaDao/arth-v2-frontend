import { Dispatch } from '@reduxjs/toolkit'
import { BasisCash } from '../../basis-cash/BasisCash'
import * as Actions from './actions'
import { IMulticallInput } from '../../basis-cash/Mulitcall'


export const init = (basisCash: BasisCash, dispatch: Dispatch) => {
  const registerVariable = (fn: string, reduxAction: any) => {
    const input: IMulticallInput = {
      key: `TREASURY:${fn}`,
      target: basisCash.contracts.Treasury.address,
      call: [fn],
      convertResult: val => val.toNumber()
    }

    basisCash.multicall.on(input.key, val => dispatch(reduxAction(val)))

    return input
  }


  const registerVariableBN = (fn: string, reduxAction: any) => {
    const input: IMulticallInput = {
      key: `TREASURY:${fn}`,
      target: basisCash.contracts.Treasury.address,
      call: [fn],
      convertResult: val => val
    }

    basisCash.multicall.on(input.key, val => dispatch(reduxAction(val)))

    return input
  }

  const updateJob =  async () => {
    await basisCash.getTreasury()
    // const t = await basisCash.getTreasury()
    // const state = await t.getState();
    // dispatch(Actions.updateState(state))
  }

  updateJob()
  setInterval(updateJob, basisCash.config.refreshInterval)

  const calls = [
    registerVariable('nextEpochPoint()(uint256)', Actions.updateNextEpochPoint),
    registerVariable('getPeriod()(uint256)', Actions.updatePeriod),
    registerVariable('getCurrentEpoch()(uint256)', Actions.updateCurrentEpoch),


    registerVariableBN('getGMUOraclePrice()(uint256)', Actions.updateGetGMUOraclePrice),
    registerVariableBN('getSeigniorageOraclePrice()(uint256)', Actions.updateGet12hrTWAPOraclePrice),
    registerVariableBN('getBondOraclePrice()(uint256)', Actions.updateGet1hrTWAPOraclePrice),
    registerVariableBN('bondCirculatingSupply()(uint256)', Actions.updateBondCirculatingSupply),
    registerVariableBN('arthCirculatingSupply()(uint256)', Actions.updateArthCirculatingSupply),


    // registerVariableBN('getGMUOraclePrice()(uint256)', Actions.updateGetGMUOraclePrice),
    // registerVariableBN('get12hrTWAPOraclePrice()(uint256)', Actions.updateGet12hrTWAPOraclePrice),
    // registerVariableBN('get1hrTWAPOraclePrice()(uint256)', Actions.updateGet1hrTWAPOraclePrice),
    // registerVariableBN('bondCirculatingSupply()(uint256)', Actions.updateBondCirculatingSupply),
    // registerVariableBN('arthCirculatingSupply()(uint256)', Actions.updateArthCirculatingSupply),

    // // registerVariable('getReserve()(uint256)', Actions.updateGetReserve),
    // // registerVariable('getBondOraclePrice()(uint256)', Actions.updateGetBondOraclePrice),
    // registerVariable('getStabilityFee()(uint256)', Actions.updateGetStabilityFee),
    // // registerVariable('getGMUOraclePrice()(uint256)', Actions.updateGetGMUOraclePrice),
    // // registerVariable('getArthMahaOraclePrice()(uint256)', Actions.updateGetArthMahaOraclePrice),
    // // registerVariable('getSeigniorageOraclePrice()(uint256)', Actions.updateGetSeigniorageOraclePrice),
    // // registerVariable('arthCirculatingSupply()(uint256)', Actions.updateArthCirculatingSupply),
    // // registerVariable('bondCirculatingSupply()(uint256)', Actions.updateBondCirculatingSupply),
    // // registerVariable('getBondRedemtionPrice()(uint256)', Actions.updateGetBondRedemtionPrice),
    // // registerVariable('getExpansionLimitPrice()(uint256)', Actions.updateGetExpansionLimitPrice),
    // // registerVariable('getBondPurchasePrice()(uint256)', Actions.updateGetBondPurchasePrice),
    // // registerVariable('getCashSupplyInLiquidity()(uint256)', Actions.updateGetCashSupplyInLiquidity),
    // // registerVariable('get1hourEpoch()(uint256)', Actions.updateGet1hourEpoch),
    // // registerVariable('cashTargetPrice(uint256)', Actions.updateCashTargetPrice),
    // registerVariable('cashToBondConversionLimit()(uint256)', Actions.updateCashToBondConversionLimit),
    // registerVariable('accumulatedBonds()(uint256)', Actions.updateAccumulatedBonds),
    // // registerVariable('accumulatedSeigniorage()(uint256)', Actions.updateAccumulatedSeigniorage),
    // registerVariable('maxDebtIncreasePerEpoch()(uint256)', Actions.updateMaxDebtIncreasePerEpoch),
    // registerVariable('bondDiscount()(uint256)', Actions.updateBondDiscount),
    // registerVariable('safetyRegion()(uint256)', Actions.updateSafetyRegion),
    // registerVariable('maxSupplyIncreasePerEpoch()(uint256)', Actions.updateMaxSupplyIncreasePerEpoch),
    // registerVariable('ecosystemFundAllocationRate()(uint256)', Actions.updateEcosystemFundAllocationRate),
    // registerVariable('rainyDayFundAllocationRate()(uint256)', Actions.updateRainyDayFundAllocationRate),
    // registerVariable('bondSeigniorageRate()(uint256)', Actions.updateBondSeigniorageRate),
    // registerVariable('arthLiquidityUniAllocationRate()(uint256)', Actions.updateArthLiquidityUniAllocationRate),
    // registerVariable('arthLiquidityMlpAllocationRate()(uint256)', Actions.updateArthLiquidityMlpAllocationRate),
    // registerVariable('arthBoardroomAllocationRate()(uint256)', Actions.updateArthBoardroomAllocationRate),
    // registerVariable('mahaLiquidityBoardroomAllocationRate()(uint256)', Actions.updateMahaLiquidityBoardroomAllocationRate),
    // registerVariable('stabilityFee()(uint256)', Actions.updateStabilityFee),
  ]

  basisCash.multicall.addCalls(calls)
}
