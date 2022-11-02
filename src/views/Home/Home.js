import React, { useMemo } from 'react';

import Page from '../../components/Page';
import styled from 'styled-components';
import HomeImage from '../../assets/img/SVG_Icons_and_web_bg/bg.svg';
import MetamaskFox from '../../assets/img/metamask-fox.svg';
import UsdcLogo from '../../assets/img/USDC.png';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import TokenSymbol from '../../components/TokenSymbol';
import useTombStats from '../../hooks/useTombStats';
import useLpStats from '../../hooks/useLpStats';
import useFantomPrice from '../../hooks/useFantomPrice.js';
import useBondStats from '../../hooks/useBondStats';
import usetShareStats from '../../hooks/usetShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';

import { Box, Button, CardContent, Grid, Typography, useMediaQuery } from '@material-ui/core';
import Card from '../../components/Card';
// import tvl from '../../assets/img/tvl.svg';
import tvl from '../../assets/img/TVL-Icon.png';

import { makeStyles } from '@material-ui/core/styles';
import useTombFinance from '../../hooks/useTombFinance';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';
import Label from '../../components/Label';
import useBank from '../../hooks/useBank';
import useModal from '../../hooks/useModal';
import WrapperRouterModal from '../Bank/components/WrapperRouterModal';
import useWrapperRouter from '../../hooks/useWrapperRouter';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      marginTop: '10px',
    },
    backgroundColor: '#284C7B',
  },
  tokenButton: {},
  '@media only screen and (max-width: 1200px)': {
    tokenButton: {
      fontSize: '12px',
      marginRight: '4%',
    },
  },
  flex: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flexStart',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  '@media only screen and (max-width: 850px)': {
    tokenButton: {
      width: '40% !important',
    },
  },
  '@media only screen and (max-width: 670px)': {
    tokenButton: {
      width: '80% !important',
    },
  },
}));

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 16px;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Ols = styled.ol`
  list-style: none;
  margin: -30px 0 0 0;
`;

const Lis = styled.li`
  & {
    font-size: 16px;
    counter-increment: step-counter;
    position: relative;
    margin: 10px 0 0 0;
  }
  &:before {
    content: counter(step-counter);
    display: inline-block;
    position: absolute;
    top: -1px;
    /* Adjust < -number | number+ > */
    left: -32px;
    width: 1.25rem;
    height: 1.25rem;
    line-height: 1.25rem;
    background-color: rgb(0, 200, 200);
    color: white;
    font-weight: bold;
    font-size: 0.8rem;
    text-align: center;
    border-radius: 15px;
  }
`;

const Home = () => {
  const matches = useMediaQuery('(min-width:600px)');
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const tombFtmLpStats = useLpStats('SNOW-USDC-LP');
  const tShareFtmLpStats = useLpStats('GLCR-USDC-LP');
  const tombStats = useTombStats();
  const tShareStats = usetShareStats();
  const tBondStats = useBondStats();
  const tombFinance = useTombFinance();
  // const { price: JOEPrice, marketCap: JOEMarketCap, priceChange: JOEPriceChange } = useFantomPrice();

  const tombBank = useBank('SnowUsdcLPGlcrRewardPool');
  const tShareBank = useBank('GlcrUsdcLPGlcrRewardPool');
  const { onAddTombLiquidity } = useWrapperRouter(tombBank);
  const { onAddTshareLiquidity } = useWrapperRouter(tShareBank);

  const [onPresentTombZap, onDissmissTombZap] = useModal(
    <WrapperRouterModal
      decimals={tombBank.depositToken.decimal}
      onConfirm={(zappingToken, amount, ftmAmount, lpAmount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount)) || Number(ftmAmount) <= 0 || isNaN(Number(ftmAmount))) return;
        // setLiquidityToken(zappingToken);
        onAddTombLiquidity(zappingToken, amount, ftmAmount, lpAmount);
        onDissmissTombZap();
      }}
      tokenName={tombBank.depositTokenName}
    />,
  );
  const [onPresentTshareZap, onDissmissTshareZap] = useModal(
    <WrapperRouterModal
      decimals={tShareBank.depositToken.decimal}
      onConfirm={(zappingToken, amount, ftmAmount, lpAmount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount)) || Number(ftmAmount) <= 0 || isNaN(Number(ftmAmount))) return;
        // setLiquidityToken(zappingToken);
        onAddTshareLiquidity(zappingToken, amount, ftmAmount, lpAmount);
        onDissmissTshareZap();
      }}
      tokenName={tShareBank.depositTokenName}
    />,
  );

  const buyTombAddress =
    'https://mm.finance/swap?inputCurrency=0xc3F95DeDacFEA28a3d657FfbCc74e9BaB6FB949B&outputCurrency=0x05a3F4E0ad6580D9d977F5eE12F168620f4F71e9#/';
  const buyTShareAddress =
    'https://mm.finance/swap?inputCurrency=0xc3F95DeDacFEA28a3d657FfbCc74e9BaB6FB949B&outputCurrency=0xbe27f32D9F731CC9DddAfE3ddaA7CBBC0f58b414#/';

  const tombChart = 'https://dexscreener.com/avalanche/0xbFCF9D86CFb0E1E58F63F7e0b9861A4Db204D3a7';
  const tshareChart = 'https://dexscreener.com/avalanche/0xB4586CAb2e3Aa47A3586854AfD35592a78D62cF3';

  const tombContract = 'https://testnet.cronoscan.com/address/0x05a3F4E0ad6580D9d977F5eE12F168620f4F71e9#code';
  const tshareContract = 'https://testnet.cronoscan.com/address/0xbe27f32D9F731CC9DddAfE3ddaA7CBBC0f58b414#code';
  const tbondContract = 'https://testnet.cronoscan.com/address/0x66608790511b4d7B5f179d3b65f68A3Aa42347b0#code';

  const tombLPStats = useMemo(() => (tombFtmLpStats ? tombFtmLpStats : null), [tombFtmLpStats]);
  const tshareLPStats = useMemo(() => (tShareFtmLpStats ? tShareFtmLpStats : null), [tShareFtmLpStats]);
  const tombPriceInDollars = useMemo(
    () => (tombStats ? Number(tombStats.priceInDollars).toFixed(2) : null),
    [tombStats],
  );
  const tombPriceInFTM = useMemo(() => (tombStats ? Number(tombStats.tokenInFtm).toFixed(4) : null), [tombStats]);
  const tombCirculatingSupply = useMemo(() => (tombStats ? Number(tombStats.circulatingSupply) : null), [tombStats]);
  const tombTotalSupply = useMemo(() => (tombStats ? Number(tombStats.totalSupply) : null), [tombStats]);
  const tombTotalBurned = useMemo(() => (tombStats ? Number(tombStats.totalBurned) : null), [tombStats]);
  const tombTax = useMemo(() => (tombStats ? Number(tombStats.totalTax).toFixed(2) : null), [tombStats]);
  const tombBurnedPercentage = useMemo(
    () => (tombStats ? Number((tombTotalBurned * 100) / (tombCirculatingSupply + tombTotalBurned)).toFixed(2) : null),
    [tombStats],
  );

  const tSharePriceInDollars = useMemo(
    () => (tShareStats ? Number(tShareStats.priceInDollars).toFixed(2) : null),
    [tShareStats],
  );
  const tSharePriceInFTM = useMemo(
    () => (tShareStats ? Number(tShareStats.tokenInFtm).toFixed(4) : null),
    [tShareStats],
  );
  const tShareCirculatingSupply = useMemo(
    () => (tShareStats ? Number(tShareStats.circulatingSupply) : null),
    [tShareStats],
  );
  const tShareTotalSupply = useMemo(() => (tShareStats ? Number(tShareStats.totalSupply) : null), [tShareStats]);
  const tShareTax = useMemo(() => (tShareStats ? Number(tShareStats.totalTax) : null), [tShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInFTM = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? Number(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? Number(tBondStats.totalSupply) : null), [tBondStats]);

  const tombBalance = useTokenBalance(tombFinance.TOMB);
  const displayTombBalance = useMemo(() => getDisplayBalance(tombBalance), [tombBalance]);
  const tombBalanceInDollars =
    tombPriceInDollars && tombBalance
      ? (Number(tombPriceInDollars) * tombBalance.div('1000000000000000000').toNumber()).toFixed(2)
      : null;

  const tShareBalance = useTokenBalance(tombFinance.TSHARE);
  const displayTShareBalance = useMemo(() => getDisplayBalance(tShareBalance), [tShareBalance]);
  const tShareBalanceInDollars =
    tSharePriceInDollars && tShareBalance
      ? (Number(tSharePriceInDollars) * tShareBalance.div('1000000000000000000').toNumber()).toFixed(2)
      : null;

  const tBondBalance = useTokenBalance(tombFinance.TBOND);
  const displayTBondBalance = useMemo(() => getDisplayBalance(tBondBalance), [tBondBalance]);
  const tBondBalanceInDollars =
    tBondPriceInDollars && displayTBondBalance
      ? (Number(tBondPriceInDollars) * tBondBalance.div('1000000000000000000').toNumber()).toFixed(2)
      : null;

  return (
    <Page>
      <BackgroundImage />
      <Grid container spacing={6} justify="center">
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent style={{ position: 'relative' }}>
              <Box p={4}>
                <h1 style={{ textAlign: 'center' }}>SNOWCRYSTALS NEWS</h1>
              </Box>

              <Ols>
                <Lis>
                  $SNOW is pegged to $USDC with <b>BURN and BONUS REWARD</b> mechanisam.
                </Lis>
                <Lis>
                  <b>Ownership of $SNOW and $SBOND renounced</b>, only Treasury can mint $SNOW and $SBOND
                </Lis>
                <Lis>
                  48 hr Genesis Pool starts on <b>19th Sep 2022 12 AM UTC.</b>
                </Lis>
                <Lis>
                  BoardRoom will open on <b>20th Sep 2022 6 PM UTC.</b>
                </Lis>
                <Lis>First 28 EPOCH are bootstrap with the expansion rate of 4%.</Lis>

                <Lis>
                  Based on $SNOW TWAP price, BONUS REWARD will destribute to SNOW-USDC Node and $GLCR Farm Pool using
                  $SBOND (will be added in future).
                </Lis>
                <Lis>
                  Buy <b>10% discounted</b> $GLCR using Rebates with $USDC or SNOW-USDC LP.
                </Lis>
              </Ols>

              {/* <Balances>
                <StyledBalanceWrapper>
                  <TokenSymbol symbol="TOMB" />
                  <StyledBalance>
                    <StyledValue>{displayTombBalance}</StyledValue>
                    <Label text="SNOW available" variant="noraml" />
                    <span style={{ fontSize: '15px', marginLeft: '2%' }}>
                      (${tombBalanceInDollars ? tombBalanceInDollars : '-.----'})
                    </span>
                    <div className={classes.flex}>
                      <Button
                        color="primary"
                        target="_blank"
                        href={buyTombAddress}
                        variant="contained"
                        style={{ marginTop: '10px', borderRadius: '10px', width: '27%', marginRight: '5%' }}
                        className={classes.tokenButton}
                      >
                        Buy
                      </Button>
                      <Button
                        color="primary"
                        target="_blank"
                        href={tombChart}
                        variant="contained"
                        style={{ marginTop: '10px', borderRadius: '10px', width: '27%', marginRight: '5%' }}
                        className={classes.tokenButton}
                      >
                        Chart
                      </Button>
                      <Button
                        color="primary"
                        target="_blank"
                        href={tombContract}
                        variant="contained"
                        style={{ marginTop: '10px', borderRadius: '10px', width: '27%', marginRight: '5%' }}
                        className={classes.tokenButton}
                      >
                        Contract
                      </Button>
                    </div>
                  </StyledBalance>
                </StyledBalanceWrapper>
                <StyledBalanceWrapper>
                  <TokenSymbol symbol="GLCR" />
                  <StyledBalance>
                    <StyledValue>{displayTShareBalance}</StyledValue>
                    <Label text="GLCR available" variant="noraml" />
                    <span style={{ fontSize: '15px', marginLeft: '2%' }}>
                      (${tShareBalanceInDollars ? tShareBalanceInDollars : '-.----'})
                    </span>
                    <div className={classes.flex}>
                      <Button
                        color="primary"
                        target="_blank"
                        href={buyTShareAddress}
                        variant="contained"
                        style={{ marginTop: '10px', borderRadius: '10px', width: '27%', marginRight: '5%' }}
                        className={classes.tokenButton}
                      >
                        Buy
                      </Button>
                      <Button
                        color="primary"
                        target="_blank"
                        href={tshareChart}
                        variant="contained"
                        style={{ marginTop: '10px', borderRadius: '10px', width: '27%', marginRight: '5%' }}
                        className={classes.tokenButton}
                      >
                        Chart
                      </Button>
                      <Button
                        color="primary"
                        target="_blank"
                        href={tshareContract}
                        variant="contained"
                        style={{ marginTop: '10px', borderRadius: '10px', width: '27%', marginRight: '5%' }}
                        className={classes.tokenButton}
                      >
                        Contract
                      </Button>
                    </div>
                  </StyledBalance>
                </StyledBalanceWrapper>
                <StyledBalanceWrapper>
                  <TokenSymbol symbol="SBOND" />
                  <StyledBalance>
                    <StyledValue>{displayTBondBalance}</StyledValue>
                    <Label text="SBOND available" variant="noraml" />
                    <span style={{ fontSize: '15px', marginLeft: '2%' }}>
                      (${tBondBalanceInDollars ? tBondBalanceInDollars : '-.----'})
                    </span>
                    <div className={classes.flex}>
                      <Button
                        color="primary"
                        href="/bonds"
                        variant="contained"
                        style={{ marginTop: '10px', borderRadius: '10px', width: '27%', marginRight: '5%' }}
                        className={classes.tokenButton}
                      >
                        Bond
                      </Button>
                      <Button
                        color="primary"
                        target="_blank"
                        href={tbondContract}
                        variant="contained"
                        style={{ marginTop: '10px', borderRadius: '10px', width: '27%', marginRight: '5%' }}
                        className={classes.tokenButton}
                      >
                        Contract
                      </Button>
                    </div>
                  </StyledBalance>
                </StyledBalanceWrapper>
              </Balances> */}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} container direction="column" style={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h1"
            style={{
              fontWeight: 900,
              textAlign: 'center',
              fontSize: 50,
              ...(!matches ? { fontSize: 36 } : {}),
            }}
            gutterBottom
          >
            WELCOME TO SNOWCRYSTALS
          </Typography>
          <Card>
            <CardContent
              style={{ margin: '37px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}
            >
              <div>
                <h1>Total Value Locked</h1>
                <CountUp style={{ fontSize: '50px' }} end={TVL} separator="," prefix="$" />
              </div>
              {/* <img
                src={`${tvl}`}
                alt="tvl"
                style={!matches ? { width: 80, height: 80 } : { width: 128, height: 128 }}
              /> */}
            </CardContent>
          </Card>
        </Grid>

        {/* <Grid item xs={12} sm={3}>
          <Card>
            <CardContent style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', right: 5, top: 5 }}>
                <TokenSymbol symbol="USDC" size={50} />
              </div>
              <h2 align="center">USDC</h2>
              <p align="center">Current Price</p>
              <Box align="center">
                <span style={{ fontSize: '30px' }}>${JOEPrice ? JOEPrice : '-.----'}</span>
              </Box>
              <Box align="center" marginBottom={3}>
                &nbsp;
              </Box>
              <Row>
                <span style={{ fontSize: '14px' }}>
                  Market Cap:
                  <br />
                  24h Price Change: <br />
                  &nbsp; <br />
                  &nbsp;
                </span>
                <span style={{ fontSize: '14px', textAlign: 'right' }}>
                  ${JOEMarketCap} <br />
                  {JOEPriceChange.toFixed(2)}% <br />
                  &nbsp;
                  <br />
                  &nbsp;
                </span>
              </Row>
              <Box>
                <Button
                  color="primary"
                  target="_blank"
                  href={'https://mm.finance/swap?outputCurrency=0xc3F95DeDacFEA28a3d657FfbCc74e9BaB6FB949B#/'}
                  variant="contained"
                  style={{ marginTop: '10px', borderRadius: '10px', width: '100%' }}
                  className={classes.button}
                >
                  Purchase
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid> */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', right: 10, top: 10 }}>
                <TokenSymbol symbol="TOMB" size={50} />
              </div>
              <div>
                <Button
                  onClick={() => {
                    tombFinance.watchAssetInMetamask('SNOW');
                  }}
                  style={{
                    position: 'absolute',
                    'background-image':
                      'linear-gradient(hsla(170, 77%, 83%, 0.2), hsla(202, 81%, 86%, 0.2), hsla(0, 97%, 85%, 0.2))',
                  }}
                >
                  <b>+</b>&nbsp;&nbsp;
                  <img alt="metamask fox" style={{ width: '20px', filter: 'grayscale(30%)' }} src={MetamaskFox} />
                </Button>
              </div>
              <h2 align="center">SNOW</h2>
              <p align="center">Current Price</p>
              <Box align="center">
                <span
                  style={{
                    fontSize: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  {tombPriceInFTM ? tombPriceInFTM : '-.----'}{' '}
                  <img alt="logo" style={{ width: '30px', marginLeft: '6px' }} src={UsdcLogo} />
                </span>
              </Box>
              <Box align="center" marginBottom={3}>
                <span style={{ fontSize: '16px', alignContent: 'flex-start', fontWeight: 'bold' }}>
                  ${tombPriceInDollars ? tombPriceInDollars : '-.--'}
                </span>
              </Box>

              <Row>
                <span style={{ fontSize: '14px' }}>
                  Market Cap:
                  <br />
                  Circulating Supply: <br />
                  Total Burned: <br />
                  Sell Tax: <br />
                  &nbsp;
                </span>
                <span style={{ fontSize: '14px', textAlign: 'right', fontWeight: 'bold' }}>
                  ${(tombCirculatingSupply * tombPriceInDollars).toFixed(2)} <br />
                  {tombCirculatingSupply} <br />
                  {tombTotalBurned ? tombTotalBurned + ' (' + tombBurnedPercentage + '%)' : ''}
                  <br />
                  {tombTax ? tombTax + '%' : ''} <br />
                  &nbsp;
                </span>
              </Row>
              <Box>
                <Row>
                  <Button
                    color="primary"
                    target="_blank"
                    href={buyTombAddress}
                    variant="contained"
                    style={{
                      marginTop: '10px',
                      marginRight: '10px',
                      marginLeft: '10px',
                      borderRadius: '10px',
                      width: '100%',
                    }}
                    className={classes.button}
                  >
                    Purchase
                  </Button>
                  <Button
                    color="primary"
                    target="_blank"
                    href={tombContract}
                    variant="contained"
                    style={{
                      marginTop: '10px',
                      marginRight: '10px',
                      marginLeft: '10px',
                      borderRadius: '10px',
                      width: '100%',
                    }}
                    className={classes.button}
                  >
                    Contract
                  </Button>
                </Row>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', right: 5, top: 5 }}>
                <TokenSymbol symbol="GLCR" size={50} />
              </div>
              <div>
                <Button
                  onClick={() => {
                    tombFinance.watchAssetInMetamask('GLCR');
                  }}
                  style={{
                    position: 'absolute',
                    'background-image':
                      'linear-gradient(hsla(170, 77%, 83%, 0.2), hsla(202, 81%, 86%, 0.2), hsla(0, 97%, 85%, 0.2))',
                  }}
                >
                  <b>+</b>&nbsp;&nbsp;
                  <img alt="metamask fox" style={{ width: '20px', filter: 'grayscale(30%)' }} src={MetamaskFox} />
                </Button>
              </div>
              <h2 align="center">GLCR</h2>
              <p align="center">Current Price</p>
              <Box align="center">
                <span
                  style={{
                    fontSize: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  {tSharePriceInFTM ? tSharePriceInFTM : '-.----'}{' '}
                  <img alt="logo" style={{ width: '30px', marginLeft: '6px' }} src={UsdcLogo} />
                </span>
              </Box>
              <Box align="center" marginBottom={3}>
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  ${tSharePriceInDollars ? tSharePriceInDollars : '-.--'}
                </span>
              </Box>
              <Row>
                <span style={{ fontSize: '14px' }}>
                  Market Cap: <br />
                  Circulating Supply: <br />
                  Total Supply:
                  <br />
                  Sell Tax: <br />
                  &nbsp;
                </span>
                <span style={{ fontSize: '14px', textAlign: 'right', fontWeight: 'bold' }}>
                  ${(tShareCirculatingSupply * tSharePriceInDollars).toFixed(2)} <br />
                  {tShareCirculatingSupply} <br />
                  {tShareTotalSupply}
                  <br />
                  {tShareTax ? tShareTax + '%' : ''} <br />
                  &nbsp;
                </span>
              </Row>
              <Box>
                <Row>
                  <Button
                    color="primary"
                    target="_blank"
                    href={buyTShareAddress}
                    variant="contained"
                    style={{
                      marginTop: '10px',
                      marginRight: '10px',
                      marginLeft: '10px',
                      borderRadius: '10px',
                      width: '100%',
                    }}
                    className={classes.button}
                  >
                    Purchase
                  </Button>
                  <Button
                    color="primary"
                    target="_blank"
                    href={tshareContract}
                    variant="contained"
                    style={{
                      marginTop: '10px',
                      marginRight: '10px',
                      marginLeft: '10px',
                      borderRadius: '10px',
                      width: '100%',
                    }}
                    className={classes.button}
                  >
                    Contract
                  </Button>
                </Row>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', right: 5, top: 5 }}>
                <TokenSymbol symbol="SBOND" size={50} />
              </div>
              <div>
                <Button
                  onClick={() => {
                    tombFinance.watchAssetInMetamask('SBOND');
                  }}
                  style={{
                    position: 'absolute',
                    'background-image':
                      'linear-gradient(hsla(170, 77%, 83%, 0.2), hsla(202, 81%, 86%, 0.2), hsla(0, 97%, 85%, 0.2))',
                  }}
                >
                  <b>+</b>&nbsp;&nbsp;
                  <img alt="metamask fox" style={{ width: '20px', filter: 'grayscale(30%)' }} src={MetamaskFox} />
                </Button>
              </div>
              <h2 align="center">SBOND</h2>
              <p align="center">Current Price</p>
              <Box align="center">
                <span
                  style={{
                    fontSize: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  {tBondPriceInFTM ? tBondPriceInFTM : '-.----'}{' '}
                  <img alt="logo" style={{ width: '30px', marginLeft: '6px' }} src={UsdcLogo} />
                </span>
              </Box>
              <Box align="center" marginBottom={3}>
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  ${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}
                </span>
              </Box>
              <Row>
                <span style={{ fontSize: '14px' }}>
                  Market Cap: <br />
                  Circulating Supply: <br />
                  Total Supply:
                  <br />
                  <br />
                  &nbsp;
                </span>
                <span style={{ fontSize: '14px', textAlign: 'right', fontWeight: 'bold' }}>
                  ${(tBondCirculatingSupply * tBondPriceInDollars).toFixed(2)} <br />
                  {tBondCirculatingSupply} <br />
                  {tBondTotalSupply}
                  <br />
                  <br />
                  &nbsp;
                </span>
              </Row>
              <Box>
                <Row>
                  <Button
                    color="primary"
                    target="_blank"
                    href="/bonds"
                    variant="contained"
                    style={{
                      marginTop: '10px',
                      marginRight: '10px',
                      marginLeft: '10px',
                      borderRadius: '10px',
                      width: '100%',
                    }}
                    className={classes.button}
                  >
                    Bond
                  </Button>
                  <Button
                    color="primary"
                    target="_blank"
                    href={tbondContract}
                    variant="contained"
                    style={{
                      marginTop: '10px',
                      marginRight: '10px',
                      marginLeft: '10px',
                      borderRadius: '10px',
                      width: '100%',
                    }}
                    className={classes.button}
                  >
                    Contract
                  </Button>
                </Row>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent align="center">
              <h2>SNOW-USDC LP</h2>
              <div style={{ position: 'absolute', right: 5, top: 5 }}>
                <TokenSymbol size={50} symbol="SNOW-USDC-LP" />
              </div>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {tombLPStats?.tokenAmount ? tombLPStats?.tokenAmount : '-.--'} SNOW /{' '}
                  {tombLPStats?.ftmAmount ? tombLPStats?.ftmAmount : '-.--'} USDC
                </span>
              </Box>
              <Box>${tombLPStats?.priceOfOne ? tombLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: ${tombLPStats?.totalLiquidity ? tombLPStats.totalLiquidity : '-.--'} <br />
                Total supply:{' '}
                {tombLPStats?.totalSupply
                  ? Number(tombLPStats.totalSupply) < 1 / 10 ** 4
                    ? (Number(tombLPStats.totalSupply) * 10 ** 6).toFixed(4) + 'µ'
                    : tombLPStats.totalSupply
                  : '-.--'}
              </span>
              <Box>
                <Row>
                  <Button
                    color="primary"
                    variant="contained"
                    style={{
                      marginTop: '10px',
                      marginRight: '10px',
                      marginLeft: '10px',
                      borderRadius: '10px',
                      width: '100%',
                    }}
                    className={classes.button}
                    disabled={tombBank.closedForStaking}
                    onClick={() => (tombBank.closedForStaking ? null : onPresentTombZap())}
                  >
                    Create LP
                  </Button>
                  <Button
                    color="primary"
                    target="_blank"
                    href={tombChart}
                    variant="contained"
                    style={{
                      marginTop: '10px',
                      marginRight: '10px',
                      marginLeft: '10px',
                      borderRadius: '10px',
                      width: '100%',
                    }}
                    className={classes.button}
                  >
                    Chart
                  </Button>
                </Row>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent align="center">
              <h2>GLCR-USDC LP</h2>
              <div style={{ position: 'absolute', right: 5, top: 5 }}>
                <TokenSymbol size={50} symbol="GLCR-USDC-LP" />
              </div>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {tshareLPStats?.tokenAmount ? tshareLPStats?.tokenAmount : '-.--'} GLCR /{' '}
                  {tshareLPStats?.ftmAmount ? tshareLPStats?.ftmAmount : '-.--'} USDC
                </span>
              </Box>
              <Box>${tshareLPStats?.priceOfOne ? tshareLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: ${tshareLPStats?.totalLiquidity ? tshareLPStats.totalLiquidity : '-.--'}
                <br />
                Total supply:{' '}
                {tshareLPStats?.totalSupply
                  ? Number(tshareLPStats.totalSupply) < 1 / 10 ** 4
                    ? (Number(tshareLPStats.totalSupply) * 10 ** 6).toFixed(4) + 'µ'
                    : tshareLPStats.totalSupply
                  : '-.--'}
              </span>
              <Box>
                <Row>
                  <Button
                    color="primary"
                    variant="contained"
                    style={{
                      marginTop: '10px',
                      marginRight: '10px',
                      marginLeft: '10px',
                      borderRadius: '10px',
                      width: '100%',
                    }}
                    className={classes.button}
                    disabled={tombBank.closedForStaking}
                    onClick={() => (tombBank.closedForStaking ? null : onPresentTshareZap())}
                  >
                    Create LP
                  </Button>
                  <Button
                    color="primary"
                    target="_blank"
                    href={tshareChart}
                    variant="contained"
                    style={{
                      marginTop: '10px',
                      marginRight: '10px',
                      marginLeft: '10px',
                      borderRadius: '10px',
                      width: '100%',
                    }}
                    className={classes.button}
                  >
                    Chart
                  </Button>
                </Row>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

// const StyledValue = styled.div`
//   //color: ${(props) => props.theme.color.grey[300]};
//   font-size: 30px;
//   font-weight: 700;
// `;

// const StyledBalance = styled.div`
//   align-items: center;
//   display: flex;
//   flex-direction: row;
//   flex-wrap: wrap;
//   margin-left: 2.5%;
//   margin-right: 2.5%;
// `;

// const Balances = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   margin-left: 2.5%;
//   margin-right: 2.5%;
// `;

// const StyledBalanceWrapper = styled.div`
//   align-items: center;
//   display: flex;
//   flex-direction: row;
//   margin: 1%;
// `;

export default Home;
