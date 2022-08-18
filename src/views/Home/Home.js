import React, { useMemo } from 'react';
import Page from '../../components/Page';
import styled from 'styled-components';
import HomeImage from '../../assets/img/SVG_Icons_and_web_bg/bg.svg';
import AvaxLogo from '../../assets/img/USDC.png';
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
  const { price: JOEPrice, marketCap: JOEMarketCap, priceChange: JOEPriceChange } = useFantomPrice();

  // let tomb;
  // let tShare;
  // if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  //   tomb = tombTesting;
  //   tShare = tShareTesting;
  // } else {
  //   tomb = tombProd;
  //   tShare = tShareProd;
  // }

  const buyTombAddress =
    'https://mm.finance/swap?inputCurrency=0x39D8fa99c9964D456b9fbD5e059e63442F314121&outputCurrency=0xE0B078b36D4203f0080D52A7a3b48e10F2f38203#/';
  const buyTShareAddress =
    'https://mm.finance/swap?inputCurrency=0x39D8fa99c9964D456b9fbD5e059e63442F314121&outputCurrency=0x79e576DA7B5359DbA5Aa08d8db6AA62394f80553#/';

  const tombLPStats = useMemo(() => (tombFtmLpStats ? tombFtmLpStats : null), [tombFtmLpStats]);
  const tshareLPStats = useMemo(() => (tShareFtmLpStats ? tShareFtmLpStats : null), [tShareFtmLpStats]);
  const tombPriceInDollars = useMemo(
    () => (tombStats ? Number(tombStats.priceInDollars).toFixed(2) : null),
    [tombStats],
  );
  const tombPriceInFTM = useMemo(() => (tombStats ? Number(tombStats.tokenInFtm).toFixed(4) : null), [tombStats]);
  const tombCirculatingSupply = useMemo(() => (tombStats ? String(tombStats.circulatingSupply) : null), [tombStats]);
  const tombTotalSupply = useMemo(() => (tombStats ? String(tombStats.totalSupply) : null), [tombStats]);

  const tSharePriceInDollars = useMemo(
    () => (tShareStats ? Number(tShareStats.priceInDollars).toFixed(2) : null),
    [tShareStats],
  );
  const tSharePriceInFTM = useMemo(
    () => (tShareStats ? Number(tShareStats.tokenInFtm).toFixed(4) : null),
    [tShareStats],
  );
  const tShareCirculatingSupply = useMemo(
    () => (tShareStats ? String(tShareStats.circulatingSupply) : null),
    [tShareStats],
  );
  const tShareTotalSupply = useMemo(() => (tShareStats ? String(tShareStats.totalSupply) : null), [tShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInFTM = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

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

  const Row = styled.div`
    align-items: center;
    display: flex;
    font-size: 16px;
    justify-content: space-between;
    margin-bottom: 8px;
  `;

  return (
    <Page>
      <BackgroundImage />
      <Grid container spacing={3}>
        <Grid item sm={12} md={6}>
          <Card>
            <CardContent style={{ position: 'relative' }}>
              <Box p={4}>
                <h1 style={{ textAlign: 'center' }}>My balance</h1>
              </Box>
              <Balances>
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
                        href="https://dexscreener.com/avalanche/0xc921265f76a662cDa289f0e2C2615ac493B262A9"
                        variant="contained"
                        style={{ marginTop: '10px', borderRadius: '10px', width: '27%', marginRight: '5%' }}
                        className={classes.tokenButton}
                      >
                        Chart
                      </Button>
                      <Button
                        color="primary"
                        target="_blank"
                        href="https://testnet.cronoscan.com/address/0xE0B078b36D4203f0080D52A7a3b48e10F2f38203#code"
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
                        href="https://dexscreener.com/avalanche/0xE9BCf02CDf63fF0794889487868B093711487FC7"
                        variant="contained"
                        style={{ marginTop: '10px', borderRadius: '10px', width: '27%', marginRight: '5%' }}
                        className={classes.tokenButton}
                      >
                        Chart
                      </Button>
                      <Button
                        color="primary"
                        target="_blank"
                        href="https://testnet.cronoscan.com/address/0x79e576DA7B5359DbA5Aa08d8db6AA62394f80553#code"
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
                        href="https://testnet.cronoscan.com/address/0xE426f672Bd21D72Ba127D075cE2c4f01eF6f76D7#code"
                        variant="contained"
                        style={{ marginTop: '10px', borderRadius: '10px', width: '27%', marginRight: '5%' }}
                        className={classes.tokenButton}
                      >
                        Contract
                      </Button>
                    </div>
                  </StyledBalance>
                </StyledBalanceWrapper>
              </Balances>
            </CardContent>
          </Card>
        </Grid>

        <Grid item sm={12} md={6} container direction="column" style={{ justifyContent: 'space-between' }}>
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
            Welcome to SnowCrystals
          </Typography>
          <Card>
            <CardContent
              style={{ margin: '37px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}
            >
              <div>
                <h1>Total Value Locked</h1>
                <CountUp style={{ fontSize: '40px' }} end={TVL} separator="," prefix="$" />
              </div>
              <img
                src={`${tvl}`}
                alt="tvl"
                style={!matches ? { width: 80, height: 80 } : { width: 128, height: 128 }}
              />
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
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
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
                  href={'https://mm.finance/swap?outputCurrency=0x39D8fa99c9964D456b9fbD5e059e63442F314121#/'}
                  variant="contained"
                  style={{ marginTop: '10px', borderRadius: '10px', width: '100%' }}
                  className={classes.button}
                >
                  Purchase
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', right: 5, top: 5 }}>
                <TokenSymbol symbol="TOMB" size={50} />
              </div>
              <h2 align="center">SNOW</h2>
              <p align="center">Current Price</p>
              <Box align="center">
                <span style={{ fontSize: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {tombPriceInFTM ? tombPriceInFTM : '-.----'}{' '}
                  <img alt="logo" style={{ width: '30px', marginLeft: '6px' }} src={AvaxLogo} />
                </span>
              </Box>
              <Box align="center" marginBottom={3}>
                <span style={{ fontSize: '16px', alignContent: 'flex-start' }}>
                  ${tombPriceInDollars ? tombPriceInDollars : '-.--'}
                </span>
              </Box>
              <Row>
                <span style={{ fontSize: '14px' }}>
                  Market Cap:
                  <br />
                  Circulating Supply: <br />
                  Total Supply: <br />
                  Tax:
                </span>
                <span style={{ fontSize: '14px', textAlign: 'right' }}>
                  ${(tombCirculatingSupply * tombPriceInDollars).toFixed(2)} <br />
                  {tombCirculatingSupply} <br />
                  {tombTotalSupply}
                </span>
              </Row>
              <Box>
                <Button
                  color="primary"
                  target="_blank"
                  href={buyTombAddress}
                  variant="contained"
                  style={{ marginTop: '10px', borderRadius: '10px', width: '100%' }}
                  className={classes.button}
                >
                  Purchase
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', right: 5, top: 5 }}>
                <TokenSymbol symbol="GLCR" size={50} />
              </div>
              <h2 align="center">GLCR</h2>
              <p align="center">Current Price</p>
              <Box align="center">
                <span style={{ fontSize: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {tSharePriceInFTM ? tSharePriceInFTM : '-.----'}{' '}
                  <img alt="logo" style={{ width: '30px', marginLeft: '6px' }} src={AvaxLogo} />
                </span>
              </Box>
              <Box align="center" marginBottom={3}>
                <span style={{ fontSize: '16px' }}>${tSharePriceInDollars ? tSharePriceInDollars : '-.--'}</span>
              </Box>
              <Row>
                <span style={{ fontSize: '14px' }}>
                  Market Cap: <br />
                  Circulating Supply: <br />
                  Total Supply:
                  <br />
                  &nbsp;
                </span>
                <span style={{ fontSize: '14px', textAlign: 'right' }}>
                  ${(tShareCirculatingSupply * tSharePriceInDollars).toFixed(2)} <br />
                  {tShareCirculatingSupply} <br />
                  {tShareTotalSupply}
                  <br />
                  &nbsp;
                </span>
              </Row>
              <Box>
                <Button
                  color="primary"
                  target="_blank"
                  href={buyTShareAddress}
                  variant="contained"
                  style={{ marginTop: '10px', borderRadius: '10px', width: '100%' }}
                  className={classes.button}
                >
                  Purchase
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', right: 5, top: 5 }}>
                <TokenSymbol symbol="SBOND" size={50} />
              </div>
              <h2 align="center">SBOND</h2>
              <p align="center">Current Price</p>
              <Box align="center">
                <span style={{ fontSize: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {tBondPriceInFTM ? tBondPriceInFTM : '-.----'}{' '}
                  <img alt="logo" style={{ width: '30px', marginLeft: '6px' }} src={AvaxLogo} />
                </span>
              </Box>
              <Box align="center" marginBottom={3}>
                <span style={{ fontSize: '16px' }}>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}</span>
              </Box>
              <Row>
                <span style={{ fontSize: '14px' }}>
                  Market Cap: <br />
                  Circulating Supply: <br />
                  Total Supply:
                  <br />
                  &nbsp;
                </span>
                <span style={{ fontSize: '14px', textAlign: 'right' }}>
                  ${(tBondCirculatingSupply * tBondPriceInDollars).toFixed(2)} <br />
                  {tBondCirculatingSupply} <br />
                  {tBondTotalSupply}
                  <br />
                  &nbsp;
                </span>
              </Row>
              <Box>
                <Button
                  color="primary"
                  target="_blank"
                  href="/bonds"
                  variant="contained"
                  style={{ marginTop: '10px', borderRadius: '10px', width: '100%' }}
                  className={classes.button}
                >
                  Bond
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

const StyledValue = styled.div`
  //color: ${(props) => props.theme.color.grey[300]};
  font-size: 30px;
  font-weight: 700;
`;

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 2.5%;
  margin-right: 2.5%;
`;

const Balances = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 2.5%;
  margin-right: 2.5%;
`;

const StyledBalanceWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  margin: 1%;
`;

export default Home;
