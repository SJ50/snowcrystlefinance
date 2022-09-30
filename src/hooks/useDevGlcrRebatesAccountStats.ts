import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import { RebateGlcrAccountStat } from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useDevGlcrRebatesAccountStats = () => {
  const [stat, setStat] = useState<RebateGlcrAccountStat>();
  const { fastRefresh } = useRefresh();
  const tombFinance = useTombFinance();

  useEffect(() => {
    async function fetchDevGlcrRebateAccountStat() {
      try {
        setStat(await tombFinance.rebatesDevGlcrRebateAccountStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchDevGlcrRebateAccountStat();
  }, [setStat, tombFinance, fastRefresh]);

  return stat;
};

export default useDevGlcrRebatesAccountStats;
