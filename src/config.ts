// import { ChainId } from '@pancakeswap-libs/sdk';
// import { ChainId } from '@traderjoe-xyz/sdk';
import { ChainId } from '@madmeerkat/sdk';
import { Configuration } from './tomb-finance/config';
import { BankInfo } from './tomb-finance';

const configurations: { [env: string]: Configuration } = {
  production: {
    chainId: ChainId.TESTNET,
    networkName: 'cronos-testnet',
    ftmscanUrl: 'https://testnet.cronoscan.com/', // https://cronos.org/explorer/testnet3/ // https://cronoscan.com/
    defaultProvider: 'https://evm-t3.cronos.org', // https://evm.cronos.org/
    deployments: require('./tomb-finance/deployments/deployments.mainnet.json'),
    externalTokens: {
      WCRO: ['0x0A293560E05eb5A62d9AED0dA043CDe17056C83e', 18],
      SNOW: ['0xDd5a54be18BC4a9D181D70Ab5728E42031Be836b', 18],
      SBOND: ['0xdF224aA5BB984a1c49F227D9D3e952D339cD200A', 18],
      GLCR: ['0x6C8afC3EEe9bc98bAa8327Fac1073bE1c8B23729', 18],
      USDC: ['0xc3F95DeDacFEA28a3d657FfbCc74e9BaB6FB949B', 6],
      USDT: ['0x1060131f1Ac799D3fcd94fa73014e61AcFf30C7B', 6],
      WFTM: ['0x6a3173618859C7cd40fAF6921b5E9eB6A76f1fD4', 18], // router WETH
      WBTC: ['0x8915C13CD83dbA690e1B7513a4283d66fb0B12Ca', 8],
      WETH: ['0xa0584d1fCe56C22186Ac1aE0E160940D79373a5c', 18],
      DAI: ['0x9e62f654877573Aa2b5908db223019eEF767D04c', 18],
      'SNOW-USDC-LP': ['0xd02Bf39EB5BBebE42Aa0f12Bc2a5a5995627EDB0', 18],
      'GLCR-USDC-LP': ['0x53c2F7E378879395d5F2a0dD7bD95eF89EF4C564', 18],
    },
    baseLaunchDate: new Date('2022-10-29T00:00:00Z'),
    bondLaunchesAt: new Date('2022-10-29T00:00:00Z'),
    masonryLaunchesAt: new Date('2022-10-30T18:00:00Z'),
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
