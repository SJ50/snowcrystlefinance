import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, CardActions, CardContent, Typography, Grid } from '@material-ui/core';
import Card from '../../components/Card';

import TokenSymbol from '../../components/TokenSymbol';

import useTombFinance from '../../hooks/useTombFinance';
import useDaoGlcrRebatesStats from '../../hooks/useDaoGlcrRebatesStats';
import useDaoGlcrRebatesAccountStats from '../../hooks/useDaoGlcrRebatesAccountStats';
import useDaoGlcrRebates from '../../hooks/useDaoGlcrRebates'; // bond and claim
import useTokenBalance from '../../hooks/useTokenBalance';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import useModal from '../../hooks/useModal';
import DaoGlcrDepositModal from './components/DaoGlcrDepositModal';
import { getFullDisplayBalance, getDisplayBalance } from '../../utils/formatBalance';
import { BigNumber } from 'ethers';
import Web3 from 'web3';

import styled from 'styled-components';
const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 16px;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const web3 = new Web3();
const BN = (n) => new web3.utils.BN(n);

// const useStyles = makeStyles((theme) => ({
//   black: {
//     color: '#000000 !important',
//   },
// }));
const HomeCard = styled.div`
  border-radius: 25px;
  box-shadow: 0px 0px 18px black;
  padding: 2px;
`;
const CemeteryCard = ({ bank }) => {
  const daoGlcrRebatesStats = useDaoGlcrRebatesStats();
  const daoGlcrRebatePriceInUSDC = useMemo(
    () =>
      daoGlcrRebatesStats
        ? Number(getDisplayBalance(BigNumber.from(daoGlcrRebatesStats.glcrPrice), 18, 4)).toFixed(4)
        : null,
    [daoGlcrRebatesStats],
  );
  const daoGlcrRebateBondDuration = useMemo(
    () => (daoGlcrRebatesStats ? (Number(daoGlcrRebatesStats.bondVesting) / 60 / 60).toFixed(0) : null),
    [daoGlcrRebatesStats],
  );
  const daoGlcrRebateBondPremium = useMemo(
    () => (daoGlcrRebatesStats ? (Number(daoGlcrRebatesStats.bondPremium) * 100).toFixed(2) : null),
    [daoGlcrRebatesStats],
  );
  const daoGlcrRebateGlcrAvailable = useMemo(
    () =>
      daoGlcrRebatesStats
        ? Number(getDisplayBalance(BigNumber.from(daoGlcrRebatesStats.glcrAvailable), 18)).toFixed(4)
        : null,
    [daoGlcrRebatesStats],
  );
  const daoGlcrRebateGlcrAddress = useMemo(
    () => (daoGlcrRebatesStats ? daoGlcrRebatesStats.treasuryAddress : null),
    [daoGlcrRebatesStats],
  );
  const daoGlcrRebateAsset = useMemo(
    () => (daoGlcrRebatesStats ? daoGlcrRebatesStats.assets : null),
    [daoGlcrRebatesStats],
  );
  const daoGlcrRebatesAccountStats = useDaoGlcrRebatesAccountStats();
  const daoGlcrRebatesAccountClaimableGlcr = useMemo(
    () =>
      daoGlcrRebatesAccountStats
        ? Number(getDisplayBalance(BigNumber.from(daoGlcrRebatesAccountStats.claimableGlcr), 18, 6)).toFixed(6)
        : null,
    [daoGlcrRebatesAccountStats],
  );
  const daoGlcrRebatesAccountVested = useMemo(
    () =>
      daoGlcrRebatesAccountStats
        ? Number(getDisplayBalance(BigNumber.from(daoGlcrRebatesAccountStats.vested), 18, 6)).toFixed(6)
        : null,
    [daoGlcrRebatesAccountStats],
  );

  const tombFinance = useTombFinance();
  const { onClaim } = useDaoGlcrRebates();

  async function claimGlcr() {
    if (!window.ethereum) return;
    const address = tombFinance.myAccount; // (await window.ethereum.request({ method: 'eth_accounts' }))[0];
    if (!address) return;

    onClaim();
  }
  // BOND

  const { onBond } = useDaoGlcrRebates();

  const [glcrApproveStatus, glcrApprove] = useApprove(
    tombFinance.externalTokens[bank.depositTokenName],
    daoGlcrRebateGlcrAddress,
  );

  const tokenBalance = useTokenBalance(tombFinance.externalTokens[bank.depositTokenName]);

  const [onPresentGlcrDeposit, onDismissGlcrDeposit] = useModal(
    <DaoGlcrDepositModal
      max={tokenBalance}
      onConfirm={async (value) => {
        if (!window.ethereum) return;
        const account = tombFinance.myAccount; //(await window.ethereum.request({ method: 'eth_accounts' }))[0];
        if (!account) return;
        let amountBN = BN(Math.floor(value * 10000 * 10 ** 12).toString())
          .mul(BN(10).pow(BN(14)))
          .div(BN(10).pow(BN(12)));
        if (18 - tombFinance.externalTokens[bank.depositTokenName].decimal > 0) {
          amountBN = amountBN.div(BN(10).pow(BN(18 - tombFinance.externalTokens[bank.depositTokenName].decimal)));
        }

        const amount = amountBN.toString();
        onBond(tombFinance.externalTokens[bank.depositTokenName].address, amount);
        // console.log(account, tombFinance.externalTokens[bank.depositTokenName].address, rebateStats.RebateTreasury._address);
        // window.ethereum.request({
        //   method: 'eth_sendTransaction',
        //   params: [
        //     {
        //       from: account,
        //       to: rebateStats.RebateTreasury._address,
        //       data: rebateStats.RebateTreasury.methods
        //         .bond(
        //           tombFinance.externalTokens[bank.depositTokenName].address,
        //           BN(Math.floor(value * 10000 * 10**12)).mul(BN(10).pow(BN(14))).div(BN(10).pow(BN(12))),
        //         )
        //         .encodeABI(),
        //     },
        //   ],
        // });
      }}
      tokenName={bank.depositTokenName}
      token={
        daoGlcrRebateAsset
          ? daoGlcrRebateAsset.find(
              (token) => token.token === tombFinance.externalTokens[bank.depositTokenName].address,
            )
          : null
      }
    />,
  );
  return (
    <HomeCard>
      <div>
        <br />
        <Typography
          variant="h5"
          component="h2"
          style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', textAlign: 'center' }}
        >
          USDC Vesting for GLCR
        </Typography>
        <br />
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', textAlign: 'center' }}>
          <TokenSymbol size={60} symbol="USDC" />
          <TokenSymbol size={60} symbol="RIGHTARROW" />
          <TokenSymbol size={60} symbol="GLCR" />
        </div>
      </div>
      <CardContent
        style={{
          flexWrap: 'wrap',
          position: 'relative',
        }}
      >
        <Row>
          <span style={{ fontSize: '14px', marginLeft: '7%' }}>
            GLCR Price (TWAP): <br />
            Bond Duration: <br />
            Bond Premium: <br />
            GLCR Available:
            <br />
            <br />
            GLCR Vested: <br />
            GLCR Claimable: <br />
            &nbsp;
          </span>
          <span style={{ fontSize: '14px', textAlign: 'right', fontWeight: 'bold', marginRight: '15%' }}>
            {daoGlcrRebatePriceInUSDC ? daoGlcrRebatePriceInUSDC : '-.----'}
            <br />
            {daoGlcrRebateBondDuration ? daoGlcrRebateBondDuration + ' hours' : ''}
            <br />
            {daoGlcrRebateBondPremium ? daoGlcrRebateBondPremium + '%' : ''}
            <br />
            {daoGlcrRebateGlcrAvailable ? daoGlcrRebateGlcrAvailable : ''} <br />
            <br />
            {daoGlcrRebatesAccountVested ? daoGlcrRebatesAccountVested : '-.------'}
            <br />
            {daoGlcrRebatesAccountClaimableGlcr ? daoGlcrRebatesAccountClaimableGlcr : '-.------'} <br />
            &nbsp;
          </span>
        </Row>
      </CardContent>
      <CardActions style={{ justifyContent: 'center' }}>
        {glcrApproveStatus !== ApprovalState.APPROVED ? (
          <Button
            disabled={glcrApproveStatus !== ApprovalState.NOT_APPROVED}
            variant="contained"
            color="primary"
            onClick={glcrApprove}
            style={{ width: '150px', height: '45px', marginBottom: '5%', marginLeft: '5%', marginRight: '5%' }}
          >
            Approve
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            style={{ width: '150px', height: '45px', marginBottom: '5%', marginLeft: '5%', marginRight: '5%' }}
            onClick={onPresentGlcrDeposit}
          >
            Bond
          </Button>
        )}
        <Button
          color="primary"
          onClick={claimGlcr}
          style={{ width: '150px', height: '45px', marginBottom: '5%', marginLeft: '5%', marginRight: '5%' }}
          variant="contained"
        >
          Claim {bank.earnTokenName === 'GLCR' ? 'GLCR' : ''}
        </Button>
      </CardActions>
    </HomeCard>
  );
};

export default CemeteryCard;
