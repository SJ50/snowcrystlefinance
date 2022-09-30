import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import { RebateGlcrStat } from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useDevGlcrRebatesStats = () => {
  const [stat, setStat] = useState<RebateGlcrStat>();
  const { fastRefresh } = useRefresh();
  const tombFinance = useTombFinance();

  useEffect(() => {
    async function fetchDevGlcrRebateStat() {
      try {
        setStat(await tombFinance.rebatesDevGlcrRebateStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchDevGlcrRebateStat();
  }, [setStat, tombFinance, fastRefresh]);

  return stat;
};

export default useDevGlcrRebatesStats;
