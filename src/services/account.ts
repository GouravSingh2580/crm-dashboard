import { SortingDirection } from 'enums';
import { omitBy } from 'lodash';
import {
  AccountStatus,
  IAccount,
  ProgressTrackerGroup,
  ProgressTrackerGroupRequest,
  ProgressTrackerGroups,
  ProgressTrackerStages,
  ProgressTrackerStatus,
  Status,
  IAccountRequest,
  IAccountListItem,
  IAccountXeroInfo,
  IAccountBase,
} from 'models/account';
import { ApiListResp, PageInfo } from 'models/api';
import Api from './axios';

export interface GetAccountsProps {
  page?: number;
  size?: number;
  status?: AccountStatus;
  search?: string;
  from?: string;
  to?: string;
  sortingName: string;
  sortingDirection?: SortingDirection;
  taxFormCompletionStatus: string;
}

export interface GetAccountsListProps {
  page?: number;
  size?: number;
  status?: AccountStatus;
  search?: string;
  from?: string;
  to?: string;
  sortingName: string;
  sortingDirection?: SortingDirection;
  taxFormCompletionStatus: string;
  csm: string;
  entityType: string;
}

export interface IMetadata {
  total: number;
  types: Array<{
    label: AccountStatus;
    count: number;
  }>;
}

export type StatusResp = Omit<Status, 'updatedAt' | 'updatedBy'> & {
  // eslint-disable-next-line camelcase
  updated_at: Date;
  // eslint-disable-next-line camelcase
  updated_by: string;
};

export type ProgressTrackerGroupResp = Omit<ProgressTrackerGroup, 'status'> & {
  status: StatusResp[];
};

type IAccountResp = Omit<IAccountBase, 'progress'> & {
  progress: ProgressTrackerGroupResp[];
};

// transform server side updated_at and updated_by to updatedAt and updatedBy
const transfromStatusData = (serverStatus: StatusResp[]): Status[] =>
  serverStatus.map((statusResp) => ({
    status: statusResp.status,
    updatedAt: statusResp.updated_at,
    updatedBy: statusResp.updated_by,
    comment: statusResp.comment,
  }));

// set default value for some attributes in account
const transformAccountRespData = (account: IAccountResp): IAccount => ({
  ...account,
  payrollEnabled: account?.payrollEnabled ?? false,
  payrollRunNumber: account?.payrollRunNumber ?? 0,
  companyName: account?.companyName ?? '',
  healthInsurance: account?.healthInsurance ?? 'todo',
  retirementPlan: account?.retirementPlan ?? 'todo',
  estimatedSalary: account?.estimatedSalary ?? 0,
  progress: account.progress.map((prog: ProgressTrackerGroupResp) => ({
    ...prog,
    status: transfromStatusData(prog.status),
  })),
});

export const getAccount = (id: string): Promise<IAccount> =>
  Api.get<{ data: IAccount }>(`accounts/${id}`)
    .then((resp) => resp.data.data as unknown as IAccountResp)
    .then((account: IAccountResp) => transformAccountRespData(account));

export const updateAccountById = (
  id: string,
  params: Partial<IAccountRequest>,
) => Api.patch(`accounts/${id}`, params);

export const getAccountsMeta = async () =>
  Api.get<{ data: IMetadata }>('/accounts/meta').then((resp) => resp.data.data);

export const updateStatus = async (id: string, label: AccountStatus) => {
  const { data } = await Api.patch<{ label: AccountStatus }>(
    `/accounts/${id}`,
    {
      label,
    },
  );
  return data;
};

/** Get account service */
const getSortingName = (tableHeaderName: string) => {
  let name = '';

  switch (tableHeaderName) {
    case 'dayInStatus':
      name = 'dayInStatus';
      break;
    case 'registeredDate':
      name = 'created_at';
      break;
    case 'companyName':
      name = 'company_name';
      break;
    case 'ownerName':
      name = 'owner_name';
      break;
    default:
      break;
  }

  return name;
};

export type IAccountListItemResp = Omit<IAccountListItem, 'progress'> & {
  progress: ProgressTrackerGroupResp[];
};
export type ApiListAccountResp = ApiListResp<IAccountListItemResp[]>;

export const defaultPageInfo: PageInfo = {
  currentPage: 1,
  nextPage: null,
  pageCount: 1,
  pageSize: 10,
  prevPage: null,
  totalCount: 0,
};
export const getAccounts = ({
  page = 1,
  size = 20,
  status,
  search,
  from,
  to,
  sortingName,
  sortingDirection = SortingDirection.Asc,
  taxFormCompletionStatus,
}: GetAccountsProps) => {
  const params = omitBy(
    {
      status,
      keyword: search,
      from,
      to,
      taxFormCompletionStatus,
      sort: getSortingName(sortingName),
      order: sortingDirection,
      page,
      size,
    },
    (value) => value == null || value === '',
  );

  return Api.get<ApiListAccountResp>(`/accounts/search`, { params }).then(
    (resp) => resp.data,
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const transformAccountList = (
  account: IAccountListItemResp,
): IAccountListItem => ({
  ...account,
  createdAt: account.createdAt,
  progress: account.progress.map((prog: ProgressTrackerGroupResp) => ({
    ...prog,
    status: transfromStatusData(prog.status),
  })),
});

export const getAccountsList = async ({
  page = 1,
  size = 20,
  status,
  search,
  from,
  to,
  sortingName,
  sortingDirection = SortingDirection.Asc,
  taxFormCompletionStatus,
  entityType,
  csm,
}: GetAccountsListProps) => {
  const params = omitBy(
    {
      status,
      keyword: search,
      from,
      to,
      taxFormCompletionStatus,
      sort: getSortingName(sortingName),
      order: sortingDirection,
      page,
      size,
      entityType,
      csm,
    },
    (value) => value == null || value === '',
  );

  const resp = await Api.get<ApiListAccountResp>(`/accounts`, { params });
  return {
    data: resp.data.data?.map(transformAccountList),
    pageInfo: resp.data.pageInfo,
  } as ApiListResp<IAccountListItem[]>;
};

export const getAccountsXero = async (id: string) =>
  Api.get<{ data: IAccountXeroInfo }>(`accounts/${id}/xero`).then(
    (resp) => resp.data,
  );

export const AccountService = {
  getAccount,
  updateAccountById,
  getAccountsXero,
};

export type {
  AccountStatus,
  IAccount,
  ProgressTrackerGroup,
  ProgressTrackerGroupRequest,
  Status,
};
export { ProgressTrackerGroups, ProgressTrackerStages, ProgressTrackerStatus };
