import ARTHContracts from './contracts'
import * as vfat from './helpers'
import { getDefaultProvider } from '../utils/provider'
import { BaseProvider } from '@ethersproject/providers'
import * as ethcall from 'ethcall';

let vfatApp: IVFatApp

export interface IVFatApp {
    provider: BaseProvider
    YOUR_ADDRESS: string,
    ethcallProvider: ethcall.Provider

    getAPYFromPool: (contractName: string) => Promise<{
        weeklyAPY: number;
        dailyAPY: number;
        yearlyAPY: number;
        staked_tvl: number;
    }>
}

export interface IVFatAPY {
    weeklyAPY: number;
    dailyAPY: number;
    yearlyAPY: number;
    staked_tvl: number;
}

var tokens = {};
var prices = {
    // '0x0E3cC2c4FB9252d17d07C67135E48536071735D9': {usd: 2.1}
};

export const getAPYFromPool = (contractName: string) => {
    const contract = ARTHContracts.find(c => c.name === contractName);
    // loadSynthetixPoolInfo(App, tokens, prices, p.abi, p.address, p.rewardTokenFunction, p.stakeTokenFunction)));
    return vfat.loadSynthetixPool(vfatApp, tokens, prices, contract.abi, contract.address, contract.rewardTokenFunction, contract.stakeTokenFunction)
}


export const init = async (): Promise<IVFatApp> => {
    if (vfatApp) return
    const vfatAppDum = await vfat.init_ethers(getDefaultProvider())
    vfatApp = {
        ...vfatAppDum,
        getAPYFromPool
    }

    return vfatApp
}
