import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Card, CardActions, CardContent, Typography, Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import TokenSymbol from '../../components/TokenSymbol';
import useStatsForPool from '../../hooks/useStatsForPool';
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle';
import useBank from '../../hooks/useBank';
import styled from 'styled-components';
const HomeCard = styled.div`
  border-radius: 25px;
  box-shadow: 0px 0px 18px black;
  padding: 2px;
`;

const ShareLPCard = ({}) => {
  const tombBank = useBank('ShareLPNode');
  const statsOnPool = useStatsForPool(tombBank);

  return (
    <Grid item xs={12} md={4} lg={4}>
      <HomeCard>
        <CardContent>
          <Box style={{ position: 'relative' }}>
            <Box
              style={{
                position: 'absolute',
                right: '5px',
                top: '-5px',
                height: '48px',
                width: '48px',
                borderRadius: '40px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <TokenSymbol size={55} symbol={'GLCR-USDC-LP'} />
            </Box>
            <Typography variant="h5" component="h2">
              GLCR-USDC LP Node
            </Typography>
            <Typography variant="h7">
              Lock your GLCR LP to earn daily yields<br></br>
              <b>Daily APR:</b> {statsOnPool?.dailyAPR}%<br></br>
              <b>Yearly APR:</b> {statsOnPool?.yearlyAPR}%
            </Typography>
          </Box>
        </CardContent>
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button
            className="shinyButtonSecondary"
            style={{ background: '#5686d6', borderRadius: '15px' }}
            component={Link}
            to={'/nodes/ShareLPNode'}
          >
            Stake
          </Button>
        </CardActions>
      </HomeCard>
    </Grid>
  );
};

export default ShareLPCard;
