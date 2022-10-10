import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import { Bank } from '../tomb-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useWrapperRouter = (bank: Bank) => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleAddLiquidity = useCallback(
    (Token: string, amount: string, ftmAmount: string, lpAmount: string) => {
      console.log("debug use WrapperRouter " + bank.depositTokenName);
      handleTransactionReceipt(
        tombFinance.addLiquidity(Token, amount, ftmAmount),
        `Adding Liquidity ${lpAmount} in ${bank.depositTokenName.replace('USDC', 'USDC')}.`,
      );
    },
    [bank, tombFinance, handleTransactionReceipt],
  );
  return { onAddTombLiquidity: handleAddLiquidity,onAddTshareLiquidity: handleAddLiquidity };
};

export default useWrapperRouter;
