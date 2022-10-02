import React, { useCallback, useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';

import { Button } from '@material-ui/core';
// import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
import TokenInput from '../../../components/TokenInput';
import useDevSnowRebatesStats from '../../../hooks/useDevSnowRebatesStats';
import useTombFinance from '../../../hooks/useTombFinance';
import useFantomPrice from '../../../hooks/useFantomPrice';

import { getFullDisplayBalance, getDisplayBalance } from '../../../utils/formatBalance';
import { BigNumber } from 'ethers';

interface DepositModalProps extends ModalProps {
  max: BigNumber;
  onConfirm: (amount: Number) => void;
  tokenName?: string;
  token?: any;
}

const DepositModal: React.FC<DepositModalProps> = ({ max, onConfirm, onDismiss, tokenName = '', token }) => {
  const [val, setVal] = useState('');
  const [out, setOut] = useState(0);

  const tombFinance = useTombFinance();
  const devSnowRebatesStats = useDevSnowRebatesStats();
  const devSnowRebatePriceInUSDC = useMemo(
    () => (devSnowRebatesStats ? Number(getFullDisplayBalance(BigNumber.from(devSnowRebatesStats.snowPrice),18)) : 0),
    [devSnowRebatesStats],
  );
  const devSnowRebateBondPremium = useMemo(
    () => (devSnowRebatesStats ? (Number(devSnowRebatesStats.bondPremium) * 100) : 0),
    [devSnowRebatesStats],
  );
  const devSnowRebateSnowAvailable = useMemo(
    () => (devSnowRebatesStats ? Number(getDisplayBalance(BigNumber.from(devSnowRebatesStats.snowAvailable),18)).toFixed(4) : 0),
    [devSnowRebatesStats],
  );
  const { price: ftmPrice, marketCap: ftmMarketCap, priceChange: ftmPriceChange } = useFantomPrice();

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, tokenName === 'USDC' ? 6 : 18);
  }, [max, tokenName]);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value);
    },
    [setVal],
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal, devSnowRebatesStats]);

  const devSnowRebateAsset = useMemo(
    () => (devSnowRebatesStats ? devSnowRebatesStats.assets : null),
    [devSnowRebatesStats],
  );
  
  function getAssetPrice(token: String) {
    const address = tombFinance.externalTokens[tokenName].address;
    const assetPrice = devSnowRebateAsset ? devSnowRebateAsset.find((a: any) => a.token === address).price : 0;
    return assetPrice;
  }

  function getOutAmount() {
    const toBondPrice = Number(getAssetPrice(tokenName)); 
    const outAmount =
      (+val * toBondPrice *
        (1 + devSnowRebateBondPremium / 100))/devSnowRebatePriceInUSDC;
    return outAmount;
  }

  function formatOutAmount() {
    const outAmount = getOutAmount();
    return `Receiving: ${outAmount.toFixed(4)} SNOW ($${(outAmount * devSnowRebatePriceInUSDC * ftmPrice).toFixed(4)})`;
  }

  function formatInAmount() {
    return `Input: ${(+val).toFixed(9)} ${tokenName.replace('USDC', 'USDC')} ($${(+val * Number(getAssetPrice(tokenName)) * ftmPrice).toFixed(4)})`;
  }

  return (
    <Modal>
      <ModalTitle text={`Bond ${tokenName.replace('USDC', 'USDC')}`} />
      <TokenInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
      />
      <StyledMaxText style={{ marginTop: '14px', color: 'black' }}>{formatInAmount()}</StyledMaxText>
      <StyledMaxText style={{ color: 'black' }}>{formatOutAmount()}</StyledMaxText>
      <StyledMaxText style={{ color: 'black' }}>
        {devSnowRebateSnowAvailable > 0 ? `${devSnowRebateSnowAvailable} SNOW Available` : 'Bond Sold Out'}
      </StyledMaxText>
      <ModalActions>
        <Button
          color={'primary'}
          variant="contained"
          disabled={getOutAmount() >= devSnowRebateSnowAvailable}
          onClick={() => onConfirm(+val)}
        >
          Confirm
        </Button>
      </ModalActions>
    </Modal>
  );
};

const StyledMaxText = styled.div`
  align-items: center;
  color: ${(props) => props.theme.color.grey[600]};
  display: flex;
  font-size: 18px;
  margin-top: 2px;
  font-weight: 700;
  justify-content: flex-start;
`;

export default DepositModal;
