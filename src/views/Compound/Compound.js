import React from 'react';
import { Grid, useMediaQuery } from '@material-ui/core';
import { createGlobalStyle } from 'styled-components';

import Page from '../../components/Page';
import CompoundCard from './Components/CompoundCard/CompoundCard';
import CompoundPageBackground from '../../assets/img/SVG_Icons_and_web_bg/bg.svg';
import HomeImage from '../../assets/img/background.jpg';
import { black } from '../../theme/colors';

const BackgroundImage = createGlobalStyle`
  body {
    background-image: url(${CompoundPageBackground}), url(${HomeImage});
    background-repeat: repeat, repeat;
    background-size: cover, cover;
    background-position: top, center;
  }
`;

const Compound = () => {
  const isMobile = useMediaQuery('(max-width:599px)');

  const heightBreakpoint = useMediaQuery('(max-height:900px)');

  return (
    <Page>
      <BackgroundImage />
      <Grid
        container
        xs={12}
        sm={10}
        md={6}
        style={{
          ...(isMobile
            ? { margin: 'auto' }
            : {
                marginLeft: 'auto',
                marginRight: 'auto',
                ...(heightBreakpoint
                  ? { marginTop: '7vh' }
                  : { marginTop: '10vh' }),
              }),
        }}
      >
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 'normal',
            width: '100%',
            textAlign: 'center',
            color: black,
            marginBottom: 0,
          }}
        >
          Compound
        </h1>

        <p style={{ fontWeight: 'lighter', textAlign: 'center' }}>
          Use <strong>magik.farm</strong> compounding protocol to maximise
          your farms. Be sure to read their docs to assess risk.
        </p>

        <Grid item container spacing={3} style={{ marginTop: '2rem' }}>
          <Grid item xs={12} sm={6}>
            <CompoundCard
              cardData={{
                title: 'WLRS-USDC.e LP',
                tokenSymbol: 'WLRS-USDC-LP',
              }}
              buttonProps={{
                href: 'https://magik.farm/#/avax/vault/joe-wlrs-usdc',
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CompoundCard
              cardData={{
                title: 'WSHARE-USDC.e LP',
                tokenSymbol: 'WSHARE-USDC-LP',
              }}
              buttonProps={{
                href: 'https://magik.farm/#/avax/vault/joe-wshare-usdc',
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Compound;
