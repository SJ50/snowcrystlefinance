import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Button, CardContent } from '@material-ui/core';
// import Button from '../../../components/Button';
import Card from '../../../components/Card';
// import CardContent from '../../../components/CardContent';
// import CardIcon from '../../../components/CardIcon';
import Label from '../../../components/Label';
import Value from '../../../components/Value';

import useEarnings from '../../../hooks/useEarnings';
import useHarvest from '../../../hooks/useHarvest';
import useRedeem from '../../../hooks/useRedeem';

import { getDisplayBalance } from '../../../utils/formatBalance';
import TokenSymbol from '../../../components/TokenSymbol';
import { Bank } from '../../../tomb-finance';
import useTombStats from '../../../hooks/useTombStats';
import useShareStats from '../../../hooks/usetShareStats';

interface HarvestProps {
  bank: Bank;
}
const HomeCard = styled.div`
  border-radius: 25px;
  box-shadow: 0px 0px 18px black;
  padding: 2px;
`;
const Harvest: React.FC<HarvestProps> = ({ bank }) => {
  const earnings = useEarnings(bank.contract, bank.earnTokenName, bank.poolId);
  const { onReward } = useHarvest(bank);
  const tombStats = useTombStats();
  const tShareStats = useShareStats();

  const tokenName = bank.earnTokenName; /*=== 'GLCR' ? 'GLCR' : 'GLCR'*/
  const tokenStats = bank.earnTokenName === 'GLCR' ? tShareStats : tombStats;
  const tokenPriceInDollars = useMemo(
    () => (tokenStats ? Number(tokenStats.priceInDollars).toFixed(2) : null),
    [tokenStats],
  );
  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);
  const { onRedeem } = useRedeem(bank);
  return (
    <HomeCard>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <TokenSymbol symbol={bank.earnToken.symbol} size={100} />
            <Value value={getDisplayBalance(earnings)} />
            <Label color="#4b4453" text={`≈ $${earnedInDollars}`} />
            <Label color="#4b4453" text={`${tokenName} Earned`} />
          </StyledCardHeader>
          <StyledCardActions>
            <Button
              style={{ borderRadius: '15px', width: '250px' }}
              onClick={onReward}
              disabled={earnings.eq(0)}
              color="primary"
              variant="contained"
            >
              Claim
            </Button>
          </StyledCardActions>
          <Button
            style={{ borderRadius: '15px', marginTop: '10px', width: '250px' }}
            onClick={onRedeem}
            color="primary"
            variant="contained"
          >
            Claim & Withdraw
          </Button>
        </StyledCardContentInner>
      </CardContent>
    </HomeCard>
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
  margin-top: ${(props) => props.theme.spacing[6]}px;
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
