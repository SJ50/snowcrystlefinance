import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import { RebateGlcrStat } from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useDaoGlcrRebatesStats = () => {
  const [stat, setStat] = useState<RebateGlcrStat>();
  const { fastRefresh } = useRefresh();
  const tombFinance = useTombFinance();

  useEffect(() => {
    async function fetchDaoGlcrRebateStat() {
      try {
        setStat(await tombFinance.rebatesDaoGlcrRebateStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchDaoGlcrRebateStat();
  }, [setStat, tombFinance, fastRefresh]);

  return stat;
};

export default useDaoGlcrRebatesStats;
