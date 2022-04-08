import React, { useEffect, useState } from 'react';
import { useBankAccounts } from 'hooks/api/useBankAccount';
import { Stage, useStore } from './state';
import { LoadingScreen, Stages } from '../LoadingScreen';

interface Props {
  accountId: string | undefined;
}

export const BankAccountLoading = ({ accountId }: Props) => {
  const setStage = useStore((state) => state.setStage);
  const [loadingStage, setLoadingStage] = useState<number>(0);
  const { connections: rawAccounts, refresh } = useBankAccounts(accountId);

  useEffect(() => {
    const t = setTimeout(() => setLoadingStage(loadingStage + 1), 5000);

    let retryCount: number = 0;
    const refreshInterval = setInterval(() => {
      retryCount += 1;
      if (retryCount > 10) {
        clearInterval(refreshInterval);
      }
      return refresh();
    }, 2000);
    return () => {
      clearTimeout(t);
      clearInterval(refreshInterval);
    };
  }, []);

  useEffect(() => {
    if (rawAccounts.length > 0) {
      setStage(Stage.BankView);
    }
  }, [rawAccounts]);
  return <LoadingScreen stage={Stages[loadingStage] || Stages[1]} />;
};
