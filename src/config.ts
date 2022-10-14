// import { ChainId } from '@pancakeswap-libs/sdk';
// import { ChainId } from '@traderjoe-xyz/sdk';
import { ChainId } from '@madmeerkat/sdk';
import { Configuration } from './tomb-finance/config';
import { BankInfo } from './tomb-finance';

const configurations: { [env: string]: Configuration } = {
  production: {
    chainId: ChainId.TESTNET,
    networkName: 'cronos-testnet',
    ftmscanUrl: 'https://testnet.cronoscan.com/', // https://cronos.org/explorer/testnet3/
    defaultProvider: 'https://evm-t3.cronos.org',
    deployments: require('./tomb-finance/deployments/deployments.mainnet.json'),
    externalTokens: {
      WCRO: ['0x9c3C2124B5bcE1688D5F4C707e910F5E2fA6B056', 18],
      SNOW: ['0x6075433fDDef9D3aB7573765839E13d906879bb8', 18],
      SBOND: ['0xAF7965bFCF95c101890838ebe669565484FDD385', 18],
      GLCR: ['0x2a1764f110D65310D05B534e968A587b415D3219', 18],
      USDC: ['0x39D8fa99c9964D456b9fbD5e059e63442F314121', 6],
      USDT: ['0x3BE41FcDDC7914fbEf3635001b58e5571F7ddbb1', 6],
      WFTM: ['0x6a3173618859C7cd40fAF6921b5E9eB6A76f1fD4', 18],
      WBTC: ['0x111b84073280db412dE86b2252045e83604BA383', 18],
      WETH: ['0x4fB822330853F3442e50714bEB49576740DCa6e0', 18],
      DAI: ['0xe269eFacB96992DDaCda8C17ACc1411Cc22D484A', 18],
      'SNOW-USDC-LP': ['0xd69eE3cBdF99f6E92a5DC37A6076B399f6b4cDc2', 18],
      'GLCR-USDC-LP': ['0xc0819210274027b5185EB35d1a43de37f0666ADE', 18],
    },
    baseLaunchDate: new Date('2022-10-15T00:00:00Z'),
    bondLaunchesAt: new Date('2022-10-15T00:00:00Z'),
    masonryLaunchesAt: new Date('2022-10-16T18:00:00Z'),
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
  SnowUsdcGenesisRewardPool: {
    name: 'Earn SNOW by USDC',
    poolId: 0,
    sectionInUI: 0,
    contract: 'SnowUsdcGenesisRewardPool',
    depositTokenName: 'USDC',
    earnTokenName: 'SNOW',
    finished: false,
    sort: 1,
    closedForStaking: false,
  },
  SnowBtcGenesisRewardPool: {
    name: 'Earn SNOW by wBTC',
    poolId: 1,
    sectionInUI: 0,
    contract: 'SnowBtcGenesisRewardPool',
    depositTokenName: 'WBTC',
    earnTokenName: 'SNOW',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  SnowEthGenesisRewardPool: {
    name: 'Earn SNOW by wETH',
    poolId: 2,
    sectionInUI: 0,
    contract: 'SnowEthGenesisRewardPool',
    depositTokenName: 'WETH',
    earnTokenName: 'SNOW',
    finished: false,
    sort: 3,
    closedForStaking: false,
  },
  SnowCroGenesisRewardPool: {
    name: 'Earn SNOW by wCRO',
    poolId: 3,
    sectionInUI: 0,
    contract: 'SnowCroGenesisRewardPool',
    depositTokenName: 'WCRO',
    earnTokenName: 'SNOW',
    finished: false,
    sort: 4,
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
    sort: 5,
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
    sort: 6,
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
  DaoSnowRebateTreasury: {
    name: 'Bond USDC for SNOW',
    poolId: 100,
    sectionInUI: 3,
    contract: 'DaoSnowRebateTreasury',
    depositTokenName: 'USDC',
    earnTokenName: 'SNOW',
    finished: false,
    sort: 4,
    closedForStaking: false,
  },
  DaoGlcrRebateTreasury: {
    name: 'Bond USDC for SNOW',
    poolId: 100,
    sectionInUI: 3,
    contract: 'DaoGlcrRebateTreasury',
    depositTokenName: 'USDC',
    earnTokenName: 'GLCR',
    finished: false,
    sort: 4,
    closedForStaking: false,
  },
  DevSnowRebateTreasury: {
    name: 'Bond USDC for SNOW',
    poolId: 100,
    sectionInUI: 3,
    contract: 'DevSnowRebateTreasury',
    depositTokenName: 'USDC',
    earnTokenName: 'SNOW',
    finished: false,
    sort: 4,
    closedForStaking: false,
  },
  DevGlcrRebateTreasury: {
    name: 'Bond USDC for SNOW',
    poolId: 100,
    sectionInUI: 3,
    contract: 'DevGlcrRebateTreasury',
    depositTokenName: 'USDC',
    earnTokenName: 'GLCR',
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
    closedForStaking: false,
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
    closedForStaking: false,
  },
};

export default configurations[/*process.env.NODE_ENV || */ 'production'];
