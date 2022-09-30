import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import { RebateSnowAccountStat } from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useDevSnowRebatesAccountStats = () => {
  const [stat, setStat] = useState<RebateSnowAccountStat>();
  const { fastRefresh } = useRefresh();
  const tombFinance = useTombFinance();

  useEffect(() => {
    async function fetchDevSnowRebateAccountStat() {
      try {
        setStat(await tombFinance.rebatesDevSnowRebateAccountStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchDevSnowRebateAccountStat();
  }, [setStat, tombFinance, fastRefresh]);

  return stat;
};

export default useDevSnowRebatesAccountStats;
