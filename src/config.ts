// import { ChainId } from '@pancakeswap-libs/sdk';
// import { ChainId } from '@traderjoe-xyz/sdk';
import { ChainId } from '@madmeerkat/sdk';
import { Configuration } from './tomb-finance/config';
import { BankInfo } from './tomb-finance';

const configurations: { [env: string]: Configuration } = {
  production: {
    chainId: ChainId.TESTNET,
    networkName: 'cronos-testnet',
    ftmscanUrl: 'https://testnet.cronoscan.com/',
    defaultProvider: 'https://evm-t3.cronos.org',
    deployments: require('./tomb-finance/deployments/deployments.mainnet.json'),
    externalTokens: {
      WCRO: ['0x6a3173618859C7cd40fAF6921b5E9eB6A76f1fD4', 18], 
      SNOW: ['0x72a5Cdd48908AE4E3cb07AC379aB238004251dCa', 18],
      SBOND: ['0x37cd1678C86A190BF4e41a4005Cf0662E6AAA688', 18],
      GLCR: ['0x2cC136019AF0c7e855459B3929D17707820a410B', 18],
      USDC: ['0x39D8fa99c9964D456b9fbD5e059e63442F314121', 6],
      USDT: ['0xf1852356be8aD76dAAD31acEB55018Dd87961109', 18],
      WFTM: ['0x6a3173618859C7cd40fAF6921b5E9eB6A76f1fD4', 18],
      WBTC: ['0xB5294e29A6e4CbFbb269a6240313b593190ef544', 18],
      WETH: ['0x1e8B3db284ef89E19Bc8edb7A0c5246be288a824', 18],
      DAI: ['0x4b23dfd7e925b543E4354A5D4eA8AD47699e6f12', 6],
      'SNOW-USDC-LP': ['0xE2A1207be9E08E212d0EFe0Fc628A4367361A065', 18],
      'GLCR-USDC-LP': ['0x549fa6e6c0F23D42B34403E586c614c52360b4A9', 18]
    },
    baseLaunchDate: new Date('2022-05-14T18:00:00Z'),
    bondLaunchesAt: new Date('2022-05-15T09:00:00Z'),
    masonryLaunchesAt: new Date('2022-05-15T09:00:00Z'),
    refreshInterval: 10000,
  },
};

export const bankDefinitions: { [contractName: string]: BankInfo } = {
  /*
  Explanation:
  name: description of the card
  poolId: the poolId assigned in the contract
  sectionInUI: way to distinguish in which of the 3 pool groups it should be listed
        - 0 = Single asset stake pools
        - 1 = LP asset staking rewarding TOMB
        - 2 = LP asset staking rewarding TSHARE
  contract: the contract name which will be loaded from the deployment.environmnet.json
  depositTokenName : the name of the token to be deposited
  earnTokenName: the rewarded token
  finished: will disable the pool on the UI if set to true
  sort: the order of the pool
  */
  SnowBtcGenesisRewardPool: {
    name: 'Earn SNOW by wBTC',
    poolId: 0,
    sectionInUI: 0,
    contract: 'SnowBtcGenesisRewardPool',
    depositTokenName: 'WBTC',
    earnTokenName: 'SNOW',
    finished: false,
    sort: 1,
    closedForStaking: false,
  },
  SnowEthGenesisRewardPool: {
    name: 'Earn SNOW by wETH',
    poolId: 1,
    sectionInUI: 0,
    contract: 'SnowEthGenesisRewardPool',
    depositTokenName: 'WETH',
    earnTokenName: 'SNOW',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  SnowCroGenesisRewardPool: {
    name: 'Earn SNOW by wCRO',
    poolId: 2,
    sectionInUI: 0,
    contract: 'SnowCroGenesisRewardPool',
    depositTokenName: 'WCRO',
    earnTokenName: 'SNOW',
    finished: false,
    sort: 5,
    closedForStaking: false,
  },
  SnowUsdcGenesisRewardPool: {
    name: 'Earn SNOW by USDC',
    poolId: 3,
    sectionInUI: 0,
    contract: 'SnowUsdcGenesisRewardPool',
    depositTokenName: 'USDC',
    earnTokenName: 'SNOW',
    finished: false,
    sort: 6,
    closedForStaking: false,
  },
  SnowDAIGenesisRewardPool: {
    name: 'Earn SNOW by DAI',
    poolId: 4,
    sectionInUI: 0,
    contract: 'SnowDaiGenesisRewardPool',
    depositTokenName: 'DAI',
    earnTokenName: 'SNOW',
    finished: false,
    sort: 7,
    closedForStaking: false,
  },
  SnowUsdtGenesisRewardPool: {
    name: 'Earn SNOW by USDT',
    poolId: 5,
    sectionInUI: 0,
    contract: 'SnowUsdtGenesisRewardPool',
    depositTokenName: 'USDT',
    earnTokenName: 'SNOW',
    finished: false,
    sort: 8,
    closedForStaking: false,
  },
  SnowUsdcLPGlcrRewardPool: {
    name: 'Earn GLCR by SNOW-USDC LP',
    poolId: 0,
    sectionInUI: 2,
    contract: 'SnowUsdcLPGlcrRewardPool',
    depositTokenName: 'SNOW-USDC-LP',
    earnTokenName: 'GLCR',
    finished: false,
    sort: 1,
    closedForStaking: false,
  },
  GlcrUsdcLPGlcrRewardPool: {
    name: 'Earn GLCR by GLCR-USDC LP',
    poolId: 1,
    sectionInUI: 2,
    contract: 'GlcrUsdcLPGlcrRewardPool',
    depositTokenName: 'GLCR-USDC-LP',
    earnTokenName: 'GLCR',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  CroRebate: {
    name: 'Bond CRO for SNOW',
    poolId: 100,
    sectionInUI: 3,
    contract: 'RebateTreasury',
    depositTokenName: 'WCRO',
    earnTokenName: 'SNOW',
    finished: false,
    sort: 3,
    closedForStaking: false,
  },
  UsdcRebate: {
    name: 'Bond USDC for SNOW',
    poolId: 100,
    sectionInUI: 3,
    contract: 'RebateTreasury',
    depositTokenName: 'USDC',
    earnTokenName: 'SNOW',
    finished: false,
    sort: 4,
    closedForStaking: false,
  },
  PegLPNode: {
    name: 'Generate SNOW-USDC LP with Nodes',
    poolId: 0,
    sectionInUI: 4,
    contract: 'PegLPNode',
    depositTokenName: 'SNOW-USDC-LP',
    earnTokenName: 'SNOW-USDC-LP',
    finished: false,
    sort: 6,
    closedForStaking: false
   },
   ShareLPNode: {
    name: 'Generate GLCR-USDC LP with Nodes',
    poolId: 0,
    sectionInUI: 4,
    contract: 'ShareLPNode',
    depositTokenName: 'GLCR-USDC-LP',
    earnTokenName: 'GLCR-USDC-LP',
    finished: false,
    sort: 6,
    closedForStaking: false
   }
};

export default configurations[/*process.env.NODE_ENV || */'production'];
