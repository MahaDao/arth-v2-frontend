import { Deployments } from './deployments';
import { ChainId } from '@uniswap/sdk';

export type Configuration = {
  chainId: ChainId,
  etherscanUrl: string,
  defaultProvider: string,
  deployments: Deployments,
  externalTokens: { [contractName: string]: [string, number] };
  config?: EthereumConfig,

  baseLaunchDate: Date,
  bondLaunchesAt: Date,
  boardroomLaunchesAt: Date,

  refreshInterval: number;
  gasLimitMultiplier: number;
};

export type BoardroomsV1 = 'arthUniLiquidity' | 'arthMlpLiquidity' | 'arth'  | 'mahaLiquidity'
export type BoardroomsV2 = 'arthArthDaiLiquidity' | 'arthArth'  | 'arthMaha' |
  'mahaArthDaiLiquidity' | 'mahaArth'  | 'mahaMaha' | 'arthArthEthLiquidity' | 'mahaArthEthLiquidity'

export type Boardrooms = BoardroomsV1 | BoardroomsV2
export enum Vaults {
  arthEthLiquidity = 'arthEthLiquidity',
  arthDaiLiquidity = 'arthDaiLiquidity',
  arth = 'arth',
  maha = 'maha'
}
export type BoardroomVersion = 'v1' | 'v2'

export type EthereumConfig = {
  testing: boolean,
  autoGasMultiplier: number,
  defaultConfirmations: number,
  defaultGas: string,
  defaultGasPrice: string,
  ethereumNodeTimeout: number,
};

export const defaultEthereumConfig = {
  testing: false,
  autoGasMultiplier: 1.5,
  defaultConfirmations: 1,
  defaultGas: "6000000",
  defaultGasPrice: "1000000000000",
  ethereumNodeTimeout: 10000,
};
