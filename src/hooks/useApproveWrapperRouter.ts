import { BigNumber, ethers } from 'ethers';
import { useCallback, useMemo } from 'react';
import { useHasPendingApproval, useTransactionAdder } from '../state/transactions/hooks';
import useAllowance from './useAllowance';
import ERC20 from '../tomb-finance/ERC20';
import { FTM_TICKER, TOMB_TICKER, TSHARE_TICKER } from '../utils/constants';
import useTombFinance from './useTombFinance';

const APPROVE_AMOUNT = ethers.constants.MaxUint256;
const APPROVE_BASE_AMOUNT = BigNumber.from('1000000000000000000000000');

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
function useApproveWapper(zappingToken: string): [ApprovalState, () => Promise<void>] {
  const tombFinance = useTombFinance();
  let token: ERC20;
  if (zappingToken === FTM_TICKER) token = tombFinance.FTM;
  else if (zappingToken === TOMB_TICKER) token = tombFinance.TOMB;
  else if (zappingToken === TSHARE_TICKER) token = tombFinance.TSHARE;
  const pendingApproval = useHasPendingApproval(token.address, tombFinance.wrapperRouterAddress());
  const currentAllowance = useAllowance(token, tombFinance.wrapperRouterAddress(), pendingApproval);

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    // we might not have enough data to know whether or not we need to approve
    // if (token === tombFinance.FTM) return ApprovalState.APPROVED;
    if (!currentAllowance) return ApprovalState.UNKNOWN;

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lt(APPROVE_BASE_AMOUNT)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [currentAllowance, pendingApproval, token, tombFinance]);

  const addTransaction = useTransactionAdder();

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily');
      return;
    }

    const response = await token.approve(tombFinance.wrapperRouterAddress(), APPROVE_AMOUNT);
    addTransaction(response, {
      summary: `Approve ${token.symbol}`,
      approval: {
        tokenAddress: token.address,
        spender: tombFinance.wrapperRouterAddress(),
      },
    });
  }, [approvalState, token, addTransaction]);

  return [approvalState, approve];
}

export default useApproveWapper;
