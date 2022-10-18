import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, CardActions, CardContent, Typography, Grid } from '@material-ui/core';
import Card from '../../components/Card';

import TokenSymbol from '../../components/TokenSymbol';

import useTombFinance from '../../hooks/useTombFinance';
import useDaoSnowRebatesStats from '../../hooks/useDaoSnowRebatesStats';
import useDaoSnowRebatesAccountStats from '../../hooks/useDaoSnowRebatesAccountStats';
import useDaoSnowRebates from '../../hooks/useDaoSnowRebates'; // bond and claim
import useTokenBalance from '../../hooks/useTokenBalance';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import useModal from '../../hooks/useModal';
import DaoSnowDepositModal from './components/DaoSnowDepositModal';
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
  const daoSnowRebatesStats = useDaoSnowRebatesStats();
  const daoSnowRebatePriceInUSDC = useMemo(
    () =>
      daoSnowRebatesStats
        ? Number(getDisplayBalance(BigNumber.from(daoSnowRebatesStats.snowPrice), 18, 4)).toFixed(4)
        : null,
    [daoSnowRebatesStats],
  );
  const daoSnowRebateBondDuration = useMemo(
    () => (daoSnowRebatesStats ? (Number(daoSnowRebatesStats.bondVesting) / 60 / 60).toFixed(0) : null),
    [daoSnowRebatesStats],
  );
  const daoSnowRebateBondPremium = useMemo(
    () => (daoSnowRebatesStats ? (Number(daoSnowRebatesStats.bondPremium) * 100).toFixed(2) : null),
    [daoSnowRebatesStats],
  );
  const daoSnowRebateSnowAvailable = useMemo(
    () =>
      daoSnowRebatesStats
        ? Number(getDisplayBalance(BigNumber.from(daoSnowRebatesStats.snowAvailable), 18)).toFixed(4)
        : null,
    [daoSnowRebatesStats],
  );
  const daoSnowRebateSnowAddress = useMemo(
    () => (daoSnowRebatesStats ? daoSnowRebatesStats.treasuryAddress : null),
    [daoSnowRebatesStats],
  );
  const daoSnowRebateAsset = useMemo(
    () => (daoSnowRebatesStats ? daoSnowRebatesStats.assets : null),
    [daoSnowRebatesStats],
  );
  const daoSnowRebatesAccountStats = useDaoSnowRebatesAccountStats();
  const daoSnowRebatesAccountClaimableSnow = useMemo(
    () =>
      daoSnowRebatesAccountStats
        ? Number(getDisplayBalance(BigNumber.from(daoSnowRebatesAccountStats.claimableSnow), 18, 6)).toFixed(6)
        : null,
    [daoSnowRebatesAccountStats],
  );
  const daoSnowRebatesAccountVested = useMemo(
    () =>
      daoSnowRebatesAccountStats
        ? Number(getDisplayBalance(BigNumber.from(daoSnowRebatesAccountStats.vested), 18, 6)).toFixed(6)
        : null,
    [daoSnowRebatesAccountStats],
  );

  const tombFinance = useTombFinance();
  const { onClaim } = useDaoSnowRebates();

  async function claimSnow() {
    if (!window.ethereum) return;
    const address = tombFinance.myAccount; // (await window.ethereum.request({ method: 'eth_accounts' }))[0];
    if (!address) return;

    onClaim();
  }

  const { onBond } = useDaoSnowRebates();

  const [snowApproveStatus, snowApprove] = useApprove(
    tombFinance.externalTokens[bank.depositTokenName],
    daoSnowRebateSnowAddress,
  );

  const tokenBalance = useTokenBalance(tombFinance.externalTokens[bank.depositTokenName]);

  const [onPresentSnowDeposit, onDismissSnowDeposit] = useModal(
    <DaoSnowDepositModal
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
        daoSnowRebateAsset
          ? daoSnowRebateAsset.find(
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
            {daoSnowRebatePriceInUSDC ? daoSnowRebatePriceInUSDC : '-.----'}
            <br />
            {daoSnowRebateBondDuration ? daoSnowRebateBondDuration + ' hours' : ''}
            <br />
            {daoSnowRebateBondPremium ? daoSnowRebateBondPremium + '%' : ''}
            <br />
            {daoSnowRebateSnowAvailable ? daoSnowRebateSnowAvailable : ''} <br />
            <br />
            {daoSnowRebatesAccountVested ? daoSnowRebatesAccountVested : '-.------'}
            <br />
            {daoSnowRebatesAccountClaimableSnow ? daoSnowRebatesAccountClaimableSnow : '-.------'} <br />
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
