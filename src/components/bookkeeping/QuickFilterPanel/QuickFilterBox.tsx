import {
  Filters, getUnknownCategoryId, useTransactionCategories,
  useUncategorizedTransactionCount,
} from 'hooks/api/useBankTransactions';
import { Box } from '@mui/material';
import { useMemo } from 'react';
import {
  FilterItem,
  createQuickFilterState,
  QuickFilterState,
  GenericQuickFilter,
} from '../../common/GenericQuickFilter/GenericQuickFilter';
import { QuickFilter } from './QuickFilter';

export const quickFilters: FilterItem<Filters>[] = [
  {
    id: 'all',
    label: 'All transactions',
    data: {
      categoryId: undefined,
      amountGreaterThan: undefined,
      amountLessThan: undefined,
    },
  },
  {
    id: 'uncategorized',
    label: 'Uncategorized',
    data: {
      categoryId: 'b067d97a-337c-11ec-9ee5-acde48001122',
      amountGreaterThan: undefined,
      amountLessThan: undefined,
    },
  },
  {
    id: 'income',
    label: 'Income',
    data: {
      categoryId: undefined,
      amountGreaterThan: undefined,
      amountLessThan: '0',
    },
  },
  {
    id: 'expense',
    label: 'Expense',
    data: {
      categoryId: undefined,
      amountGreaterThan: '0',
      amountLessThan: undefined,
    },
  },
];

export const useQuickFilter = createQuickFilterState(quickFilters);
export type TransactionsFilterItem = FilterItem<Filters>;
export interface TransactionQuickFilterState extends QuickFilterState<TransactionsFilterItem> {
  accountId: string | undefined;
}

// eslint-disable-next-line max-len
export const QuickFilterBox = ({ accountId, quickFilterId, setQuickFilterId }: TransactionQuickFilterState) => {
  const { count: uncategorizedCount } = useUncategorizedTransactionCount(accountId);
  const { categories } = useTransactionCategories();

  const filters = useMemo(() => {
    const unknownCatId = getUnknownCategoryId(categories || []);
    return quickFilters.map((item) => {
      if (item.id === 'uncategorized') {
        const newItem = { ...item };
        newItem.count = uncategorizedCount;
        newItem.data.categoryId = unknownCatId;
        return newItem;
      }
      return item;
    });
  }, [categories, uncategorizedCount]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
    }}
    >
      <GenericQuickFilter
        items={filters}
        renderItem={(filter) => (
          <Box sx={{ m: 1 }} key={filter.id}>
            <QuickFilter
              label={filter.label}
              count={filter.count}
              selected={quickFilterId === filter.id}
              onClick={() => setQuickFilterId(filter.id)}
              data-testid={`quick-filter-${filter.id} ${quickFilterId === filter.id ? 'quick-filter-selected' : ''}`}
            />
          </Box>
        )}
      />
    </Box>
  );
};
