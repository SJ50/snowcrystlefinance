import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, CardActions, CardContent, Typography, Grid } from '@material-ui/core';
import Card from '../../components/Card';

import TokenSymbol from '../../components/TokenSymbol';

const GenesisCard = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={3}>
        <Card>
          <CardContent align="center">
            <Typography variant="h5" component="h2">
              WBTC
            </Typography>
            <Box mt={2}>
              <TokenSymbol symbol="WBTC" />
            </Box>
          </CardContent>
          <CardActions style={{ justifyContent: 'center' }}>
            <Button
              color="primary"
              size="small"
              style={{ width: '200px', height: '40px', marginBottom: '10%' }}
              variant="contained"
              component={Link}
              to={`/farms/SnowBtcGenesisRewardPool/`}
            >
              Stake
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Card>
          <CardContent align="center">
            <Typography variant="h5" component="h2">
              FOX
            </Typography>
            <Box mt={2}>
              <TokenSymbol symbol="FOX" />
            </Box>
          </CardContent>
          <CardActions style={{ justifyContent: 'center' }}>
            <Button
              color="primary"
              size="small"
              style={{ width: '200px', height: '40px', marginBottom: '10%' }}
              variant="contained"
              component={Link}
              to={`/farms/SnowFoxGenesisRewardPool/`}
            >
              Stake
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Card>
          <CardContent align="center">
            <Typography variant="h5" component="h2">
              SNOBOND
            </Typography>
            <Box mt={2}>
              <TokenSymbol symbol="SNOBOND" />
            </Box>
          </CardContent>
          <CardActions style={{ justifyContent: 'center' }}>
            <Button
              color="primary"
              size="small"
              style={{ width: '200px', height: '40px', marginBottom: '10%' }}
              variant="contained"
              component={Link}
              to={`/farms/SnowSnobondGenesisRewardPool/`}
            >
              Stake
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Card>
          <CardContent align="center">
            <Typography variant="h5" component="h2">
              DIBS
            </Typography>
            <Box mt={2}>
              <TokenSymbol symbol="DIBS" />
            </Box>
          </CardContent>
          <CardActions style={{ justifyContent: 'center' }}>
            <Button
              color="primary"
              size="small"
              style={{ width: '200px', height: '40px', marginBottom: '10%' }}
              variant="contained"
              component={Link}
              to={`/farms/SnowDibsGenesisRewardPool/`}
            >
              Stake
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Card>
          <CardContent align="center">
            <Typography variant="h5" component="h2">
              wAVAX
            </Typography>
            <Box mt={2}>
              <TokenSymbol symbol="WAVAX" />
            </Box>
          </CardContent>
          <CardActions style={{ justifyContent: 'center' }}>
            <Button
              color="primary"
              size="small"
              style={{ width: '200px', height: '40px', marginBottom: '10%' }}
              variant="contained"
              component={Link}
              to={`/farms/SnowAvaxGenesisRewardPool/`}
            >
              Stake
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Card>
          <CardContent align="center">
            <Typography variant="h5" component="h2">
              USDC
            </Typography>
            <Box mt={2}>
              <TokenSymbol symbol="USDC" />
            </Box>
          </CardContent>
          <CardActions style={{ justifyContent: 'center' }}>
            <Button
              color="primary"
              size="small"
              style={{ width: '200px', height: '40px', marginBottom: '10%' }}
              variant="contained"
              component={Link}
              to={`/farms/SnowUsdcGenesisRewardPool/`}
            >
              Stake
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Card>
          <CardContent align="center">
            <Typography variant="h5" component="h2">
              GRAPE
            </Typography>
            <Box mt={2}>
              <TokenSymbol symbol="GRAPE" />
            </Box>
          </CardContent>
          <CardActions style={{ justifyContent: 'center' }}>
            <Button
              color="primary"
              size="small"
              style={{ width: '200px', height: '40px', marginBottom: '10%' }}
              variant="contained"
              component={Link}
              to={`/farms/SnowGrapeGenesisRewardPool/`}
            >
              Stake
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3}>
        {/*<Card>
          <CardContent align="center">
            <Typography variant="h5" component="h2">
              USDT.e
            </Typography>
            <Box mt={2}>
              <TokenSymbol symbol="USDT" />
            </Box>
          </CardContent>
          <CardActions style={{ justifyContent: 'center' }}>
            <Button
              color="primary"
              size="small"
              style={{ width: '200px', height: '40px', marginBottom: '10%' }}
              variant="contained"
              component={Link}
              to={`/farms/SnowUsdtGenesisRewardPool/`}
            >
              Stake
            </Button>
          </CardActions>
</Card>*/}
      </Grid>
    </Grid>
  );
};

export default GenesisCard;
