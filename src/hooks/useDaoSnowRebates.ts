import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useDaoSnowRebates = () => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleBond = useCallback(
    (token: string, amount: string) => {
      handleTransactionReceipt(tombFinance.rebatesDaoSnowBond(token, amount), `Bond ${Number(amount) / 10 ** 18}.`);
    },
    [tombFinance, handleTransactionReceipt],
  );

  const handleClaim = useCallback(() => {
    handleTransactionReceipt(tombFinance.rebatesDaoSnowClaim(), `Claim Reward.`);
  }, [tombFinance, handleTransactionReceipt]);

  return { onBond: handleBond, onClaim: handleClaim };
};

export default useDaoSnowRebates;
