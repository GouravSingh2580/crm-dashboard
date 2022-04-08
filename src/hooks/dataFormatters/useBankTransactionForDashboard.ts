import { assignWith } from 'lodash';
import { SortingDirection } from 'enums';

export interface QueryResp<T = unknown> {
  pageInfo: {
    total: number;
    page: number;
    size: number;
    order: SortingDirection;
    sort: string;
  };
  data: T[];
}

// eslint-disable-next-line max-len
export const useBankTransactionForDashboard = (tableData: QueryResp<any> | undefined): QueryResp<any> => {
  const defaultBankTransactionResp: QueryResp<any> = {
    pageInfo: {
      total: 0,
      page: 1,
      size: 20,
      order: SortingDirection.Desc,
      sort: 'date',
    },
    data: [],
  };
  if (tableData === undefined) return defaultBankTransactionResp;
  return {
    pageInfo: assignWith(defaultBankTransactionResp.pageInfo, tableData?.pageInfo),
    data: Array.isArray(tableData?.data) ? tableData?.data : [],
  };
};
