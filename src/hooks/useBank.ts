import { useContext } from 'react';
import { Context as BanksContext } from '../contexts/Banks';
import { Bank, ContractName } from '../tomb-finance';

const useBank = (contractName: ContractName): Bank => {
  const { banks } = useContext(BanksContext);
  if (contractName === 'SnowBtcGenesisRewardPool') {
    return banks.find((bank) => bank.sectionInUI === 0 && bank.depositTokenName === 'WBTC');
  } else if (contractName === 'SnowEthGenesisRewardPool') {
    return banks.find((bank) => bank.sectionInUI === 0 && bank.depositTokenName === 'WETH');
  } else if (contractName === 'SnowCroGenesisRewardPool') {
    return banks.find((bank) => bank.sectionInUI === 0 && bank.depositTokenName === 'WCRO');
  } else if (contractName === 'SnowUsdcGenesisRewardPool') {
    return banks.find((bank) => bank.sectionInUI === 0 && bank.depositTokenName === 'USDC');
  } else if (contractName === 'SnowDaiGenesisRewardPool') {
    return banks.find((bank) => bank.sectionInUI === 0 && bank.depositTokenName === 'DAI');
  } else if (contractName === 'SnowUsdtGenesisRewardPool') {
    return banks.find((bank) => bank.sectionInUI === 0 && bank.depositTokenName === 'USDT');
  }
  if (contractName === 'PegLPNode') {
    return banks.find((bank) => bank.sectionInUI === 4 && bank.depositTokenName === 'SNOW-USDC-LP');
  } else if (contractName === 'ShareLPNode') {
    return banks.find((bank) => bank.sectionInUI === 4 && bank.depositTokenName === 'GLCR-USDC-LP');
  }else if (contractName === 'LPSnowNode') {
    return banks.find((bank) => bank.sectionInUI === 4 && bank.depositTokenName === 'GRAPE-SNOW-LP');
  }

  if (contractName === 'GlcrUsdcLPGlcrRewardPool') {
    return banks.find((bank) => bank.sectionInUI === 2 && bank.depositTokenName === 'GLCR-USDC-LP');
  } else if (contractName === 'SnowUsdcLPGlcrRewardPool') {
    return banks.find((bank) => bank.sectionInUI === 2 && bank.depositTokenName === 'SNOW-USDC-LP');
  } else {
    return null;
  }
};

export default useBank;
