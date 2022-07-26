// import { ChainId } from '@pancakeswap-libs/sdk';
// import { ChainId } from '@traderjoe-xyz/sdk';
import { ChainId } from '@madmeerkat/sdk';
import { Configuration } from './tomb-finance/config';
import { BankInfo } from './tomb-finance';

const configurations: { [env: string]: Configuration } = {
  production: {
    chainId: ChainId.TESTNET,
    networkName: 'CRONOS',
    ftmscanUrl: 'https://testnet.cronoscan.com/',
    defaultProvider: 'https://evm-t3.cronos.org',
    deployments: require('./tomb-finance/deployments/deployments.mainnet.json'),
    externalTokens: {
      WCRO: ['0x6a3173618859C7cd40fAF6921b5E9eB6A76f1fD4', 18], // CRO
      SNOW: ['0x944D7e385F08074C1536C8f03382a5F9b16009C0', 18],
      GLCR: ['0xB4Cb4ea7B7eB865562de9a365847f564924D5D11', 18],
      SBOND: ['0x12cd3Bc16e9c83D2c6c83469895c652a4F053cEf', 18],
      USDC: ['0xf1852356be8aD76dAAD31acEB55018Dd87961109', 6],
      USDT: ['0xc7198437980c041c805A1EDcbA50c1Ce5db95118', 6],
      WFTM: ['0x6a3173618859C7cd40fAF6921b5E9eB6A76f1fD4', 18],
      WBTC: ['0x062E66477Faf219F25D27dCED647BF57C3107d52', 18],
      SNOBOND: ['0x8aB4Ac266d8e698b7E39f97Ec17876076680f6f1', 18],
      WETH: ['0xFFffFfFf68A2e13F7B68d2E190E37D804E02E0ad', 18],
      DIBS: ['0x5E430F88D1BE82EB3eF92b6fF06125168fD5DCf2', 18],
      DAI: ['0x5541D83EFaD1f281571B343977648B75d95cdAC2', 18],
      MMF: ['0x97749c9B61F878a880DfE312d2594AE07AEd7656', 18],
      MIM: ['0x130966628846BFd36ff31a822705796e8cb8C18D', 18],
      'SNOW-USDC-LP': ['0xB63E20a3f301bB6e9A00970b185Da72Ff3987718', 18],
      'GLCR-USDC-LP': ['0x96CD9c5AdbCe091C77548fb71c24d2aa8B8A78d9', 18],
      'GRAPE-SNOW-LP': ['0xA3F24b18608606079a0317Cbe6Cda54CED931420', 18],
      'USDC-WCRO-LP': ['0xa68466208F1A3Eb21650320D2520ee8eBA5ba623', 18],
      'USDC-MMF-LP': ['0x722f19bd9A1E5bA97b3020c6028c279d27E4293C', 18],
      'SNO-JOE-LP': ['0xe63b66a8cf7811525cd15dab15f17fb62aa5af2f', 18],
      'MIM-WCRO-LP': ['0x781655d802670bbA3c89aeBaaEa59D3182fD755D', 18],
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
    poolId: 0,
    sectionInUI: 0,
    contract: 'SnowEthGenesisRewardPool',
    depositTokenName: 'WETH',
    earnTokenName: 'SNOW',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },
  SnowSnobondGenesisRewardPool: {
    name: 'Earn SNOW by SNOBOND',
    poolId: 0,
    sectionInUI: 0,
    contract: 'SnowSnobondGenesisRewardPool',
    depositTokenName: 'SNOBOND',
    earnTokenName: 'SNOW',
    finished: true,
    sort: 3,
    closedForStaking: true,
  },
  SnowDibsGenesisRewardPool: {
    name: 'Earn SNOW by DIBS',
    poolId: 0,
    sectionInUI: 0,
    contract: 'SnowDibsGenesisRewardPool',
    depositTokenName: 'DIBS',
    earnTokenName: 'SNOW',
    finished: true,
    sort: 4,
    closedForStaking: true,
  },
  SnowCroGenesisRewardPool: {
    name: 'Earn SNOW by wCRO',
    poolId: 0,
    sectionInUI: 0,
    contract: 'SnowCroGenesisRewardPool',
    depositTokenName: 'WCRO',
    earnTokenName: 'SNOW',
    finished: false,
    sort: 5,
    closedForStaking: true,
  },
  SnowUsdcGenesisRewardPool: {
    name: 'Earn SNOW by USDC',
    poolId: 0,
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
    poolId: 0,
    sectionInUI: 0,
    contract: 'SnowDaiGenesisRewardPool',
    depositTokenName: 'DAI',
    earnTokenName: 'SNOW',
    finished: false,
    sort: 7,
    closedForStaking: true,
  },
  SnowUsdtGenesisRewardPool: {
    name: 'Earn SNOW by USDT',
    poolId: 0,
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
  /*SnowUsdcLPGlcrRewardPoolUsdcLPRebate: {
    name: 'Bond SNOW-USDC-LP for SNOW',
    poolId: 100,
    sectionInUI: 3,
    contract: 'RebateTreasury',
    depositTokenName: 'SNOW-USDC-LP',
    earnTokenName: 'SNOW',
    finished: false,
    sort: 1,
    closedForStaking: false,
  },
  GlcrUsdcJoeLPRebate: {
    name: 'Bond GLCR-USDC-LP for SNOW',
    poolId: 100,
    sectionInUI: 3,
    contract: 'RebateTreasury',
    depositTokenName: 'GLCR-USDC-LP',
    earnTokenName: 'SNOW',
    finished: false,
    sort: 2,
    closedForStaking: false,
  },*/
  AvaxJoeLPRebate: {
    name: 'Bond AVAX for SNOW',
    poolId: 100,
    sectionInUI: 3,
    contract: 'RebateTreasury',
    depositTokenName: 'WAVAX',
    earnTokenName: 'SNOW',
    finished: false,
    sort: 3,
    closedForStaking: false,
  },
  UsdcJoeLPRebate: {
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
   },
   LPSnowNode: {
    name: 'Generate GRAPE-SNOW LP with Nodes',
    poolId: 0,
    sectionInUI: 4,
    contract: 'LPSnowNode',
    depositTokenName: 'GRAPE-SNOW-LP',
    earnTokenName: 'GRAPE-SNOW-LP',
    finished: false,
    sort: 2,
    closedForStaking: false,
  }
};

export default configurations[/*process.env.NODE_ENV || */'production'];
