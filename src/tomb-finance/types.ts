import ERC20 from './ERC20';

export type ContractName = string;

export interface BankInfo {
  name: string;
  poolId: number;
  sectionInUI: number;
  contract: ContractName;
  depositTokenName: ContractName;
  earnTokenName: ContractName;
  sort: number;
  finished: boolean;
  closedForStaking: boolean;
}

export interface Bank extends BankInfo {
  address: string;
  depositToken: ERC20;
  earnToken: ERC20;
}

export type PoolStats = {
  userDailyBurst?: string;
  userYearlyBurst?: string;
  dailyAPR: string;
  yearlyAPR: string;
  TVL: string;
};

export type TokenStat = {
  tokenInFtm: string;
  priceInDollars: string;
  totalSupply: string;
  circulatingSupply: string;
  totalBurned: string;
  totalTax: string;
};

export type LPStat = {
  tokenAmount: string;
  ftmAmount: string;
  priceOfOne: string;
  totalLiquidity: string;
  totalSupply: string;
};

export type AllocationTime = {
  from: Date;
  to: Date;
};

export type TShareSwapperStat = {
  tshareBalance: string;
  tbondBalance: string;
  // tombPrice: string;
  // tsharePrice: string;
  rateTSharePerTomb: string;
};

export type RebateSnowStat = {
  treasuryAddress: string;
  snowPrice: string;
  bondVesting: string;
  bondPremium: string;
  snowAvailable: string;
  assets: {
    token: string;
    params: {
      multiplier: number;
      isLP: boolean;
    };
    price: string;
  }[];
};

export type RebateGlcrStat = {
  treasuryAddress: string;
  glcrPrice: string;
  bondVesting: string;
  bondPremium: string;
  glcrAvailable: string;
  assets: {
    token: string;
    params: {
      multiplier: number;
      isLP: boolean;
    };
    price: string;
  }[];
};

export type RebateSnowAccountStat = {
  claimableSnow: string;
  vested: string;
};

export type RebateGlcrAccountStat = {
  claimableGlcr: string;
  vested: string;
};
