// import { ChainId } from '@pancakeswap-libs/sdk';
// import { ChainId } from '@traderjoe-xyz/sdk';
import { ChainId } from '@madmeerkat/sdk';
import { Configuration } from './tomb-finance/config';
import { BankInfo } from './tomb-finance';

const configurations: { [env: string]: Configuration } = {
  production: {
    chainId: ChainId.MAINNET,
    networkName: 'cronos',
    ftmscanUrl: 'https://cronoscan.com', // https://cronos.org/explorer/testnet3/ // https://cronoscan.com/
    defaultProvider: 'https://evm.cronos.org', // https://evm.cronos.org/
    deployments: require('./tomb-finance/deployments/deployments.mainnet.json'),
    externalTokens: {
      WCRO: ['0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23', 18],
      SNOW: ['0x05a3F4E0ad6580D9d977F5eE12F168620f4F71e9', 18],
      SBOND: ['0x66608790511b4d7B5f179d3b65f68A3Aa42347b0', 18],
      GLCR: ['0xbe27f32D9F731CC9DddAfE3ddaA7CBBC0f58b414', 18],
      USDC: ['0xc21223249CA28397B4B6541dfFaEcC539BfF0c59', 6],
      USDT: ['0x66e428c3f67a68878562e79A0234c1F83c208770', 6],
      WFTM: ['0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23', 18], // router WETH
      WBTC: ['0x062E66477Faf219F25D27dCED647BF57C3107d52', 8],
      WETH: ['0xe44Fd7fCb2b1581822D0c862B68222998a0c299a', 18],
      DAI: ['0xF2001B145b43032AAF5Ee2884e456CCd805F677D', 18],
      SNOW_USDC_LP: ['0xbFCF9D86CFb0E1E58F63F7e0b9861A4Db204D3a7', 18],
      GLCR_USDC_LP: ['0xB4586CAb2e3Aa47A3586854AfD35592a78D62cF3', 18],
    },
    baseLaunchDate: new Date('2022-10-31T00:00:00Z'),
    bondLaunchesAt: new Date('2022-10-31T00:00:00Z'),
    masonryLaunchesAt: new Date('2022-11-01T18:00:00Z'),
    refreshInterval: 10000,
  },
  development: {
    chainId: ChainId.TESTNET,
    networkName: 'cronos-testnet',
    ftmscanUrl: 'https://testnet.cronoscan.com/', // https://cronos.org/explorer/testnet3/ // https://cronoscan.com/
    defaultProvider: 'https://evm-t3.cronos.org', // https://evm.cronos.org/
    deployments: require('./tomb-finance/deployments/deployments.testnet.json'),
    externalTokens: {
      WCRO: ['0x0A293560E05eb5A62d9AED0dA043CDe17056C83e', 18],
      SNOW: ['0x4F79bb07123d133C4eB82174014DC58585Cb7f68', 18],
      SBOND: ['0x96f684a51A6359337Cb5BB3CE1E7B89BfF93d02f', 18],
      GLCR: ['0xcBa7B6E4888400a2D73036d2c7b8E1d63d529654', 18],
      USDC: ['0xc3F95DeDacFEA28a3d657FfbCc74e9BaB6FB949B', 6],
      USDT: ['0x1060131f1Ac799D3fcd94fa73014e61AcFf30C7B', 6],
      WFTM: ['0x6a3173618859C7cd40fAF6921b5E9eB6A76f1fD4', 18], // router WETH
      WBTC: ['0x8915C13CD83dbA690e1B7513a4283d66fb0B12Ca', 8],
      WETH: ['0xa0584d1fCe56C22186Ac1aE0E160940D79373a5c', 18],
      DAI: ['0x9e62f654877573Aa2b5908db223019eEF767D04c', 18],
      SNOW_USDC_LP: ['0xEF0a44354D844f8Fc8985dA49083e529aFE277Ba', 18],
      GLCR_USDC_LP: ['0xDbE23e156d1085b3579D837E60dd936C622113Ee', 18],
    },
    baseLaunchDate: new Date('2022-11-05T00:00:00Z'),
    bondLaunchesAt: new Date('2022-11-05T00:00:00Z'),
    masonryLaunchesAt: new Date('2022-11-06T18:00:00Z'),
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
        - 1 = LP asset staking rewarding SNOW
        - 2 = LP asset staking rewarding GLCR
  contract: the contract name which will be loaded from the deployment.environmnet.json
  depositTokenName : the name of the token to be deposited
  earnTokenName: the rewarded token
  finished: will disable the pool on the UI if set to true
  sort: the order of the pool
  */
  /*
  SNOW GENESIS pools
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
    poolId: 4,
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
    poolId: 1,
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
    poolId: 5,
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
    poolId: 2,
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
    poolId: 3,
    sectionInUI: 0,
    contract: 'SnowUsdtGenesisRewardPool',
    depositTokenName: 'USDT',
    earnTokenName: 'SNOW',
    finished: false,
    sort: 6,
    closedForStaking: false,
  },
  /*
  GLCR farming pool
 */
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
  /*
  REBATE Treasury
 */
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
  /*
  NODES
 */
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

export default configurations[/*process.env.NODE_ENV || */ 'development'];
