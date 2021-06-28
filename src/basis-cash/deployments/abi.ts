export const ArthController = require('./abi/ArthController.json');
export const ArthPool = require('./abi/ArthPool.json');
export const ArthPoolLibrary = require('./abi/ArthPoolLibrary.json');
export const ArthPoolRouter = require('./abi/ArthPoolRouter.json');
export const ARTHShares = require('./abi/ARTHShares.json');
export const ARTHStablecoin = require('./abi/ARTHStablecoin.json');
export const BasicStaking = require('./abi/BasicStaking.json');
export const Faucet = require('./abi/Faucet.json');
export const Genesis = require('./abi/Genesis.json');
export const GMUOracle = require('./abi/GMUOracle.json');
export const IERC20 = require('./abi/IERC20.json');
export const IWETH = require('./abi/IWETH.json');
export const LotteryRaffle = require('./abi/LotteryRaffle.json');
export const MahaToken = require('./abi/MahaToken.json');
export const PoolToken = require('./abi/PoolToken.json');
export const UniswapPairOracle = require('./abi/UniswapPairOracle.json');
export const UniswapV2Factory = require('./abi/UniswapV2Factory.json');
export const UniswapV2Pair = require('./abi/UniswapV2Pair.json');
export const UniswapV2Router02 = require('./abi/UniswapV2Router02.json');
export const Router = require('./abi/Router.json');
export const UniversalGMUOracle = require('./abi/UniversalGMUOracle.json');
export const BasicStakingSpecificReward = require('./abi/BasicStakingSpecificReward.json');

type IABIS = {
  [key: string]: any[];
};

const ret: IABIS = {
  ArthController,
  ArthPool,
  ArthPoolLibrary,
  ArthPoolRouter,
  ARTHShares,
  ARTHStablecoin,
  BasicStaking,
  Faucet,
  Genesis,
  GMUOracle,
  IERC20,
  IWETH,
  LotteryRaffle,
  MahaToken,
  PoolToken,
  UniswapPairOracle,
  UniswapV2Factory,
  UniswapV2Pair,
  UniswapV2Router02,
  UniversalGMUOracle,
  BasicStakingSpecificReward,
  Router
};

export default ret;
