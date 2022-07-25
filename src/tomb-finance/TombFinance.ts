import axios from 'axios';
// import { Fetcher, Route, Token } from '@uniswap/sdk';
// import { Fetcher as FetcherSpirit, Token as TokenSpirit } from '@traderjoe-xyz/sdk';
// import { Fetcher, Route, Token } from '@traderjoe-xyz/sdk';
import { Fetcher as FetcherSpirit, Token as TokenSpirit } from '@madmeerkat/sdk';
import { Fetcher, Route, Token } from '@madmeerkat/sdk';
// import { Fetcher as FetcherSpirit, Token as TokenSpirit } from 'quickswap-sdk';
// import { Fetcher, Route, Token } from 'quickswap-sdk';
import { Configuration } from './config';
import { ContractName, TokenStat, AllocationTime, LPStat, Bank, PoolStats, TShareSwapperStat } from './types';
import { BigNumber, Contract, ethers, EventFilter } from 'ethers';
import { decimalToBalance } from './ether-utils';
import { TransactionResponse } from '@ethersproject/providers';
import ERC20 from './ERC20';
import { getFullDisplayBalance, getDisplayBalance } from '../utils/formatBalance';
import { getDefaultProvider } from '../utils/provider';
import IUniswapV2PairABI from './IUniswapV2Pair.abi.json';
import { /*config,*/ bankDefinitions } from '../config';
import moment from 'moment';
import { parseUnits } from 'ethers/lib/utils';
import { FTM_TICKER, SPOOKY_ROUTER_ADDR, TOMB_TICKER, TSHARE_TICKER } from '../utils/constants';
// import { CompareArrowsOutlined } from '@material-ui/icons';
// import { CompareArrowsOutlined, CompassCalibrationOutlined } from '@material-ui/icons';
/**
 * An API module of Tomb Finance contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class TombFinance {
  myAccount: string;
  provider: ethers.providers.Web3Provider;
  signer?: ethers.Signer;
  config: Configuration;
  contracts: { [name: string]: Contract };
  externalTokens: { [name: string]: ERC20 };
  masonryVersionOfUser?: string;

  TOMBWFTM_LP: Contract;
  TOMB: ERC20;
  TSHARE: ERC20;
  TBOND: ERC20;
  FTM: ERC20;
  WAVAX: ERC20;
  SNO: ERC20;
  FOX: ERC20;
  DIBS: ERC20;
  GRAPE: ERC20;

  constructor(cfg: Configuration) {
    const { deployments, externalTokens } = cfg;
    const provider = getDefaultProvider();

    // loads contracts from deployments
    this.contracts = {};
    for (const [name, deployment] of Object.entries(deployments)) {
      this.contracts[name] = new Contract(deployment.address, deployment.abi, provider);
    }
    this.externalTokens = {};
    for (const [symbol, [address, decimal]] of Object.entries(externalTokens)) {
      this.externalTokens[symbol] = new ERC20(address, provider, symbol, decimal);
    }
    this.TOMB = new ERC20(deployments.tomb.address, provider, 'SNOW');
    this.TSHARE = new ERC20(deployments.tShare.address, provider, 'GLCR');
    this.TBOND = new ERC20(deployments.tBond.address, provider, 'SBOND');
    this.FTM = this.externalTokens['USDC'];
    this.WAVAX = this.externalTokens['WAVAX'];
    this.SNO = this.externalTokens['SNO'];
    this.FOX = this.externalTokens['FOX'];
    this.DIBS = this.externalTokens['DIBS'];
    this.GRAPE = this.externalTokens['GRAPE'];

    // Uniswap V2 Pair
    this.TOMBWFTM_LP = new Contract(externalTokens['SNOW-USDC-LP'][0], IUniswapV2PairABI, provider);

    this.config = cfg;
    this.provider = provider;
  }

  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */
  unlockWallet(provider: any, account: string) {
    const newProvider = new ethers.providers.Web3Provider(provider, this.config.chainId);
    this.signer = newProvider.getSigner(0);
    this.myAccount = account;
    for (const [name, contract] of Object.entries(this.contracts)) {
      this.contracts[name] = contract.connect(this.signer);
    }
    const tokens = [this.TOMB, this.TSHARE, this.TBOND, ...Object.values(this.externalTokens)];
    for (const token of tokens) {
      token.connect(this.signer);
    }
    this.TOMBWFTM_LP = this.TOMBWFTM_LP.connect(this.signer);
    console.log(`🔓 Wallet is unlocked. Welcome, ${account}!`);
    this.fetchMasonryVersionOfUser()
      .then((version) => (this.masonryVersionOfUser = version))
      .catch((err) => {
        console.error(`Failed to fetch boardroom version: ${err.stack}`);
        this.masonryVersionOfUser = 'latest';
      });
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }

  //===================================================================
  //===================== GET ASSET STATS =============================
  //===================FROM SPOOKY TO DISPLAY =========================
  //=========================IN HOME PAGE==============================
  //===================================================================

  async getTombStat(): Promise<TokenStat> {
    // const { TombFtmRewardPool, TombFtmLpTombRewardPool, TombFtmLpTombRewardPoolOld } = this.contracts;

    const [supply, priceInFTM, priceOfOneFTM] = await Promise.all([
      this.TOMB.totalSupply(),
      this.getTokenPriceFromPancakeswap(this.TOMB),
      this.getWFTMPriceFromPancakeswap(),
    ]);

    const tombCirculatingSupply = supply.sub(25000);
    const priceOfTombInDollars = (Number(priceInFTM) * Number(priceOfOneFTM)).toFixed(18);

    return {
      tokenInFtm: priceInFTM,
      priceInDollars: priceOfTombInDollars,
      totalSupply: getDisplayBalance(supply, this.TOMB.decimal, 0),
      circulatingSupply: getDisplayBalance(tombCirculatingSupply, this.TOMB.decimal, 0),
    };
  }

  /**
   * Calculates various stats for the requested LP
   * @param name of the LP token to load stats for
   * @returns
   */
  async getLPStat(name: string): Promise<LPStat> {
    let lpToken = this.externalTokens[name];
    let lpTokenSupplyBN = await lpToken.totalSupply();
    let lpTokenSupply = getDisplayBalance(lpTokenSupplyBN, lpToken.decimal, lpToken.decimal / 2);
    let token0 =  name.startsWith('SNOW') ? this.TOMB : this.TSHARE; // name === 'SNOW-USDC-LP' ? this.TOMB : this.TSHARE;
    let isTomb = name.startsWith('SNOW'); // name === 'SNOW-USDC-LP';
    let tokenAmountBN = await token0.balanceOf(lpToken.address);
    let tokenAmount = getDisplayBalance(tokenAmountBN, token0.decimal);

    let ftmAmountBN = await this.FTM.balanceOf(lpToken.address);
    let ftmAmount = getDisplayBalance(ftmAmountBN, this.FTM.decimal);
    let tokenAmountInOneLP = Number(tokenAmount) / Number(lpTokenSupply) / 10**6;
    let ftmAmountInOneLP = Number(ftmAmount) / Number(lpTokenSupply) / 10**6;
    let lpTokenPrice = await this.getLPTokenPrice(lpToken, token0, isTomb);
    let lpTokenPriceFixed = Number(lpTokenPrice).toFixed(2).toString();
    let liquidity = (Number(lpTokenSupply) * Number(lpTokenPrice) * 10**6).toFixed(2).toString();

    // if (name === 'SNO-SNOSHARE-LP') {
    //   ftmAmountBN = await this.TOMB.balanceOf(lpToken.address);
    //   ftmAmount = getDisplayBalance(ftmAmountBN, 18);
    //   ftmAmountInOneLP = Number(ftmAmount) / Number(lpTokenSupply);
    // }

    return {
      tokenAmount: tokenAmountInOneLP.toFixed(2).toString(),
      ftmAmount: ftmAmountInOneLP.toFixed(2).toString(),
      priceOfOne: lpTokenPriceFixed,
      totalLiquidity: liquidity,
      totalSupply: Number(lpTokenSupply).toFixed(9).toString(),
    };
  }

  async sendTomb(amount: string | number, recepient: string): Promise<TransactionResponse> {
    const { tomb } = this.contracts;

    return await tomb.transfer(recepient, decimalToBalance(amount));
  }

  async getRaffleStat(account: string, raffleAddress: string): Promise<TokenStat> {
    let total = 0;
    const { tomb } = this.contracts;

    const priceInBTC = await this.getTokenPriceFromPancakeswap(this.TOMB);

    const balOfRaffle = await tomb.balanceOf(raffleAddress);

    const currentBlockNumber = await this.provider.getBlockNumber();

    const filterTo = tomb.filters.Transfer(account, raffleAddress);

    const startBlock = currentBlockNumber - 100000;

    let allEvents: any = [];

    for (let i = startBlock; i < currentBlockNumber; i += 2000) {
      const _startBlock = i;
      const _endBlock = Math.min(currentBlockNumber, i + 1999);
      const events = await tomb.queryFilter(filterTo, _startBlock, _endBlock);
      allEvents = [...allEvents, ...events];
    }

    if (allEvents.length !== 0 && account !== null) {
      for (let i = 0; i < allEvents.length; i++) {
        total = total + Number(allEvents[i].args.value);
      }
      total = total / 1e18;
    } else {
      total = 0;
    }

    return {
      tokenInFtm: priceInBTC.toString(),
      priceInDollars: total.toString(),
      totalSupply: getDisplayBalance(balOfRaffle, 18, 0),
      circulatingSupply: raffleAddress.toString(),
    };
  }

  /*Nodes*/
  async getNodes(contract: string, user: string): Promise<BigNumber[]> {
    return await this.contracts[contract].getNodes(user);
  }

  async getTotalNodes(contract: string): Promise<BigNumber[]> {
    return await this.contracts[contract].getTotalNodes();
  }

  async getMaxPayout(contract: string, user: string): Promise<BigNumber[]> {
    return await this.contracts[contract].maxPayout(user);
  }

  async getUserDetails(contract: string, user: string): Promise<BigNumber[]> {
    return await this.contracts[contract].users(user);
  }

  async compound(poolName: ContractName, poolId: Number, sectionInUI: Number): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    //By passing 0 as the amount, we are asking the contract to only redeem the reward and not the currently staked token
    return sectionInUI !== 4
    ? await pool.withdraw(poolId, 0)
    : await pool.compound();
  }

  async claimedBalanceNode(poolName: ContractName, account = this.myAccount): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      let userInfo = await pool.users(account);
      return await userInfo.total_claims;
    } catch (err) {
      console.error(`Failed to call userInfo() on pool ${pool.address}: ${err}`);
      return BigNumber.from(0);
    }
  }

  async getNodePrice(poolName: ContractName, poolId: Number): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      return await pool.tierAmounts(poolId);
    } catch (err) {
      console.error(`Failed to call tierAmounts on contract ${pool.address}: ${err}`);
      return BigNumber.from(0);
    }
  }

  /**
   * Use this method to get price for Tomb
   * @returns TokenStat for TBOND
   * priceInFTM
   * priceInDollars
   * TotalSupply
   * CirculatingSupply (always equal to total supply for bonds)
   */
  async getBondStat(): Promise<TokenStat> {
    const { Treasury } = this.contracts;
    const tombStat = await this.getTombStat();
    const bondTombRatioBN = await Treasury.getBondPremiumRate();
    const modifier = bondTombRatioBN / 1e18 > 1 ? bondTombRatioBN / 1e18 : 1;
    const bondPriceInFTM = (Number(tombStat.tokenInFtm) * modifier).toFixed(2);
    const priceOfTBondInDollars = (Number(tombStat.priceInDollars) * modifier).toFixed(2);
    const supply = await this.TBOND.displayedTotalSupply();
    return {
      tokenInFtm: bondPriceInFTM,
      priceInDollars: priceOfTBondInDollars,
      totalSupply: supply,
      circulatingSupply: supply,
    };
  }

  /**
   * @returns TokenStat for TSHARE
   * priceInFTM
   * priceInDollars
   * TotalSupply
   * CirculatingSupply (always equal to total supply for bonds)
   */
  async getShareStat(): Promise<TokenStat> {
    const { GlcrRewardPool } = this.contracts;

    const supply = await this.TSHARE.totalSupply();

    const priceInFTM = await this.getTokenPriceFromPancakeswap(this.TSHARE);
    const tombRewardPoolSupply = await this.TSHARE.balanceOf(GlcrRewardPool.address);
    const tShareCirculatingSupply = supply.sub(tombRewardPoolSupply);
    const priceOfOneFTM = await this.getWFTMPriceFromPancakeswap();
    const priceOfSharesInDollars = (Number(priceInFTM) * Number(priceOfOneFTM)).toFixed(2);

    return {
      tokenInFtm: priceInFTM,
      priceInDollars: priceOfSharesInDollars,
      totalSupply: getDisplayBalance(supply, this.TSHARE.decimal, 0),
      circulatingSupply: getDisplayBalance(tShareCirculatingSupply, this.TSHARE.decimal, 0),
    };
  }

  async getTombStatInEstimatedTWAP(): Promise<TokenStat> {
    const { SeigniorageOracle, TombFtmRewardPool } = this.contracts;
    const expectedPrice = (await SeigniorageOracle.twap(this.TOMB.address, ethers.utils.parseEther('1')))/*.mul(10**12)*/;

    const supply = await this.TOMB.totalSupply();
    const tombRewardPoolSupply = await this.TOMB.balanceOf(TombFtmRewardPool.address);
    const tombCirculatingSupply = supply.sub(tombRewardPoolSupply);

    return {
      tokenInFtm: getDisplayBalance(expectedPrice),
      priceInDollars: getDisplayBalance(expectedPrice),
      totalSupply: getDisplayBalance(supply, this.TOMB.decimal, 0),
      circulatingSupply: getDisplayBalance(tombCirculatingSupply, this.TOMB.decimal, 0),
    };
  }

  async getTombPriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    // TODO: update function name after abi change
    return Treasury.getSnowUpdatedPrice();
  }

  async getBondsPurchasable(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    // TODO: update function name after abi change
    return Treasury.getBurnableSnowLeftt();
  }

  /**
   * Calculates the TVL, APR and daily APR of a provided pool/bank
   * @param bank
   * @returns
   */
  async getPoolAPRs(bank: Bank): Promise<PoolStats> {
    if (this.myAccount === undefined) return;
    const depositToken = bank.depositToken;
    const poolContract = this.contracts[bank.contract];

    if (bank.sectionInUI === 4) {
        const [depositTokenPrice, points, totalPoints, tierAmount, poolBalance, totalBalance, dripRate, dailyUserDrip] = await Promise.all([
          this.getDepositTokenPriceInDollars(bank.depositTokenName, depositToken),
          poolContract.tierAllocPoints(bank.poolId),
          poolContract.totalAllocPoints(),
          poolContract.tierAmounts(bank.poolId),
          poolContract.getBalancePool(),
          depositToken.balanceOf(bank.address),
          poolContract.dripRate(),
          poolContract.getDayDripEstimate(this.myAccount),
        ]);
        const stakeAmount = Number(tierAmount)/1e18
        
        const dailyDrip = totalPoints && +totalPoints > 0 
          ? (poolBalance.mul(BigNumber.from(86400)).mul(points).div(totalPoints).div(dripRate))/1e18
          : 0;
        const dailyDripAPR = (Number(dailyDrip) / stakeAmount) * 100;
        const yearlyDripAPR = (Number(dailyDrip) * 365 / stakeAmount) * 100;
        const dailyDripUser = Number(getDisplayBalance(dailyUserDrip));
        const yearlyDripUser = Number(dailyDripUser) * 365;

        const TVL = Number(depositTokenPrice) * Number(totalBalance)/1e12;

        return {
          userDailyBurst: dailyDripUser.toFixed(2).toString(),
          userYearlyBurst: yearlyDripUser.toFixed(2).toString(),
          dailyAPR: dailyDripAPR.toFixed(2).toString(),
          yearlyAPR: yearlyDripAPR.toFixed(2).toString(),
          TVL: TVL.toFixed(2).toString(),
        };
      
    }else{
    const depositTokenPrice = await this.getDepositTokenPriceInDollars(bank.depositTokenName, depositToken);
    const stakeInPool = (await depositToken.balanceOf(bank.address)).mul(bank.depositTokenName.endsWith('USDC-LP') ? 10**6 : 1);
    const TVL = Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal, depositToken.decimal === 6 ? 3 : 9));
    const stat = bank.earnTokenName === 'SNOW' ? await this.getTombStat() : await this.getShareStat();
    const tokenPerSecond = await this.getTokenPerSecond(
      bank.earnTokenName,
      bank.contract,
      poolContract,
      bank.depositTokenName,
    );

    let tokenPerHour = tokenPerSecond.mul(60).mul(60).mul(3).div(8);
    if (bank.sectionInUI === 2 && bank.depositTokenName === 'SNOW') {
      tokenPerHour = tokenPerHour.mul(3).div(5);
    }
    const totalRewardPricePerYear =
      Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24).mul(365)));
    const totalRewardPricePerDay = Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24)));
    const totalStakingTokenInPool =
      Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal));
    const dailyAPR = (totalRewardPricePerDay / totalStakingTokenInPool) * 100;
    const yearlyAPR = (totalRewardPricePerYear / totalStakingTokenInPool) * 100;
    return {
      dailyAPR: dailyAPR.toFixed(2).toString(),
      yearlyAPR: yearlyAPR.toFixed(2).toString(),
      TVL: TVL.toFixed(2).toString(),
    };
  }
}

  /**
   * Method to return the amount of tokens the pool yields per second
   * @param earnTokenName the name of the token that the pool is earning
   * @param contractName the contract of the pool/bank
   * @param poolContract the actual contract of the pool
   * @returns
   */
  async getTokenPerSecond(
    earnTokenName: string,
    contractName: string,
    poolContract: Contract,
    depositTokenName: string,
  ) {
    if (earnTokenName === 'SNOW') {
      if (contractName.endsWith('GenesisRewardPool')) {
        // TODO: update function name after abi change
        const rewardPerSecond = await poolContract.snowPerSecond();
        // if (depositTokenName === 'WAVAX') {
        //   return rewardPerSecond.mul(6000).div(11000).div(24);
        // } else if (depositTokenName === 'BOO') {
        //   return rewardPerSecond.mul(2500).div(11000).div(24);
        // } else if (depositTokenName === 'ZOO') {
        //   return rewardPerSecond.mul(1000).div(11000).div(24);
        // } else if (depositTokenName === 'SHIBA') {
        //   return rewardPerSecond.mul(1500).div(11000).div(24);
        // }
        return rewardPerSecond/*.div(24)*/;
      }

      const poolStartTime = await poolContract.poolStartTime();
      const startDateTime = new Date(poolStartTime.toNumber() * 1000);
      const FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;
      if (Date.now() - startDateTime.getTime() > FOUR_DAYS) {
        return await poolContract.epochTombPerSecond(1);
      }

      return await poolContract.epocTombPerSecond(0);
    }
    // TODO: update function call after ABI update
    const rewardPerSecond = await poolContract.glcrPerSecond();
    if (depositTokenName.startsWith('SNOW')) {
      return rewardPerSecond.mul(30000).div(50000).mul(3).div(2);
    } else {
      return rewardPerSecond.mul(20000).div(50000).mul(3).div(2);
    }
  }

  /**
   * Method to calculate the tokenPrice of the deposited asset in a pool/bank
   * If the deposited token is an LP it will find the price of its pieces
   * @param tokenName
   * @param pool
   * @param token
   * @returns
   */
  async getDepositTokenPriceInDollars(tokenName: string, token: ERC20) {
    let tokenPrice;
    const priceOfOneFtmInDollars = await this.getWFTMPriceFromPancakeswap();
    if (tokenName === 'SNOW') {
      tokenPrice = (await this.getTombStat()).priceInDollars;
    } if (tokenName === 'GLCR') {
      tokenPrice = (await this.getShareStat()).priceInDollars;
    } else if (!tokenName.includes('-LP')) {
      tokenPrice = (await this.getTokenStat(tokenName)).priceInDollars;
    } else if (tokenName === 'SNOW-USDC-LP') {
      tokenPrice = await this.getLPTokenPrice(token, this.TOMB, true);
    } else if (tokenName === 'GLCR-USDC-LP') {
      tokenPrice = await this.getLPTokenPrice(token, this.TSHARE, false);
    } else if (tokenName === 'GRAPE-SNOW-LP') {
      tokenPrice = await this.getLPTokenPrice(token, this.TOMB, true);
    }else {
      tokenPrice = await this.getTokenPriceFromPancakeswap(token);
      tokenPrice = (Number(tokenPrice) * Number(priceOfOneFtmInDollars)).toString();
    }
    return tokenPrice;
  }

  //===================================================================
  //===================== GET ASSET STATS =============================
  //=========================== END ===================================
  //===================================================================

  async getCurrentEpoch(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.epoch();
  }

  async getBondOraclePriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getBondPremiumRate();
  }

  /**
   * Buy bonds with cash.
   * @param amount amount of cash to purchase bonds with.
   */
  async buyBonds(amount: string | number): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    // TODO: update function name after abi change
    const treasuryTombPrice = await Treasury.getSnowPrice();
    return await Treasury.buyBonds(decimalToBalance(amount), treasuryTombPrice);
  }

  /**
   * Redeem bonds for cash.
   * @param amount amount of bonds to redeem.
   */
  async redeemBonds(amount: string): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    // TODO: update function name after abi change
    const priceForTomb = await Treasury.getSnowPrice();
    return await Treasury.redeemBonds(decimalToBalance(amount), priceForTomb);
  }

  async getTotalValueLocked(): Promise<Number> {
    let totalValue = 0;
    for (const bankInfo of Object.values(bankDefinitions)) {
      const pool = this.contracts[bankInfo.contract];
      const token = this.externalTokens[bankInfo.depositTokenName];
      // const tokenPrice = await this.getDepositTokenPriceInDollars(bankInfo.depositTokenName, token);
      // const tokenAmountInPool = await token.balanceOf(pool.address);

      const [tokenPrice, tokenAmountInPool] = await Promise.all([
        this.getDepositTokenPriceInDollars(bankInfo.depositTokenName, token),
        token.balanceOf(pool.address)
      ]);

      const value = Number(getDisplayBalance(tokenAmountInPool, token.decimal, 6)) * Number(tokenPrice);
      let poolValue = Number.isNaN(value) ? 0 : value;
      if (bankInfo.depositTokenName.endsWith('-USDC-LP')) {
        poolValue = poolValue * 10**6;
      }

      totalValue += poolValue;
    }

    // const TSHAREPrice = (await this.getShareStat()).priceInDollars;
    // const masonrytShareBalanceOf = await this.TSHARE.balanceOf(this.currentMasonry().address);

    const [shareStat, masonrytShareBalanceOf] = await Promise.all([
      this.getShareStat(),
      this.TSHARE.balanceOf(this.currentMasonry().address)
    ]);

    const TSHAREPrice = shareStat.priceInDollars;
    const masonryTVL = Number(getDisplayBalance(masonrytShareBalanceOf, this.TSHARE.decimal)) * Number(TSHAREPrice);

    return totalValue + masonryTVL;
  }

  /**
   * Calculates the price of an LP token
   * Reference https://github.com/DefiDebauchery/discordpricebot/blob/4da3cdb57016df108ad2d0bb0c91cd8dd5f9d834/pricebot/pricebot.py#L150
   * @param lpToken the token under calculation
   * @param token the token pair used as reference (the other one would be FTM in most cases)
   * @param isTomb sanity check for usage of tomb token or tShare
   * @returns price of the LP token
   */
  async getLPTokenPrice(lpToken: ERC20, token: ERC20, isTomb: boolean): Promise<string> {
    const totalSupply = getFullDisplayBalance(await lpToken.totalSupply(), lpToken.decimal);
    //Get amount of tokenA
    const tokenSupply = getFullDisplayBalance(await token.balanceOf(lpToken.address), token.decimal);
    // const stat = isTomb === true ? await this.getTombStat() : await this.getShareStat();
    const stat = await this.getTokenStat(token.symbol);
    const priceOfToken = stat.priceInDollars;
    const divider = ['SNOW', 'GLCR', 'USDC', 'USDT'].includes(token.symbol) ? 10**6 : 1;
    const tokenInLP = Number(tokenSupply) / Number(totalSupply) / divider;  // NOTE: hot fix
    const tokenPrice = (Number(priceOfToken) * tokenInLP * 2) //We multiply by 2 since half the price of the lp token is the price of each piece of the pair. So twice gives the total
      .toString();
    return tokenPrice;
  }

  async getTokenStat(tokenName: string): Promise<TokenStat> {
    switch(tokenName) {
      case 'USDT':
        return this.getUsdtStat();
      case 'USDC':
        return this.getUsdcStat();
      case 'SNOW':
        return this.getTombStat();
      case 'GLCR':
        return this.getShareStat();
      case 'DIBS':
        return this.getDibsStat();
      case 'SNO':
      case 'SNOBOND':
        return this.getSnoStat();
      case 'WAVAX':
        return this.getAvaxStat();
      case 'FOX':
        return this.getFoxStat();
      case 'GRAPE':
        return this.getGrapeStat();
      default:
        throw new Error(`Unknown token name: ${tokenName}`);
    }
  }

  async getUsdtStat(): Promise<TokenStat> {
    const { data } = await axios('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=tether-avalanche-bridged-usdt-e');
    return {
      tokenInFtm: data[0].current_price,
      priceInDollars: data[0].current_price,
      totalSupply: '0',
      circulatingSupply: '0',
    };
  }

  async getUsdcStat(): Promise<TokenStat> {
    const { data } = await axios('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=usd-coin-avalanche-bridged-usdc-e');
    return {
      tokenInFtm: data[0].current_price,
      priceInDollars: data[0].current_price,
      totalSupply: '0',
      circulatingSupply: '0',
    };
  }

  async getDibsStat(): Promise<TokenStat> {
    const {WAVAX} = this.config.externalTokens;
    const [priceInAvax, priceOfOneAvax] = await Promise.all([
      this.getTokenPriceFromPancakeswap(this.DIBS, new Token(this.config.chainId, WAVAX[0], WAVAX[1], 'WAVAX')),
      this.getAvaxPriceFromPancakeswap(),
    ]);

    const priceInDollars = (Number(priceInAvax) * Number(priceOfOneAvax)).toFixed(12);
    return {
      tokenInFtm: priceInAvax,
      priceInDollars,
      totalSupply: '0',
      circulatingSupply: '0',
    };
  }

  async getSnoStat(): Promise<TokenStat> {
    const {JOE} = this.config.externalTokens;
    const [priceInJoe, priceOfOneJoe] = await Promise.all([
      this.getTokenPriceFromPancakeswap(this.SNO, new Token(this.config.chainId, JOE[0], JOE[1], 'JOE')),
      this.getJoePriceFromPancakeswap(),
    ]);

    const priceInDollars = (Number(priceInJoe) * Number(priceOfOneJoe)).toFixed(12);
    return {
      tokenInFtm: priceInJoe,
      priceInDollars,
      totalSupply: '0',
      circulatingSupply: '0',
    };
  }

  async getFoxStat(): Promise<TokenStat> {
    const {JOE} = this.config.externalTokens;
    const [priceInJoe, priceOfOneJoe] = await Promise.all([
      this.getTokenPriceFromPancakeswap(this.FOX, new Token(this.config.chainId, JOE[0], JOE[1], 'JOE')),
      this.getJoePriceFromPancakeswap(),
    ]);

    const priceInDollars = (Number(priceInJoe) * Number(priceOfOneJoe)).toFixed(12);
    return {
      tokenInFtm: priceInJoe,
      priceInDollars,
      totalSupply: '0',
      circulatingSupply: '0',
    };
  }

  async getGrapeStat(): Promise<TokenStat> {
    const {MIM} = this.config.externalTokens;
    const [priceInMim, priceOfOneMim] = await Promise.all([
      this.getTokenPriceFromPancakeswap(this.GRAPE, new Token(this.config.chainId, MIM[0], MIM[1], 'MIM')),
      this.getMimPriceFromPancakeswap(),
    ]);

    const priceInDollars = (Number(priceInMim) * Number(priceOfOneMim)).toFixed(12);
    return {
      tokenInFtm: priceInMim,
      priceInDollars,
      totalSupply: '0',
      circulatingSupply: '0',
    };
  }

  async getAvaxStat(): Promise<TokenStat> {
    const priceInDollars = await this.getAvaxPriceFromPancakeswap();
    return {
      tokenInFtm: priceInDollars,
      priceInDollars,
      totalSupply: '0',
      circulatingSupply: '0',
    };
  }

  async getAvaxPriceFromPancakeswap(): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const {WAVAX, USDC} = this.externalTokens;
    try {
      const busd_eth_lp_pair = this.externalTokens['USDC-WAVAX-LP'];
      let eth_amount_BN = await WAVAX.balanceOf(busd_eth_lp_pair.address);
      let eth_amount = Number(getFullDisplayBalance(eth_amount_BN, WAVAX.decimal));
      let busd_amount_BN = await USDC.balanceOf(busd_eth_lp_pair.address);
      let busd_amount = Number(getFullDisplayBalance(busd_amount_BN, USDC.decimal));
      return (busd_amount / eth_amount).toString();
    } catch (err) {
      console.error(`Failed to fetch token price of ETH: ${err}`);
    }
  }

  async getMimPriceFromPancakeswap(): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const avaxPrice = await this.getAvaxPriceFromPancakeswap();
    const {MIM, WAVAX} = this.externalTokens;
    try {
      const busd_eth_lp_pair = this.externalTokens['MIM-WAVAX-LP'];
      let eth_amount_BN = await WAVAX.balanceOf(busd_eth_lp_pair.address);
      let eth_amount = Number(getFullDisplayBalance(eth_amount_BN, WAVAX.decimal));
      let busd_amount_BN = await MIM.balanceOf(busd_eth_lp_pair.address);
      let busd_amount = Number(getFullDisplayBalance(busd_amount_BN, MIM.decimal));
      return (busd_amount / eth_amount / Number(avaxPrice)).toString();
    } catch (err) {
      console.error(`Failed to fetch token price of ETH: ${err}`);
    }
  }

  async getJoePriceFromPancakeswap(): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const {JOE, USDC} = this.externalTokens;
    try {
      const busd_eth_lp_pair = this.externalTokens['USDC-JOE-LP'];
      let eth_amount_BN = await JOE.balanceOf(busd_eth_lp_pair.address);
      let eth_amount = Number(getFullDisplayBalance(eth_amount_BN, JOE.decimal));
      let busd_amount_BN = await USDC.balanceOf(busd_eth_lp_pair.address);
      let busd_amount = Number(getFullDisplayBalance(busd_amount_BN, USDC.decimal));
      return (busd_amount / eth_amount).toString();
    } catch (err) {
      console.error(`Failed to fetch token price of ETH: ${err}`);
    }
  }

  async earnedFromBank(
    poolName: ContractName,
    earnTokenName: String,
    poolId: Number,
    account = this.myAccount,
  ): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      if (earnTokenName === 'SNOW-USDC-LP' && poolName.includes('Node')) {
        return await pool.getTotalRewards(account);
      }
      if (earnTokenName === 'GLCR-USDC-LP' && poolName.includes('Node')) {
        return await pool.getTotalRewards(account);
      }
      if (earnTokenName === 'GRAPE-SNOW-LP' && poolName.includes('Node')) {
        return await pool.getTotalRewards(account);
      }
      if (earnTokenName === 'SNOW') {
        // TODO: update function name after abi change
        return await pool.pendingSNOW(poolId, account);
      } else {
        return await pool.pendingShare(poolId, account);
      }
    } catch (err) {
      console.error(`Failed to call earned() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  async stakedBalanceOnBank(poolName: ContractName, poolId: Number, account = this.myAccount): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      let userInfo = await pool.userInfo(poolId, account);
      return await userInfo.amount;
    } catch (err) {
      console.error(`Failed to call balanceOf() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  /**
   * Deposits token to given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
   async stake(poolName: ContractName, poolId: Number, sectionInUI: Number, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];

    return sectionInUI !== 4 
      ? await pool.deposit(poolId, amount)
      : await pool.create(poolId, amount);
  }

  /**
   * Withdraws token from given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async unstake(poolName: ContractName, poolId: Number, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    return await pool.withdraw(poolId, amount);
  }

  /**
   * Transfers earned token reward from given pool to my account.
   */
   async harvest(poolName: ContractName, poolId: Number, sectionInUI: Number): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    //By passing 0 as the amount, we are asking the contract to only redeem the reward and not the currently staked token
    return sectionInUI !== 4
    ? await pool.withdraw(poolId, 0)
    : await pool.claim();
  }

  /**
   * Harvests and withdraws deposited tokens from the pool.
   */
  async exit(poolName: ContractName, poolId: Number, account = this.myAccount): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    let userInfo = await pool.userInfo(poolId, account);
    return await pool.withdraw(poolId, userInfo.amount);
  }

  async fetchMasonryVersionOfUser(): Promise<string> {
    return 'latest';
  }

  currentMasonry(): Contract {
    if (!this.masonryVersionOfUser) {
      //throw new Error('you must unlock the wallet to continue.');
    }
    return this.contracts.Masonry;
  }

  isOldMasonryMember(): boolean {
    return this.masonryVersionOfUser !== 'latest';
  }

  async getTokenPriceFromPancakeswap(tokenContract: ERC20, baseToken?: Token): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { chainId } = this.config;
    const { USDC } = this.config.externalTokens;

    const wftm = baseToken || new Token(chainId, USDC[0], USDC[1]);
    const token = new Token(chainId, tokenContract.address, tokenContract.decimal, tokenContract.symbol);
    try {
      const wftmToToken = await Fetcher.fetchPairData(wftm, token, this.provider);
      const priceInBUSD = new Route([wftmToToken], token);
      return priceInBUSD.midPrice.toFixed(18);
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  async getTokenPriceFromSpiritswap(tokenContract: ERC20): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { chainId } = this.config;
    const { WFTM } = this.externalTokens;

    const wftm = new TokenSpirit(chainId, WFTM.address, WFTM.decimal);
    const token = new TokenSpirit(chainId, tokenContract.address, tokenContract.decimal, tokenContract.symbol);
    try {
      const wftmToToken = await FetcherSpirit.fetchPairData(wftm, token, this.provider);
      const liquidityToken = wftmToToken.liquidityToken;
      let ftmBalanceInLP = await WFTM.balanceOf(liquidityToken.address);
      let ftmAmount = Number(getFullDisplayBalance(ftmBalanceInLP, WFTM.decimal));
      let shibaBalanceInLP = await tokenContract.balanceOf(liquidityToken.address);
      let shibaAmount = Number(getFullDisplayBalance(shibaBalanceInLP, tokenContract.decimal));
      const priceOfOneFtmInDollars = await this.getWFTMPriceFromPancakeswap();
      let priceOfShiba = (ftmAmount / shibaAmount) * Number(priceOfOneFtmInDollars);
      return priceOfShiba.toString();
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  async getWFTMPriceFromPancakeswap(): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    return (await this.getUsdcStat()).priceInDollars;
    // const { WFTM, FUSDT } = this.externalTokens;
    // try {
    //   const fusdt_wftm_lp_pair = this.externalTokens['WAVAX-USDC-LP'];
    //   let ftm_amount_BN = await WFTM.balanceOf(fusdt_wftm_lp_pair.address);
    //   let ftm_amount = Number(getFullDisplayBalance(ftm_amount_BN, WFTM.decimal));
    //   let fusdt_amount_BN = await FUSDT.balanceOf(fusdt_wftm_lp_pair.address);
    //   let fusdt_amount = Number(getFullDisplayBalance(fusdt_amount_BN, FUSDT.decimal));
    //   return (fusdt_amount / ftm_amount).toString();
    // } catch (err) {
    //   console.error(`Failed to fetch token price of WAVAX: ${err}`);
    // }
  }

  //===================================================================
  //===================================================================
  //===================== MASONRY METHODS =============================
  //===================================================================
  //===================================================================

  async getMasonryAPR() {
    const Masonry = this.currentMasonry();
    const latestSnapshotIndex = await Masonry.latestSnapshotIndex();
    const lastHistory = await Masonry.boardroomHistory(latestSnapshotIndex);

    const lastRewardsReceived = lastHistory[1];

    const TSHAREPrice = (await this.getShareStat()).priceInDollars;
    const TOMBPrice = (await this.getTombStat()).priceInDollars;
    const epochRewardsPerShare = lastRewardsReceived / 1e18;

    //Mgod formula
    const amountOfRewardsPerDay = epochRewardsPerShare * Number(TOMBPrice) * 4;
    const masonrytShareBalanceOf = await this.TSHARE.balanceOf(Masonry.address);
    const masonryTVL = Number(getDisplayBalance(masonrytShareBalanceOf, this.TSHARE.decimal)) * Number(TSHAREPrice);
    const realAPR = ((amountOfRewardsPerDay * 100) / masonryTVL) * 365;
    return realAPR;
  }

  /**
   * Checks if the user is allowed to retrieve their reward from the Masonry
   * @returns true if user can withdraw reward, false if they can't
   */
  async canUserClaimRewardFromMasonry(): Promise<boolean> {
    const Masonry = this.currentMasonry();
    return await Masonry.canClaimReward(this.myAccount);
  }

  /**
   * Checks if the user is allowed to retrieve their reward from the Masonry
   * @returns true if user can withdraw reward, false if they can't
   */
  async canUserUnstakeFromMasonry(): Promise<boolean> {
    const Masonry = this.currentMasonry();
    const canWithdraw = await Masonry.canWithdraw(this.myAccount);
    const stakedAmount = await this.getStakedSharesOnMasonry();
    const notStaked = Number(getDisplayBalance(stakedAmount, this.TSHARE.decimal)) === 0;
    const result = notStaked ? true : canWithdraw;
    return result;
  }

  async timeUntilClaimRewardFromMasonry(): Promise<BigNumber> {
    // const Masonry = this.currentMasonry();
    // const mason = await Masonry.members(this.myAccount);
    return BigNumber.from(0);
  }

  async getTotalStakedInMasonry(): Promise<BigNumber> {
    const Masonry = this.currentMasonry();
    return await Masonry.totalSupply();
  }

  async stakeShareToMasonry(amount: string): Promise<TransactionResponse> {
    if (this.isOldMasonryMember()) {
      throw new Error("you're using old boardroom. please withdraw and deposit the GLCR again.");
    }
    const Masonry = this.currentMasonry();
    return await Masonry.stake(decimalToBalance(amount));
  }

  async getStakedSharesOnMasonry(): Promise<BigNumber> {
    const Masonry = this.currentMasonry();
    return await Masonry.balanceOf(this.myAccount);
  }

  async getEarningsOnMasonry(): Promise<BigNumber> {
    const Masonry = this.currentMasonry();
    return await Masonry.earned(this.myAccount);
  }

  async withdrawShareFromMasonry(amount: string): Promise<TransactionResponse> {
    const Masonry = this.currentMasonry();
    return await Masonry.withdraw(decimalToBalance(amount));
  }

  async harvestCashFromMasonry(): Promise<TransactionResponse> {
    const Masonry = this.currentMasonry();
    return await Masonry.claimReward();
  }

  async exitFromMasonry(): Promise<TransactionResponse> {
    const Masonry = this.currentMasonry();
    return await Masonry.exit();
  }

  async getTreasuryNextAllocationTime(): Promise<AllocationTime> {
    const { Treasury } = this.contracts;
    const nextEpochTimestamp: BigNumber = await Treasury.nextEpochPoint();
    const nextAllocation = new Date(nextEpochTimestamp.mul(1000).toNumber());
    const prevAllocation = new Date(Date.now());

    return { from: prevAllocation, to: nextAllocation };
  }
  /**
   * This method calculates and returns in a from to to format
   * the period the user needs to wait before being allowed to claim
   * their reward from the masonry
   * @returns Promise<AllocationTime>
   */
  async getUserClaimRewardTime(): Promise<AllocationTime> {
    const { Masonry, Treasury } = this.contracts;
    const nextEpochTimestamp = await Masonry.nextEpochPoint(); //in unix timestamp
    const currentEpoch = await Masonry.epoch();
    const mason = await Masonry.members(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await Treasury.PERIOD();
    const periodInHours = period / 60 / 60; // 6 hours, period is displayed in seconds which is 21600
    const rewardLockupEpochs = await Masonry.rewardLockupEpochs();
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(rewardLockupEpochs);

    const fromDate = new Date(Date.now());
    if (targetEpochForClaimUnlock - currentEpoch <= 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - currentEpoch - 1;
      const endDate = moment(toDate)
        .add(delta * periodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  /**
   * This method calculates and returns in a from to to format
   * the period the user needs to wait before being allowed to unstake
   * from the masonry
   * @returns Promise<AllocationTime>
   */
  async getUserUnstakeTime(): Promise<AllocationTime> {
    const { Masonry, Treasury } = this.contracts;
    const nextEpochTimestamp = await Masonry.nextEpochPoint();
    const currentEpoch = await Masonry.epoch();
    const mason = await Masonry.members(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await Treasury.PERIOD();
    const PeriodInHours = period / 60 / 60;
    const withdrawLockupEpochs = await Masonry.withdrawLockupEpochs();
    const fromDate = new Date(Date.now());
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(withdrawLockupEpochs);
    const stakedAmount = await this.getStakedSharesOnMasonry();
    if (currentEpoch <= targetEpochForClaimUnlock && Number(stakedAmount) === 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - Number(currentEpoch) - 1;
      const endDate = moment(toDate)
        .add(delta * PeriodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  async watchAssetInMetamask(assetName: string): Promise<boolean> {
    const { ethereum } = window as any;

    let asset;
    let assetUrl;
    if (assetName === 'SNOW') {
      asset = this.TOMB;
      assetUrl = 'https://gateway.pinata.cloud/ipfs/QmVL6cK5iUmkfGhw41s4gCksHn4H4KoF2tnEin2fhbEMmQ';
    } else if (assetName === 'GLCR') {
      asset = this.TSHARE;
      assetUrl = 'https://gateway.pinata.cloud/ipfs/QmSkdqbueZTKDjb2oqKo6bEcn6qenA9Z6iiSNR1omHGVZx';
    } else if (assetName === 'SBOND') {
      asset = this.TBOND;
      assetUrl = 'https://gateway.pinata.cloud/ipfs/QmVCNLxo6vRUr3qCaNHJPwVL7jMGBf18FSa65zkeaHSbua';
    }
    await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: asset.address,
          symbol: asset.symbol,
          decimals: 18,
          image: assetUrl,
        },
      },
    });

    return true;
  }

  async provideTombFtmLP(ftmAmount: string, tombAmount: BigNumber): Promise<TransactionResponse> {
    const { TaxOffice } = this.contracts;
    let overrides = {
      value: parseUnits(ftmAmount, 18),
    };
    return await TaxOffice.addLiquidityETHTaxFree(
      tombAmount,
      tombAmount.mul(992).div(1000),
      parseUnits(ftmAmount, 18).mul(992).div(1000),
      overrides,
    );
  }

  async quoteFromSpooky(tokenAmount: string, tokenName: string): Promise<string> {
    const { SpookyRouter } = this.contracts;
    const { _reserve0, _reserve1 } = await this.TOMBWFTM_LP.getReserves();
    let quote;
    if (tokenName === 'TOMB') {
      quote = await SpookyRouter.quote(parseUnits(tokenAmount), _reserve1, _reserve0);
    } else {
      quote = await SpookyRouter.quote(parseUnits(tokenAmount), _reserve0, _reserve1);
    }
    return (quote / 1e18).toString();
  }

  /**
   * @returns an array of the regulation events till the most up to date epoch
   */
  async listenForRegulationsEvents(): Promise<any> {
    const { Treasury } = this.contracts;

    const treasuryDaoFundedFilter = Treasury.filters.DaoFundFunded();
    const treasuryDevFundedFilter = Treasury.filters.DevFundFunded();
    const treasuryMasonryFundedFilter = Treasury.filters.MasonryFunded();
    const boughtBondsFilter = Treasury.filters.BoughtBonds();
    const redeemBondsFilter = Treasury.filters.RedeemedBonds();

    let epochBlocksRanges: any[] = [];
    let masonryFundEvents = await Treasury.queryFilter(treasuryMasonryFundedFilter);
    var events: any[] = [];
    masonryFundEvents.forEach(function callback(value, index) {
      events.push({ epoch: index + 1 });
      events[index].masonryFund = getDisplayBalance(value.args[1]);
      if (index === 0) {
        epochBlocksRanges.push({
          index: index,
          startBlock: value.blockNumber,
          boughBonds: 0,
          redeemedBonds: 0,
        });
      }
      if (index > 0) {
        epochBlocksRanges.push({
          index: index,
          startBlock: value.blockNumber,
          boughBonds: 0,
          redeemedBonds: 0,
        });
        epochBlocksRanges[index - 1].endBlock = value.blockNumber;
      }
    });

    epochBlocksRanges.forEach(async (value, index) => {
      events[index].bondsBought = await this.getBondsWithFilterForPeriod(
        boughtBondsFilter,
        value.startBlock,
        value.endBlock,
      );
      events[index].bondsRedeemed = await this.getBondsWithFilterForPeriod(
        redeemBondsFilter,
        value.startBlock,
        value.endBlock,
      );
    });
    let DEVFundEvents = await Treasury.queryFilter(treasuryDevFundedFilter);
    DEVFundEvents.forEach(function callback(value, index) {
      events[index].devFund = getDisplayBalance(value.args[1]);
    });
    let DAOFundEvents = await Treasury.queryFilter(treasuryDaoFundedFilter);
    DAOFundEvents.forEach(function callback(value, index) {
      events[index].daoFund = getDisplayBalance(value.args[1]);
    });
    return events;
  }

  /**
   * Helper method
   * @param filter applied on the query to the treasury events
   * @param from block number
   * @param to block number
   * @returns the amount of bonds events emitted based on the filter provided during a specific period
   */
  async getBondsWithFilterForPeriod(filter: EventFilter, from: number, to: number): Promise<number> {
    const { Treasury } = this.contracts;
    const bondsAmount = await Treasury.queryFilter(filter, from, to);
    return bondsAmount.length;
  }

  async estimateZapIn(tokenName: string, lpName: string, amount: string): Promise<number[]> {
    const { zapper } = this.contracts;
    const lpToken = this.externalTokens[lpName];
    let estimate;
    if (parseFloat(amount) === 0) {
      return [0,0];
    }
    /*if (tokenName === FTM_TICKER) {
      estimate = await zapper.estimateZapIn(lpToken.address, SPOOKY_ROUTER_ADDR, parseUnits(amount, 18));
    } else {*/
      const token = tokenName === TOMB_TICKER ? this.TOMB : tokenName === TSHARE_TICKER ? this.TSHARE : this.FTM;
      estimate = await zapper.estimateZapInToken(
        token.address,
        lpToken.address,
        SPOOKY_ROUTER_ADDR,
        parseUnits(amount, 18),
      );
    /*}*/
    return [estimate[0] / 1e18, estimate[1] / 1e18];
  }
  async zapIn(tokenName: string, lpName: string, amount: string): Promise<TransactionResponse> {
    const { zapper } = this.contracts;
    const lpToken = this.externalTokens[lpName];
    /*if (tokenName === FTM_TICKER) {
      let overrides = {
        value: parseUnits(amount, 18),
      };
      return await zapper.zapIn(lpToken.address, SPOOKY_ROUTER_ADDR, this.myAccount, overrides);
    } else {*/
      const token = tokenName === TOMB_TICKER ? this.TOMB : (tokenName === TSHARE_TICKER ? this.TSHARE : tokenName === FTM_TICKER ? this.FTM : null);
      return await zapper.zapInToken(
        token.address,
        parseUnits(amount, token.decimal),
        lpToken.address,
        SPOOKY_ROUTER_ADDR,
        this.myAccount,
      );
    /*}*/
  }
  async swapTBondToTShare(tbondAmount: BigNumber): Promise<TransactionResponse> {
    const { TShareSwapper } = this.contracts;
    return await TShareSwapper.swapTBondToTShare(tbondAmount);
  }
  async estimateAmountOfTShare(tbondAmount: string): Promise<string> {
    const { TShareSwapper } = this.contracts;
    try {
      const estimateBN = await TShareSwapper.estimateAmountOfTShare(parseUnits(tbondAmount, 18));
      return getDisplayBalance(estimateBN, 18, 6);
    } catch (err) {
      console.error(`Failed to fetch estimate tshare amount: ${err}`);
    }
  }

  async getTShareSwapperStat(address: string): Promise<TShareSwapperStat> {
    const { TShareSwapper } = this.contracts;
    const tshareBalanceBN = await TShareSwapper.getTShareBalance();
    const tbondBalanceBN = await TShareSwapper.getTBondBalance(address);
    // TODO: update function name after abi change
    // const tombPriceBN = await TShareSwapper.getSnowPrice();
    // const tsharePriceBN = await TShareSwapper.getTSharePrice();
    const rateTSharePerTombBN = await TShareSwapper.getTShareAmountPerTomb();
    const tshareBalance = getDisplayBalance(tshareBalanceBN, 18, 5);
    const tbondBalance = getDisplayBalance(tbondBalanceBN, 18, 5);
    return {
      tshareBalance: tshareBalance.toString(),
      tbondBalance: tbondBalance.toString(),
      // tombPrice: tombPriceBN.toString(),
      // tsharePrice: tsharePriceBN.toString(),
      rateTSharePerTomb: rateTSharePerTombBN.toString(),
    };
  }

  async rebatesBond(token: string, amount: string): Promise<TransactionResponse> {
    const { RebateTreasury } = this.contracts;
    return await RebateTreasury.bond(token, amount);
  }

  async rebatesClaim(): Promise<TransactionResponse> {
    const { RebateTreasury } = this.contracts;
    return await RebateTreasury.claimRewards();
  }
}
