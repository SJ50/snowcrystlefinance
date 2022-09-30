import React from 'react';
import { useWallet } from 'use-wallet';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Bank from '../Bank';

import { Alert } from '@material-ui/lab';
import { Box, Container, Typography, Grid } from '@material-ui/core';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';
import DaoSnowCard from './DaoSnowRebates';
import DaoGlcrCard from './DaoGlcrRebates';
import DevSnowCard from './DevSnowRebates';
import DevGlcrCard from './DevGlcrRebates';
// import DevCard from './DevRebates';
import CemeteryImage from '../../assets/img/SVG_Icons_and_web_bg/bg.svg';
import { createGlobalStyle } from 'styled-components';

import useBanks from '../../hooks/useBanks';
import config from '../../config';
import { makeStyles } from '@material-ui/core/styles';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${CemeteryImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

const useStyles = makeStyles((theme) => ({
  gridItem: {
    color: 'black !important',
    height: '100%',
  },
  gridCard: {
    border: '1px solid #000000',
    color: 'black !important',
  },
  flex: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  alert: {
    maxWidth: '600px !important',
    marginLeft: 'auto !important',
    marginRight: 'auto !important',
  },
}));

const Cemetery = () => {
  const classes = useStyles();
  const [banks] = useBanks();
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const activeBanks = banks.filter((bank) => !bank.finished);
  const rebateDaoSnowBanks = activeBanks.filter(
    (bank) => bank.sectionInUI === 3 && bank.earnTokenName === 'SNOW' && bank.contract.includes('Dao'),
  );
  const rebateDaoGlcrBanks = activeBanks.filter(
    (bank) => bank.sectionInUI === 3 && bank.earnTokenName === 'GLCR' && bank.contract.includes('Dao'),
  );
  const rebateDevSnowBanks = activeBanks.filter(
    (bank) => bank.sectionInUI === 3 && bank.earnTokenName === 'SNOW' && bank.contract.includes('Dev'),
  );
  const rebateDevGlcrBanks = activeBanks.filter(
    (bank) => bank.sectionInUI === 3 && bank.earnTokenName === 'GLCR' && bank.contract.includes('Dev'),
  );

  return (
    <Switch>
      <Page>
        <Route exact path={path}>
          <BackgroundImage />
          {!!account ? (
            <Container maxWidth="lg">
              <Typography align="center" variant="h2" style={{ marginTop: '-30px' }}>
                Rebates
              </Typography>

              <Box mt={5}>
                <div>
                  <Typography
                    align="center"
                    variant="h4"
                    gutterBottom
                    style={{ marginTop: '-25px', marginBottom: '35px' }}
                  >
                    Dao Rebates
                  </Typography>
                  <Grid container spacing={4} justify="center">
                    {rebateDaoSnowBanks.map((bank) => (
                      <Grid item xs={12} sm={5} key={bank.name}>
                        <DaoSnowCard bank={bank} className={classes.gridCard} />
                      </Grid>
                    ))}
                    {rebateDaoGlcrBanks.map((bank) => (
                      <Grid item xs={12} sm={5} key={bank.name}>
                        <DaoGlcrCard bank={bank} className={classes.gridCard} />
                      </Grid>
                    ))}
                  </Grid>
                </div>
              </Box>

              <Box mt={5}>
                <div>
                  <Typography
                    align="center"
                    variant="h4"
                    gutterBottom
                    style={{ marginTop: '-25px', marginBottom: '35px' }}
                  >
                    Dao Rebates
                  </Typography>
                  <Grid container spacing={4} justify="center">
                    {rebateDevSnowBanks.map((bank) => (
                      <Grid item xs={12} sm={5} key={bank.name}>
                        <DevSnowCard bank={bank} className={classes.gridCard} />
                      </Grid>
                    ))}
                    {rebateDevGlcrBanks.map((bank) => (
                      <Grid item xs={12} sm={5} key={bank.name}>
                        <DevGlcrCard bank={bank} className={classes.gridCard} />
                      </Grid>
                    ))}
                  </Grid>
                </div>
              </Box>
            </Container>
          ) : (
            <UnlockWallet />
          )}
        </Route>
        {/* <Route path={`${path}/:bankId`}>
          <BackgroundImage />
          <Bank />
        </Route> */}
      </Page>
    </Switch>
  );
};

export default Cemetery;
