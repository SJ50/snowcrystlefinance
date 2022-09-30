import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import { RebateGlcrAccountStat } from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useDaoGlcrRebatesAccountStats = () => {
  const [stat, setStat] = useState<RebateGlcrAccountStat>();
  const { fastRefresh } = useRefresh();
  const tombFinance = useTombFinance();

  useEffect(() => {
    async function fetchDaoGlcrRebateAccountStat() {
      try {
        setStat(await tombFinance.rebatesDaoGlcrRebateAccountStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchDaoGlcrRebateAccountStat();
  }, [setStat, tombFinance, fastRefresh]);

  return stat;
};

export default useDaoGlcrRebatesAccountStats;
