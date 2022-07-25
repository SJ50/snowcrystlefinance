import { useContext } from 'react';
import { Context as BanksContext } from '../contexts/Banks';
import { Bank, ContractName } from '../tomb-finance';

const useBank = (contractName: ContractName): Bank => {
  const { banks } = useContext(BanksContext);
  if (contractName === 'SnowBtcGenesisRewardPool') {
    return banks.find((bank) => bank.sectionInUI === 0 && bank.depositTokenName === 'WBTC');
  } else if (contractName === 'SnowFoxGenesisRewardPool') {
    return banks.find((bank) => bank.sectionInUI === 0 && bank.depositTokenName === 'FOX');
  } else if (contractName === 'SnowSnobondGenesisRewardPool') {
    return banks.find((bank) => bank.sectionInUI === 0 && bank.depositTokenName === 'SNOBOND');
  } else if (contractName === 'SnowDibsGenesisRewardPool') {
    return banks.find((bank) => bank.sectionInUI === 0 && bank.depositTokenName === 'DIBS');
  } else if (contractName === 'SnowAvaxGenesisRewardPool') {
    return banks.find((bank) => bank.sectionInUI === 0 && bank.depositTokenName === 'WAVAX');
  } else if (contractName === 'SnowUsdcGenesisRewardPool') {
    return banks.find((bank) => bank.sectionInUI === 0 && bank.depositTokenName === 'USDC');
  } else if (contractName === 'SnowGrapeGenesisRewardPool') {
    return banks.find((bank) => bank.sectionInUI === 0 && bank.depositTokenName === 'GRAPE');
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
