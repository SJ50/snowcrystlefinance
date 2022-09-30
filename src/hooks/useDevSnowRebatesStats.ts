import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import { RebateSnowStat } from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useDevSnowRebatesStats = () => {
  const [stat, setStat] = useState<RebateSnowStat>();
  const { fastRefresh } = useRefresh();
  const tombFinance = useTombFinance();

  useEffect(() => {
    async function fetchDevSnowRebateStat() {
      try {
        setStat(await tombFinance.rebatesDevSnowRebateStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchDevSnowRebateStat();
  }, [setStat, tombFinance, fastRefresh]);

  return stat;
};

export default useDevSnowRebatesStats;
