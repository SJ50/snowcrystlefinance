import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import { Bank } from '../tomb-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useWrapperRouter = (bank: Bank) => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleAddLiquidity = useCallback(
    (Token: string, amount: string, ftmAmount: string) => {
      console.log("debug use WrapperRouter " + bank.depositTokenName);
      handleTransactionReceipt(
        tombFinance.addLiquidity(Token, amount, ftmAmount),
        `Adding Liquidity ${amount} in ${bank.depositTokenName.replace('USDC', 'USDC')}.`,
      );
    },
    [bank, tombFinance, handleTransactionReceipt],
  );
  return { onAddLiquidity: handleAddLiquidity};
};

export default useWrapperRouter;
