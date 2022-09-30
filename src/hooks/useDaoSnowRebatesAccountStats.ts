import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import { RebateSnowAccountStat } from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useDaoSnowRebatesAccountStats = () => {
  const [stat, setStat] = useState<RebateSnowAccountStat>();
  const { fastRefresh } = useRefresh();
  const tombFinance = useTombFinance();

  useEffect(() => {
    async function fetchDaoSnowRebateAccountStat() {
      try {
        setStat(await tombFinance.rebatesDaoSnowRebateAccountStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchDaoSnowRebateAccountStat();
  }, [setStat, tombFinance, fastRefresh]);

  return stat;
};

export default useDaoSnowRebatesAccountStats;
