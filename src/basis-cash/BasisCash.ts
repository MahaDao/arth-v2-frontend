import { Boardrooms, BoardroomsV2, BoardroomVersion, Configuration, Vaults } from './config';
import { BoardroomInfo, BoardroomInfoV2, ContractName, TokenStat, TreasuryAllocationTime, VaultInfo } from './types';
import { BigNumber, Contract, ethers, Overrides } from 'ethers';
import { decimalToBalance } from './ether-utils';
import { TransactionResponse } from '@ethersproject/providers';
import ERC20 from './ERC20';
import { getDefaultProvider } from '../utils/provider';
import UniswapV2Router02ABI from './UniswapV2Router02.abi.json';
import Multicall from './Mulitcall';
import UniswapPair from './UniswapPair';
import ABIS from './deployments/abi';


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

  arthEth: UniswapPair;
  arthDai: UniswapPair;
  mahaEth: UniswapPair;

  DAI: ERC20;
  ARTH: ERC20;
  MAHA: ERC20;
  ARTHB: ERC20;

  multicall: Multicall

  constructor(cfg: Configuration) {
    const { deployments, externalTokens } = cfg;
    const provider = getDefaultProvider();

    // loads contracts from deployments
    this.contracts = {};
    for (const [name, deployment] of Object.entries(deployments)) {
      if (!deployment.abi) continue
      this.contracts[name] = new Contract(deployment.address, ABIS[deployment.abi], provider);
    }
    this.externalTokens = {};
    for (const [symbol, [address, decimal]] of Object.entries(externalTokens)) {
      this.externalTokens[symbol] = new ERC20(address, provider, symbol, decimal); // TODO: add decimal+
    }

    this.ARTH = new ERC20(deployments.ARTH.address, provider, 'ARTH');
    this.MAHA = new ERC20(deployments.MahaToken.address, provider, 'MAHA');
    this.ARTHB = new ERC20(deployments.ARTHB.address, provider, 'ARTHB');
    this.DAI = new ERC20(deployments.DAI.address, provider, 'DAI');

    this.multicall = new Multicall(cfg.defaultProvider, deployments.Multicall.address)

    // Uniswap V2 Pair

    this.arthDai = new UniswapPair(
      deployments.ArthDaiMLP.address,
      provider,
      'ARTH-DAI-LP'
    );

    this.arthEth = new UniswapPair(
      deployments.ArthEthMLP.address,
      provider,
      'ARTH-ETH-LP'
    );

    this.mahaEth = new UniswapPair(
      deployments.MahaEthLP.address,
      provider,
      'MAHA-ETH'
    );

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
    const tokens = [this.ARTH, this.MAHA, this.ARTHB, this.DAI, this.arthDai, this.arthEth, ...Object.values(this.externalTokens)];
    for (const token of tokens) {
      token.connect(this.signer);
    }

    console.log(`🔓 Wallet is unlocked. Welcome, ${account}!`);
    this.fetchBoardroomVersionOfUser()
      .then((version) => (this.boardroomVersionOfUser = version))
      .catch((err) => {
        console.error(`Failed to fetch boardroom version: ${err.stack}`);
        this.boardroomVersionOfUser = 'latest';
      });

    // this.multicall.addCalls([
    //   {
    //     key: 'BALANCE_OF_ARTH',
    //     target: this.ARTH.address,
    //     call: ['balanceOf(address)(uint256)', this.myAccount],
    //     convertResult: val => val / 10 ** 18
    //   }, {
    //     key: 'BALANCE_OF_ARTHB',
    //     target: this.ARTHB.address,
    //     call: ['balanceOf(address)(uint256)', this.myAccount],
    //     convertResult: val => val / 10 ** 18
    //   }, {
    //     key: 'BALANCE_OF_MAHA',
    //     target: this.MAHA.address,
    //     call: ['balanceOf(address)(uint256)', this.myAccount],
    //     convertResult: val => val / 10 ** 18
    //   }, {
    //     key: 'BALANCE_OF_DAI',
    //     target: this.DAI.address,
    //     call: ['balanceOf(address)(uint256)', this.myAccount],
    //     convertResult: val => val / 10 ** 18
    //   }
    // ])
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }

  getBoardrooms: () => ['arth', 'arthUniLiquidity', 'arthMlpLiquidity', 'mahaLiquidity']


  getBoardroom(kind: Boardrooms, version: BoardroomVersion): BoardroomInfo {
    const contract = this.boardroomByVersion(kind, version)

    if (kind === 'arth' || kind === 'arthArth' || kind === 'arthMaha') return {
      kind,
      contract,
      address: contract.address,
      depositTokenName: 'ARTH_DAI',
      earnTokenName: 'ARTH',
      seionrageSupplyPercentage: 20,
      history7dayAPY: 30,
      lockInPeriodDays: 5,
    }

    // if (kind === 'maha') return {
    //   kind: 'maha',
    //   contract,
    //   address: contract.address,
    //   depositTokenName: 'MAHA',
    //   earnTokenName: 'ARTH',
    //   seionrageSupplyPercentage: 20,
    //   history7dayAPY: 30,
    //   lockInPeriodDays: 5,
    // }

    if (kind === 'mahaLiquidity')
      return {
        kind,
        contract,
        address: contract.address,
        depositTokenName: 'MAHA_ETH-UNI-LPv2',
        earnTokenName: 'ARTH',
        seionrageSupplyPercentage: 10,
        history7dayAPY: 30,
        lockInPeriodDays: 1,
      }

    if (kind === 'arthMlpLiquidity')
      return {
        kind,
        contract,
        address: contract.address,
        depositTokenName: 'ARTH_DAI-MLP-LPv1',
        earnTokenName: 'ARTH',
        seionrageSupplyPercentage: 70,
        history7dayAPY: 30,
        lockInPeriodDays: 1,
      }

    return {
      kind: 'arthUniLiquidity',
      contract,
      address: contract.address,
      depositTokenName: 'ARTH_DAI-UNI-LPv2',
      earnTokenName: 'ARTH',
      seionrageSupplyPercentage: 60,
      history7dayAPY: 30,
      lockInPeriodDays: 1,
    }
  }

  getBoardroomV2(kind: BoardroomsV2): BoardroomInfoV2 {
    const contract = this.boardroomByVersion(kind, 'v2')

    if (kind === 'arthArth' || kind === 'arthMaha' || kind === 'arthArthDaiLiquidity' || kind === 'arthArthEthLiquidity') return {
      kind,
      contract,
      address: contract.address,
      earnTokenName: 'ARTH',
      vestingPeriodHours: 8
    }

    return {
      kind,
      contract,
      address: contract.address,
      earnTokenName: 'MAHA',
      vestingPeriodHours: 8
    }
  }

  getBoardroomVault(kind: Vaults): VaultInfo {
    const contract = (() => {
      if (kind === 'arth') return this.contracts.VaultArth;
      if (kind === 'arthDaiLiquidity') return this.contracts.VaultArthDaiMlp;
      if (kind === 'arthEthLiquidity') return this.contracts.VaultArthEthMlp;
      return this.contracts.VaultMaha;
    })()

    if (kind === 'arth') return {
      kind: Vaults.arth,
      contract,
      address: contract.address,
      depositTokenName: 'ARTH',
      seionrageSupplyPercentage: 20,
      lockInPeriodDays: 5,

      arthBoardroom: 'arthArth',
      mahaBoardroom: 'mahaArth',
    }

    if (kind === 'maha')
      return {
        kind: Vaults.maha,
        contract,
        address: contract.address,
        depositTokenName: 'MAHA',
        seionrageSupplyPercentage: 20,
        lockInPeriodDays: 5,
        arthBoardroom: 'arthMaha',
        mahaBoardroom: 'mahaMaha',
      }

    if (kind === 'arthEthLiquidity')
      return {
        kind: Vaults.arthEthLiquidity,
        contract,
        address: contract.address,
        depositTokenName: 'ARTH_ETH-MLP-LPv1',
        seionrageSupplyPercentage: 10,
        lockInPeriodDays: 1,
        arthBoardroom: 'arthArthEthLiquidity',
        mahaBoardroom: 'mahaArthEthLiquidity',
      }

    return {
      kind: Vaults.arthDaiLiquidity,
      contract,
      address: contract.address,
      depositTokenName: 'ARTH_DAI-MLP-LPv1',
      seionrageSupplyPercentage: 50,
      lockInPeriodDays: 1,
      arthBoardroom: 'arthArthDaiLiquidity',
      mahaBoardroom: 'mahaArthDaiLiquidity',
    }
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
  async getCashStat(): Promise<TokenStat> {
    return {
      priceInDAI: await this.getTokenPriceFromPair(this.arthDai, this.ARTH),
      totalSupply: await this.ARTH.displayedTotalSupply(),
    };
  }

  /**
   * @returns Estimated ARTH (ARTH) price data,
   * calculated by 1-day Time-Weight Averaged Price (TWAP).
   */
  async getCashPriceInEstimatedTWAP(): Promise<BigNumber> {
    const { TWAP12hrOracle } = this.contracts;

    // estimate current TWAP price
    let cumulativePrice: BigNumber
    let cumulativePriceLast: BigNumber

    if ((await this.arthDai.token0()).toLowerCase() !== this.ARTH.address.toLowerCase()) {
      cumulativePrice = await this.arthDai.price1CumulativeLast();
      cumulativePriceLast = await TWAP12hrOracle.price1CumulativeLast();
    } else {
      cumulativePrice = await this.arthDai.price0CumulativeLast();
      cumulativePriceLast = await TWAP12hrOracle.price0CumulativeLast();
    }

    const elapsedSec = Math.floor(Date.now() / 1000 - (await TWAP12hrOracle.blockTimestampLast()));

    const denominator112 = BigNumber.from(2).pow(112);
    const denominator1e18 = BigNumber.from(10).pow(18);
    const cashPriceTWAP = cumulativePrice
      .sub(cumulativePriceLast)
      .mul(denominator1e18)
      .div(elapsedSec)
      .div(denominator112);

    return cashPriceTWAP
  }

  async getTargetPrice(): Promise<BigNumber> {
    const { GMUOracle } = this.contracts;
    return GMUOracle.getPrice();
  }

  async getCashPriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    const fn = Treasury.get12hrTWAPOraclePrice || Treasury.getSeigniorageOraclePrice
    return fn();
  }

  async getBondOraclePriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    const fn = Treasury.get1hrTWAPOraclePrice || Treasury.getBondOraclePrice
    return fn();
  }

  async getBondStat(): Promise<TokenStat> {
    return {
      priceInDAI: BigNumber.from(0), // await this.getTokenPriceFromUniswap(this.ARTHB),
      totalSupply: await this.ARTHB.displayedTotalSupply(),
    };
  }

  async getShareStat(): Promise<TokenStat> {
    return {
      priceInDAI: await this.getTokenPriceFromCoingecko(this.MAHA),
      totalSupply: '1007483', // await this.MAHA.displayedTotalSupply(),
    };
  }

  async getTokenPriceFromPair(pair: UniswapPair, forToken: ERC20): Promise<BigNumber> {
    await this.provider.ready;

    const token0 = await pair.token0()
    const [r0, r1] = await pair.reserves()
    const decimals = BigNumber.from(10).pow(18);

    if (token0.toLowerCase() === forToken.address.toLowerCase()) return r1.mul(decimals).div(r0)
    return r0.mul(decimals).div(r1)
  }

  async getTokenPriceFromCoingecko(tokenContract: ERC20): Promise<BigNumber> {
    await this.provider.ready;

    const decimals = BigNumber.from(10).pow(18);

    try {
      const result = await fetch(`https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokenContract.address}&vs_currencies=usd`)
      const json = await result.json()
      return BigNumber.from(Number(json[tokenContract.address.toLowerCase()].usd)).mul(decimals)
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }

    return BigNumber.from(0)
  }

  async estimateAmountOutFromUniswap(amountIn: number, path: ERC20[]): Promise<BigNumber> {
    await this.provider.ready;

    if (amountIn <= 0) return BigNumber.from(0)

    const denominator1e18 = BigNumber.from(10).pow(18).mul(Math.floor(amountIn));
    const adjustedAmount = BigNumber.from(1).mul(denominator1e18)

    const UniswapV2Library = new Contract(
      this.config.deployments.UniswapV2Router02.address,
      UniswapV2Router02ABI,
      this.provider,
    )

    try {
      const result: BigNumber[] = await UniswapV2Library.getAmountsOut(adjustedAmount, path.map(p => p.address))
      return result[result.length - 1]
    } catch (error) {
      console.log('Uniswap estimation error', error)
    }

    return BigNumber.from(0)
  }

  /**
   * Buy bonds with cash.
   * @param amount amount of cash to purchase bonds with.
   */
  async buyBonds(amount: string | number): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    return await Treasury.buyBonds(decimalToBalance(amount), await this.getBondOraclePriceInLastTWAP());
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

  boardroomByVersion(kind: Boardrooms, version: BoardroomVersion): Contract {
     if (version === 'v2') {
      if (kind === 'arthArth') return this.contracts.ArthArthBoardroomV2;
      if (kind === 'arthMaha') return this.contracts.ArthMahaBoardroomV2;
      if (kind === 'mahaArth') return this.contracts.MahaArthBoardroomV2;
      if (kind === 'mahaMaha') return this.contracts.MahaMahaBoardroomV2;
      if (kind === 'mahaArthDaiLiquidity') return this.contracts.MahaArthMlpLiquidityBoardroomV2;
      if (kind === 'arthArthDaiLiquidity') return this.contracts.ArthArthMlpLiquidityBoardroomV2;
      if (kind === 'mahaArthEthLiquidity') return this.contracts.MahaArthEthLiquidityBoardroomV2;
      if (kind === 'arthArthEthLiquidity') return this.contracts.ArthArthEthLiquidityBoardroomV2;
      return this.contracts.ArthArthMlpLiquidityBoardroomV2;
    }

    if (kind === 'arthUniLiquidity') return this.contracts.ArthLiquidityBoardroomV1;
    if (kind === 'mahaLiquidity') return this.contracts.MahaLiquidityBoardroomV1;
    return this.contracts.ArthBoardroomV1;
  }

  currentBoardroom(kind: Boardrooms, version: BoardroomVersion): Contract {
    return this.boardroomByVersion(kind, version);
  }

  isOldBoardroomMember(): boolean {
    return this.boardroomVersionOfUser !== 'latest';
  }

  async stakeShareToBoardroom(kind: Boardrooms, amount: string, version: BoardroomVersion): Promise<TransactionResponse> {
    if (this.isOldBoardroomMember()) {
      throw new Error("you're using old ArthBoardroom. please withdraw and deposit the MAHA again.");
    }
    const boardroom = this.currentBoardroom(kind, version);

    if (version === 'v1') return await boardroom.stake(decimalToBalance(amount));
    return await boardroom.bond(decimalToBalance(amount));
  }

  async getStakedSharesOnBoardroom(kind: Boardrooms, version: BoardroomVersion): Promise<BigNumber> {
    const boardroom = this.currentBoardroom(kind, version);
    return await boardroom.balanceOf(this.myAccount);
  }

  async getEarningsOnBoardroom(kind: Boardrooms, version: BoardroomVersion): Promise<BigNumber> {
    const boardroom = this.currentBoardroom(kind, version);
     return await boardroom.earned(this.myAccount);
  }


  async getClaimableEarningsOnBoardroomV2(kind: BoardroomsV2, version: BoardroomVersion): Promise<BigNumber> {
    const boardroom = this.getBoardroom(kind, version);
    return await boardroom.contract.earned(this.myAccount);
  }

  async withdrawShareFromBoardroomV2(kind: BoardroomsV2, version: BoardroomVersion): Promise<TransactionResponse> {
    const boardroom = this.currentBoardroom(kind, version);
    return await boardroom.withdraw();
  }

  async withdrawShareFromBoardroomV1(kind: Boardrooms, amount: string): Promise<TransactionResponse> {
    const boardroom = this.currentBoardroom(kind, 'v1');
    return await boardroom.withdraw(decimalToBalance(amount));
  }

  async unbondShareFromBoardroom(kind: Boardrooms, amount: string): Promise<TransactionResponse> {
    const boardroom = this.currentBoardroom(kind, 'v2');
    return await boardroom.unbond(decimalToBalance(amount));
  }

  async harvestCashFromBoardroom(kind: BoardroomsV2, version: BoardroomVersion): Promise<TransactionResponse> {
    const boardroom = this.getBoardroomV2(kind);
    return await boardroom.contract.claimReward();
  }

  async exitFromBoardroom(kind: Boardrooms, version: BoardroomVersion): Promise<TransactionResponse> {
    const boardroom = this.currentBoardroom(kind, version);
    return await boardroom.exit();
  }

  async getTreasuryEstimateBondsToIssue(price: BigNumber): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    const est = await Treasury.estimateSeignorageToMint(price);
    return est
  }

  async getTreasury() {
    const { Treasury } = this.contracts;
    return Treasury
  }

  async getTreasuryEstimateSeignorageToMint(price: BigNumber): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    const est = await Treasury.estimateSeignorageToMint(price);
    return est
  }

  async getTreasuryNextAllocationTime(): Promise<TreasuryAllocationTime> {
    const { Treasury } = this.contracts;
    const nextEpochTimestamp: BigNumber = await Treasury.nextEpochPoint();
    const period: BigNumber = await Treasury.getPeriod();
    const currentEpoch: BigNumber = await Treasury.getCurrentEpoch();

    const nextAllocation = new Date(nextEpochTimestamp.mul(1000).toNumber());
    const prevAllocation = new Date(nextAllocation.getTime() - period.toNumber() * 1000);

    return { prevAllocation, nextAllocation, currentEpoch: 1 + currentEpoch.toNumber() };
  }
}
