import { ChainId } from '@uniswap/sdk';
import { BigNumber, Contract } from 'ethers';
import { Boardrooms, BoardroomsV2, Vaults } from './config';
import ERC20 from './ERC20';

export type ContractName = string;

export interface BankInfo {
  name: string;
  contract: ContractName;
  depositTokenName: ContractName;
  earnTokenName: ContractName;
  sort: number;
  finished: boolean;
  networks: ChainId[]
  poolRewards: number
  poolDurationInDays: number
  poolSize: number
}


export interface BoardroomInfo {
  kind: Boardrooms
  contract: Contract
  address: ContractName;
  depositTokenName: ContractName;
  earnTokenName: ContractName;
  seionrageSupplyPercentage: number
  history7dayAPY: number
  lockInPeriodDays: number
}

export interface BoardroomInfoV2 {
  kind: BoardroomsV2
  contract: Contract
  address: ContractName;
  earnTokenName: ContractName;
  vestingPeriodHours: number
}

export interface VaultInfo {
  kind: Vaults
  contract: Contract
  address: ContractName;
  depositTokenName: ContractName;
  seionrageSupplyPercentage: number
  lockInPeriodDays: number

  arthSnapshotBoardroom: Contract

  reinvestVault: Vaults

  mahaBoardroom: BoardroomsV2
  arthBoardroom: BoardroomsV2
}

export interface Bank extends BankInfo {
  address: string;
  depositToken: ERC20;
  earnToken: ERC20;

  currentAPY: number
  hasLocking: boolean
  lockinDays: number
  supplyFromARTH: number
}

export type TokenStat = {
  priceInDAI: BigNumber;
  totalSupply: string;
};

export type TreasuryAllocationTime = {
  currentEpoch: Number
  prevAllocation: Date;
  nextAllocation: Date;
}


export type TreasuryCoreState = {
  uniswapRouter: string
  uniswapLiquidityPair: string
  cashTargetPrice: BigNumber
  cashToBondConversionLimit: BigNumber
  accumulatedBonds: BigNumber
  accumulatedSeigniorage: BigNumber
  contractionRewardPerEpoch: BigNumber
}

export type TreasuryOracleState = {
  oracle1hrTWAP: string
  oracle12hrTWAP: string
  gmuOracle: string
}

export type TreasuryBoardroomState = {
  arthArthLiquidityMlpBoardroom: string
  arthMahaBoardroom: string
  arthArthBoardroom: string
  mahaArthLiquidityMlpBoardroom: string
  mahaMahaBoardroom: string
  mahaArthBoardroom: string
  ecosystemFund: string
  rainyDayFund: string
  arthLiquidityMlpAllocationRate: BigNumber
  arthAllocationRate: BigNumber
  mahaAllocationRate: BigNumber
  ecosystemFundAllocationRate: BigNumber
  rainyDayFundAllocationRate: BigNumber
}
