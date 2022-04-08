import { useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import {
  getTransactions,
  updateTransaction,
  getCategories, CategoryItem,
} from 'services/bankTransactions';
import reactQueryClient from 'states/reactQueryClient';
import { SortingDirection } from 'enums';

export interface Filters {
  from?: string;
  to?: string;
  // eslint-disable-next-line camelcase
  categoryId?: string;
  amountGreaterThan?: string;
  amountLessThan?: string;
  source?: string;
}

export interface QueryParams {
  page: number;
  order: SortingDirection;
  search?: string;
  // filters: Filters,
  from?: string;
  to?: string;
  categoryId?: string;
  amountGreaterThan?: string;
  amountLessThan?: string;
  source?: string;
}

const defaultQuery: QueryParams = {
  page: 1,
  order: SortingDirection.Desc,
};

export const buildQueryString = (params: QueryParams): string => {
  const { from, to, ...rest } = params;
  const paramsRecord: Record<string, string> = {
    ...rest,
    page: String(params.page),
    order: params.order,
  };
  if (from) paramsRecord.from = from.toString();
  if (to) paramsRecord.to = to.toString();
  return new URLSearchParams(paramsRecord).toString();
};

export const buildParamsFromSearch = (search: string): QueryParams => {
  const paramObjects = new URLSearchParams(search);
  const params: QueryParams = { ...defaultQuery };
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of paramObjects.entries()) {
    switch (key) {
      case 'page':
        params.page = Number(value);
        break;
      case 'order':
        params.order =
          value === SortingDirection.Asc
            ? SortingDirection.Asc
            : SortingDirection.Desc;
        break;
      case 'search':
        break;
      case 'categoryId':
        break;
      default:
        // @ts-ignore
        params[key] = String(value);
        break;
    }
  }

  return params;
};

export const useBankTransactions = (
  accountId: string | undefined,
  defaultParams: QueryParams = { ...defaultQuery },
) => {
  const [params, setParams] = useState<QueryParams>(defaultParams);
  const { page = 1, order = SortingDirection.Desc } = params;

  const { data: transactions, ...rest } = useQuery<any, unknown>(
    [
      'transactions',
      {
        accountId,
        ...params,
      },
    ],
    () => getTransactions(accountId!, params),
    {
      enabled: accountId != null, // only enable if accountid is available
    },
  );

  const updateParams = (newParams: Partial<QueryParams>) => {
    const updatedParams: QueryParams = {
      ...params,
      ...newParams,
    };

    // remove empty params
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(updatedParams)) {
      if (value == null || value === '') {
        // @ts-ignore
        delete updatedParams[key];
      }
    }
    setParams(updatedParams);
  };

  const setOrder = (value: SortingDirection) =>
    updateParams({
      order: value,
      page: 1,
    });
  const setPage = (value: number) => updateParams({ page: value });
  const setSearch = (value: string) =>
    updateParams({
      search: value,
      page: 1,
    });
  const setFilters = (filtersParams: Filters) =>
    updateParams({
      ...filtersParams,
      page: 1,
    });
  const refresh = () => {
    reactQueryClient.invalidateQueries([
      'transactions',
      {
        accountId,
        page,
        order,
      },
    ]);
  };

  return {
    transactions,
    params,
    refresh,
    updateParams,
    setOrder,
    setPage,
    setSearch,
    setFilters,
    ...rest,
  };
};

interface TransactionUpdateData {
  accountId: string;
  transactionId: string;
  // eslint-disable-next-line camelcase
  category_id: string;
  notes: string;
  reviewed: boolean | null;
}

export const useTransactionUpdate = () => {
  const { mutateAsync } = useMutation((data: TransactionUpdateData) => {
    const { accountId, transactionId, ...newData } = data;
    return updateTransaction(accountId, transactionId, newData);
  });

  return {
    updateTransaction: mutateAsync,
  };
};

export const useTransactionCategories = () => {
  const { data: categories, ...rest } = useQuery<CategoryItem[], unknown>(
    ['categories', {}],
    () => getCategories(),
  );
  return {
    categories: categories || [] as CategoryItem[],
    ...rest,
  };
};

export const getUnknownCategoryId = (categories: CategoryItem[]) =>
  categories.find((cat) => cat.name === 'Unknown')?.id;

export const useUncategorizedTransactionCount = (
  accountId: string | undefined,
) => {
  const { categories, isLoading: getCategoriesLoading } =
    useTransactionCategories();
  const categoryId: string | undefined = useMemo(() => {
    if (categories == null) return undefined;
    return categories.find((cat) => cat.name === 'Unknown')?.id;
  }, [categories]);

  const { data, isLoading } = useQuery(
    ['countUncategorized'],
    () =>
      getTransactions(accountId!, {
        categoryId,
        page: 1,
        order: SortingDirection.Desc,
      }),
    { enabled: accountId != null && categoryId != null },
  );

  const count = useMemo(() => {
    if (categoryId != null) {
      return data?.pageInfo.total || 0;
    }
    return 0;
  }, [data]);
  return {
    count,
    isLoading: isLoading || getCategoriesLoading,
  };
};
