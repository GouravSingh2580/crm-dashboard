import { useBankAccounts } from 'hooks/api/useBankAccount';
import useBankAccountForDashboard from 'hooks/dataFormatters/useBankAccountForDashboard';
import { BankAccountsList } from 'components/bookkeeping';
import useLoading from 'hooks/useLoading';
import { Alert, AlertTitle, Box } from '@mui/material';
import { useBookkeepingStore } from 'states/bookkeeping';
import { FLAGS, withFeatureFlag } from 'hooks/useFeatureFlag';
import React from 'react';

interface Props {
  accountId: string;
}

const BankAccountsAdmin = ({ accountId }: Props) => {
  const { connections, isLoading, error } = useBankAccounts(accountId);
  const loading = useLoading(isLoading);
  const bankAccounts = useBankAccountForDashboard(connections);
  const bookKeepingStore = useBookkeepingStore(
    (state) => state.setIsBookkeeper,
  );

  React.useEffect(() => {
    // set current user as bookkeeper
    bookKeepingStore(true);
  }, []);

  const bankAccountTable =
    connections != null && connections.length > 0 ? (
      <BankAccountsList accountId={accountId} bankAccounts={bankAccounts} />
    ) : (
      <Alert severity="warning">
        <AlertTitle>The customer does not connect to a bank yet</AlertTitle>
        When the customer connected to a bank, bank accounts will display in
        this section
      </Alert>
    );

  return (
    <Box marginTop={2}>
      {loading}
      {error != null ? (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {`An error has been occurred: ${error.message}`}
        </Alert>
      ) : (
        bankAccountTable
      )}
    </Box>
  );
};

export const BankAccounts = withFeatureFlag(FLAGS.BOOKKEEPING)(
  BankAccountsAdmin,
);
