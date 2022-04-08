import { ReactNode, useState } from 'react';
import { Filters } from 'hooks/api/useBankTransactions';
import { Grid } from '@mui/material';
import { TransactionFilterDrawer } from '../TransactionsFilterDrawer';
import { BankTransactionsSearch } from './BankTransactionsSearch';

interface Props {
  search?: string;
  filters: Filters;
  onSearchChange: (value: string) => void;
  onFiltersChange: (filter: Filters) => void;
  refresh: () => void;
  quickFilter: ReactNode;
}

export const BankTransactionSearchPanel = ({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  refresh,
  quickFilter,
}: Props) => {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>{quickFilter}</Grid>
        <Grid item>
          <BankTransactionsSearch
            value={search}
            onChange={onSearchChange}
            onFilterOpen={() => setIsFilterOpen(true)}
          />
        </Grid>
      </Grid>

      <TransactionFilterDrawer
        open={isFilterOpen}
        filters={filters}
        onChange={onFiltersChange}
        onClose={() => setIsFilterOpen(false)}
        refresh={refresh}
      />
    </>
  );
};
BankTransactionSearchPanel.defaultProps = {
  search: '',
};
