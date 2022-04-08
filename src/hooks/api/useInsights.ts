import { useQuery } from 'react-query';
import { getTransactionInsights, ItransactionInsights } from 'services/bankTransactions';

export const useTransactionInsights = (accountId: string | undefined) => {
    const {
        data: transactionInsights,
        ...rest
      } = useQuery<ItransactionInsights, unknown>(
        ['transactionInsights', {
          accountId,
        }],
        () => getTransactionInsights(
          accountId!,
        ),
        {
          enabled: accountId != null, // only enable if accountid is available
        },
      );
  return {
    transactionInsights,
    ...rest,
  }
};