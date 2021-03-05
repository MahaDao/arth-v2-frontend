export const ARTHTokenPool = require('./ARTHTokenPool.json');
export const BaseToken = require('./BaseToken.json');
export const IERC20 = require('./IERC20.json');
export const IUniswapV2Pair = require('./IUniswapV2Pair.json');
export const Maharaja = require('./Maharaja.json');
export const MahaToken = require('./MahaToken.json');
export const Multicall = require('./Multicall.json');
export const SimpleBoardroom = require('./SimpleBoardroom.json');
export const SimpleERCFund = require('./SimpleERCFund.json');
export const SimpleOracle = require('./SimpleOracle.json');
export const Treasury = require('./Treasury.json');
export const TreasuryOld = require('./TreasuryOld.json');
export const UniswapOracle = require('./UniswapOracle.json');
export const UniswapV2Factory = require('./UniswapV2Factory.json');
export const UniswapV2Router02 = require('./UniswapV2Router02.json');
export const Vault = require('./Vault.json');
export const VaultBoardroom = require('./VaultBoardroom.json');
export const VestedVaultBoardroom = require('./VestedVaultBoardroom.json');


type IABIS = {
  [key: string]: any[]
}

const ret: IABIS = {
  BaseToken,
  IERC20,
  MahaToken,
  Maharaja,
  Multicall,
  SimpleERCFund,
  SimpleOracle,
  IUniswapV2Pair,
  Treasury,
  TreasuryOld,
  UniswapOracle,
  SimpleBoardroom,
  ARTHTokenPool,
  UniswapV2Factory,
  UniswapV2Router02,
  Vault,
  VaultBoardroom,
  VestedVaultBoardroom,
}

export default ret
