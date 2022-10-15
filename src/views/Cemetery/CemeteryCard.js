import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, CardActions, CardContent, Typography, Grid } from '@material-ui/core';
import Card from '../../components/Card';

import TokenSymbol from '../../components/TokenSymbol';
import useLpStats from '../../hooks/useLpStats';
import useBank from '../../hooks/useBank';
import useStatsForPool from '../../hooks/useStatsForPool';
// import useCashStat from '../../hooks/useCashPriceInEstimatedTWAP.ts';

import useModal from '../../hooks/useModal';
import WrapperRouterModal from '../Bank/components/WrapperRouterModal';
import useWrapperRouter from '../../hooks/useWrapperRouter';

const CemeteryCard = () => {
  const tombFtmLpStats = useLpStats('SNOW-USDC-LP');
  const tShareFtmLpStats = useLpStats('GLCR-USDC-LP');
  // const snoSnoShareLpStats = useLpStats('SNO-SNOSHARE-LP');
  const tombLPStats = useMemo(() => (tombFtmLpStats ? tombFtmLpStats : null), [tombFtmLpStats]);
  const tshareLPStats = useMemo(() => (tShareFtmLpStats ? tShareFtmLpStats : null), [tShareFtmLpStats]);

  const tombBank = useBank('SnowUsdcLPGlcrRewardPool');
  const tombStatsOnPool = useStatsForPool(tombBank);

  const tShareBank = useBank('GlcrUsdcLPGlcrRewardPool');
  const tShareStatsOnPool = useStatsForPool(tShareBank);

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

  // const snoSnoShareLPStats = useMemo(() => (snoSnoShareLpStats ? snoSnoShareLpStats : null), [snoSnoShareLpStats]);
  // const snoPrice = useCashStat();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Card>
          <CardContent
            style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', textAlign: 'center' }}
          >
            <div>
              <Typography variant="h5" component="h2">
                SNOW-USDC LP
              </Typography>
              <TokenSymbol size={60} symbol="SNOW-USDC-LP" />
            </div>
            <div>
              <span style={{ fontSize: '23px' }}>
                {tombLPStats?.tokenAmount ? tombLPStats?.tokenAmount : '-.--'} SNOW /{' '}
                {tombLPStats?.ftmAmount ? tombLPStats?.ftmAmount : '-.--'} USDC
              </span>
              <Box>${tombLPStats?.priceOfOne ? tombLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: ${tombLPStats?.totalLiquidity ? tombLPStats.totalLiquidity : '-.--'} <br />
                Total supply:{' '}
                {tombLPStats?.totalSupply
                  ? Number(tombLPStats.totalSupply) < 1 / 10 ** 4
                    ? (Number(tombLPStats.totalSupply) * 10 ** 6).toFixed(4) + 'µ'
                    : tombLPStats.totalSupply
                  : '-.--'}{' '}
                <br />
                APR: {tombStatsOnPool?.yearlyAPR ? tombStatsOnPool?.yearlyAPR : '----.--'}%
              </span>
            </div>
          </CardContent>
          <CardActions style={{ justifyContent: 'center' }}>
            <Button
              color="primary"
              style={{ width: '150px', height: '45px', marginBottom: '5%' }}
              variant="contained"
              component={Link}
              to={`/farms/SnowUsdcLPGlcrRewardPool/`}
            >
              Farm
            </Button>
            <Button
              color="primary"
              style={{ width: '150px', height: '45px', marginBottom: '5%' }}
              variant="contained"
              disabled={tombBank.closedForStaking}
              onClick={() => (tombBank.closedForStaking ? null : onPresentTombZap())}
            >
              Add Liquidity
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card>
          <CardContent
            style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', textAlign: 'center' }}
          >
            <div>
              <Typography variant="h5" component="h2">
                GLCR-USDC LP
              </Typography>
              <TokenSymbol size={60} symbol="GLCR-USDC-LP" />
            </div>
            <div>
              <span style={{ fontSize: '23px' }}>
                {tshareLPStats?.tokenAmount ? tshareLPStats?.tokenAmount : '-.--'} GLCR /{' '}
                {tshareLPStats?.ftmAmount ? tshareLPStats?.ftmAmount : '-.--'} USDC
              </span>

              <Box>${tshareLPStats?.priceOfOne ? tshareLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: ${tshareLPStats?.totalLiquidity ? tshareLPStats.totalLiquidity : '-.--'} <br />
                Total supply:{' '}
                {tshareLPStats?.totalSupply
                  ? Number(tshareLPStats.totalSupply) < 1 / 10 ** 4
                    ? (Number(tshareLPStats.totalSupply) * 10 ** 6).toFixed(4) + 'µ'
                    : tshareLPStats.totalSupply
                  : '-.--'}{' '}
                <br />
                APR: {tShareStatsOnPool?.yearlyAPR ? tShareStatsOnPool?.yearlyAPR : '----.--'}%
              </span>
            </div>
          </CardContent>
          <CardActions style={{ justifyContent: 'center' }}>
            <Button
              color="primary"
              style={{ width: '150px', height: '45px', marginBottom: '5%' }}
              variant="contained"
              component={Link}
              to={`/farms/GlcrUsdcLPGlcrRewardPool/`}
            >
              Farm
            </Button>
            <Button
              color="primary"
              style={{ width: '150px', height: '45px', marginBottom: '5%' }}
              variant="contained"
              disabled={tShareBank.closedForStaking}
              onClick={() => (tShareBank.closedForStaking ? null : onPresentTshareZap())}
            >
              Add Liquidity
            </Button>
          </CardActions>
        </Card>
      </Grid>
      {/* <Grid item xs={12} sm={6}>
        <Card>
          <CardContent
            style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', textAlign: 'center' }}
          >
            <div>
              <Typography variant="h5" component="h2">
                SNOW-GLCR-LP
              </Typography>
              <TokenSymbol symbol="SNOW-GLCR-LP" size={60} />
            </div>
            <div>
              <span style={{ fontSize: '23px' }}>
                {snoSnoShareLPStats?.ftmAmount ? snoSnoShareLPStats?.ftmAmount : '-.--'} SNOW /{' '}
                {snoSnoShareLPStats?.tokenAmount ? snoSnoShareLPStats?.tokenAmount : '-.--'} GLCR
              </span>
              <Box>${snoSnoShareLPStats?.priceOfOne ? snoSnoShareLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: ${snoSnoShareLPStats?.totalLiquidity ? snoSnoShareLPStats.totalLiquidity : '-.--'}
                <br />
                Total supply: {snoSnoShareLPStats?.totalSupply ? snoSnoShareLPStats.totalSupply : '-.--'}
              </span>
            </div>
          </CardContent>
          <CardActions style={{ justifyContent: 'center' }}>
            <Button
              color="primary"
              style={{ width: '150px', height: '45px', marginBottom: '5%' }}
              variant="contained"
              component={Link}
              to={`/farms/SnoSnoShareLPSnoShareRewardPool/`}
            >
              Farm
            </Button>
            <Button
              color="primary"
              target="_blank"
              style={{ width: '150px', height: '45px', marginBottom: '5%' }}
              variant="contained"
              href="https://mm.finance/add/0x1fE4869f2C5181b9CD780a7E16194FA2c4C4293D/0xe7A102Fbc8AB3581d62830DdB599eCCaae5e7875"
            >
              Add Liquidity
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card>
          <CardContent
            style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', textAlign: 'center' }}
          >
            <div>
              <Typography variant="h5" component="h2">
                SNOW
              </Typography>
              <TokenSymbol symbol="SNO" size={60} />
            </div>
            <div>
              SINGLE STAKE
              <Box>${snoPrice?.priceInDollars ? snoPrice?.priceInDollars : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Circulating Supply: ${snoPrice?.circulatingSupply ? snoPrice?.circulatingSupply : '-.--'}
                <br />
                Total supply: {snoPrice?.totalSupply ? snoPrice.totalSupply : '-.--'}
              </span>
            </div>
          </CardContent>
          <CardActions style={{ justifyContent: 'center' }}>
            <Button
              color="primary"
              style={{ width: '150px', height: '45px', marginBottom: '5%' }}
              variant="contained"
              component={Link}
              to={`/farms/SnoSnoShareRewardPool/`}
            >
              Farm
            </Button>
            <Button
              color="primary"
              target="_blank"
              style={{ width: '150px', height: '45px', marginBottom: '5%' }}
              variant="contained"
              href="https://traderjoexyz.com/trade?inputCurrency=0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd&outputCurrency=0x1fE4869f2C5181b9CD780a7E16194FA2c4C4293D"
            >
              Buy SNOW
            </Button>
          </CardActions>
        </Card>
      </Grid> */}
    </Grid>
  );
};

export default CemeteryCard;
