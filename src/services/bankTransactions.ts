import { buildQueryString, QueryParams } from 'hooks/api/useBankTransactions';
import { bookkeepingService } from './bookkeepingService';

export interface ItransactionInsights {
  // eslint-disable-next-line camelcase
  actionable_count: number;
  // eslint-disable-next-line camelcase
  expense_total_cents: number;
  // eslint-disable-next-line camelcase
  income_total_cents: number;
}

export const getTransactions = async (
  accountId: string,
  params: QueryParams,
): Promise<any> => {
  const url = `/accounts/${accountId}/transactions?${buildQueryString(params)}`;
  return bookkeepingService({
    method: 'GET',
    url,
  }).then((resp) => resp.data);
};

export const updateTransaction = async (
  accountId: string,
  transactionId: string,
  data: {
    // eslint-disable-next-line camelcase
    category_id: string;
    notes: string;
    reviewed: boolean | null;
  },
): Promise<any> =>
  bookkeepingService({
    method: 'PATCH',
    url: `/accounts/${accountId}/transactions/${transactionId}`,
    data,
  }).then((resp) => resp.data);

export interface CategoryItem {
  id: string;
  name: string;
  type: 'income' | 'expense';
  active: boolean;
}

export const getCategories = async (): Promise<any> =>
  bookkeepingService
    .get<CategoryItem[]>('categories')
    .then((resp) => resp.data);

export const getTransactionInsights = async (
  accountId: string,
): Promise<any> => {
  const url = `/accounts/${accountId}/transactions-meta`;
  return bookkeepingService({
    method: 'GET',
    url,
  }).then((resp) => resp.data);
};
