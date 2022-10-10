import React, { useState, useMemo, useEffect } from 'react';

import { Button, Select, MenuItem, InputLabel, withStyles } from '@material-ui/core';
// import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
import TokenInput from '../../../components/TokenInput';
import styled from 'styled-components';

import { getDisplayBalance } from '../../../utils/formatBalance';
import Label from '../../../components/Label';
import useLpStats from '../../../hooks/useLpStats';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useTombFinance from '../../../hooks/useTombFinance';
// import { useWallet } from 'use-wallet';
import useApproveWapper, { ApprovalState } from '../../../hooks/useApproveWrapperRouter';
import useApproveFtmWapper, { ApprovalState as ApprovalFtmState } from '../../../hooks/useApproveWrapperRouter';
import { TOMB_TICKER, TSHARE_TICKER, FTM_TICKER } from '../../../utils/constants';
import { Alert } from '@material-ui/lab';
// import { isCommunityResourcable } from '@ethersproject/providers';
import useTombStats from '../../../hooks/useTombStats';
import usetShareStats from '../../../hooks/usetShareStats';

interface ZapProps extends ModalProps {
  onConfirm: (zapAsset: string, amount: string, ftmAmount: string, lpAmount: string) => void;
  tokenName?: string;
  decimals?: number;
}

const ZapRouterModal: React.FC<ZapProps> = ({ onConfirm, onDismiss, tokenName = '', decimals = 18 }) => {
  const tombFinance = useTombFinance();
  // const { balance } = useWallet();
  // const ftmBalance = (Number(balance) / 1e18).toFixed(4).toString();
  const ftmBalanceVal = useTokenBalance(tombFinance.FTM);
  const tombBalance = useTokenBalance(tombFinance.TOMB);
  const tshareBalance = useTokenBalance(tombFinance.TSHARE);
  const tombStats = useTombStats();
  const tShareStats = usetShareStats();
  const tombPriceInFTM = useMemo(() => (tombStats ? Number(tombStats.tokenInFtm).toFixed(6) : null), [tombStats]);
  const tSharePriceInFTM = useMemo(
    () => (tShareStats ? Number(tShareStats.tokenInFtm).toFixed(6) : null),
    [tShareStats],
  );
  const [val, setVal] = useState('');
  const [ftmVal, setFtmVal] = useState(''); 
  const [zappingToken, setZappingToken] = useState((tokenName.startsWith(TOMB_TICKER) ? TOMB_TICKER : TSHARE_TICKER));
  const [zappingFtmToken, setZappingFtmToken] = useState(FTM_TICKER);
  const [zappingTokenBalance, setZappingTokenBalance] = useState(getDisplayBalance((tokenName.startsWith(TOMB_TICKER) ? tombBalance : tshareBalance), decimals));
  const [zappingFtmTokenBalance, setZappingFtmTokenBalance] = useState(getDisplayBalance(ftmBalanceVal, 6));
  useEffect(() => {
    if (Number(zappingFtmTokenBalance) == 0) {
      setZappingFtmTokenBalance(getDisplayBalance(ftmBalanceVal, 6));
    }
  }, [ftmBalanceVal]);
  useEffect(() => {
    if (Number(zappingTokenBalance) == 0) {
      setZappingTokenBalance(getDisplayBalance((tokenName.startsWith(TOMB_TICKER) ? tombBalance : tshareBalance), decimals));
    }
  }, [ftmBalanceVal]);
  const [estimate, setEstimate] = useState({ token0: '0', token1: '0' }); // token0 will always be FTM in this case
  const [approveZapperStatus, approveZapper] = useApproveWapper(zappingToken);
  const [approveFtmZapperStatus, approveFtmZapper] = useApproveFtmWapper(zappingFtmToken);
  const tombFtmLpStats = useLpStats('SNOW-USDC-LP');
  const tShareFtmLpStats = useLpStats('GLCR-USDC-LP');
  const tombLPStats = useMemo(() => (tombFtmLpStats ? tombFtmLpStats : null), [tombFtmLpStats]);
  const tshareLPStats = useMemo(() => (tShareFtmLpStats ? tShareFtmLpStats : null), [tShareFtmLpStats]);
  const ftmAmountPerLP = tokenName.startsWith(TOMB_TICKER) ? tombLPStats?.ftmAmount : tshareLPStats?.ftmAmount;
  /**
   * Checks if a value is a valid number or not
   * @param n is the value to be evaluated for a number
   * @returns
   */
  function isNumeric(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  // const handleChangeAsset = (event: any) => {
  //   const value = event.target.value;
  //   setZappingToken(value);

  //   if (event.target.value === TSHARE_TICKER) {
  //     setZappingTokenBalance(getDisplayBalance(tshareBalance, decimals));
  //   }
  //   if (event.target.value === TOMB_TICKER) {
  //     setZappingTokenBalance(getDisplayBalance(tombBalance, decimals));
  //   }

  //   if (event.target.value === FTM_TICKER) {
  //     setZappingTokenBalance(getDisplayBalance(ftmBalanceVal, 6));
  //   }
  // };

  const handleChange = async (e: any) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setVal(e.currentTarget.value);
      setFtmVal(e.currentTarget.value);
      setEstimate({ token0: '0', token1: '0' });
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setVal(e.currentTarget.value);
    const ftmVal = Number(e.currentTarget.value)*Number(tokenName.startsWith(TOMB_TICKER) ? tombPriceInFTM : tSharePriceInFTM);
    setFtmVal(ftmVal.toString());
    // const estimateZap = await tombFinance.estimateZapIn(zappingToken, tokenName, String(Number(e.currentTarget.value)*2));
    setEstimate({ token0: ftmVal.toString(), token1: e.currentTarget.value.toString() });
    
  };

  const handleFtmChange = async (e: any) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setVal(e.currentTarget.value);
      setFtmVal(e.currentTarget.value);
      setEstimate({ token0: '0', token1: '0' });
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setFtmVal(e.currentTarget.value);
    const tokenVal = Number(e.currentTarget.value)/Number(tokenName.startsWith(TOMB_TICKER) ? tombPriceInFTM : tSharePriceInFTM);
    setVal(tokenVal.toString());
    // const estimateZap = await tombFinance.estimateZapIn(zappingToken, tokenName, String(e.currentTarget.value));
    setEstimate({ token0: e.currentTarget.value.toString() , token1: tokenVal.toString()});
  };

  const handleSelectMax = async () => {
    setVal(zappingTokenBalance);
    const ftmVal = Number(zappingTokenBalance)*Number(tokenName.startsWith(TOMB_TICKER) ? tombPriceInFTM : tSharePriceInFTM);
    setFtmVal(ftmVal.toString());
    // const estimateZap = await tombFinance.estimateZapIn(zappingToken, tokenName, String(Number(zappingTokenBalance)*2));
    setEstimate({ token0: ftmVal.toString(), token1: zappingFtmTokenBalance.toString() });
  };
  const handleSelectFtmMax = async () => {
    setFtmVal(zappingFtmTokenBalance);
    const tokenVal = Number(zappingFtmTokenBalance)/Number(tokenName.startsWith(TOMB_TICKER) ? tombPriceInFTM : tSharePriceInFTM);
    setVal(tokenVal.toString());
    // const estimateZap = await tombFinance.estimateZapIn(zappingFtmToken, tokenName, String(zappingFtmTokenBalance));
    setEstimate({ token0: zappingFtmTokenBalance.toString(), token1: tokenVal.toString() });
  };

  return (
    <Modal>
      <ModalTitle text={`Add Liquidity`} />

      <StyledActionSpacer />
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={zappingTokenBalance}
        symbol={zappingToken}
      />
      <StyledActionSpacer />

      <TokenInput
        onSelectMax={handleSelectFtmMax}
        onChange={handleFtmChange}
        value={ftmVal}
        max={zappingFtmTokenBalance}
        symbol={zappingFtmToken}
      />
      {/* <Label text="Zap Estimations" color="black" />
      <StyledDescriptionText>
        {' '}
        {tokenName}: {Number(estimate.token1) / Number(ftmAmountPerLP)}
      </StyledDescriptionText>
      <StyledDescriptionText>
        {' '}
        ({Number(estimate.token0)} {FTM_TICKER} / {Number(estimate.token1)}{' '}
        {tokenName.startsWith(TOMB_TICKER) ? TOMB_TICKER : TSHARE_TICKER}){' '}
      </StyledDescriptionText> */}
        {Number(val) > Number(zappingTokenBalance) && <StyledActionSpacer /> }
        {Number(val) > Number(zappingTokenBalance) && <Alert variant="filled" severity="error"  >
        {' '} 
        {(Number(val) > Number(zappingTokenBalance) ? 'Insufficient ' + (tokenName.startsWith(TOMB_TICKER) ? TOMB_TICKER : TSHARE_TICKER) : '')}{' '}  
        </Alert>}
        {Number(ftmVal) > Number(zappingFtmTokenBalance) && <StyledActionSpacer /> }
        {Number(ftmVal) > Number(zappingFtmTokenBalance) && <Alert variant="filled" severity="error" >
        {' '} 
        {(Number(ftmVal) > Number(zappingFtmTokenBalance) ? 'Insufficient ' + FTM_TICKER :'')}{' '}
        </Alert>}
    
      <ModalActions>
        <Button
          color="primary"
          variant="contained"
          disabled={Number(val) > Number(zappingTokenBalance) || Number(ftmVal) > Number(zappingFtmTokenBalance)}
          onClick={() =>
            approveZapperStatus !== ApprovalState.APPROVED ? approveZapper() : approveFtmZapperStatus !== ApprovalFtmState.APPROVED ? approveFtmZapper() : onConfirm(zappingToken, val, ftmVal,(Number(estimate.token1) / Number(ftmAmountPerLP)).toString())
          }
        >
          {approveZapperStatus !== ApprovalState.APPROVED ? 'Approve ' + (tokenName.startsWith(TOMB_TICKER) ? TOMB_TICKER : TSHARE_TICKER) : approveFtmZapperStatus !== ApprovalFtmState.APPROVED ? 'Approve ' +FTM_TICKER :'Add Liquidity'}

        </Button>
      </ModalActions>

      <StyledActionSpacer />
      {/* <Alert variant="filled" severity="warning">
        Beta feature. Use at your own risk!
      </Alert> */}
    </Modal>
  );
};

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledDescriptionText = styled.div`
  align-items: center;
  color: ${(props) => props.theme.color.grey[400]};
  display: flex;
  font-size: 14px;
  font-weight: 700;
  height: 22px;
  justify-content: flex-start;
`;
const StyledMenuItem = withStyles({
  root: {
    backgroundColor: 'white',
    color: '#2c2560',
    '&:hover': {
      backgroundColor: 'grey',
      color: '#2c2560',
    },
    selected: {
      backgroundColor: 'black',
    },
  },
})(MenuItem);

export default ZapRouterModal;
