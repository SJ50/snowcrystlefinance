import { ethers } from 'ethers';
import config from '../config';
import { web3ProviderFrom } from '../tomb-finance/ether-utils';

let provider: ethers.providers.Web3Provider = null;

export function getDefaultProvider(): ethers.providers.Web3Provider {
  if (!provider) {
    provider = new ethers.providers.Web3Provider(web3ProviderFrom(config.defaultProvider), config.chainId);
  }

  return provider;
}

let baseProvider: ethers.providers.BaseProvider = null;
export function getDefaultBaseProvider(): ethers.providers.BaseProvider {
  if (!provider) {
    baseProvider = new ethers.providers.BaseProvider(web3ProviderFrom(config.defaultProvider));
  }

  return baseProvider;
}
