import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, CardActions, CardContent, Typography, Grid } from '@material-ui/core';
import Card from '../../components/Card';

import TokenSymbol from '../../components/TokenSymbol';

import useTombFinance from '../../hooks/useTombFinance';
import useDevSnowRebatesStats from '../../hooks/useDevSnowRebatesStats';
import useDevSnowRebatesAccountStats from '../../hooks/useDevSnowRebatesAccountStats';
import useDevSnowRebates from '../../hooks/useDevSnowRebates'; // bond and claim
import useTokenBalance from '../../hooks/useTokenBalance';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import useModal from '../../hooks/useModal';
import DevSnowDepositModal from './components/DevSnowDepositModal';
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

const CemeteryCard = ({ bank }) => {
  const devSnowRebatesStats = useDevSnowRebatesStats();
  const devSnowRebatePriceInUSDC = useMemo(
    () =>
      devSnowRebatesStats
        ? Number(getDisplayBalance(BigNumber.from(devSnowRebatesStats.snowPrice), 18, 4)).toFixed(4)
        : null,
    [devSnowRebatesStats],
  );
  const devSnowRebateBondDuration = useMemo(
    () => (devSnowRebatesStats ? (Number(devSnowRebatesStats.bondVesting) / 60 / 60).toFixed(0) : null),
    [devSnowRebatesStats],
  );
  const devSnowRebateBondPremium = useMemo(
    () => (devSnowRebatesStats ? (Number(devSnowRebatesStats.bondPremium) * 100).toFixed(2) : null),
    [devSnowRebatesStats],
  );
  const devSnowRebateSnowAvailable = useMemo(
    () =>
      devSnowRebatesStats
        ? Number(getDisplayBalance(BigNumber.from(devSnowRebatesStats.snowAvailable), 18)).toFixed(4)
        : null,
    [devSnowRebatesStats],
  );
  const devSnowRebateSnowAddress = useMemo(
    () => (devSnowRebatesStats ? devSnowRebatesStats.treasuryAddress : null),
    [devSnowRebatesStats],
  );
  const devSnowRebateAsset = useMemo(
    () => (devSnowRebatesStats ? devSnowRebatesStats.assets : null),
    [devSnowRebatesStats],
  );
  const devSnowRebatesAccountStats = useDevSnowRebatesAccountStats();
  const devSnowRebatesAccountClaimableSnow = useMemo(
    () =>
      devSnowRebatesAccountStats
        ? Number(getDisplayBalance(BigNumber.from(devSnowRebatesAccountStats.claimableSnow), 18, 6)).toFixed(6)
        : null,
    [devSnowRebatesAccountStats],
  );
  const devSnowRebatesAccountVested = useMemo(
    () =>
      devSnowRebatesAccountStats
        ? Number(getDisplayBalance(BigNumber.from(devSnowRebatesAccountStats.vested), 18, 6)).toFixed(6)
        : null,
    [devSnowRebatesAccountStats],
  );

  const tombFinance = useTombFinance();
  const { onClaim } = useDevSnowRebates();

  async function claimSnow() {
    if (!window.ethereum) return;
    const address = tombFinance.myAccount; // (await window.ethereum.request({ method: 'eth_accounts' }))[0];
    if (!address) return;

    onClaim();
  }

  const { onBond } = useDevSnowRebates();

  const [snowApproveStatus, snowApprove] = useApprove(
    tombFinance.externalTokens[bank.depositTokenName],
    devSnowRebateSnowAddress,
  );

  const tokenBalance = useTokenBalance(tombFinance.externalTokens[bank.depositTokenName]);

  const [onPresentSnowDeposit, onDismissSnowDeposit] = useModal(
    <DevSnowDepositModal
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
        devSnowRebateAsset
          ? devSnowRebateAsset.find(
              (token) => token.token === tombFinance.externalTokens[bank.depositTokenName].address,
            )
          : null
      }
    />,
  );

  return (
    <Card>
      <div>
        <br />
        <Typography
          variant="h5"
          component="h2"
          style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', textAlign: 'center' }}
        >
          USDC Vesting for SNOW
        </Typography>
        <br />
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', textAlign: 'center' }}>
          <TokenSymbol size={60} symbol="USDC" />
          <TokenSymbol size={60} symbol="RIGHTARROW" />
          <TokenSymbol size={60} symbol="SNOW" />
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
            SNOW Price (TWAP): <br />
            Bond Duration: <br />
            Bond Premium: <br />
            SNOW Available:
            <br />
            <br />
            SNOW Vested: <br />
            SNOW Claimable: <br />
            &nbsp;
          </span>
          <span style={{ fontSize: '14px', textAlign: 'right', fontWeight: 'bold', marginRight: '15%' }}>
            {devSnowRebatePriceInUSDC ? devSnowRebatePriceInUSDC : '-.----'}
            <br />
            {devSnowRebateBondDuration ? devSnowRebateBondDuration + ' hours' : ''}
            <br />
            {devSnowRebateBondPremium ? devSnowRebateBondPremium + '%' : ''}
            <br />
            {devSnowRebateSnowAvailable ? devSnowRebateSnowAvailable : ''} <br />
            <br />
            {devSnowRebatesAccountVested ? devSnowRebatesAccountVested : '-.------'}
            <br />
            {devSnowRebatesAccountClaimableSnow ? devSnowRebatesAccountClaimableSnow : '-.------'} <br />
            &nbsp;
          </span>
        </Row>
      </CardContent>
      <CardActions style={{ justifyContent: 'center' }}>
        {snowApproveStatus !== ApprovalState.APPROVED ? (
          <Button
            disabled={snowApproveStatus !== ApprovalState.NOT_APPROVED}
            variant="contained"
            color="primary"
            onClick={snowApprove}
            style={{ width: '150px', height: '45px', marginBottom: '5%', marginLeft: '5%', marginRight: '5%' }}
          >
            Approve
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            style={{ width: '150px', height: '45px', marginBottom: '5%', marginLeft: '5%', marginRight: '5%' }}
            onClick={onPresentSnowDeposit}
          >
            Bond
          </Button>
        )}
        <Button
          color="primary"
          onClick={claimSnow}
          style={{ width: '150px', height: '45px', marginBottom: '5%', marginLeft: '5%', marginRight: '5%' }}
          variant="contained"
        >
          Claim {bank.earnTokenName === 'SNOW' ? 'SNOW' : bank.earnTokenName === 'GLCR' ? 'GLCR' : ''}
        </Button>
      </CardActions>
    </Card>
  );
};

export default CemeteryCard;
