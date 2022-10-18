import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, CardActions, CardContent, Typography, Grid } from '@material-ui/core';
import Card from '../../components/Card';

import TokenSymbol from '../../components/TokenSymbol';
import styled from 'styled-components';

const GenesisCard = () => {
  return (
    <Grid container spacing={3}>
      {/* <Grid item xs={12} sm={3}>
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
      </Grid> */}
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
              wBTC
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
              wETH
            </Typography>
            <Box mt={2}>
              <TokenSymbol symbol="WETH" />
            </Box>
          </CardContent>
          <CardActions style={{ justifyContent: 'center' }}>
            <Button
              color="primary"
              size="small"
              style={{ width: '200px', height: '40px', marginBottom: '10%' }}
              variant="contained"
              component={Link}
              to={`/farms/SnowEthGenesisRewardPool/`}
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
              wCRO
            </Typography>
            <Box mt={2}>
              <TokenSymbol symbol="WCRO" />
            </Box>
          </CardContent>
          <CardActions style={{ justifyContent: 'center' }}>
            <Button
              color="primary"
              size="small"
              style={{ width: '200px', height: '40px', marginBottom: '10%' }}
              variant="contained"
              component={Link}
              to={`/farms/SnowCroGenesisRewardPool/`}
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
              DAI
            </Typography>
            <Box mt={2}>
              <TokenSymbol symbol="DAI" />
            </Box>
          </CardContent>
          <CardActions style={{ justifyContent: 'center' }}>
            <Button
              color="primary"
              size="small"
              style={{ width: '200px', height: '40px', marginBottom: '10%' }}
              variant="contained"
              component={Link}
              to={`/farms/SnowDaiGenesisRewardPool/`}
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
              USDT
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
        </Card>
      </Grid>
    </Grid>
  );
};

export default GenesisCard;
