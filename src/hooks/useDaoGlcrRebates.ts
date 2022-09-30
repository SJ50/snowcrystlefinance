import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useDaoGlcrRebates = () => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleBond = useCallback(
    (token: string, amount: string) => {
      handleTransactionReceipt(
        tombFinance.rebatesDaoGlcrBond(token, amount),
        `Bond ${Number(amount) / 10**18}.`,
      );
    },
    [tombFinance, handleTransactionReceipt],
  );

  const handleClaim = useCallback(
    () => {
      handleTransactionReceipt(
        tombFinance.rebatesDaoGlcrClaim(),
        `Claim Reward.`,
      );
    },
    [tombFinance, handleTransactionReceipt],
  );

  return { onBond: handleBond, onClaim: handleClaim };
};

export default useDaoGlcrRebates;
