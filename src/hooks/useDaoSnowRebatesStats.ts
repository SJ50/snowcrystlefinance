import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import { RebateSnowStat } from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useDaoSnowRebatesStats = () => {
  const [stat, setStat] = useState<RebateSnowStat>();
  const { fastRefresh } = useRefresh();
  const tombFinance = useTombFinance();

  useEffect(() => {
    async function fetchDaoSnowRebateStat() {
      try {
        setStat(await tombFinance.rebatesDaoSnowRebateStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchDaoSnowRebateStat();
  }, [setStat, tombFinance, fastRefresh]);

  return stat;
};

export default useDaoSnowRebatesStats;
