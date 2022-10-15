import { DeFiWeb3Connector } from '@deficonnect/web3-connector';

export const connector = new DeFiWeb3Connector({
  supportedChainIds: [338],
  appName: 'SnowCrystals Finance',
  chainType: 'eth', // only support 'eth' for DeFiWeb3Connector
  chainId: '338', // for eth is 1
  rpcUrls: {
    25: 'https://evm-cronos.crypto.org/',
    338: 'https://evm-t3.cronos.org',
  },
});

// import { DeFiWeb3Connector } from 'deficonnect';
// export const connector = new DeFiWeb3Connector({
//   supportedChainIds: [338],
//   rpc: {
//
//     25: 'https://evm.cronos.org/', // cronos mainet
//     338: 'https://evm-t3.cronos.org', // cronos testnet
//   },
//   pollingInterval: 15000,
// });
