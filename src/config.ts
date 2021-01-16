import { ChainId } from '@uniswap/sdk';
import { Configuration } from './basis-cash/config';
import { BankInfo } from './basis-cash';

const configurations: { [env: string]: Configuration } = {
  development: {
    chainId: 1337,
    etherscanUrl: 'https://etherscan.io',
    defaultProvider: 'http://127.0.0.1:7545',
    deployments: require('./basis-cash/deployments/deployments.development.json'),
    externalTokens: {
      'DAI': ['0x74794D95c38A0cb436F4a1143Cc9D1f57D8bD692', 18],
      'MKR': ['0x74794D95c38A0cb436F4a1143Cc9D1f57D8bD692', 18],
      'SHARE': ['0x74794D95c38A0cb436F4a1143Cc9D1f57D8bD692', 18],
      'COMP': ['0x74794D95c38A0cb436F4a1143Cc9D1f57D8bD692', 18],
      'ESD': ['0x74794D95c38A0cb436F4a1143Cc9D1f57D8bD692', 18],
      'MAHA_ETH-NI-LPv2': ['0x74794D95c38A0cb436F4a1143Cc9D1f57D8bD692', 18],
      'SUSHI': ['0x74794D95c38A0cb436F4a1143Cc9D1f57D8bD692', 18],
      'CURVE': ['0x74794D95c38A0cb436F4a1143Cc9D1f57D8bD692', 18],
      'FRAX': ['0x74794D95c38A0cb436F4a1143Cc9D1f57D8bD692', 18],
      'MAHA': ['0x74794D95c38A0cb436F4a1143Cc9D1f57D8bD692', 18],
      'YFI': ['0x74794D95c38A0cb436F4a1143Cc9D1f57D8bD692', 18],
      'DSD': ['0x74794D95c38A0cb436F4a1143Cc9D1f57D8bD692', 18],
      'MATIC': ['0x74794D95c38A0cb436F4a1143Cc9D1f57D8bD692', 18],
      'RSR': ['0x74794D95c38A0cb436F4a1143Cc9D1f57D8bD692', 18],

      'ARTH_DAI-UNI-LPv2': ['0x41284a876508E19d80339f9F8935eF24235E5852', 18]
    },
    uniswapRouter: '0x4dC2c34dE248aE0c8FC9091C503729409b94E5db',

    baseLaunchDate: new Date('2021-01-20T15:00:00Z'),
    bondLaunchesAt: new Date('2021-01-20T15:00:00Z'),
    boardroomLaunchesAt: new Date('2021-01-20T15:00:00Z'),
    refreshInterval: 10000,
    gasLimitMultiplier: 1.1,
  },
  staging: {
    chainId: ChainId.ROPSTEN,
    etherscanUrl: 'https://ropsten.etherscan.io',
    defaultProvider: 'https://weathered-young-wave.quiknode.io/75809a67-435c-4d8b-a287-649990316295/IHZHq4dJhpdQq85_QIA5Uidl_btMGwikH8tF3VNPZsgoFhaetWDXXdmkavW1TaTf5JrVwFWnMsx8aJ-fR01pTg==/',
    deployments: require('./basis-cash/deployments/deployments.ropsten.json'),
    externalTokens: {
      DAI: ['0x760AE87bBCEFa2CF76B6E0F9bCe80c1408764936', 18],
      yCRV: ['0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8', 18],
      SUSD: ['0x57Ab1E02fEE23774580C119740129eAC7081e9D3', 18],

      USDC: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6],
      USDT: ['0xdAC17F958D2ee523a2206206994597C13D831ec7', 6],
      'ARTH_DAI-UNI-LPv2': ['0x80189479C870D3808BcDE2BFDB5d70a9EbD9fECd', 18],
    },
    uniswapRouter: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    baseLaunchDate: new Date('2020-11-26T00:00:00Z'),
    bondLaunchesAt: new Date('2021-01-20T15:00:00Z'),
    boardroomLaunchesAt: new Date('2021-01-20T15:00:00Z'),
    refreshInterval: 10000,
    gasLimitMultiplier: 1.1,
  },
  production: {
    chainId: ChainId.MAINNET,
    etherscanUrl: 'https://etherscan.io',
    defaultProvider: 'https://ancient-young-wave.quiknode.io/f13a565e-d520-49bb-8109-b6278531d848/TD7pzD7xEEC-ppMyv475dYkhgEYWh-Ev4zyPEiGValWQ76lrBPMuGhoJjLflw3KRBvt1ytsJ4IrpXajUC5XbkQ==/',
    deployments: require('./basis-cash/deployments/deployments.mainnet.json'),
    externalTokens: {
      DAI: ['0x6B175474E89094C44Da98b954EedeAC495271d0F', 18],
      yCRV: ['0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8', 18],
      SUSD: ['0x57Ab1E02fEE23774580C119740129eAC7081e9D3', 18],
      USDC: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6],
      USDT: ['0xdAC17F958D2ee523a2206206994597C13D831ec7', 6],

      'BAC_DAI-UNI-LPv2': ['0xd4405F0704621DBe9d4dEA60E128E0C3b26bddbD', 18],
      'BAS_DAI-UNI-LPv2': ['0x0379dA7a5895D13037B6937b109fA8607a659ADF', 18],
    },

    uniswapRouter: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',

    baseLaunchDate: new Date('2021-01-15T14:00:00Z'),
    bondLaunchesAt: new Date('2021-01-21T15:00:00Z'),
    boardroomLaunchesAt: new Date('2021-01-21T15:00:00Z'),
    refreshInterval: 30000,
    gasLimitMultiplier: 1.7,
  },
};

export const bankDefinitions: { [contractName: string]: BankInfo } = {
  ARTHBASPool: {
    name: 'Deposit $DAI and Earn $ARTH',
    contract: 'ARTHBASPool',
    depositTokenName: 'DAI',
    earnTokenName: 'ARTH',
    finished: false,
    sort: 3,
  },
  ARTHMKRPool: {
    name: 'Deposit $MKR and Earn $ARTH',
    contract: 'ARTHMKRPool',
    depositTokenName: 'MKR',
    earnTokenName: 'ARTH',
    finished: false,
    sort: 3,
  },
  ARTHSHAREPool: {
    name: 'Deposit $SHARE and Earn $ARTH',
    contract: 'ARTHSHAREPool',
    depositTokenName: 'SHARE',
    earnTokenName: 'ARTH',
    finished: false,
    sort: 3,
  },
  ARTHCOMPool: {
    name: 'Deposit $COMP and Earn $ARTH',
    contract: 'ARTHCOMPool',
    depositTokenName: 'COMP',
    earnTokenName: 'ARTH',
    finished: false,
    sort: 3,
  },
  ARTHESDPool: {
    name: 'Deposit $ESD and Earn $ARTH',
    contract: 'ARTHESDPool',
    depositTokenName: 'ESD',
    earnTokenName: 'ARTH',
    finished: false,
    sort: 3,
  },
  ARTHMahaEthLPPool: {
    name: 'Deposit $MAHA_ETH-UNI-LPv2 and Earn $ARTH',
    contract: 'ARTHMahaEthLPPool',
    depositTokenName: 'MAHA_ETH-UNI-LPv2',
    earnTokenName: 'ARTH',
    finished: false,
    sort: 2,
  },
  ARTHSUSHIPool: {
    name: 'Deposit $SUSHI and Earn $ARTH',
    contract: 'ARTHSUSHIPool',
    depositTokenName: 'SUSHI',
    earnTokenName: 'ARTH',
    finished: false,
    sort: 3,
  },
  ARTHCURVEPool: {
    name: 'Deposit $CURVE and Earn $ARTH',
    contract: 'ARTHCURVEPool',
    depositTokenName: 'CURVE',
    earnTokenName: 'ARTH',
    finished: false,
    sort: 3,
  },
  ARTHFRAXPool: {
    name: 'Deposit $FRAX and Earn $ARTH',
    contract: 'ARTHFRAXPool',
    depositTokenName: 'FRAX',
    earnTokenName: 'ARTH',
    finished: false,
    sort: 3,
  },
  ARTHMahaPool: {
    name: 'Deposit $MAHA and Earn $ARTH',
    contract: 'ARTHMahaPool',
    depositTokenName: 'MAHA',
    earnTokenName: 'ARTH',
    finished: false,
    sort: 2,
  },
  ARTHYFIPool: {
    name: 'Deposit $YFI and Earn $ARTH',
    contract: 'ARTHYFIPool',
    depositTokenName: 'YFI',
    earnTokenName: 'ARTH',
    finished: false,
    sort: 3,
  },
  ARTHDSDPool: {
    name: 'Deposit $DSD and Earn $ARTH',
    contract: 'ARTHDSDPool',
    depositTokenName: 'DSD',
    earnTokenName: 'ARTH',
    finished: false,
    sort: 3,
  },
  ARTHMATICPool: {
    name: 'Deposit $MATIC and Earn $ARTH',
    contract: 'ARTHMATICPool',
    depositTokenName: 'MATIC',
    earnTokenName: 'ARTH',
    finished: false,
    sort: 3,
  },
  ARTHRSRPool: {
    name: 'Deposit $RSR and Earn $ARTH',
    contract: 'ARTHRSRPool',
    depositTokenName: 'RSR',
    earnTokenName: 'ARTH',
    finished: false,
    sort: 3,
  },

  DAIARTHLPTokenSharePool: {
    name: 'Deposit $MAHA_ETH-UNI-LPv2 and Earn $MAHA',
    contract: 'DAIARTHLPTokenSharePool',
    depositTokenName: 'MAHA_ETH-UNI-LPv2',
    earnTokenName: 'MAHA',
    finished: false,
    sort: 1,
  },
  DAIBASLPTokenSharePool: {
    name: 'Deposit $ARTH_DAI-UNI-LPv2 and Earn $MAHA',
    contract: 'DAIARTHLPTokenSharePool',
    depositTokenName: 'ARTH_DAI-UNI-LPv2',
    earnTokenName: 'MAHA',
    finished: false,
    sort: 1,
  },
};

// export default configurations[process.env.NODE_ENV || "production"];
export default configurations["development"];