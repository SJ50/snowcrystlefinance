import React, { useCallback, useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';

import { Button } from '@material-ui/core';
// import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
import TokenInput from '../../../components/TokenInput';
import useDaoGlcrRebatesStats from '../../../hooks/useDaoGlcrRebatesStats';
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
  const daoGlcrRebatesStats = useDaoGlcrRebatesStats();
  const daoGlcrRebatePriceInUSDC = useMemo(
    () => (daoGlcrRebatesStats ? Number(getFullDisplayBalance(BigNumber.from(daoGlcrRebatesStats.glcrPrice), 18)) : 0),
    [daoGlcrRebatesStats],
  );
  const daoGlcrRebateBondPremium = useMemo(
    () => (daoGlcrRebatesStats ? Number(daoGlcrRebatesStats.bondPremium) * 100 : 0),
    [daoGlcrRebatesStats],
  );
  const daoGlcrRebateGlcrAvailable = useMemo(
    () =>
      daoGlcrRebatesStats
        ? Number(getDisplayBalance(BigNumber.from(daoGlcrRebatesStats.glcrAvailable), 18)).toFixed(4)
        : 0,
    [daoGlcrRebatesStats],
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
  }, [fullBalance, setVal, daoGlcrRebatesStats]);

  const daoGlcrRebateAsset = useMemo(
    () => (daoGlcrRebatesStats ? daoGlcrRebatesStats.assets : null),
    [daoGlcrRebatesStats],
  );

  function getAssetPrice(token: String) {
    const address = tombFinance.externalTokens[tokenName].address;
    const assetPrice = daoGlcrRebateAsset ? daoGlcrRebateAsset.find((a: any) => a.token === address).price : 0;
    return assetPrice;
  }

  function getOutAmount() {
    const toBondPrice = Number(getAssetPrice(tokenName));
    const outAmount = (+val * toBondPrice * (1 + daoGlcrRebateBondPremium / 100)) / daoGlcrRebatePriceInUSDC;
    return outAmount;
  }

  function formatOutAmount() {
    const outAmount = getOutAmount();
    return `Receiving: ${outAmount.toFixed(4)} GLCR ($${(outAmount * daoGlcrRebatePriceInUSDC * ftmPrice).toFixed(4)})`;
  }

  function formatInAmount() {
    return `Input: ${(+val).toFixed(9)} ${tokenName.replace('USDC', 'USDC')} ($${(
      +val *
      Number(getAssetPrice(tokenName)) *
      ftmPrice
    ).toFixed(4)})`;
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
        {daoGlcrRebateGlcrAvailable > 0 ? `${daoGlcrRebateGlcrAvailable} GLCR Available` : 'Bond Sold Out'}
      </StyledMaxText>
      <ModalActions>
        <Button
          color={'primary'}
          variant="contained"
          disabled={getOutAmount() >= daoGlcrRebateGlcrAvailable}
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