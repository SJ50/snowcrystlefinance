import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, CardActions, CardContent, Typography, Grid } from '@material-ui/core';
import Card from '../../components/Card';

import TokenSymbol from '../../components/TokenSymbol';

import useTombFinance from '../../hooks/useTombFinance';
import useDevGlcrRebatesStats from '../../hooks/useDevGlcrRebatesStats';
import useDevGlcrRebatesAccountStats from '../../hooks/useDevGlcrRebatesAccountStats';
import useDevGlcrRebates from '../../hooks/useDevGlcrRebates'; // bond and claim
import useTokenBalance from '../../hooks/useTokenBalance';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import useModal from '../../hooks/useModal';
import DevGlcrDepositModal from './components/DevGlcrDepositModal';
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
  const devGlcrRebatesStats = useDevGlcrRebatesStats();
  const devGlcrRebatePriceInUSDC = useMemo(
    () =>
      devGlcrRebatesStats
        ? Number(getDisplayBalance(BigNumber.from(devGlcrRebatesStats.glcrPrice), 18, 4)).toFixed(4)
        : null,
    [devGlcrRebatesStats],
  );
  const devGlcrRebateBondDuration = useMemo(
    () => (devGlcrRebatesStats ? (Number(devGlcrRebatesStats.bondVesting) / 60 / 60).toFixed(0) : null),
    [devGlcrRebatesStats],
  );
  const devGlcrRebateBondPremium = useMemo(
    () => (devGlcrRebatesStats ? (Number(devGlcrRebatesStats.bondPremium) * 100).toFixed(2) : null),
    [devGlcrRebatesStats],
  );
  const devGlcrRebateGlcrAvailable = useMemo(
    () =>
      devGlcrRebatesStats
        ? Number(getDisplayBalance(BigNumber.from(devGlcrRebatesStats.glcrAvailable), 18)).toFixed(4)
        : null,
    [devGlcrRebatesStats],
  );
  const devGlcrRebateGlcrAddress = useMemo(
    () => (devGlcrRebatesStats ? devGlcrRebatesStats.treasuryAddress : null),
    [devGlcrRebatesStats],
  );
  const devGlcrRebateAsset = useMemo(
    () => (devGlcrRebatesStats ? devGlcrRebatesStats.assets : null),
    [devGlcrRebatesStats],
  );
  const devGlcrRebatesAccountStats = useDevGlcrRebatesAccountStats();
  const devGlcrRebatesAccountClaimableGlcr = useMemo(
    () =>
      devGlcrRebatesAccountStats
        ? Number(getDisplayBalance(BigNumber.from(devGlcrRebatesAccountStats.claimableGlcr), 18, 6)).toFixed(6)
        : null,
    [devGlcrRebatesAccountStats],
  );
  const devGlcrRebatesAccountVested = useMemo(
    () =>
      devGlcrRebatesAccountStats
        ? Number(getDisplayBalance(BigNumber.from(devGlcrRebatesAccountStats.vested), 18, 6)).toFixed(6)
        : null,
    [devGlcrRebatesAccountStats],
  );

  // console.log('debug ' + devSnowRebatePriceInUSDC);
  const tombFinance = useTombFinance();
  const { onClaim } = useDevGlcrRebates();

  async function claimGlcr() {
    if (!window.ethereum) return;
    const address = tombFinance.myAccount; // (await window.ethereum.request({ method: 'eth_accounts' }))[0];
    if (!address) return;

    onClaim();
  }
  // BOND

  const { onBond } = useDevGlcrRebates();

  const [glcrApproveStatus, glcrApprove] = useApprove(
    tombFinance.externalTokens[bank.depositTokenName],
    devGlcrRebateGlcrAddress,
  );

  const tokenBalance = useTokenBalance(tombFinance.externalTokens[bank.depositTokenName]);

  const [onPresentGlcrDeposit, onDismissGlcrDeposit] = useModal(
    <DevGlcrDepositModal
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
        devGlcrRebateAsset
          ? devGlcrRebateAsset.find(
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
            {devGlcrRebatePriceInUSDC ? devGlcrRebatePriceInUSDC : '-.----'}
            <br />
            {devGlcrRebateBondDuration ? devGlcrRebateBondDuration + ' hours' : ''}
            <br />
            {devGlcrRebateBondPremium ? devGlcrRebateBondPremium + '%' : ''}
            <br />
            {devGlcrRebateGlcrAvailable ? devGlcrRebateGlcrAvailable : ''} <br />
            <br />
            {devGlcrRebatesAccountVested ? devGlcrRebatesAccountVested : '-.------'}
            <br />
            {devGlcrRebatesAccountClaimableGlcr ? devGlcrRebatesAccountClaimableGlcr : '-.------'} <br />
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
