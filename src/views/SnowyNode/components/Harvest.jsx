import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Button, /*Card,*/ CardContent, Typography } from '@material-ui/core';
// import Button from '../../../components/Button';
// import Card from '../../../components/Card';
// import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import Label from '../../../components/Label';
import Value from '../../../components/Value';
import useEarnings from '../../../hooks/useEarnings';
import useHarvest from '../../../hooks/useHarvest';
import useCompound from '../../../hooks/useCompound';
import { getDisplayBalance } from '../../../utils/formatBalance';
import TokenSymbol from '../../../components/TokenSymbol';
import { Bank } from '../../../tomb-finance';
import useGrapeStats from '../../../hooks/useTombStats';
import useStakedTokenPriceInDollars from '../../../hooks/useStakedTokenPriceInDollars';
import useNodePrice from '../../../hooks/useNodePrice';
import Card from '../../../components/Card';
const HomeCard = styled.div`
  border-radius: 25px;
  box-shadow: 0px 0px 18px black;
  padding: 2px;
`;
const Harvest = ({ bank }) => {
  const earnings = useEarnings(bank.contract, bank.earnTokenName, bank.poolId);
  const grapeStats = useGrapeStats();
  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(bank.depositTokenName, bank.depositToken);
  const nodePrice = useNodePrice(bank.contract, bank.poolId, bank.sectionInUI);
  const tokenPriceInDollars = useMemo(
    () => (stakedTokenPriceInDollars ? stakedTokenPriceInDollars : null),
    [stakedTokenPriceInDollars],
  );

  const earnedInDollars = (Number(tokenPriceInDollars * 1e6) * Number(earnings)).toFixed(2);
  const { onReward } = useHarvest(bank);
  const { onCompound } = useCompound(bank);
  return (
    <Card >
      <CardContent >
        <StyledCardContentInner>
          <StyledCardHeader>

              <TokenSymbol symbol={bank.depositTokenName} />
  
            <Typography style={{ textTransform: 'uppercase', color:"rgba(74, 68, 82)" }}>
              <Value
                value={
                  bank.depositTokenName === 'GRAPE-SNOW-LP'
                    ? (Number(earnings) / 1e18).toFixed(4)
                    : (Number(earnings) / 1e18).toFixed(6)
                }
              />
            </Typography>
            <Label color="rgba(74, 68, 82)" text={`≈ $${(earnedInDollars / 1e18).toFixed(2)}`} />
            <Typography style={{ textTransform: 'uppercase', color:"rgba(74, 68, 82)" }}>{`Earned`}</Typography>
          </StyledCardHeader>
          <StyledCardActions>
            <Button
              onClick={onReward}
              disabled={earnings.eq(0)}
              style={{ background: '#5686d6', borderRadius: '15px' }}
            >
              Claim
            </Button>
          </StyledCardActions>
          <Button
            onClick={onCompound}
            disabled={Number(earnings) < Number(nodePrice)}
            style={{ background: '#5686d6', borderRadius: '15px', marginTop: '10px' }}
          >
            Compound {(Number(earnings) / Number(nodePrice)) | 0} Nodes
          </Button>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  );
};

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Harvest;
