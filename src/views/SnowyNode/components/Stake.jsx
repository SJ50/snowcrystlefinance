import React, { useMemo, useContext } from 'react';
import styled from 'styled-components';

// import Button from '../../../components/Button';
import { Button, /*Card,*/ CardContent, Typography } from '@material-ui/core';
import DepositModal from './DepositModal';
// import Card from '../../../components/Card';
// import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import { AddIcon, RemoveIcon } from '../../../components/icons';
import IconButton from '../../../components/IconButton';
import Label from '../../../components/Label';
import Value from '../../../components/Value';
import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useModal from '../../../hooks/useModal';
import useStake from '../../../hooks/useStake';
import useNodePrice from '../../../hooks/useNodePrice';
import useStakedBalance from '../../../hooks/useStakedBalance';
import useStakedTokenPriceInDollars from '../../../hooks/useStakedTokenPriceInDollars';
import useTokenBalance from '../../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../../utils/formatBalance';
import TokenSymbol from '../../../components/TokenSymbol';
import Card from '../../../components/Card';
const HomeCard = styled.div`
  border-radius: 25px;
  box-shadow: 0px 0px 18px black;
  padding: 2px;
`;
const Stake = ({ bank }) => {
  const [approveStatus, approve] = useApprove(bank.depositToken, bank.address);

  const tokenBalance = useTokenBalance(bank.depositToken);
  const nodePrice = useNodePrice(bank.contract, bank.poolId, bank.sectionInUI);
  const stakedBalance = useStakedBalance(bank.contract, bank.poolId);
  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(bank.depositTokenName, bank.depositToken);

  const tokenPriceInDollars = useMemo(
    () => (stakedTokenPriceInDollars ? stakedTokenPriceInDollars : null),
    [stakedTokenPriceInDollars],
  );
  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(nodePrice, 12))).toFixed(2);
  const { onStake } = useStake(bank);

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      bank={bank}
      max={tokenBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onStake(amount);
        onDismissDeposit();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  return (
    <Card>
      <CardContent >
        <StyledCardContentInner>
          <StyledCardHeader>

              <TokenSymbol symbol={bank.depositTokenName} />
      
            <Typography style={{ textTransform: 'uppercase', color:"rgba(74, 68, 82)" }}>
              <Value
                value={
                  bank.depositTokenName === 'GRAPE-SNOW-LP'
                    ? getDisplayBalance(nodePrice, bank.depositToken.decimal, 0)
                    : getDisplayBalance(nodePrice, bank.depositToken.decimal, 8)
                }
              />
            </Typography>

            <Label color="rgba(74, 68, 82)" text={`≈ $${earnedInDollars}`} />

            <Typography style={{ textTransform: 'uppercase', color:"rgba(74, 68, 82)"}}>{`${'NODE'} COST`}</Typography>
          </StyledCardHeader>
          <StyledCardActions>
            {approveStatus !== ApprovalState.APPROVED ? (
              <Button
                disabled={
                  bank.closedForStaking ||
                  approveStatus === ApprovalState.PENDING ||
                  approveStatus === ApprovalState.UNKNOWN
                }
                color="#fff"
                onClick={approve}
                style={{ marginTop: '20px', background: '#5686d6', borderRadius: '15px' }}
              >
                {`Approve ${bank.depositTokenName.replace('USDC', 'USDC')}`}
              </Button>
            ) : (
              <IconButton
                disabled={bank.closedForStaking}
                onClick={() => (bank.closedForStaking ? null : onPresentDeposit())}
                style={{ marginTop: '20px', background: '#5686d6', borderRadius: '15px' }}
              >
                <AddIcon />
              </IconButton>
            )}
          </StyledCardActions>
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
  margin-top: 28px;
  width: 100%;
`;

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Stake;
