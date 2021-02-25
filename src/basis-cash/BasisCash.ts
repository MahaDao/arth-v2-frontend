import { Fetcher as MFetcher, Route as MRoute, Token as MToken } from 'mahaswap-sdk';
import { Fetcher, Route, Token } from '@uniswap/sdk';
import { Boardrooms, Configuration } from './config';
import { BoardroomInfo, ContractName, TokenStat, TreasuryAllocationTime } from './types';
import { BigNumber, Contract, ethers, Overrides } from 'ethers';
import { decimalToBalance } from './ether-utils';
import { TransactionResponse } from '@ethersproject/providers';
import ERC20 from './ERC20';
import { getDisplayBalance } from '../utils/formatBalance';
import { getDefaultProvider } from '../utils/provider';
import IUniswapV2PairABI from './IUniswapV2Pair.abi.json';
import UniswapV2Router02ABI from './UniswapV2Router02.abi.json';
import Multicall from './Mulitcall';

/**
 * An API module of ARTH contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class BasisCash {
  myAccount: string;
  provider: ethers.providers.BaseProvider;
  signer?: ethers.Signer;
  config: Configuration;
  contracts: { [name: string]: Contract };
  externalTokens: { [name: string]: ERC20 };
  boardroomVersionOfUser?: string;

  bacDai: Contract;
  arthDai: Contract;
  mahaEth: Contract;

  DAI: ERC20;
  ARTH: ERC20;
  MAHA: ERC20;
  ARTHB: ERC20;
  ARTHDAI_UNIV2: ERC20;

  multicall: Multicall;

  constructor(cfg: Configuration) {
    const { deployments, externalTokens } = cfg;
    const provider = getDefaultProvider();

    // loads contracts from deployments
    this.contracts = {};
    for (const [name, deployment] of Object.entries(deployments)) {
      if (!deployment.abi) continue;
      this.contracts[name] = new Contract(deployment.address, deployment.abi, provider);
    }
    this.externalTokens = {};
    for (const [symbol, [address, decimal]] of Object.entries(externalTokens)) {
      this.externalTokens[symbol] = new ERC20(address, provider, symbol, decimal); // TODO: add decimal+
    }

    this.ARTH = new ERC20(deployments.ARTH.address, provider, 'ARTH');
    this.MAHA = new ERC20(deployments.MahaToken.address, provider, 'MAHA');
    this.ARTHB = new ERC20(deployments.ARTHB.address, provider, 'ARTHB');
    this.DAI = new ERC20(deployments.DAI.address, provider, 'ARTHB');

    this.multicall = new Multicall(cfg.defaultProvider, deployments.Multicall.address);

    // Uniswap V2 Pair

    this.arthDai = new Contract(deployments.ArthDaiLP.address, IUniswapV2PairABI, provider);

    this.mahaEth = new Contract(deployments.MahaEthLP.address, IUniswapV2PairABI, provider);

    this.config = cfg;
    this.provider = provider;
  }

  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */
  unlockWallet(provider: any, account: string) {
    const newProvider = new ethers.providers.Web3Provider(provider, this.config.chainId);

    this.signer = newProvider.getSigner(0);
    this.myAccount = account;
    for (const [name, contract] of Object.entries(this.contracts)) {
      this.contracts[name] = contract.connect(this.signer);
    }
    const tokens = [this.ARTH, this.MAHA, this.ARTHB, ...Object.values(this.externalTokens)];
    for (const token of tokens) {
      token.connect(this.signer);
    }
    this.arthDai = this.arthDai.connect(this.signer);
    console.log(`🔓 Wallet is unlocked. Welcome, ${account}!`);
    this.fetchBoardroomVersionOfUser()
      .then((version) => (this.boardroomVersionOfUser = version))
      .catch((err) => {
        console.error(`Failed to fetch boardroom version: ${err.stack}`);
        this.boardroomVersionOfUser = 'latest';
      });
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }

  getBoardrooms: () => ['arth', 'arthUniLiquidity', 'arthMlpLiquidity', 'mahaLiquidity'];

  getBoardroom(kind: Boardrooms, version: string): BoardroomInfo {
    const contract = this.boardroomByVersion(kind, version);

    if (kind === 'arth')
      return {
        kind: 'arth',
        contract,
        address: contract.address,
        depositTokenName: 'ARTH',
        earnTokenName: 'ARTH',
        seionrageSupplyPercentage: 20,
        history7dayAPY: 30,
        lockInPeriodDays: 5,
      };

    if (kind === 'mahaLiquidity')
      return {
        kind: 'mahaLiquidity',
        contract,
        address: contract.address,
        depositTokenName: 'MAHA_ETH-UNI-LPv2',
        earnTokenName: 'ARTH',
        seionrageSupplyPercentage: 10,
        history7dayAPY: 30,
        lockInPeriodDays: 1,
      };

    if (kind === 'arthMlpLiquidity')
      return {
        kind: 'arthMlpLiquidity',
        contract,
        address: contract.address,
        depositTokenName: 'ARTH_DAI-MLP-LPv2',
        earnTokenName: 'ARTH',
        seionrageSupplyPercentage: 65,
        history7dayAPY: 30,
        lockInPeriodDays: 1,
      };

    return {
      kind: 'arthUniLiquidity',
      contract,
      address: contract.address,
      depositTokenName: 'ARTH_DAI-UNI-LPv2',
      earnTokenName: 'ARTH',
      seionrageSupplyPercentage: 60,
      history7dayAPY: 30,
      lockInPeriodDays: 1,
    };
  }

  gasOptions(gas: BigNumber): Overrides {
    const multiplied = Math.floor(gas.toNumber() * this.config.gasLimitMultiplier);
    console.log(`⛽️ Gas multiplied: ${gas} -> ${multiplied}`);
    return {
      gasLimit: BigNumber.from(multiplied),
    };
  }

  /**
   * @returns ARTH (ARTH) stats from Uniswap.
   * It may differ from the ARTH price used on Treasury (which is calculated in TWAP)
   */
  async getCashStatFromUniswap(): Promise<TokenStat> {
    const supply = await this.ARTH.displayedTotalSupply();
    return {
      priceInDAI: await this.getTokenPriceFromUniswap(this.ARTH),
      totalSupply: supply,
    };
  }

  async getCashStatFromMahaswap(): Promise<TokenStat> {
    const supply = await this.ARTH.displayedTotalSupply();
    return {
      priceInDAI: await this.getTokenPriceFromMahaswap(this.ARTH),
      totalSupply: supply,
    };
  }

  /**
   * @returns Estimated ARTH (ARTH) price data,
   * calculated by 1-day Time-Weight Averaged Price (TWAP).
   */
  async getCashStatInEstimatedTWAP(): Promise<TokenStat> {
    const { SeigniorageOracle } = this.contracts;

    // estimate current TWAP price
    const cumulativePrice: BigNumber = await this.arthDai.price0CumulativeLast();
    const cumulativePriceLast = await SeigniorageOracle.price0CumulativeLast();

    const elapsedSec = Math.floor(
      Date.now() / 1000 - (await SeigniorageOracle.blockTimestampLast()),
    );

    const denominator112 = BigNumber.from(2).pow(112);
    const denominator1e18 = BigNumber.from(10).pow(18);
    const cashPriceTWAP = cumulativePrice
      .sub(cumulativePriceLast)
      .mul(denominator1e18)
      .div(elapsedSec)
      .div(denominator112);

    const totalSupply = await this.ARTH.displayedTotalSupply();
    return {
      priceInDAI: getDisplayBalance(cashPriceTWAP),
      totalSupply,
    };
  }

  async getTargetPrice(): Promise<BigNumber> {
    const { GMUOracle } = this.contracts;
    return GMUOracle.getPrice();
  }

  async getBondOraclePriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getBondOraclePrice();
  }

  async getBondStat(): Promise<TokenStat> {
    return {
      priceInDAI: await this.getTokenPriceFromUniswap(this.ARTHB),
      totalSupply: await this.ARTHB.displayedTotalSupply(),
    };
  }

  async getShareStat(): Promise<TokenStat> {
    return {
      priceInDAI: await this.getTokenPriceFromCoingecko(this.MAHA),
      totalSupply: '783601', // await this.MAHA.displayedTotalSupply(),
    };
  }

  async getTokenPriceFromUniswap(tokenContract: ERC20): Promise<string> {
    await this.provider.ready;

    const { chainId } = this.config;
    const { DAI } = this.config.externalTokens;

    const dai = new Token(chainId, DAI[0], 18);
    const token = new Token(chainId, tokenContract.address, 18);

    try {
      const daiToToken = await Fetcher.fetchPairData(dai, token, this.provider);
      const priceInDAI = new Route([daiToToken], token);
      return priceInDAI.midPrice.toSignificant(3);
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  async getTokenPriceFromMahaswap(tokenContract: ERC20): Promise<string> {
    await this.provider.ready;

    const { chainId } = this.config;
    const { DAI } = this.config.externalTokens;

    const dai = new MToken(chainId, DAI[0], 18);
    const token = new MToken(chainId, tokenContract.address, 18);

    try {
      const daiToToken = await MFetcher.fetchPairData(dai, token, this.provider);
      const priceInDAI = new MRoute([daiToToken], token);
      return priceInDAI.midPrice.toSignificant(3);
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  async getTokenPriceFromCoingecko(tokenContract: ERC20): Promise<string> {
    await this.provider.ready;

    try {
      const result = await fetch(
        `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokenContract.address}&vs_currencies=usd`,
      );
      const json = await result.json();
      return json[tokenContract.address.toLowerCase()].usd.toFixed(3);
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  async estimateAmountOutFromUniswap(amountIn: number, path: ERC20[]): Promise<BigNumber> {
    await this.provider.ready;

    if (amountIn <= 0) return BigNumber.from(0);

    const denominator1e18 = BigNumber.from(10).pow(18).mul(Math.floor(amountIn));
    const adjustedAmount = BigNumber.from(1).mul(denominator1e18);

    const UniswapV2Library = new Contract(
      this.config.deployments.UniswapV2Router02.address,
      UniswapV2Router02ABI,
      this.provider,
    );

    try {
      const result: BigNumber[] = await UniswapV2Library.getAmountsOut(
        adjustedAmount,
        path.map((p) => p.address),
      );
      return result[result.length - 1];
    } catch (error) {
      console.log('Uniswap estimation error', error);
    }

    return BigNumber.from(0);
  }

  /**
   * Buy bonds with cash.
   * @param amount amount of cash to purchase bonds with.
   */
  async buyBonds(amount: string | number): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    return await Treasury.buyBonds(
      decimalToBalance(amount),
      await this.getBondOraclePriceInLastTWAP(),
    );
  }

  /**
   * Redeem bonds for ARTH.
   * @param amount amount of bonds to redeem.
   */
  async redeemBonds(amount: string): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    return await Treasury.redeemBonds(decimalToBalance(amount));
  }

  async earnedFromBank(poolName: ContractName, account = this.myAccount): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      return await pool.earned(account);
    } catch (err) {
      console.error(`Failed to call earned() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  async stakedBalanceOnBank(
    poolName: ContractName,
    account = this.myAccount,
  ): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      return await pool.balanceOf(account);
    } catch (err) {
      console.error(`Failed to call balanceOf() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  /**
   * Deposits token to given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async stake(poolName: ContractName, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.stake(amount);
    return await pool.stake(amount, this.gasOptions(gas));
  }

  /**
   * Withdraws token from given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async unstake(poolName: ContractName, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.withdraw(amount);
    return await pool.withdraw(amount, this.gasOptions(gas));
  }

  /**
   * Transfers earned token reward from given pool to my account.
   */
  async harvest(poolName: ContractName): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.getReward();
    return await pool.getReward(this.gasOptions(gas));
  }

  /**
   * Harvests and withdraws deposited tokens from the pool.
   */
  async exit(poolName: ContractName): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.exit();
    return await pool.exit(this.gasOptions(gas));
  }

  async fetchBoardroomVersionOfUser(): Promise<string> {
    return 'latest';
  }

  boardroomByVersion(kind: Boardrooms, version: string): Contract {
    // if (version === 'v2') {
    //   if (kind === 'arthUniLiquidity') return this.contracts.ArthUniLiquidityBoardroomV2;
    //   if (kind === 'arthMlpLiquidity') return this.contracts.ArthMlpLiquidityBoardroomV2;
    //   if (kind === 'mahaLiquidity') return this.contracts.MahaLiquidityBoardroomV2;
    //   return this.contracts.ArthBoardroomV2;
    // }

    if (kind === 'arthUniLiquidity') return this.contracts.ArthLiquidityBoardroomV1;
    if (kind === 'mahaLiquidity') return this.contracts.MahaLiquidityBoardroomV1;
    return this.contracts.ArthBoardroomV1;
  }

  currentBoardroom(kind: Boardrooms): Contract {
    return this.boardroomByVersion(kind, 'v1');
  }

  isOldBoardroomMember(): boolean {
    return this.boardroomVersionOfUser !== 'latest';
  }

  async stakeShareToBoardroom(kind: Boardrooms, amount: string): Promise<TransactionResponse> {
    if (this.isOldBoardroomMember()) {
      throw new Error(
        "you're using old ArthBoardroom. please withdraw and deposit the MAHA again.",
      );
    }
    const boardroom = this.currentBoardroom(kind);
    return await boardroom.bond(decimalToBalance(amount));
  }

  async getStakedSharesOnBoardroom(kind: Boardrooms, version: string): Promise<BigNumber> {
    const boardroom = this.currentBoardroom(kind);
    return await boardroom.balanceOf(this.myAccount);
  }

  async getEarningsOnBoardroom(kind: Boardrooms, version: string): Promise<BigNumber> {
    const boardroom = this.currentBoardroom(kind);
    return await boardroom.earned(this.myAccount);
  }

  async getClaimableEarningsOnBoardroomV2(
    kind: Boardrooms,
    version: string,
  ): Promise<BigNumber> {
    const boardroom = this.getBoardroom(kind, 'v2');
    return await boardroom.contract.estimateRewardsToClaim(this.myAccount);
  }

  async withdrawShareFromBoardroomV2(kind: Boardrooms): Promise<TransactionResponse> {
    const boardroom = this.currentBoardroom(kind);
    return await boardroom.withdraw();
  }

  async withdrawShareFromBoardroomV1(
    kind: Boardrooms,
    amount: string,
  ): Promise<TransactionResponse> {
    const boardroom = this.currentBoardroom(kind);
    return await boardroom.withdraw(decimalToBalance(amount));
  }

  async unbondShareFromBoardroom(
    kind: Boardrooms,
    amount: string,
  ): Promise<TransactionResponse> {
    const boardroom = this.currentBoardroom(kind);
    return await boardroom.unbond(decimalToBalance(amount));
  }

  async harvestCashFromBoardroom(
    kind: Boardrooms,
    version: string,
  ): Promise<TransactionResponse> {
    const boardroom = this.currentBoardroom(kind);
    if (this.boardroomVersionOfUser === 'v1') {
      return await boardroom.claimDividends();
    }
    return await boardroom.claimReward();
  }

  async exitFromBoardroom(kind: Boardrooms, version: string): Promise<TransactionResponse> {
    const boardroom = this.currentBoardroom(kind);
    return await boardroom.exit();
  }

  async getTreasuryEstimateBondsToIssue(price: BigNumber): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    const est = await Treasury.estimateSeignorageToMint(price);
    return est;
  }

  async getTreasury() {
    const { Treasury } = this.contracts;
    return Treasury;
  }

  async getTreasuryEstimateSeignorageToMint(price: BigNumber): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    const est = await Treasury.estimateSeignorageToMint(price);
    return est;
  }
}
